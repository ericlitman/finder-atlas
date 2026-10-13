# MASTRA-367 Qodo finder comparison: lockbox

Decision under the preregistered ordering (recall, precision, dollars, wall, ties to the incumbent): b-sol-xhigh outranks a-sol-xhigh.

Ranking of complete arms: b-sol-xhigh > a-sol-xhigh > d-astra-high > c-astra-medium. 24 unresolved finding or label states remain on paired units; the ordering is provisional where they could change it.

Labels are human (Qodo PR-Review-Bench); eligibility is the shared per-label mask; 32/32 units are paired (covered by every arm).

## Paired units

| Arm | Units | Covered | Recall (hits/eligible) | Functional | Practice | Precision (hits/published) | Duplicates | Unmatched | Unresolved findings/labels | Diagnostic-only | Unidentified | Missing | Dollars | Wall mean/median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| a-sol-xhigh | 32 | 32 | 51.6% (97/188) | 64.4% (67/104) | 35.7% (30/84) | 74.6% (97/130) | 2 | 29 | 2/2 | 6 | 4 | 0 | $105.06 | 13.1 min / 11.7 min |
| b-sol-xhigh | 32 | 32 | 56.4% (106/188) | 62.5% (65/104) | 48.8% (41/84) | 59.9% (106/177) | 23 | 43 | 5/5 | 10 | 2 | 3 | $103.46 | 13.0 min / 11.9 min |
| c-astra-medium | 32 | 32 | 37.2% (70/188) | 59.6% (62/104) | 9.5% (8/84) | 83.3% (70/84) | 2 | 10 | 2/2 | 2 | 2 | 0 | $58.28 | 4.5 min / 2.9 min |
| d-astra-high | 32 | 32 | 41.5% (78/188) | 62.5% (65/104) | 15.5% (13/84) | 79.6% (78/98) | 2 | 15 | 3/3 | 0 | 2 | 2 | $95.82 | 9.8 min / 7.6 min |

## All units per arm

| Arm | Units | Covered | Recall (hits/eligible) | Functional | Practice | Precision (hits/published) | Duplicates | Unmatched | Unresolved findings/labels | Diagnostic-only | Unidentified | Missing | Dollars | Wall mean/median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| a-sol-xhigh | 32 | 32 | 51.6% (97/188) | 64.4% (67/104) | 35.7% (30/84) | 74.6% (97/130) | 2 | 29 | 2/2 | 6 | 4 | 0 | $105.06 | 13.1 min / 11.7 min |
| b-sol-xhigh | 32 | 32 | 56.4% (106/188) | 62.5% (65/104) | 48.8% (41/84) | 59.9% (106/177) | 23 | 43 | 5/5 | 10 | 2 | 3 | $103.46 | 13.0 min / 11.9 min |
| c-astra-medium | 32 | 32 | 37.2% (70/188) | 59.6% (62/104) | 9.5% (8/84) | 83.3% (70/84) | 2 | 10 | 2/2 | 2 | 2 | 0 | $58.28 | 4.5 min / 2.9 min |
| d-astra-high | 32 | 32 | 41.5% (78/188) | 62.5% (65/104) | 15.5% (13/84) | 79.6% (78/98) | 2 | 15 | 3/3 | 0 | 2 | 2 | $95.82 | 9.8 min / 7.6 min |

## Paired gains and losses against the incumbent

- b-sol-xhigh: won 17 (028/r2:L28-5, 037/r2:L37-2, 041/r1:L41-0, 060/r1:L60-0, 062/r1:L62-0, 064/r1:L64-2, 074/r1:L74-3, 074/r1:L74-5, 074/r1:L74-6, 074/r1:L74-7, 074/r2:L74-3, 074/r2:L74-4, 074/r2:L74-5, 074/r2:L74-6, 074/r2:L74-7, 088/r1:L88-6, 088/r2:L88-5); lost 6 (041/r2:L41-4, 050/r1:L50-1, 055/r2:L55-0, 064/r1:L64-1, 064/r2:L64-1, 064/r2:L64-2); unresolved 6 (037/r1:L37-1, 041/r1:L41-6, 050/r1:L50-2, 054/r1:L54-1, 074/r1:L74-2, 074/r2:L74-2)
- c-astra-medium: won 3 (037/r2:L37-2, 074/r1:L74-3, 074/r2:L74-3); lost 30 (006/r2:L6-0, 021/r1:L21-0, 021/r1:L21-2, 021/r2:L21-0, 021/r2:L21-2, 028/r2:L28-0, 037/r1:L37-6, 037/r2:L37-6, 041/r2:L41-0, 041/r2:L41-4, 050/r1:L50-1, 054/r1:L54-0, 054/r2:L54-0, 055/r1:L55-0, 055/r1:L55-1, 055/r2:L55-0, 055/r2:L55-1, 060/r2:L60-0, 064/r2:L64-2, 074/r1:L74-4, 086/r1:L86-0, 086/r2:L86-0, 088/r1:L88-0, 088/r1:L88-5, 088/r2:L88-0, 088/r2:L88-6, 090/r1:L90-0, 090/r1:L90-3, 090/r2:L90-0, 090/r2:L90-3); unresolved 3 (050/r1:L50-3, 054/r1:L54-1, 074/r2:L74-2)
- d-astra-high: won 4 (037/r2:L37-2, 050/r2:L50-1, 074/r1:L74-3, 074/r2:L74-3); lost 22 (021/r1:L21-2, 021/r2:L21-0, 021/r2:L21-2, 037/r1:L37-6, 037/r2:L37-6, 041/r2:L41-0, 041/r2:L41-4, 054/r1:L54-0, 054/r2:L54-0, 055/r1:L55-0, 055/r1:L55-1, 055/r2:L55-0, 055/r2:L55-1, 060/r2:L60-0, 064/r2:L64-2, 074/r1:L74-4, 086/r1:L86-0, 088/r1:L88-0, 088/r1:L88-5, 088/r2:L88-0, 088/r2:L88-6, 090/r2:L90-0); unresolved 4 (054/r1:L54-1, 074/r1:L74-2, 074/r2:L74-2, 090/r1:L90-2)

Scorer coverage: 748/753 pairs answered by both scorers; 10 unidentified (valid conflicting answers); 5 missing evidence.
