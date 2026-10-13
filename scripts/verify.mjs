import { readFileSync, readdirSync, statSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { basename } from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = new URL('../' + (process.env.ATLAS_ROOT || 'dist') + '/', import.meta.url);
const read = (p) => readFileSync(new URL(p, root));
const parsed = (p) => JSON.parse(p.endsWith('.gz') ? gunzipSync(read(p)) : read(p));
const data = parsed('data/index.json');
const rawHashes = new Set(
  data.outputs.flatMap((o) =>
    parsed(`data/outputs/${o.id}.json.gz`).cells.map((c) => c.sourceSha256),
  ),
);
const gaps = [];
for (const report of data.reports) {
  const packet = parsed(`data/${report.id}/packet.json.gz`);
  for (const arm of report.arms)
    for (const [cellId, expectedHash] of Object.entries(arm.cellHashes)) {
      if (rawHashes.has(expectedHash)) continue;
      const members = new Set(
        packet.pairs
          .flatMap((p) => p.members)
          .filter((m) => m.cellId === cellId && m.kind === 'published')
          .map((m) => m.findingIndex),
      );
      const published =
        report.analysis?.units.find((u) => u.cellId === cellId)?.published ?? members.size;
      gaps.push({
        report: report.id,
        family: arm.family,
        cellId,
        expectedHash,
        missingFindings: Math.max(0, published - members.size),
      });
    }
}
assert.deepEqual(
  data.evidenceGaps,
  gaps,
  'Evidence gaps must exactly describe unavailable source hashes',
);
for (const path of readdirSync(new URL('data/', root), { recursive: true })) {
  const file = new URL('data/' + path, root);
  if (statSync(file).isFile())
    assert.ok(
      statSync(file).size <= 25 * 1024 * 1024,
      path + ' exceeds Cloudflare Pages file limit',
    );
}
const element = { addEventListener() {}, classList: { toggle() {} }, setAttribute() {} };
const context = vm.createContext({
  document: { querySelector: () => element, querySelectorAll: () => [], addEventListener() {} },
  window: { addEventListener() {} },
  location: { hash: '' },
  console,
  Response,
  DecompressionStream,
  Set,
  Map,
  setTimeout,
  fetch: async (p) => new Response(read(p)),
  DATA: data,
});
let code = read('app.js').toString();
code = code.slice(0, code.lastIndexOf('init().catch'));
vm.runInContext(code, context);
vm.runInContext('data=DATA', context);
let lanes = 0,
  pairs = 0,
  published = 0;
for (const r of data.reports) {
  context.R = r;
  vm.runInContext(
    'report=R;selected=new Set(report.arms.map(a=>a.family));basis="planned";findings=[]',
    context,
  );
  const packet = parsed(`data/${r.id}/packet.json.gz`),
    judges = parsed(`data/${r.id}/judges.json.gz`);
  assert.equal(
    createHash('sha256')
      .update(gunzipSync(read(`data/${r.id}/packet.json.gz`)))
      .digest('hex'),
    r.hashes.packet,
  );
  if (r.analysis) {
    assert.equal(
      createHash('sha256')
        .update(read(`data/${r.id}/analysis.json`))
        .digest('hex'),
      r.hashes.analysis,
    );
    const prior = r.analysis.inputHashes?.prior;
    const parent =
      prior && data.reports.find((candidate) => candidate.id === basename(prior.report));
    if (parent)
      assert.equal(parent.hashes.analysis, prior.analysis, r.id + ' prior analysis identity');
    let missing = 0,
      unidentified = 0;
    for (const p of packet.pairs) {
      const v = judges[p.pairId] || {};
      if (!v.fable || !v.sol) missing++;
      else if (v.fable.verdict !== v.sol.verdict) unidentified++;
    }
    assert.equal(missing, r.analysis.coverage.missing, r.id + ' missing judge results');
    assert.equal(
      unidentified,
      r.analysis.coverage.unidentified,
      r.id + ' conflicting judge results',
    );
    if (r.mode !== 'cross-file-audit')
      for (const s of vm.runInContext('summaries()', context)) {
        const expected = r.analysis.fullSummary.find((x) => x.family === s.family);
        assert.equal(s.hits, expected.recall.hits, r.id + ' ' + s.family + ' hits');
        assert.equal(s.eligible, expected.recall.eligible);
        assert.equal(s.covered, expected.covered);
        assert.equal(s.published, expected.precision.published);
        if (expected.dollars !== null) assert.ok(Math.abs(s.dollars - expected.dollars) < 1e-8);
        else assert.equal(s.dollars, null);
        lanes++;
      }
  }
  await vm.runInContext('loadFindings()', context);
  const fs = vm.runInContext('findings', context);
  if (!r.analysis) {
    vm.runInContext('basis="shared"; filterFindings()', context);
    assert.ok(
      element.innerHTML.includes(
        `${fs.filter((f) => f.kind === 'published').length.toLocaleString()} findings`,
      ),
      r.id + ' unscored findings remain visible',
    );
  }
  if (r.analysis && r.mode !== 'cross-file-audit')
    for (const s of r.analysis.fullSummary) {
      const found = fs.filter((f) => f.arm === s.family && f.kind === 'published');
      assert.equal(
        found.length,
        s.precision.published -
          (data.evidenceGaps || [])
            .filter((g) => g.report === r.id && g.family === s.family)
            .reduce((n, g) => n + g.missingFindings, 0),
        r.id + ' ' + s.family + ' complete finding inventory',
      );
      assert.equal(
        found.filter((f) => f.outcome === 'unresolved').length,
        s.unresolvedFindings,
        r.id + ' ' + s.family + ' unresolved findings',
      );
      assert.equal(
        found.filter((f) => f.outcome === 'unmatched').length,
        s.benchmarkUnmatched -
          (data.evidenceGaps || [])
            .filter((g) => g.report === r.id && g.family === s.family)
            .reduce((n, g) => n + g.missingFindings, 0),
        r.id + ' ' + s.family + ' unmatched findings',
      );
      published += found.length;
    }
  pairs += packet.pairs.length;
}
const inventory = parsed('data/inventory.json');
for (const entry of inventory)
  assert.equal(
    createHash('sha256').update(read(entry.path)).digest('hex'),
    entry.sha256,
    entry.path,
  );
const credentialPattern =
  /AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sk-(?:proj-|ant-)[A-Za-z0-9_-]{30,}/;
for (const entry of inventory) {
  if (!entry.path.endsWith('.json') && !entry.path.endsWith('.json.gz')) continue;
  const bytes = read(entry.path);
  const text = (entry.path.endsWith('.gz') ? gunzipSync(bytes) : bytes).toString();
  assert.ok(!credentialPattern.test(text), 'Credential-like text in ' + entry.path);
  if (entry.path.startsWith('data/outputs/') && entry.path.endsWith('.json.gz'))
    for (const cell of JSON.parse(text).cells)
      for (const result of [cell.result, cell.partialResult])
        for (const pass of Object.values(result?.passes || {}))
          assert.ok(
            !('rawUsage' in pass) && !('finalText' in pass),
            'Transport transcript in ' + entry.path,
          );
}
const dl = parsed('data/download.json');
const full = Buffer.concat(dl.parts.map((p) => read('data/' + p)));
assert.equal(full.length, dl.bytes);
assert.equal(createHash('sha256').update(full).digest('hex'), dl.sha256);
assert.ok(gunzipSync(full).length > 0);
console.log(
  JSON.stringify({
    reports: data.reports.length,
    lanesVerified: lanes,
    judgePairsVerified: pairs,
    publishedFindingAppearancesVerified: published,
    sourceInventoryFilesVerified: inventory.length,
    rawCells: data.outputs.reduce((n, o) => n + o.cells, 0),
    archiveBytes: full.length,
  }),
);
