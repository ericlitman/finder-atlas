import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  renameSync,
  utimesSync,
  statSync,
} from 'node:fs';
import { basename, dirname, join, resolve, relative } from 'node:path';
import {
  gzipSync,
  gunzipSync,
  brotliCompressSync,
  brotliDecompressSync,
  constants,
} from 'node:zlib';

type RecordData = { [key: string]: unknown };
type Verdict = { pairId: string; verdict: string; reason: string };
type Analysis = {
  inputHashes?: { scorerRuns?: Scorers; prior?: { report: string; analysis: string } };
  [key: string]: unknown;
};
type Scorers = {
  attempt: string;
  shards?: Record<string, Scorers>;
  scorers: Record<string, { rawOutput: string; rawOutputSha256: string }>;
};
type Packet = {
  split: string;
  mode?: string;
  arms: RecordData[];
  pairs: unknown[];
  packetIdentity: unknown;
};
type Manifest = { arm: { family: string }; evaluationRunHash: string; [key: string]: unknown };
type Cell = {
  cellId: string;
  status: string;
  result?: RecordData;
  partialResult?: RecordData;
  [key: string]: unknown;
};

const args = process.argv.slice(2);
const baselineArg = args.indexOf('--baseline');
const baseline = baselineArg >= 0 ? args.splice(baselineArg, 2)[1] : undefined;
const roots = args.map((path) => resolve(path));
if (!roots.length)
  throw new Error('Usage: pnpm import:data /path/to/qodo-finder [/path/to/another-archive]');
const destination = resolve('public/data');
const workspace = resolve('.data-import');
const staging = join(workspace, 'data');
mkdirSync(workspace);
mkdirSync(staging);
copyFileSync(resolve('public/app.js'), join(workspace, 'app.js'));
const inventory: { path: string; bytes: number; sha256: string }[] = [];
const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
const read = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T;
function add(path: string, value: unknown, compressed = false) {
  const raw = Buffer.isBuffer(value) ? value : Buffer.from(JSON.stringify(value));
  const bytes = compressed ? gzipSync(raw) : raw;
  const target = join(staging, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, bytes);
  utimesSync(target, 0, 0);
  const entry = { path: `data/${path}`, bytes: bytes.length, sha256: hash(bytes) };
  const existing = inventory.findIndex((row) => row.path === entry.path);
  if (existing < 0) inventory.push(entry);
  else inventory[existing] = entry;
  return hash(raw);
}
function sourcePath(path: string) {
  if (existsSync(path)) return path;
  for (const root of roots) {
    const marker = `/${basename(root)}/`;
    const start = path.indexOf(marker);
    if (start >= 0) {
      const candidate = join(root, path.slice(start + marker.length));
      if (existsSync(candidate)) return candidate;
    }
  }
  throw new Error(`Missing referenced evidence: ${path}`);
}
function verifiedSource(path: string, expectedHash: string) {
  const bytes = readFileSync(sourcePath(path));
  if (hash(bytes) !== expectedHash) throw new Error(`Source hash mismatch: ${path}`);
  return bytes;
}
function verdicts(bytes: Buffer): Verdict[] {
  let text = bytes.toString();
  try {
    const parsed = JSON.parse(text) as { result?: string; verdicts?: Verdict[] };
    if (parsed.verdicts) return parsed.verdicts;
    if (typeof parsed.result === 'string') text = parsed.result;
  } catch {
    /* Scorers may wrap JSON in prose. */
  }
  for (const match of text.matchAll(/\{\s*"verdicts"\s*:/g)) {
    const start = match.index;
    for (let end = text.lastIndexOf('}'); end > start; end = text.lastIndexOf('}', end - 1)) {
      try {
        return (JSON.parse(text.slice(start, end + 1)) as { verdicts: Verdict[] }).verdicts;
      } catch {
        /* Try the preceding closing brace. */
      }
    }
  }
  return [];
}
function collectJudges(analysis: Analysis | null) {
  const judges: Record<string, Record<string, Verdict>> = {};
  const visited = new Set<string>();
  let current = analysis;
  while (current) {
    const runs = current.inputHashes?.scorerRuns;
    if (runs) {
      for (const shard of runs.shards ? Object.values(runs.shards) : [runs]) {
        for (const [judge, spec] of Object.entries(shard.scorers)) {
          const rows = verdicts(
            verifiedSource(join(runs.attempt, spec.rawOutput), spec.rawOutputSha256),
          );
          const counts = new Map<string, number>();
          for (const row of rows) counts.set(row.pairId, (counts.get(row.pairId) ?? 0) + 1);
          for (const row of rows) {
            if (
              counts.get(row.pairId) !== 1 ||
              !['MATCH', 'NO_MATCH'].includes(row.verdict) ||
              !row.reason?.trim()
            )
              continue;
            (judges[row.pairId] ??= {})[judge] ??= row;
          }
        }
      }
    }
    const prior = current.inputHashes?.prior;
    if (!prior || visited.has(prior.report)) break;
    visited.add(prior.report);
    current = JSON.parse(
      verifiedSource(join(prior.report, 'analysis.json'), prior.analysis).toString(),
    ) as Analysis;
  }
  return judges;
}
function publicResult(result: RecordData) {
  const published = Object.fromEntries(
    Object.entries(result).filter(([key]) =>
      [
        'schema',
        'review',
        'served',
        'bindings',
        'checkout',
        'publication',
        'publish',
        'ledger',
        'retained',
        'retention',
        'wallMs',
        'cleanup',
      ].includes(key),
    ),
  );
  if (result.passes)
    published.passes = Object.fromEntries(
      Object.entries(result.passes as Record<string, RecordData>).map(([name, pass]) => [
        name,
        Object.fromEntries(
          Object.entries(pass).filter(([key]) =>
            [
              'modelReported',
              'promptHash',
              'turns',
              'usage',
              'usageIssue',
              'wallMs',
              'toolRange',
            ].includes(key),
          ),
        ),
      ]),
    );
  return published;
}
type ExportedCell = Cell & { result: RecordData; sourceSha256: string; archived: boolean };
function liteCells(cells: ExportedCell[]) {
  return cells.map((cell) => {
    const result = cell.result;
    const finder = (result.passes as { finder?: RecordData } | undefined)?.finder ?? {};
    return {
      cellId: cell.cellId,
      status: cell.status,
      source: cell.source,
      sourceSha256: cell.sourceSha256,
      archived: cell.archived,
      result: {
        ...Object.fromEntries(
          Object.entries(result).filter(([key]) =>
            ['review', 'bindings', 'checkout', 'publication', 'wallMs'].includes(key),
          ),
        ),
        passes: {
          finder: Object.fromEntries(
            Object.entries(finder).filter(([key]) =>
              ['usage', 'turns', 'wallMs', 'modelReported', 'promptHash'].includes(key),
            ),
          ),
        },
      },
    };
  });
}
function folders(root: string, prefix: string) {
  return readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith(prefix))
    .map((e) => join(root, e.name))
    .sort();
}
const reportIds = new Set<string>();
const reports = [];
const outputs: {
  id: string;
  manifest: Manifest;
  cells: number;
  archivedCells: number;
  statuses: Record<string, number>;
}[] = [];
const outputIds = new Set<string>();
const rawHashes = new Set<string>();
for (const root of roots) {
  for (const folder of folders(root, 'report-')) {
    const packetFile = join(folder, 'match-packet.json');
    if (!existsSync(packetFile)) continue;
    const id = basename(folder);
    if (reportIds.has(id)) throw new Error(`Duplicate report ID across input roots: ${id}`);
    reportIds.add(id);
    const packet = read<Packet>(packetFile);
    const analysis = existsSync(join(folder, 'analysis.json'))
      ? read<Analysis>(join(folder, 'analysis.json'))
      : null;
    const hashes: Record<string, string> = {
      packet: add(`${id}/packet.json.gz`, readFileSync(packetFile), true),
    };
    add(`${id}/judges.json.gz`, collectJudges(analysis), true);
    if (analysis)
      hashes.analysis = add(`${id}/analysis.json`, readFileSync(join(folder, 'analysis.json')));
    for (const extra of ['analysis.md', 'union-analysis.json', 'union-analysis.md']) {
      if (existsSync(join(folder, extra))) add(`${id}/${extra}`, readFileSync(join(folder, extra)));
    }
    const modified = statSync(packetFile).mtime.toISOString();
    reports.push({
      id,
      modified,
      split: packet.split,
      mode: packet.mode ?? 'standard',
      arms: packet.arms,
      pairs: packet.pairs.length,
      packetIdentity: packet.packetIdentity,
      analysis,
      hashes,
    });
  }
  for (const folder of folders(root, 'out-')) {
    if (!existsSync(join(folder, 'manifest.json'))) continue;
    const id = `${basename(root)}--${basename(folder)}`;
    if (outputIds.has(id)) throw new Error(`Duplicate output ID: ${id}`);
    outputIds.add(id);
    const manifest = read<Manifest>(join(folder, 'manifest.json'));
    const cells = [];
    const statuses: Record<string, number> = {};
    for (const path of readdirSync(folder, { recursive: true, withFileTypes: true })) {
      if (!path.isFile() || !path.name.endsWith('.json')) continue;
      const absolute = join(path.parentPath, path.name);
      const local = relative(folder, absolute);
      if (!local.includes('/raw/')) continue;
      const raw = readFileSync(absolute);
      const cell = JSON.parse(raw.toString()) as Cell;
      if (typeof cell.cellId !== 'string') continue;
      const result = cell.result ?? {};
      const selected = {
        ...cell,
        result: publicResult(result),
        ...(cell.partialResult ? { partialResult: publicResult(cell.partialResult) } : {}),
        archived: local.split('/').length > 3,
        source: `${basename(root)}/${relative(root, absolute)}`,
        sourceSha256: hash(raw),
      };
      cells.push(selected);
      rawHashes.add(selected.sourceSha256);
      statuses[cell.status ?? 'unknown'] = (statuses[cell.status ?? 'unknown'] ?? 0) + 1;
    }
    cells.sort((a, b) => a.source.localeCompare(b.source));
    add(`outputs/${id}.json.gz`, { manifest, cells }, true);
    add(`outputs/${id}.json`, { manifest, cells: liteCells(cells) });
    outputs.push({
      id,
      manifest,
      cells: cells.length,
      archivedCells: cells.filter((c) => c.archived).length,
      statuses,
    });
  }
}
if (!reports.length)
  throw new Error('No report packets found. Existing published data was not changed.');
// Retain previously published, hash-identified evidence when source files were later changed.
const referencedHashes = new Set(
  reports.flatMap((r) =>
    r.arms.flatMap((a) => Object.values((a.cellHashes ?? {}) as Record<string, string>)),
  ),
);
for (const prior of [destination, ...(baseline ? [resolve(baseline)] : [])]) {
  const path = join(prior, 'index.json');
  if (!existsSync(path) && !existsSync(`${path}.br`)) continue;
  const bytes = existsSync(path)
    ? readFileSync(path)
    : brotliDecompressSync(readFileSync(`${path}.br`));
  const index = JSON.parse(bytes.toString()) as { outputs: { id: string; manifest: Manifest }[] };
  for (const output of index.outputs) {
    const path = join(prior, 'outputs', `${output.id}.json.gz`);
    const dump = JSON.parse(gunzipSync(readFileSync(path)).toString()) as {
      cells: (Cell & { sourceSha256: string; archived: boolean })[];
    };
    const cells = dump.cells.filter(
      (c) => referencedHashes.has(c.sourceSha256) && !rawHashes.has(c.sourceSha256),
    );
    if (!cells.length) continue;
    for (const cell of cells) rawHashes.add(cell.sourceSha256);
    const existing = outputs.find(
      (o) =>
        o.manifest.arm.family === output.manifest.arm.family &&
        o.manifest.evaluationRunHash === output.manifest.evaluationRunHash,
    );
    const id = existing?.id ?? `preserved-${output.id.replace(/^(preserved-)+/, '')}`;
    const current = existing
      ? (JSON.parse(
          gunzipSync(readFileSync(join(staging, 'outputs', `${id}.json.gz`))).toString(),
        ) as { cells: ExportedCell[] })
      : { cells: [] };
    const combined = [
      ...current.cells,
      ...cells.map((c) => ({
        ...c,
        result: publicResult(c.result ?? {}),
        ...(c.partialResult ? { partialResult: publicResult(c.partialResult) } : {}),
        archived: true,
      })),
    ];
    add(`outputs/${id}.json.gz`, { manifest: output.manifest, cells: combined }, true);
    add(`outputs/${id}.json`, { manifest: output.manifest, cells: liteCells(combined) });
    const statuses: Record<string, number> = {};
    for (const cell of combined) statuses[cell.status] = (statuses[cell.status] ?? 0) + 1;
    const entry = {
      id,
      manifest: output.manifest,
      cells: combined.length,
      archivedCells: combined.filter((c) => c.archived).length,
      statuses,
    };
    if (existing) Object.assign(existing, entry);
    else outputs.push(entry);
  }
}
const evidenceGaps: {
  report: string;
  family: string;
  cellId: string;
  expectedHash: string;
  missingFindings: number;
}[] = [];
for (const report of reports) {
  const packet = JSON.parse(
    gunzipSync(readFileSync(join(staging, report.id, 'packet.json.gz'))).toString(),
  ) as { pairs: { members: { cellId: string; kind: string; findingIndex: number }[] }[] };
  const units = (report.analysis?.units ?? []) as { cellId?: string; published: number }[];
  for (const arm of report.arms as { family: string; cellHashes: Record<string, string> }[]) {
    for (const [cellId, expectedHash] of Object.entries(arm.cellHashes)) {
      if (rawHashes.has(expectedHash)) continue;
      const members = new Set(
        packet.pairs
          .flatMap((p) => p.members)
          .filter((m) => m.cellId === cellId && m.kind === 'published')
          .map((m) => m.findingIndex),
      );
      const published = units.find((u) => u.cellId === cellId)?.published ?? members.size;
      evidenceGaps.push({
        report: report.id,
        family: arm.family,
        cellId,
        expectedHash,
        missingFindings: Math.max(0, published - members.size),
      });
    }
  }
}
const defaultReport =
  [...reports]
    .filter(
      (r) =>
        r.analysis &&
        r.split === 'lockbox' &&
        r.mode !== 'cross-file-audit' &&
        !/interim|peek|preflight|probe/.test(r.id),
    )
    .sort((a, b) => b.modified.localeCompare(a.modified))[0]?.id ?? reports.at(-1)?.id;
add('index.json', {
  schema: 'finder-atlas/1',
  capturedAt: new Date().toISOString(),
  defaultReport,
  evidenceGaps,
  source: roots.map((path) => basename(path)).join(', '),
  scope:
    'Every report packet and output manifest in the imported archives, including archived retries. Reviews, candidates, receipts and source hashes are preserved. Tool/transport transcripts and unreferenced scorer retries are excluded.',
  reports,
  outputs,
});
add('inventory.json', [...inventory]);
const archive = execFileSync('tar', ['-czf', '-', '-C', staging, '.'], {
  maxBuffer: 1024 * 1024 * 1024,
});
const parts: string[] = [];
for (let start = 0; start < archive.length; start += 16_000_000) {
  const part = `qodo-snapshot.part${parts.length + 1}`;
  writeFileSync(join(staging, part), archive.subarray(start, start + 16_000_000));
  parts.push(part);
}
writeFileSync(
  join(staging, 'download.json'),
  JSON.stringify({
    filename: 'qodo-snapshot.tar.gz',
    parts,
    bytes: archive.length,
    sha256: hash(archive),
  }),
);
execFileSync(process.execPath, ['scripts/verify.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, ATLAS_ROOT: '.data-import' },
});
for (const path of readdirSync(staging, { recursive: true, encoding: 'utf8' })) {
  if (!path.endsWith('.json')) continue;
  const source = join(staging, path);
  writeFileSync(
    `${source}.br`,
    brotliCompressSync(readFileSync(source), {
      params: { [constants.BROTLI_PARAM_QUALITY]: 4 },
    }),
  );
  rmSync(source);
}
const previous = resolve('.data-previous');
if (existsSync(previous))
  throw new Error('Previous import backup exists; inspect .data-previous before continuing.');
if (existsSync(destination)) renameSync(destination, previous);
try {
  renameSync(staging, destination);
} catch (error) {
  if (existsSync(previous)) renameSync(previous, destination);
  throw error;
}
rmSync(previous, { recursive: true, force: true });
rmSync(workspace, { recursive: true, force: true });
console.log(`Imported ${reports.length} reports and ${outputs.length} output runs.`);
