# MASTRA-367 Qodo finder comparison: lockbox

Decision under the preregistered ordering (recall, precision, dollars, wall, ties to the incumbent): incumbent stays.

Ranking of complete arms: b-sol-xhigh > g-fable-medium > e-opus-xhigh > i-swe2-max > f-grok. 26 unresolved finding or label states remain on paired units; the ordering is provisional where they could change it. Incomplete arms (reported, not ranked): h-fable-high (22 uncovered).

Reference label provenance: "Qodo PR-Review-Bench, public; forks under github.com/agentic-review-benchmarks at the pinned shas"; eligibility is the shared per-label mask; 32/32 units are paired (covered by every arm).

## Paired units

| Arm | Units | Covered | Recall (hits/eligible) | Functional | Practice | Precision (hits/published) | Duplicates | Unmatched | Unresolved findings/labels | Diagnostic-only | Unidentified | Missing | Dollars | Wall mean/median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| b-sol-xhigh | 32 | 32 | 58.5% (110/188) | 65.4% (68/104) | 50.0% (42/84) | 48.7% (110/226) | 12 | 97 | 7/7 | 8 | 3 | 5 | $122.53 | 18.3 min / 18.0 min |
| e-opus-xhigh | 32 | 32 | 53.7% (101/188) | 61.5% (64/104) | 44.0% (37/84) | 80.8% (101/125) | 1 | 20 | 3/3 | 13 | 3 | 2 | $118.48 | 9.5 min / 8.2 min |
| f-grok | 32 | 32 | 38.8% (73/188) | 56.7% (59/104) | 16.7% (14/84) | 86.9% (73/84) | 2 | 9 | 0/0 | 14 | 1 | 1 | $71.36 | 24.8 min / 23.7 min |
| g-fable-medium | 32 | 32 | 53.7% (101/188) | 61.5% (64/104) | 44.0% (37/84) | 85.6% (101/118) | 0 | 14 | 3/3 | 2 | 0 | 3 | $67.82 | 2.5 min / 2.2 min |
| i-swe2-max | 32 | 32 | 52.7% (99/188) | 58.7% (61/104) | 45.2% (38/84) | 81.1% (99/122) | 4 | 19 | 0/0 | 0 | 1 | 0 | $14.79 | 6.0 min / 6.1 min |

## All units per arm

| Arm | Units | Covered | Recall (hits/eligible) | Functional | Practice | Precision (hits/published) | Duplicates | Unmatched | Unresolved findings/labels | Diagnostic-only | Unidentified | Missing | Dollars | Wall mean/median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| b-sol-xhigh | 32 | 32 | 58.5% (110/188) | 65.4% (68/104) | 50.0% (42/84) | 48.7% (110/226) | 12 | 97 | 7/7 | 8 | 3 | 5 | $122.53 | 18.3 min / 18.0 min |
| e-opus-xhigh | 32 | 32 | 53.7% (101/188) | 61.5% (64/104) | 44.0% (37/84) | 80.8% (101/125) | 1 | 20 | 3/3 | 13 | 3 | 2 | $118.48 | 9.5 min / 8.2 min |
| f-grok | 32 | 32 | 38.8% (73/188) | 56.7% (59/104) | 16.7% (14/84) | 86.9% (73/84) | 2 | 9 | 0/0 | 14 | 1 | 1 | $71.36 | 24.8 min / 23.7 min |
| g-fable-medium | 32 | 32 | 53.7% (101/188) | 61.5% (64/104) | 44.0% (37/84) | 85.6% (101/118) | 0 | 14 | 3/3 | 2 | 0 | 3 | $67.82 | 2.5 min / 2.2 min |
| i-swe2-max | 32 | 32 | 52.7% (99/188) | 58.7% (61/104) | 45.2% (38/84) | 81.1% (99/122) | 4 | 19 | 0/0 | 0 | 1 | 0 | $14.79 | 6.0 min / 6.1 min |
| h-fable-high | 32 | 10 | 19.7% (37/188) | 20.2% (21/104) | 19.0% (16/84) | 72.5% (37/51) | 0 | 14 | 0/0 | 2 | 0 | 0 | $44.81 | 6.5 min / 5.2 min |

## Paired gains and losses against the incumbent

- e-opus-xhigh: won 11 (037/r1:L37-7, 055/r1:L55-0, 055/r1:L55-3, 055/r2:L55-0, 062/r1:L62-4, 062/r2:L62-4, 074/r1:L74-4, 074/r1:L74-5, 074/r1:L74-6, 074/r1:L74-7, 090/r2:L90-3); lost 20 (021/r2:L21-2, 037/r2:L37-0, 037/r2:L37-7, 041/r1:L41-0, 041/r1:L41-4, 041/r1:L41-5, 041/r1:L41-6, 041/r2:L41-0, 050/r1:L50-1, 055/r1:L55-1, 064/r1:L64-2, 064/r2:L64-2, 074/r1:L74-2, 074/r2:L74-2, 074/r2:L74-5, 074/r2:L74-6, 088/r1:L88-5, 088/r1:L88-6, 088/r2:L88-5, 088/r2:L88-6); unresolved 10 (006/r2:L6-0, 041/r1:L41-1, 054/r1:L54-1, 054/r2:L54-1, 055/r1:L55-2, 074/r1:L74-3, 074/r2:L74-3, 074/r2:L74-7, 088/r2:L88-2, 090/r1:L90-4)
- f-grok: won 0 (none); lost 39 (021/r1:L21-2, 021/r2:L21-2, 028/r1:L28-0, 028/r1:L28-5, 028/r2:L28-0, 028/r2:L28-5, 037/r1:L37-6, 037/r2:L37-0, 037/r2:L37-6, 037/r2:L37-7, 041/r1:L41-0, 041/r1:L41-4, 041/r1:L41-5, 041/r1:L41-6, 041/r2:L41-0, 050/r1:L50-0, 050/r1:L50-1, 050/r2:L50-0, 054/r1:L54-0, 054/r2:L54-0, 055/r1:L55-1, 055/r2:L55-1, 060/r1:L60-0, 060/r2:L60-0, 064/r1:L64-1, 064/r1:L64-2, 064/r2:L64-1, 064/r2:L64-2, 074/r1:L74-3, 074/r2:L74-4, 074/r2:L74-5, 074/r2:L74-6, 086/r1:L86-0, 088/r1:L88-5, 088/r1:L88-6, 088/r2:L88-0, 088/r2:L88-5, 088/r2:L88-6, 090/r1:L90-3); unresolved 7 (041/r1:L41-1, 054/r1:L54-1, 054/r2:L54-1, 055/r1:L55-2, 074/r2:L74-3, 074/r2:L74-7, 090/r1:L90-4)
- g-fable-medium: won 11 (037/r1:L37-0, 055/r1:L55-0, 055/r2:L55-0, 062/r1:L62-4, 062/r2:L62-0, 074/r1:L74-4, 074/r1:L74-5, 074/r1:L74-6, 074/r1:L74-7, 088/r1:L88-3, 090/r2:L90-3); lost 21 (028/r1:L28-0, 028/r1:L28-5, 028/r2:L28-5, 037/r2:L37-0, 041/r1:L41-0, 041/r1:L41-4, 041/r1:L41-5, 041/r1:L41-6, 041/r2:L41-0, 055/r1:L55-1, 055/r2:L55-1, 055/r2:L55-3, 064/r1:L64-2, 064/r2:L64-1, 064/r2:L64-2, 074/r1:L74-2, 074/r1:L74-3, 088/r1:L88-5, 088/r1:L88-6, 088/r2:L88-5, 088/r2:L88-6); unresolved 10 (028/r1:L28-2, 041/r1:L41-1, 054/r1:L54-1, 054/r2:L54-1, 055/r1:L55-2, 060/r2:L60-0, 074/r2:L74-0, 074/r2:L74-3, 074/r2:L74-7, 090/r1:L90-4)
- i-swe2-max: won 10 (037/r1:L37-7, 055/r1:L55-4, 055/r2:L55-0, 062/r1:L62-4, 062/r2:L62-0, 074/r1:L74-4, 074/r1:L74-5, 074/r1:L74-6, 074/r1:L74-7, 090/r2:L90-3); lost 25 (021/r1:L21-2, 021/r2:L21-2, 028/r1:L28-0, 028/r1:L28-5, 028/r2:L28-5, 037/r2:L37-0, 037/r2:L37-2, 041/r1:L41-4, 041/r1:L41-5, 041/r1:L41-6, 041/r2:L41-0, 050/r1:L50-1, 055/r1:L55-1, 055/r2:L55-1, 055/r2:L55-3, 064/r1:L64-1, 064/r1:L64-2, 064/r2:L64-1, 064/r2:L64-2, 074/r1:L74-2, 088/r1:L88-5, 088/r1:L88-6, 088/r2:L88-5, 088/r2:L88-6, 090/r2:L90-0); unresolved 7 (041/r1:L41-1, 054/r1:L54-1, 054/r2:L54-1, 055/r1:L55-2, 074/r2:L74-3, 074/r2:L74-7, 090/r1:L90-4)

Scorer coverage: 1096/1107 pairs answered by both scorers; 8 unidentified (valid conflicting answers); 11 missing evidence.
