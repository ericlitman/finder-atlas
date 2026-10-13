import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
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
  const build = () =>
    spawnSync(process.execPath, ['scripts/build.ts'], { cwd: root, encoding: 'utf8' });
  const read = (path: string) => readFileSync(join(root, path));
  return { root, put, analysis, cell, runImport, build, read };
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

test('a rejected fine-grained token stays outside the build and restores the prior dataset', () => {
  const f = fixture();
  const first = f.runImport();
  expect(first.status, first.stderr).toBe(0);
  const before = f.read('public/data/index.json.br');
  const token = 'github_pat_' + 'synthetic_test_'.repeat(5);
  f.put('archive/out-one/cells/raw/one.json', {
    ...f.cell,
    result: { review: { findings: [], summary: token } },
  });
  const rejected = f.runImport();
  expect(rejected.status).not.toBe(0);
  expect(rejected.stderr).toContain('Credential-like text');
  expect(f.read('public/data/index.json.br')).toEqual(before);
  expect(existsSync(join(f.root, '.data-import'))).toBe(true);
  const built = f.build();
  expect(built.status, built.stderr).toBe(0);
  expect(existsSync(join(f.root, 'dist/.data-import'))).toBe(false);
  expect(existsSync(join(f.root, 'dist/data.previous'))).toBe(false);
  expect(gunzipSync(f.read('dist/data/outputs/archive--out-one.json.gz')).toString()).not.toContain(
    token,
  );
});
