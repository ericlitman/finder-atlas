'use strict';
const $ = (s) => document.querySelector(s);
const esc = (x) =>
  String(x ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const pct = (x) => (Number.isFinite(x) ? (100 * x).toFixed(1) + '%' : '—');
const money = (x) => (Number.isFinite(x) ? '$' + x.toFixed(2) : '—');
const min = (x) => (Number.isFinite(x) ? (x / 60000).toFixed(1) + 'm' : '—');
const names = {
  'a-sol-xhigh': 'Sol · original prompt',
  'b-sol-xhigh': 'Sol 5.6 · xhigh',
  'c-astra-medium': 'Astra · medium',
  'd-astra-high': 'Astra · high',
  'e-opus-xhigh': 'Opus 5 · xhigh',
  'f-grok': 'Grok 4.6',
  'g-fable-medium': 'Fable · medium',
  'h-fable-high': 'Fable · high',
  'i-swe2-max': 'SWE-2 · max',
  'j-grok47-high': 'Grok 4.7 · high',
  'k-grok47-xhigh': 'Grok 4.7 · xhigh',
  'l-mimo26-thinking': 'MiMo 2.6 · thinking on',
  'm-mimo26-no-thinking': 'MiMo 2.6 · thinking off',
  'n-opus55-medium': 'Opus 5.5 · medium',
  'o-opus55-high': 'Opus 5.5 · high',
  'p-opus55-xhigh': 'Opus 5.5 · xhigh',
  'q-sol6-xhigh': 'Sol 6 · xhigh',
  'r-sol6-max': 'Sol 6 · max',
  's-opus55-max': 'Opus 5.5 · max',
};
const palette = [
  '#285b46',
  '#8ba77c',
  '#b8caa2',
  '#d0b493',
  '#b79cbe',
  '#829bad',
  '#739b9e',
  '#b68b72',
  '#858bad',
  '#c1a85c',
  '#829367',
];
const name = (x) =>
  names[x] ||
  x
    .replace(/^[a-z]+\d*-/, '')
    .replace('sol61', 'Sol 6.1')
    .replace('musewonder', 'Muse Wonder')
    .replace('opus55', 'Opus 5.5')
    .replaceAll('-', ' · ');
let data,
  report,
  selected = new Set(),
  view = 'overview',
  basis = 'planned',
  sort = 'hits',
  direction = -1,
  query = '',
  outcome = 'all',
  findingKind = 'published',
  page = 0,
  findings = [],
  reportEpoch = 0,
  detailRequest = 0;
const cache = new Map();
async function json(path) {
  if (!cache.has(path))
    cache.set(
      path,
      fetch(path, { cache: 'no-store' })
        .then(async (r) => {
          if (!r.ok) throw Error('Could not load ' + path);
          if (path.endsWith('.gz'))
            return JSON.parse(
              await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).text(),
            );
          return r.json();
        })
        .catch((e) => {
          cache.delete(path);
          throw e;
        }),
    );
  return cache.get(path);
}
const color = (family) =>
  palette[
    Math.max(
      0,
      report.arms.findIndex((a) => a.family === family),
    ) % palette.length
  ];
const reportName = (r) =>
  r.id.replace(/^report-/, '').replace(/-/g, ' ') + (r.analysis ? '' : ' · unscored');
const link = (url) => ((url || '').startsWith('https://github.com/') ? esc(url) : '#');
function notify(message) {
  $('#toast').textContent = message;
  $('#toast').style.display = 'block';
  setTimeout(() => ($('#toast').style.display = 'none'), 3500);
}
function safe(task) {
  Promise.resolve()
    .then(task)
    .catch((e) => {
      $('#notice').textContent = e.message;
      console.error(e);
    });
}
function outputsFor(arm) {
  return data.outputs.filter(
    (o) =>
      o.manifest.arm.family === arm.family &&
      o.manifest.evaluationRunHash === arm.evaluationRunHash,
  );
}
function outputFor(arm) {
  return outputsFor(arm).sort((a, b) => b.cells - a.cells)[0];
}
function repo(tag) {
  for (const arm of report.arms) {
    const row = outputFor(arm)?.manifest.corpus.rows.find((r) => r.tag === tag);
    if (row) return { label: row.prUrl.split('/')[4] + ' #' + row.prNumber, ...row };
  }
  return { label: 'PR ' + tag, tag };
}
function rows() {
  let units = (report.analysis?.units || []).filter((u) => selected.has(u.arm));
  if (basis === 'shared') {
    const groups = new Map();
    for (const u of units) {
      const key = u.tag + '/' + u.repetition;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(u);
    }
    const shared = new Set(
      [...groups]
        .filter(([, us]) => us.length === selected.size && us.every((u) => u.covered))
        .map(([k]) => k),
    );
    units = units.filter((u) => shared.has(u.tag + '/' + u.repetition));
  }
  return units;
}
function summaries() {
  if (!report.analysis) return [];
  const units = rows();
  return report.arms
    .filter((a) => selected.has(a.family))
    .map((a) => {
      const us = units.filter((u) => u.arm === a.family),
        ok = us.filter((u) => u.covered),
        sum = (k) => ok.reduce((n, u) => n + (u[k] || 0), 0);
      const hits = ok.reduce((n, u) => n + u.hitLabels.length, 0),
        eligible = us.reduce((n, u) => n + u.eligibleLabels, 0),
        pub = sum('published');
      return {
        family: a.family,
        model: a.model,
        units: us.length,
        covered: ok.length,
        hits,
        eligible,
        recall: eligible ? hits / eligible : null,
        published: pub,
        yield: pub ? hits / pub : null,
        dollars: ok.length && ok.every((u) => Number.isFinite(u.dollars)) ? sum('dollars') : null,
        time:
          ok.length && ok.every((u) => Number.isFinite(u.wallMs))
            ? sum('wallMs') / ok.length
            : null,
        duplicates: sum('duplicates'),
        unresolved: sum('unresolvedFindings'),
        unmatched: sum('unmatched'),
      };
    })
    .sort((a, b) => {
      const av = a[sort],
        bv = b[sort];
      if (av == null) return bv == null ? 0 : 1;
      if (bv == null) return -1;
      return typeof av === 'string'
        ? direction * av.localeCompare(bv)
        : direction * (av - bv) || name(a.family).localeCompare(name(b.family));
    });
}
function setReport(id) {
  report =
    data.reports.find((r) => r.id === id) ||
    data.reports.find((r) => r.id === data.defaultReport) ||
    data.reports.at(-1);
  selected = new Set(report.arms.map((a) => a.family));
  $('#report-select').value = report.id;
  $('#basis-select').disabled = !report.analysis;
  findings = [];
  page = 0;
  reportEpoch++;
  renderPicker();
  render();
}
function renderPicker() {
  $('#lane-count').textContent = '(' + selected.size + ')';
  $('#lane-picker').innerHTML = report.arms
    .map(
      (a) =>
        `<label><input type="checkbox" data-lane="${esc(a.family)}" ${selected.has(a.family) ? 'checked' : ''}>${esc(name(a.family))}</label>`,
    )
    .join('');
}
const headings = {
  overview: [
    'A closer look at what finds bugs.',
    'Compare the finders. Follow the evidence. See what each review caught.',
  ],
  coverage: [
    'Every review, in view.',
    'Trace coverage and label matches across pull requests, repetitions, and finders.',
  ],
  findings: [
    'The findings behind the numbers.',
    'Read the review, inspect the code, and follow both judges’ reasoning.',
  ],
  archive: [
    'The complete evaluation record.',
    'Every report and output run in the source archive, preserved in a static snapshot.',
  ],
};
function render() {
  const title = headings[view];
  $('#page-title').textContent = title[0];
  $('#page-description').textContent = title[1];
  document.querySelectorAll('nav button').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === view);
    b.setAttribute('aria-current', b.dataset.view === view ? 'page' : 'false');
  });
  $('#notice').textContent = !report.analysis
    ? 'Unscored report. Showing recorded findings; scored comparison bases do not apply.'
    : report.mode === 'cross-file-audit'
      ? 'Diagnostic cross-file audit. This report does not measure published-finding recall or yield.'
      : `${basis === 'planned' ? 'Planned-matrix recall includes uncovered cells in the denominator.' : 'Shared-cell comparisons use only cells every selected lane completed.'} Label yield is matched labels ÷ published findings, not false-positive precision. Costs cover successful finder cells at recorded list prices.`;
  const gaps = (data.evidenceGaps || []).filter((g) => g.report === report.id);
  if (gaps.length)
    $('#notice').textContent +=
      ` Original files for ${gaps.length} reviews are unavailable at their recorded hashes; ${gaps.reduce((n, g) => n + g.missingFindings, 0)} published findings are represented only in summary totals. Available packet evidence is preserved.`;
  if (view === 'overview') overview();
  if (view === 'coverage') coverage();
  if (view === 'findings') safe(renderFindings);
  if (view === 'archive') archive();
}
function stat(label, value, note, first = false) {
  return `<article class="stat"><div class="stat-label">${label}<span>↗</span></div><div class="stat-value">${value}</div><div class="stat-note">${note}</div>${first ? '<div class="stat-bloom"></div>' : ''}</article>`;
}
function overview() {
  if (!report.analysis || report.mode === 'cross-file-audit') {
    $('#content').innerHTML =
      `<section class="panel empty">${report.analysis ? 'This diagnostic report has no published-finding ranking. Explore its evidence in Findings explorer.' : 'This report has a match packet but no completed analysis. Explore its findings or select a scored report.'}</section>`;
    return;
  }
  const ss = summaries(),
    units = rows(),
    best = [...ss].filter((s) => s.recall != null).sort((a, b) => b.recall - a.recall)[0],
    uniqueTags = new Set(units.map((u) => u.tag)),
    complete = ss.filter((s) => s.covered === s.units && s.units > 0).length;
  const sorted = [...ss].sort((a, b) => (b.recall ?? -1) - (a.recall ?? -1));
  $('#content').innerHTML =
    `<div class="stats">${stat('HIGHEST LABEL RECALL', pct(best?.recall), best ? esc(name(best.family)) + ' · ' + best.hits + '/' + best.eligible + ' labels' : 'No comparable cells', true)}${stat('FINDER LANES', ss.length, complete + ' complete · ' + (ss.length - complete) + ' incomplete')}${stat('PULL REQUESTS', uniqueTags.size, 'Distinct benchmark pull requests')}${stat('COMPLETED REVIEWS', units.filter((u) => u.covered).length + '<small>/ ' + units.length + '</small>', 'Across the selected lanes')}</div><div class="chart-grid"><section class="panel"><div class="panel-head"><div><h2>How much did each finder catch?</h2><p>Eligible benchmark labels found per planned repetition</p></div><span class="panel-tag">LABEL RECALL</span></div><div class="bars">${sorted.length ? sorted.map((s) => `<button class="bar-row" data-model="${esc(s.family)}" title="${esc(name(s.family))}: ${s.hits}/${s.eligible} labels; ${s.covered}/${s.units} completed"><span class="bar-name">${esc(name(s.family))}</span><span class="bar-track"><span class="bar-fill" style="display:block;width:${(s.recall || 0) * 100}%;--bar-color:${color(s.family)}"></span></span><span class="bar-value">${pct(s.recall)}</span></button>`).join('') : '<div class="empty">Select a lane to compare.</div>'}</div><div class="chart-foot">${ss.some((s) => s.covered < s.units) ? 'Incomplete lanes include unrun and failed cells. These bars show operational coverage, not a quality estimate for uncompleted work.' : 'All selected lanes completed the displayed review matrix.'}</div></section><section class="panel"><div class="panel-head"><div><h2>The cost of finding more</h2><p>Successful-cell list price against label recall</p></div><span class="panel-tag">COST × RECALL</span></div><div class="scatter-wrap">${scatter(ss)}</div><div class="chart-legend"><span>← Lower cost</span><span>↑ Higher recall</span><span>Click a point to inspect a lane</span></div><div class="chart-foot">Finder generation only. Judge costs and failed attempts are excluded. MiMo costs are PAYG equivalents, not actual Token Plan charges.</div></section></div><section class="panel"><div class="panel-head table-heading"><div><h2>The comparison, in detail</h2><p>Click a column to sort. Open any finder for its review-level results.</p></div><span class="panel-tag">${ss.length} LANES</span></div><div class="table-scroll"><table><thead><tr>${[
      ['family', 'Finder'],
      ['recall', 'Label recall'],
      ['yield', 'Label yield'],
      ['covered', 'Coverage'],
      ['dollars', 'Total cost'],
      ['time', 'Mean time'],
    ]
      .map(
        ([k, l]) =>
          `<th><button data-sort="${k}">${l} ${sort === k ? (direction === 1 ? '↑' : '↓') : '↕'}</button></th>`,
      )
      .join(
        '',
      )}</tr></thead><tbody>${ss.map((s, i) => `<tr><td><button class="table-button model-cell" data-model="${esc(s.family)}"><span class="rank">${String(i + 1).padStart(2, '0')}</span><span class="model-icon" style="--bar-color:${color(s.family)}">${esc(name(s.family)[0])}</span><span>${esc(name(s.family))}<small>${esc(s.model)}</small></span></button></td><td><span class="metric-strong">${pct(s.recall)}</span><div class="subtext">${s.hits} / ${s.eligible}</div></td><td>${pct(s.yield)}<div class="subtext">${s.hits} / ${s.published} published</div></td><td><span class="pill ${s.covered < s.units ? 'warn' : ''}">${s.covered}/${s.units} reviews</span></td><td>${money(s.dollars)}</td><td>${min(s.time)}</td></tr>`).join('')}</tbody></table></div></section>`;
}
function scatter(ss) {
  const points = ss.filter((s) => s.dollars != null && s.recall != null),
    max = Math.max(10, ...points.map((s) => s.dollars)) * 1.12;
  return `<svg class="scatter" viewBox="0 0 450 280" role="img" aria-label="Successful finder cost in dollars on the horizontal axis and label recall on the vertical axis">${[0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => `<line x1="48" y1="${242 - t * 210}" x2="420" y2="${242 - t * 210}" stroke="#e7ebe1" stroke-dasharray="3 4"/><text x="38" y="${246 - t * 210}" text-anchor="end">${t * 100}%</text>`).join('')}${[0, 0.25, 0.5, 0.75, 1].map((t) => `<text x="${48 + t * 372}" y="265" text-anchor="middle">$${Math.round(t * max)}</text>`).join('')}${points.map((s) => `<g><circle class="point" data-model="${esc(s.family)}" tabindex="0" role="button" aria-label="${esc(name(s.family))}, ${money(s.dollars)}, ${pct(s.recall)} recall" cx="${48 + (s.dollars / max) * 372}" cy="${242 - s.recall * 210}" r="6" fill="${color(s.family)}" stroke="white" stroke-width="2"><title>${esc(name(s.family))} · ${money(s.dollars)} · ${pct(s.recall)}</title></circle></g>`).join('')}</svg>`;
}
function coverage() {
  if (!report.analysis) {
    $('#content').innerHTML =
      '<div class="panel empty">Coverage has not been scored for this report.</div>';
    return;
  }
  const us = rows(),
    keys = [...new Set(us.map((u) => u.tag + '/' + u.repetition))].sort((a, b) =>
      a.localeCompare(b),
    ),
    families = report.arms.filter((a) => selected.has(a.family));
  $('#content').innerHTML =
    `<section class="panel"><div class="panel-head table-heading"><div><h2>Review coverage & label matches</h2><p>Each square is one review. Values show matched / eligible labels. Open a square to read the review.</p></div><span class="panel-tag">${keys.length} REVIEW UNITS</span></div><div class="table-scroll"><table class="matrix"><thead><tr><th>Finder / PR · repetition</th>${keys.map((k) => `<th title="${esc(repo(k.split('/')[0]).label)}">${esc(k.replace('/', ' · '))}</th>`).join('')}</tr></thead><tbody>${families
      .map(
        (a) =>
          `<tr><td>${esc(name(a.family))}</td>${keys
            .map((k) => {
              const u = us.find((u) => u.arm === a.family && u.tag + '/' + u.repetition === k);
              if (!u) return '<td>—</td>';
              const v = u.eligibleLabels ? u.hitLabels.length / u.eligibleLabels : 0;
              return `<td><button class="matrix-cell" data-cell="${esc(u.cellId)}" style="--cell-bg:${!u.covered ? '#f6e5c8' : `hsl(91 25% ${94 - v * 46}%)`}" title="${esc(repo(u.tag).label)} · ${esc(u.status)} · ${u.hitLabels.length}/${u.eligibleLabels}">${u.covered ? u.hitLabels.length + '/' + u.eligibleLabels : '×'}</button></td>`;
            })
            .join('')}</tr>`,
      )
      .join(
        '',
      )}</tbody></table></div><div class="matrix-key"><span><i style="background:#eaf0e3"></i>Few matches</span><span><i style="background:#a2bf82"></i>More matches</span><span><i style="background:#f6e5c8"></i>Failed, interrupted, or missing</span><span>Unresolved judge evidence remains unresolved.</span></div></section>`;
}
function showDetail(title, html) {
  detailRequest++;
  $('#detail-eyebrow').textContent = title;
  $('#detail-content').innerHTML = html;
  if (!$('#detail').open) $('#detail').showModal();
}
function modelDetail(family) {
  const s = summaries().find((s) => s.family === family);
  if (!s) return;
  const us = rows().filter((u) => u.arm === family);
  showDetail(
    'FINDER LANE',
    `<h2>${esc(name(family))}</h2><p>${esc(s.model)}</p><div class="detail-stats"><div class="detail-stat"><strong>${pct(s.recall)}</strong>Label recall · ${s.hits}/${s.eligible}</div><div class="detail-stat"><strong>${money(s.dollars)}</strong>Successful-cell list price</div><div class="detail-stat"><strong>${s.covered}/${s.units}</strong>Completed reviews</div></div><p>${s.unmatched} benchmark-unmatched findings · ${s.duplicates} duplicate assignments · ${s.unresolved} unresolved findings. Unmatched findings are not necessarily false positives.</p><section class="detail-section"><h3>Reviews</h3>${us.map((u) => `<button class="finding-row" data-cell="${esc(u.cellId)}"><span class="finding-text"><strong>${esc(repo(u.tag).label)} · ${esc(u.repetition)}</strong><p>${esc(u.status)} · ${u.published} findings · ${money(u.dollars)} · ${min(u.wallMs)}</p></span><span>${u.hitLabels.length}/${u.eligibleLabels} labels ↗</span></button>`).join('')}</section>`,
  );
}
async function cellDetail(cellId, outputId, sourceHash) {
  showDetail('REVIEW DETAIL', '<div class="loading">Reading review…</div>');
  const request = detailRequest;
  const arm = report.arms.find((a) => cellId.endsWith('/' + a.family)),
    output = outputId ? data.outputs.find((o) => o.id === outputId) : arm && outputFor(arm);
  if (!output) {
    showDetail('REVIEW DETAIL', '<p>No raw output is present in the snapshot for this review.</p>');
    return;
  }
  const sources = outputId ? [output] : outputsFor(arm);
  const dumps = await Promise.all(sources.map((o) => json('data/outputs/' + o.id + '.json')));
  if (request !== detailRequest || !$('#detail').open) return;
  let matchedOutput;
  let cell;
  for (const [index, dump] of dumps.entries()) {
    cell = dump.cells.find(
      (c) =>
        c.cellId === cellId &&
        (sourceHash
          ? c.sourceSha256 === sourceHash
          : outputId
            ? !c.archived
            : c.sourceSha256 === arm?.cellHashes?.[cellId]),
    );
    if (cell) {
      matchedOutput = sources[index];
      break;
    }
  }
  if (!cell) {
    showDetail(
      'REVIEW DETAIL',
      '<p>The original review file is unavailable at the hash recorded in this report. Saved scores and available finding/label evidence remain in the report and Findings explorer.</p>',
    );
    return;
  }
  const review = cell.result?.review;
  showDetail(
    'REVIEW DETAIL',
    `<span class="pill ${cell.status === 'ok' ? '' : 'warn'}">${esc(cell.status)}</span><h2>${esc(cellId)}</h2><p>${review?.findings?.length ?? 0} published findings in the recorded result.</p>${(review?.findings || []).map((f, i) => `<section class="detail-section"><span class="eyebrow">FINDING ${i + 1} · ${esc(f.severity)}</span><h3>${esc(f.title)}</h3><p>${esc(f.description)}</p><div class="detail-meta">${esc(f.file)}:${esc(f.line)}</div></section>`).join('')}<details><summary>Review metadata and receipts</summary><pre class="code">${esc(JSON.stringify(cell, null, 2))}</pre></details><p><a href="data/outputs/${esc(matchedOutput.id)}.json.gz" download>Download full review and candidate records ↗</a></p>`,
  );
}
function archive() {
  const sorted = [...data.reports].sort((a, b) => b.modified.localeCompare(a.modified));
  $('#content').innerHTML =
    `<div class="archive-meta"><strong>${data.reports.length} report snapshots · ${data.outputs.length} output runs · ${data.outputs.reduce((n, o) => n + o.cells, 0)} raw cells</strong><br>Captured ${esc(new Date(data.capturedAt).toLocaleString())}. ${esc(data.scope)}<br>Historical prompt cohorts, training runs, checkpoints, and diagnostic audits are kept separate. Repeated reports reuse earlier cells and must not be added together as independent trials.</div><p><button class="outline" data-download>Download complete snapshot ↓</button></p><h2 class="archive-section">Report snapshots</h2><div class="archive-grid">${sorted.map((r) => `<article class="archive-card"><span class="pill ${r.analysis ? '' : 'warn'}">${esc(r.split)} · ${r.analysis ? 'scored' : 'unscored'}</span><h3>${esc(reportName(r))}</h3><p>${r.arms.length} lanes · ${r.pairs.toLocaleString()} pairs<br>${esc(new Date(r.modified).toLocaleDateString())} · ${esc(r.mode)}</p><button data-report="${esc(r.id)}">Explore report ↗</button><a href="data/${esc(r.id)}/packet.json.gz" download>Packet ↓</a>${r.analysis ? `<a href="data/${esc(r.id)}/analysis.json" download>Analysis ↓</a>` : ''}</article>`).join('')}</div><h2 class="archive-section">Generation runs</h2><div class="archive-grid">${data.outputs
      .map(
        (o) =>
          `<article class="archive-card"><span class="eyebrow">${esc(o.manifest.split)}</span><h3>${esc(name(o.manifest.arm.family))}</h3><p>${esc(o.id)}<br>${o.cells} recorded cells, ${o.archivedCells || 0} archived · ${Object.entries(
            o.statuses,
          )
            .map(([k, v]) => esc(k) + ' ' + v)
            .join(
              ' · ',
            )}</p><button data-output="${esc(o.id)}">Browse reviews ↗</button><a href="data/outputs/${esc(o.id)}.json.gz" download>Full records ↓</a></article>`,
      )
      .join(
        '',
      )}</div><h2 class="archive-section">Snapshot provenance</h2><div class="archive-meta">${esc(data.source)}<br>Report analyses and packets retain original content hashes. Every exported raw cell includes its source path and SHA-256. <a href="data/inventory.json" download>Download file inventory ↗</a></div>`;
}
async function outputDetail(id) {
  const o = data.outputs.find((o) => o.id === id);
  showDetail('GENERATION RUN', '<div class="loading">Reading run…</div>');
  const request = detailRequest;
  const d = await json('data/outputs/' + id + '.json');
  if (request !== detailRequest || !$('#detail').open) return;
  showDetail(
    'GENERATION RUN',
    `<h2>${esc(id)}</h2><p>${esc(name(o.manifest.arm.family))} · ${d.cells.length} recorded cells</p>${d.cells.map((c) => `<button class="finding-row" data-cell="${esc(c.cellId)}" data-cell-output="${esc(id)}" data-cell-hash="${esc(c.sourceSha256)}"><span class="finding-text"><strong>${esc(c.cellId)}</strong><p>${esc(c.status)}${c.archived ? ' · archived attempt' : ''} · ${c.result.review?.findings?.length ?? 0} published findings</p></span><span>↗</span></button>`).join('')}`,
  );
}
async function renderFindings() {
  const epoch = reportEpoch;
  $('#content').innerHTML =
    '<section class="panel"><div class="loading">Loading recorded findings and scorer evidence…</div></section>';
  if (!findings.length) await loadFindings();
  if (epoch !== reportEpoch || view !== 'findings') return;
  $('#content').innerHTML =
    `<section class="panel"><div class="toolbar"><label class="screen-reader" for="finding-search">Search findings</label><input id="finding-search" placeholder="Search findings, files, models, or pull requests…" value="${esc(query)}"><select id="outcome-filter" aria-label="Finding outcome"><option value="all">All outcomes</option><option value="matched">Matched label</option><option value="unmatched">Benchmark unmatched</option><option value="unresolved">Unresolved evidence</option><option value="unscored">Not scored</option></select><select id="kind-filter" aria-label="Finding kind"><option value="published">Published findings</option><option value="diagnostic">Diagnostic candidates</option><option value="all">All findings</option></select></div><div id="finding-results"></div></section>`;
  $('#outcome-filter').value = outcome;
  $('#kind-filter').value = findingKind;
  filterFindings();
}
async function loadFindings() {
  const current = report,
    epoch = reportEpoch;
  const packet = await json(`data/${current.id}/packet.json.gz`),
    judges = await json(`data/${current.id}/judges.json.gz`);
  const result = new Map();
  for (const pair of packet.pairs)
    for (const member of pair.members) {
      const key = member.cellId + '|' + member.kind + '|' + member.findingIndex;
      if (!result.has(key))
        result.set(key, {
          key,
          arm: member.arm,
          tag: pair.tag,
          cellId: member.cellId,
          kind: member.kind,
          index: member.findingIndex,
          finding: pair.finding,
          pairs: [],
        });
      result.get(key).pairs.push({ ...pair, judges: judges[pair.pairId] || {} });
    }
  await Promise.all(
    current.arms.map(async (arm) => {
      const dumps = await Promise.all(
        outputsFor(arm).map((out) => json('data/outputs/' + out.id + '.json')),
      );
      for (const cell of dumps.flatMap((d) => d.cells)) {
        if (!arm.cellHashes[cell.cellId] || arm.cellHashes[cell.cellId] !== cell.sourceSha256)
          continue;
        for (const [i, f] of (cell.result.review?.findings || []).entries()) {
          const key = cell.cellId + '|published|' + i;
          const existing = result.get(key);
          if (existing) existing.finding = f;
          else
            result.set(key, {
              key,
              arm: arm.family,
              tag: cell.cellId.split(':')[1].split('/')[0],
              cellId: cell.cellId,
              kind: 'published',
              index: i,
              finding: f,
              pairs: [],
            });
        }
      }
    }),
  );
  const unitMap = new Map((current.analysis?.units || []).map((u) => [u.cellId, u]));
  for (const item of result.values()) {
    const u = unitMap.get(item.cellId),
      assignment = u?.assignments.find((a) => a.finding === item.kind + ':' + item.index);
    item.outcome = !current.analysis
      ? 'unscored'
      : assignment
        ? 'matched'
        : item.pairs.some((p) => {
              const a = p.judges.fable?.verdict,
                b = p.judges.sol?.verdict;
              return !a || !b || a !== b;
            })
          ? 'unresolved'
          : item.pairs.length
            ? 'unmatched'
            : u?.covered
              ? 'unmatched'
              : 'unscored';
    if (item.kind !== 'published')
      item.outcome = item.pairs.some(
        (p) => p.judges.fable?.verdict === 'MATCH' && p.judges.sol?.verdict === 'MATCH',
      )
        ? 'matched'
        : item.outcome;
    item.search = (
      name(item.arm) +
      ' ' +
      repo(item.tag).label +
      ' ' +
      JSON.stringify(item.finding)
    ).toLowerCase();
  }
  if (epoch === reportEpoch)
    findings = [...result.values()].sort(
      (a, b) => a.tag.localeCompare(b.tag) || a.arm.localeCompare(b.arm) || a.index - b.index,
    );
}
function filterFindings() {
  const sharedUnits = new Set(rows().map((u) => u.cellId));
  const matches = findings.filter(
    (f) =>
      selected.has(f.arm) &&
      (basis !== 'shared' || !report.analysis || sharedUnits.has(f.cellId)) &&
      (findingKind === 'all' || f.kind === findingKind) &&
      (outcome === 'all' || f.outcome === outcome) &&
      f.search.includes(query.toLowerCase()),
  );
  const size = 40,
    total = Math.ceil(matches.length / size);
  page = Math.max(0, Math.min(page, total - 1));
  const visible = matches.slice(page * size, (page + 1) * size);
  $('#finding-results').innerHTML =
    `<div class="finding-list">${visible.map((f) => `<button class="finding-row" data-finding="${esc(f.key)}"><span class="finding-index">${esc(f.tag)}</span><span class="finding-text"><strong>${esc(f.finding.title || 'Untitled finding')}</strong><p>${esc(name(f.arm))} · ${esc(repo(f.tag).label)} · ${esc(f.finding.file)}:${esc(f.finding.line ?? f.finding.startLine)}</p></span><span class="pill ${f.outcome === 'matched' ? '' : f.outcome === 'unresolved' ? 'warn' : 'muted'}">${esc(f.outcome)}</span><span class="finding-end">↗</span></button>`).join('') || '<div class="empty">No findings match these filters. Try a different search or outcome.</div>'}</div><div class="pagination"><span>${matches.length.toLocaleString()} findings · ${matches.length ? page * size + 1 : 0}–${Math.min((page + 1) * size, matches.length)} shown</span><div><button data-page="-1" ${page === 0 ? 'disabled' : ''}>← Previous</button><button data-page="1" ${page + 1 >= total ? 'disabled' : ''}>Next →</button></div></div>`;
}
function findingDetail(key) {
  const item = findings.find((f) => f.key === key);
  if (!item) return;
  const f = item.finding,
    r = repo(item.tag);
  showDetail(
    'FINDING / ' + item.tag,
    `<span class="pill ${item.outcome === 'matched' ? '' : 'warn'}">${esc(item.outcome)}</span><h2>${esc(f.title || 'Finding')}</h2><div class="detail-meta"><span>${esc(name(item.arm))}</span><span>·</span><a href="${link(r.prUrl)}" target="_blank" rel="noreferrer">${esc(r.label)} ↗</a><span>· ${esc(item.kind)} · ${esc(f.severity)}</span></div><p>${esc(f.description)}</p>${f.failureMode ? `<p><strong>Failure mode.</strong> ${esc(f.failureMode)}</p>` : ''}<pre class="code">${esc(f.file)}:${esc(f.line ?? f.startLine)}${f.endLine ? '–' + esc(f.endLine) : ''}</pre>${
      item.pairs.length
        ? item.pairs
            .map(
              (p) =>
                `<section class="detail-section"><div class="eyebrow">BENCHMARK LABEL ${esc(p.label.id)} · ${esc(p.label.class)}</div><h3 style="margin-top:10px">${esc(p.label.title)}</h3><p>${esc(p.label.description)}</p><div class="detail-grid">${['fable', 'sol'].map((j) => `<article class="judge"><strong>${j === 'fable' ? 'Fable xhigh' : 'Sol xhigh'}</strong> <span class="pill ${p.judges[j]?.verdict === 'MATCH' ? '' : 'muted'}">${esc(p.judges[j]?.verdict || 'MISSING')}</span><p>${esc(p.judges[j]?.reason || 'No valid recorded decision. This pair remains unresolved.')}</p></article>`).join('')}</div><details><summary>Inspect code and label evidence</summary>${Object.entries(
                  p.hunks || {},
                )
                  .map(
                    ([k, v]) =>
                      `<h3>${esc(k)}</h3><pre class="code">${esc(typeof v === 'string' ? v : JSON.stringify(v, null, 2))}</pre>`,
                  )
                  .join(
                    '',
                  )}${p.label.ruleText ? `<pre class="code">${esc(p.label.ruleText)}</pre>` : ''}</details><details><summary>Pair provenance</summary><pre class="code">${esc(JSON.stringify({ pairId: p.pairId, matcherVersion: p.matcherVersion, members: p.members }, null, 2))}</pre></details></section>`,
            )
            .join('')
        : '<p>No candidate-label pair was recorded for this finding. It is preserved from the raw review; absence of a benchmark match does not establish a false positive.</p>'
    }<section class="detail-section"><button class="outline" data-cell="${esc(item.cellId)}">Open complete review ↗</button></section>`,
  );
}
async function downloadSnapshot() {
  notify('Preparing the complete snapshot…');
  const manifest = await json('data/download.json'),
    parts = await Promise.all(
      manifest.parts.map(async (p) => {
        const r = await fetch('data/' + p);
        if (!r.ok) throw Error('Snapshot download failed');
        return r.blob();
      }),
    );
  const url = URL.createObjectURL(new Blob(parts, { type: 'application/gzip' })),
    a = document.createElement('a');
  a.href = url;
  a.download = manifest.filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  notify('Snapshot ready');
}
$('#close-detail').onclick = () => $('#detail').close();
$('#detail').addEventListener('click', (e) => {
  if (e.target === $('#detail')) {
    const r = $('#detail').getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
      $('#detail').close();
  }
});
document.addEventListener('click', (e) => {
  const b = e.target.closest(
    '[data-view],[data-sort],[data-model],[data-cell],[data-finding],[data-page],[data-report],[data-output],[data-download]',
  );
  if (!b) return;
  if (b.hasAttribute('data-download')) {
    safe(downloadSnapshot);
    return;
  }
  if (b.dataset.view) {
    location.hash = b.dataset.view;
    return;
  }
  if (b.dataset.sort) {
    direction = sort === b.dataset.sort ? -direction : -1;
    sort = b.dataset.sort;
    overview();
  }
  if (b.dataset.model) modelDetail(b.dataset.model);
  if (b.dataset.cell)
    safe(() => cellDetail(b.dataset.cell, b.dataset.cellOutput, b.dataset.cellHash));
  if (b.dataset.finding) findingDetail(b.dataset.finding);
  if (b.dataset.page) {
    page += Number(b.dataset.page);
    filterFindings();
  }
  if (b.dataset.report) {
    view = 'overview';
    location.hash = 'overview';
    setReport(b.dataset.report);
  }
  if (b.dataset.output) safe(() => outputDetail(b.dataset.output));
});
document.addEventListener('keydown', (e) => {
  if (e.target.matches('.point') && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    modelDetail(e.target.dataset.model);
  }
});
document.addEventListener('input', (e) => {
  if (e.target.id === 'finding-search') {
    query = e.target.value;
    page = 0;
    filterFindings();
  }
});
document.addEventListener('change', (e) => {
  if (e.target.dataset.lane) {
    if (e.target.checked) selected.add(e.target.dataset.lane);
    else selected.delete(e.target.dataset.lane);
    renderPicker();
    render();
  }
  if (e.target.id === 'report-select') setReport(e.target.value);
  if (e.target.id === 'basis-select') {
    basis = e.target.value;
    render();
  }
  if (e.target.id === 'outcome-filter') {
    outcome = e.target.value;
    page = 0;
    filterFindings();
  }
  if (e.target.id === 'kind-filter') {
    findingKind = e.target.value;
    page = 0;
    filterFindings();
  }
});
$('#lanes-toggle').onclick = () => {
  $('#lane-picker').hidden = !$('#lane-picker').hidden;
  $('#lanes-toggle').setAttribute('aria-expanded', !$('#lane-picker').hidden);
};
$('#reset').onclick = () => {
  basis = 'planned';
  $('#basis-select').value = basis;
  query = '';
  outcome = 'all';
  findingKind = 'published';
  sort = 'hits';
  direction = -1;
  setReport(report.id);
};
$('.sidebar-bottom a').onclick = (e) => {
  e.preventDefault();
  safe(downloadSnapshot);
};
window.addEventListener('hashchange', () => {
  view = headings[location.hash.slice(1)] ? location.hash.slice(1) : 'overview';
  if (data) render();
});
async function init() {
  data = await json('data/index.json');
  $('#snapshot-date').textContent =
    new Date(data.capturedAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ' · ' +
    data.reports.length +
    ' reports';
  $('#report-select').innerHTML = [...data.reports]
    .sort((a, b) => b.modified.localeCompare(a.modified))
    .map((r) => `<option value="${esc(r.id)}">${esc(reportName(r))}</option>`)
    .join('');
  view = headings[location.hash.slice(1)] ? location.hash.slice(1) : 'overview';
  setReport(data.defaultReport);
}
init().catch((e) => {
  $('#content').innerHTML =
    `<div class="error"><h2>The snapshot could not be loaded</h2><p>${esc(e.message)}</p><p>Open this site through its HTTP preview or hosted URL so the data files can load.</p></div>`;
  console.error(e);
});
