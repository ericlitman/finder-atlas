# MASTRA-411 union analysis

Precision is duplicates-penalized: labels count once per unit; published findings sum across members. Uncovered units remain in the eligible denominator.

### b-sol-xhigh∪v-sol61-high

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.62766 (118/188) | 0.721154 (75/104) | 0.511905 (43/84) | 0.340058 (118/347) | 79/118 | 8 | [118, 121] | n/a | 1100431.57707/1078004.763292 | 30/32 | 2 |
One member covered: 080/r1, 080/r2.

### b-sol-xhigh∪t-sol61-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.632979 (119/188) | 0.730769 (76/104) | 0.511905 (43/84) | 0.318182 (119/374) | 84/119 | 9 | [119, 124] | n/a | 1131594.702725/1080581.624625 | 30/32 | 2 |
One member covered: 080/r1, 080/r2.

### b-sol-xhigh∪u-sol61-max

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.643617 (121/188) | 0.730769 (76/104) | 0.535714 (45/84) | 0.314286 (121/385) | 86/121 | 11 | [121, 124] | n/a | 1234080.722249/1157150.235416 | 30/32 | 2 |
One member covered: 080/r1, 080/r2.

### b-sol-xhigh∪b-sol-xhigh'

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.659574 (124/188) | 0.711538 (74/104) | 0.595238 (50/84) | 0.274336 (124/452) | 96/124 | 14 | [124, 130] | 245.06935 | 1228783.889977/1173335.498416 | 32/32 | 0 |

### b-sol-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.585106 (110/188) | 0.653846 (68/104) | 0.5 (42/84) | 0.486726 (110/226) | 0/110 | 0 | [110, 117] | 122.534675 | 1097848.134025/1078004.763292 | 32/32 | 0 |

b-sol-xhigh∪v-sol61-high: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.067708, 0]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0.042553, precision=-0.146668, dollars=n/a, wall mean ms=2583.443046.
b-sol-xhigh∪t-sol61-xhigh: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.070755, 0.01087]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0.047872, precision=-0.168544, dollars=n/a, wall mean ms=33746.568701.
b-sol-xhigh∪u-sol61-max: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.056818, 0.018753]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0.058511, precision=-0.17244, dollars=n/a, wall mean ms=136232.588224.

Candidate versus candidate: not applicable: fewer than two candidates qualify.
