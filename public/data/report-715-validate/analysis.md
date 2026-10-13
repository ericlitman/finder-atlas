# MASTRA-367 Qodo finder comparison: validate

Decision under the preregistered ordering (recall, precision, dollars, wall, ties to the incumbent): incumbent stays.

Ranking of complete arms: u-sol61-max. Receipts are incomplete for u-sol61-max, so the ordering beyond precision is provisional (wall and incumbent tie-breaks applied without the dollar step). Incomplete arms (reported, not ranked): y-sol61-max-rulewalk3 (1 uncovered).

Reference label provenance: "Qodo PR-Review-Bench, public; forks under github.com/agentic-review-benchmarks at the pinned shas"; eligibility is the shared per-label mask; 8/8 units are paired (covered by every arm).

## Paired units

| Arm | Units | Covered | Recall (hits/eligible) | Functional | Practice | Precision (hits/published) | Duplicates | Unmatched | Unresolved findings/labels | Diagnostic-only | Unidentified | Missing | Dollars | Wall mean/median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| u-sol61-max | 8 | 8 | 50.0% (20/40) | 52.0% (13/25) | 46.7% (7/15) | 55.6% (20/36) | 5 | 11 | 0/0 | 1 | 0 | 0 | no receipts (8 cells without receipts) | 22.3 min / 23.7 min |

## All units per arm

| Arm | Units | Covered | Recall (hits/eligible) | Functional | Practice | Precision (hits/published) | Duplicates | Unmatched | Unresolved findings/labels | Diagnostic-only | Unidentified | Missing | Dollars | Wall mean/median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| u-sol61-max | 8 | 8 | 50.0% (20/40) | 52.0% (13/25) | 46.7% (7/15) | 55.6% (20/36) | 5 | 11 | 0/0 | 1 | 0 | 0 | no receipts (8 cells without receipts) | 22.3 min / 23.7 min |
| y-sol61-max-rulewalk3 | 8 | 7 | 42.5% (17/40) | 40.0% (10/25) | 46.7% (7/15) | 27.4% (17/62) | 19 | 26 | 0/0 | 0 | 0 | 0 | no receipts (7 cells without receipts) | 24.1 min / 20.8 min |

## Paired gains and losses against the incumbent


Scorer coverage: 128/128 pairs answered by both scorers; 0 unidentified (valid conflicting answers); 0 missing evidence.
