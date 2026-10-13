# MASTRA-411 union analysis

Precision is duplicates-penalized: labels count once per unit; published findings sum across members. Uncovered units remain in the eligible denominator.

### b-sol-xhigh∪q-sol6-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.617021 (116/188) | 0.711538 (74/104) | 0.5 (42/84) | 0.338192 (116/343) | 70/116 | 6 | [116, 120] | 148.905215 | 1097848.134025/1078004.763292 | 32/32 | 0 |

### b-sol-xhigh∪b-sol-xhigh'

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.659574 (124/188) | 0.711538 (74/104) | 0.595238 (50/84) | 0.274336 (124/452) | 96/124 | 14 | [124, 130] | 245.06935 | 1228783.889977/1173335.498416 | 32/32 | 0 |

### b-sol-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.585106 (110/188) | 0.653846 (68/104) | 0.5 (42/84) | 0.486726 (110/226) | 0/110 | 0 | [110, 117] | 122.534675 | 1097848.134025/1078004.763292 | 32/32 | 0 |

b-sol-xhigh∪q-sol6-xhigh: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.085, 0]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0.031915, precision=-0.148533, dollars=26.37054, wall mean ms=0.

Candidate versus candidate: not applicable: fewer than two candidates qualify.
