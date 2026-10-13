# MASTRA-411 union analysis

Precision is duplicates-penalized: labels count once per unit; published findings sum across members. Uncovered units remain in the eligible denominator.

### b-sol-xhigh∪n-opus55-medium

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.654255 (123/188) | 0.740385 (77/104) | 0.547619 (46/84) | 0.380805 (123/323) | 75/123 | 13 | [121, 129] | 132.724517 | 1097848.134025/1078004.763292 | 32/32 | 0 |

### b-sol-xhigh∪o-opus55-high

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.664894 (125/188) | 0.75 (78/104) | 0.559524 (47/84) | 0.375375 (125/333) | 81/125 | 15 | [124, 129] | 133.264372 | 1097848.134025/1078004.763292 | 32/32 | 0 |

### b-sol-xhigh∪p-opus55-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.654255 (123/188) | 0.730769 (76/104) | 0.559524 (47/84) | 0.345506 (123/356) | 91/123 | 13 | [123, 126] | 169.866187 | 1097848.134025/1078004.763292 | 32/32 | 0 |

### b-sol-xhigh∪b-sol-xhigh'

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.659574 (124/188) | 0.711538 (74/104) | 0.595238 (50/84) | 0.274336 (124/452) | 96/124 | 14 | [124, 130] | 245.06935 | 1228783.889977/1173335.498416 | 32/32 | 0 |

### b-sol-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.585106 (110/188) | 0.653846 (68/104) | 0.5 (42/84) | 0.486726 (110/226) | 0/110 | 0 | [110, 117] | 122.534675 | 1097848.134025/1078004.763292 | 32/32 | 0 |

b-sol-xhigh∪n-opus55-medium: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.069892, 0.055556]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0.069149, precision=-0.105921, dollars=10.189842, wall mean ms=0.
b-sol-xhigh∪o-opus55-high: qualifies=false; recall gain=true; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.054351, 0.061224]; ordering=b-sol-xhigh∪o-opus55-high. Delta versus b-sol-xhigh: recall=0.079787, precision=-0.11135, dollars=10.729697, wall mean ms=0.
b-sol-xhigh∪p-opus55-xhigh: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.060444, 0.050562]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0.069149, precision=-0.14122, dollars=47.331512, wall mean ms=0.

Candidate versus candidate: not applicable: fewer than two candidates qualify.
