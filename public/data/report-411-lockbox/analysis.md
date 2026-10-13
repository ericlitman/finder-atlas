# MASTRA-367 Qodo finder comparison: lockbox

Decision under the preregistered ordering (recall, precision, dollars, wall, ties to the incumbent): incumbent stays.

Ranking of complete arms: b-sol-xhigh > g-fable-medium > e-opus-xhigh > f-grok. 23 unresolved finding or label states remain on paired units; the ordering is provisional where they could change it. Incomplete arms (reported, not ranked): h-fable-high (22 uncovered).

Labels are human (Qodo PR-Review-Bench); eligibility is the shared per-label mask; 32/32 units are paired (covered by every arm).

## Paired units

| Arm | Units | Covered | Recall (hits/eligible) | Functional | Practice | Precision (hits/published) | Duplicates | Unmatched | Unresolved findings/labels | Diagnostic-only | Unidentified | Missing | Dollars | Wall mean/median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| b-sol-xhigh | 32 | 32 | 60.1% (113/188) | 68.3% (71/104) | 50.0% (42/84) | 50.0% (113/226) | 12 | 98 | 3/5 | 8 | 5 | 1 | $122.53 | 18.3 min / 18.0 min |
| e-opus-xhigh | 32 | 32 | 53.2% (100/188) | 60.6% (63/104) | 44.0% (37/84) | 80.0% (100/125) | 1 | 20 | 4/4 | 13 | 3 | 3 | $118.48 | 9.5 min / 8.2 min |
| f-grok | 32 | 32 | 39.4% (74/188) | 57.7% (60/104) | 16.7% (14/84) | 88.1% (74/84) | 2 | 8 | 0/0 | 14 | 1 | 0 | $71.36 | 24.8 min / 23.7 min |
| g-fable-medium | 32 | 32 | 54.3% (102/188) | 62.5% (65/104) | 44.0% (37/84) | 86.4% (102/118) | 0 | 14 | 2/3 | 2 | 1 | 2 | $67.82 | 2.5 min / 2.2 min |

## All units per arm

| Arm | Units | Covered | Recall (hits/eligible) | Functional | Practice | Precision (hits/published) | Duplicates | Unmatched | Unresolved findings/labels | Diagnostic-only | Unidentified | Missing | Dollars | Wall mean/median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| b-sol-xhigh | 32 | 32 | 60.1% (113/188) | 68.3% (71/104) | 50.0% (42/84) | 50.0% (113/226) | 12 | 98 | 3/5 | 8 | 5 | 1 | $122.53 | 18.3 min / 18.0 min |
| e-opus-xhigh | 32 | 32 | 53.2% (100/188) | 60.6% (63/104) | 44.0% (37/84) | 80.0% (100/125) | 1 | 20 | 4/4 | 13 | 3 | 3 | $118.48 | 9.5 min / 8.2 min |
| f-grok | 32 | 32 | 39.4% (74/188) | 57.7% (60/104) | 16.7% (14/84) | 88.1% (74/84) | 2 | 8 | 0/0 | 14 | 1 | 0 | $71.36 | 24.8 min / 23.7 min |
| g-fable-medium | 32 | 32 | 54.3% (102/188) | 62.5% (65/104) | 44.0% (37/84) | 86.4% (102/118) | 0 | 14 | 2/3 | 2 | 1 | 2 | $67.82 | 2.5 min / 2.2 min |
| h-fable-high | 32 | 10 | 19.7% (37/188) | 20.2% (21/104) | 19.0% (16/84) | 72.5% (37/51) | 0 | 14 | 0/0 | 2 | 0 | 0 | $44.81 | 6.5 min / 5.2 min |

## Paired gains and losses against the incumbent

- e-opus-xhigh: won 11 (037/r1:L37-7, 055/r1:L55-0, 055/r1:L55-3, 055/r2:L55-0, 062/r1:L62-4, 062/r2:L62-4, 074/r1:L74-4, 074/r1:L74-5, 074/r1:L74-6, 074/r1:L74-7, 090/r2:L90-3); lost 20 (021/r2:L21-2, 037/r2:L37-7, 041/r1:L41-0, 041/r1:L41-4, 041/r1:L41-5, 041/r1:L41-6, 041/r2:L41-0, 050/r1:L50-1, 055/r1:L55-1, 064/r1:L64-2, 064/r2:L64-2, 074/r1:L74-2, 074/r2:L74-2, 074/r2:L74-5, 074/r2:L74-6, 074/r2:L74-7, 088/r1:L88-5, 088/r1:L88-6, 088/r2:L88-5, 088/r2:L88-6); unresolved 10 (006/r1:L6-1, 021/r2:L21-4, 028/r1:L28-5, 028/r2:L28-2, 037/r2:L37-4, 037/r2:L37-0, 054/r1:L54-1, 054/r2:L54-1, 074/r1:L74-3, 074/r2:L74-3)
- f-grok: won 0 (none); lost 38 (021/r1:L21-2, 021/r2:L21-2, 028/r1:L28-0, 028/r1:L28-5, 028/r2:L28-0, 028/r2:L28-5, 037/r1:L37-6, 037/r2:L37-6, 037/r2:L37-7, 041/r1:L41-0, 041/r1:L41-4, 041/r1:L41-5, 041/r1:L41-6, 041/r2:L41-0, 050/r1:L50-0, 050/r1:L50-1, 050/r2:L50-0, 054/r1:L54-0, 054/r2:L54-0, 055/r1:L55-1, 055/r2:L55-1, 060/r1:L60-0, 060/r2:L60-0, 064/r1:L64-2, 064/r2:L64-1, 064/r2:L64-2, 074/r1:L74-3, 074/r2:L74-4, 074/r2:L74-5, 074/r2:L74-6, 074/r2:L74-7, 086/r1:L86-0, 088/r1:L88-5, 088/r1:L88-6, 088/r2:L88-0, 088/r2:L88-5, 088/r2:L88-6, 090/r1:L90-3); unresolved 6 (021/r2:L21-4, 037/r2:L37-4, 037/r2:L37-0, 054/r1:L54-1, 054/r2:L54-1, 074/r2:L74-3)
- g-fable-medium: won 10 (055/r1:L55-0, 055/r2:L55-0, 062/r1:L62-4, 062/r2:L62-0, 074/r1:L74-4, 074/r1:L74-5, 074/r1:L74-6, 074/r1:L74-7, 088/r1:L88-3, 090/r2:L90-3); lost 20 (028/r1:L28-0, 028/r1:L28-5, 028/r2:L28-5, 041/r1:L41-0, 041/r1:L41-4, 041/r1:L41-5, 041/r1:L41-6, 041/r2:L41-0, 055/r1:L55-1, 055/r2:L55-1, 055/r2:L55-3, 064/r1:L64-2, 064/r2:L64-1, 064/r2:L64-2, 074/r1:L74-2, 074/r1:L74-3, 088/r1:L88-5, 088/r1:L88-6, 088/r2:L88-5, 088/r2:L88-6); unresolved 10 (021/r2:L21-4, 028/r2:L28-2, 037/r1:L37-4, 037/r1:L37-0, 037/r2:L37-4, 037/r2:L37-0, 050/r2:L50-0, 054/r1:L54-1, 054/r2:L54-1, 074/r2:L74-3)

Scorer coverage: 925/931 pairs answered by both scorers; 10 unidentified (valid conflicting answers); 6 missing evidence.
