# Finder Atlas

Explore Qodo bug-finding evaluations, coverage, cost, individual findings, and the evidence behind each score.

Public site: <https://finderatlas.app>. Work is tracked in Linear team **FINDER**.

## Develop

Use Node 22.23.2 and pnpm 10.34.5 (pinned in this repository).

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
python3 -m http.server 8080 --directory dist
```

The browser app is static JavaScript with no framework. Import and build commands use TypeScript. No model calls, database, or application secrets are needed.

## Update evaluation data

Keep the evaluation archives outside this repository. From `~/projects/finder-atlas`, import all archives that should appear on the site:

```sh
pnpm import:data ~/projects/qodo-finder ~/projects/qodo-finder-1055
pnpm format
pnpm lint
pnpm test
pnpm build
```

The importer discovers report packets and output manifests, follows each analysis's scorer/prior references, preserves archived retries, and writes `public/data`. Missing referenced files or mismatches with their recorded hashes stop the import. One import owns `.data-import` from creation through promotion. It validates report totals, judge coverage, findings, hashes, and the downloadable snapshot in that workspace before changing `public/data`, then packs and promotes the verified dataset. A failed import leaves `.data-import` for inspection; remove it before running another import. A failed promotion restores the previous data from `.data-previous`.

Verification decodes and scans every lexical JSON string once, including keys, values, and overwritten duplicate values, and scans exported text such as Markdown verbatim. It recognizes bounded `sk-` and `xai-` provider tokens, GitHub tokens, AWS access-key IDs, and private-key headers. It does not provide universal secret detection.

Previously published records are retained when their original source hashes are still referenced but the raw source files have changed. On the initial migration only, `--baseline /path/to/old-site/data` can supply a prior Finder Atlas snapshot. Future imports automatically use the existing `public/data` as that baseline. Original records that cannot be recovered are listed in `index.json`'s `evidenceGaps`; the UI explicitly identifies those gaps and keeps the saved summary totals. It never substitutes a different retry for missing evidence.

The newest scored lockbox report by packet modification time, excluding interim/preflight/peek/probe/audit reports, is selected by default. All discovered reports remain available, including incomplete runs and historical prompt cohorts. Keep original file modification times when copying source archives.

Open a ready PR with a FINDER issue ID. Required format, lint, data verification, and behavioral tests run before Unfret review. Mergify merges approved changes; Cloudflare Pages automatically builds `main` with `pnpm build` and serves `dist` at `finderatlas.app`. Branch pushes get Pages previews. Roll back by reverting the merge through a new PR or selecting the preceding deployment in Cloudflare Pages.

## Evidence and downloads

`public/data/index.json` contains report analyses and output manifests. Packet, judge, and full output files use gzip; browser-sized output JSON supports interactive inspection. `inventory.json` checksums the exported files. The full archive is split into 16 MB parts to fit Cloudflare Pages' per-file limit; `download.json` records the assembled archive checksum. Use the site's **Download full snapshot** button to join and download it.

Generated JSON is stored as `.json.br` in Git. The build expands it into ordinary JSON in `dist`, preserving its original bytes, paths and inventory hashes. Existing `.json.gz` evidence and snapshot download parts are copied unchanged. This keeps large generated JSON out of text review inputs.

Snapshots preserve reviews, diagnostic candidates, receipts, and provenance. Tool/transport transcripts and unreferenced scorer retries are excluded. Source hashes identify the original source files, whose full byte content may not be included in the filtered export. Snapshots from different reports reuse evaluations and must not be counted as independent trials. Label yield is not false-positive precision; absent prices stay unknown.
