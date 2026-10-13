import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { brotliDecompressSync, gzipSync, gunzipSync } from 'node:zlib';
import { afterEach, expect, test } from 'vitest';

const temporary: string[] = [];
afterEach(() => {
  for (const root of temporary.splice(0)) rmSync(root, { recursive: true, force: true });
});
const hash = (bytes: string) => createHash('sha256').update(bytes).digest('hex');
const providerCredential = 'sk-' + 'synthetic_'.repeat(4);

function snapshot(path: string) {
  return readdirSync(path, { recursive: true, encoding: 'utf8' })
    .filter((entry) => statSync(join(path, entry)).isFile())
    .sort()
    .map((entry) => [entry, readFileSync(join(path, entry))]);
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'finder-import-'));
  temporary.push(root);
  cpSync('scripts', join(root, 'scripts'), { recursive: true });
  mkdirSync(join(root, 'public'));
  cpSync('public/app.js', join(root, 'public/app.js'));
  writeFileSync(join(root, 'package.json'), '{"type":"module"}');
  function put(path: string, value: unknown) {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(
      target,
      typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value),
    );
  }
  const empty = { units: [], fullSummary: [], coverage: { missing: 0, unidentified: 0 } };
  const scorer = '{"verdicts":[]}\n';
  put('judges/one.json', scorer);
  const analysis =
    JSON.stringify(
      {
        ...empty,
        inputHashes: {
          scorerRuns: {
            attempt: join(root, 'judges'),
            scorers: { fable: { rawOutput: 'one.json', rawOutputSha256: hash(scorer) } },
          },
        },
      },
      null,
      2,
    ) + '\n';
  function report(id: string, body: unknown, mode = 'standard', modified = 1) {
    const path = `archive/${id}/match-packet.json`;
    put(path, { split: 'lockbox', mode, arms: [], pairs: [], packetIdentity: {} });
    utimesSync(join(root, path), modified, modified);
    put(`archive/${id}/analysis.json`, body);
  }
  report('report-base', analysis);
  report(
    'report-child',
    {
      ...empty,
      inputHashes: {
        prior: { report: join(root, 'archive/report-base'), analysis: hash(analysis) },
      },
    },
    'standard',
    2,
  );
  report('report-900-audit', empty, 'cross-file-audit', 3);
  const manifest = { arm: { family: 'test' }, evaluationRunHash: 'run', corpus: { rows: [] } };
  const result = {
    review: { findings: [] },
    passes: {
      finder: {
        usage: { inputTokens: 2 },
        wallMs: 3,
        modelReported: 'test',
        rawUsage: [{ requests: [{ body: 'private transport' }] }],
        finalText: 'raw model response',
      },
    },
  };
  const cell = { cellId: 'test:one/r1', status: 'ok', result, partialResult: result };
  const raw = JSON.stringify(cell);
  put('archive/out-one/manifest.json', manifest);
  put('archive/out-one/cells/raw/one.json', raw);
  const old = { ...cell, cellId: 'test:two/r1' };
  const oldHash = hash(JSON.stringify(old));
  put('legacy/index.json', { outputs: [{ id: 'old', manifest }] });
  put(
    'legacy/outputs/old.json.gz',
    gzipSync(
      JSON.stringify({
        manifest,
        cells: [{ ...old, sourceSha256: oldHash, source: 'old/raw/two.json', archived: true }],
      }),
    ),
  );
  put('archive/report-unscored/match-packet.json', {
    split: 'train',
    arms: [
      {
        family: 'test',
        evaluationRunHash: 'run',
        cellHashes: { [cell.cellId]: hash(raw), [old.cellId]: oldHash },
      },
    ],
    pairs: [],
    packetIdentity: {},
  });
  const runImport = () =>
    spawnSync(
      process.execPath,
      ['scripts/import-data.ts', join(root, 'archive'), '--baseline', join(root, 'legacy')],
      { cwd: root, encoding: 'utf8' },
    );
  function putResult(summary: string) {
    put('archive/out-one/cells/raw/one.json', {
      ...cell,
      result: { review: { findings: [], summary } },
    });
  }
  function buildAtVerification() {
    const verifier = join(root, 'scripts/verify.mjs');
    writeFileSync(
      verifier,
      "import { execFileSync as build } from 'node:child_process';\n" +
        "build(process.execPath, ['scripts/build.ts'], { stdio: 'inherit' });\n" +
        readFileSync(verifier, 'utf8'),
    );
  }
  const read = (path: string) => readFileSync(join(root, path));
  return { root, put, analysis, runImport, putResult, buildAtVerification, read };
}

test('import preserves analysis bytes and filters transport data from complete, partial and preserved cells', () => {
  const f = fixture();
  const imported = f.runImport();
  expect(imported.status, imported.stderr).toBe(0);
  expect(brotliDecompressSync(f.read('public/data/report-base/analysis.json.br')).toString()).toBe(
    f.analysis,
  );
  const index = JSON.parse(brotliDecompressSync(f.read('public/data/index.json.br')).toString());
  expect(index.defaultReport).toBe('report-child');
  const dump = JSON.parse(
    gunzipSync(f.read('public/data/outputs/archive--out-one.json.gz')).toString(),
  );
  expect(dump.cells).toHaveLength(2);
  for (const cell of dump.cells)
    for (const result of [cell.result, cell.partialResult]) {
      expect(result.passes.finder).toEqual({
        usage: { inputTokens: 2 },
        wallMs: 3,
        modelReported: 'test',
      });
    }
  expect(existsSync(join(f.root, '.data-import'))).toBe(false);
  expect(existsSync(join(f.root, '.data-previous'))).toBe(false);
});

test.each(['scorer', 'prior'])(
  'changed %s evidence refuses the import without replacing published data',
  (kind) => {
    const f = fixture();
    f.put('public/data/sentinel', 'unchanged');
    if (kind === 'scorer') f.put('judges/one.json', '{"verdicts":[]}\n\n');
    else f.put('archive/report-base/analysis.json', f.analysis + '\n');
    const imported = f.runImport();
    expect(imported.status).not.toBe(0);
    expect(imported.stderr).toContain('Source hash mismatch');
    expect(f.read('public/data/sentinel').toString()).toBe('unchanged');
  },
);

test.each([
  ['OpenAI service account', 'sk-svcacct-' + 'a'.repeat(30)],
  ['OpenAI admin', 'sk-admin-' + 'a'.repeat(30)],
  ['OpenRouter', 'sk-or-v1-' + 'a'.repeat(30)],
  ['xAI', 'xai-' + 'a'.repeat(30)],
  ['GitHub classic', 'ghp_' + 'a'.repeat(30)],
  ['GitHub fine-grained', 'github_pat_' + 'a'.repeat(20)],
  ['AWS long-term', 'AKIA' + 'A'.repeat(16)],
  ['AWS temporary', 'ASIA' + 'A'.repeat(16)],
  ['generic private key', '-----BEGIN PRIVATE KEY-----'],
  ['encrypted private key', '-----BEGIN ENCRYPTED PRIVATE KEY-----'],
  ['PGP private key', '-----BEGIN PGP PRIVATE KEY BLOCK-----'],
])('rejects %s credential-shaped content', (_name, credential) => {
  const f = fixture();
  f.putResult(credential);
  const imported = f.runImport();
  expect(imported.status).not.toBe(0);
  expect(imported.stderr).toContain('Credential-like text');
});

test('allows a path containing a provider prefix without its left boundary', () => {
  const f = fixture();
  f.putResult('task-scheduler-retry-backoff-handler.ts');
  const imported = f.runImport();
  expect(imported.status, imported.stderr).toBe(0);
});

test('scans decoded JSON keys with source-preserved Unicode escapes', () => {
  const f = fixture();
  f.put(
    'archive/report-base/union-analysis.json',
    `{"\\u0073${providerCredential.slice(1)}":"value"}`,
  );
  const imported = f.runImport();
  expect(imported.status).not.toBe(0);
  expect(imported.stderr).toContain('Credential-like text');
});

test('scans decoded multiline JSON strings', () => {
  const f = fixture();
  f.put(
    'archive/report-base/union-analysis.json',
    JSON.stringify({ summary: `first line\n${providerCredential}` }),
  );
  const imported = f.runImport();
  expect(imported.status).not.toBe(0);
  expect(imported.stderr).toContain('Credential-like text');
});

test('scans exported Markdown verbatim', () => {
  const f = fixture();
  f.put('archive/report-base/analysis.md', `Notes\n\n${providerCredential}\n`);
  const imported = f.runImport();
  expect(imported.status).not.toBe(0);
  expect(imported.stderr).toContain('Credential-like text');
});

test('a rejected fine-grained token stays outside a build at the verification boundary', () => {
  const f = fixture();
  const first = f.runImport();
  expect(first.status, first.stderr).toBe(0);
  const before = snapshot(join(f.root, 'public/data'));
  const token = 'github_pat_' + 'synthetic_test_'.repeat(5);
  f.putResult(token);
  f.buildAtVerification();
  const rejected = f.runImport();
  expect(rejected.status).not.toBe(0);
  expect(rejected.stderr).toContain('Credential-like text');
  expect(snapshot(join(f.root, 'public/data'))).toEqual(before);
  expect(existsSync(join(f.root, '.data-import'))).toBe(true);
  expect(existsSync(join(f.root, '.data-previous'))).toBe(false);
  expect(gunzipSync(f.read('dist/data/outputs/archive--out-one.json.gz')).toString()).not.toContain(
    token,
  );
});
