# MASTRA-367 Qodo finder comparison: train

Decision under the preregistered ordering (recall, precision, dollars, wall, ties to the incumbent): incumbent stays.

Ranking of complete arms: u-sol61-max. Receipts are incomplete for u-sol61-max, so the ordering beyond precision is provisional (wall and incumbent tie-breaks applied without the dollar step). 6 unresolved finding or label states remain on paired units; the ordering is provisional where they could change it. Incomplete arms (reported, not ranked): x-sol61-max-rulewalk2 (23 uncovered), y-sol61-max-rulewalk3 (1 uncovered).

Reference label provenance: "Qodo PR-Review-Bench, public; forks under github.com/agentic-review-benchmarks at the pinned shas"; eligibility is the shared per-label mask; 24/24 units are paired (covered by every arm).

## Paired units

| Arm | Units | Covered | Recall (hits/eligible) | Functional | Practice | Precision (hits/published) | Duplicates | Unmatched | Unresolved findings/labels | Diagnostic-only | Unidentified | Missing | Dollars | Wall mean/median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| u-sol61-max | 24 | 24 | 43.8% (63/144) | 54.7% (41/75) | 31.9% (22/69) | 57.8% (63/109) | 3 | 40 | 3/3 | 4 | 4 | 1 | no receipts (24 cells without receipts) | 27.9 min / 29.1 min |

## All units per arm

| Arm | Units | Covered | Recall (hits/eligible) | Functional | Practice | Precision (hits/published) | Duplicates | Unmatched | Unresolved findings/labels | Diagnostic-only | Unidentified | Missing | Dollars | Wall mean/median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| u-sol61-max | 24 | 24 | 43.8% (63/144) | 54.7% (41/75) | 31.9% (22/69) | 57.8% (63/109) | 3 | 40 | 3/3 | 4 | 4 | 1 | no receipts (24 cells without receipts) | 27.9 min / 29.1 min |
| x-sol61-max-rulewalk2 | 24 | 1 | 3.5% (5/144) | 1.3% (1/75) | 5.8% (4/69) | 19.2% (5/26) | 8 | 12 | 1/1 | 0 | 1 | 0 | no receipts (1 cells without receipts) | 27.2 min / 27.2 min |
| y-sol61-max-rulewalk3 | 24 | 23 | 51.4% (74/144) | 48.0% (36/75) | 55.1% (38/69) | 37.0% (74/200) | 11 | 106 | 9/6 | 2 | 4 | 5 | no receipts (23 cells without receipts) | 27.3 min / 26.2 min |

## Paired gains and losses against the incumbent


Scorer coverage: 499/505 pairs answered by both scorers; 9 unidentified (valid conflicting answers); 6 missing evidence.
