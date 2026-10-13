# MASTRA-411 union analysis

Precision is duplicates-penalized: labels count once per unit; published findings sum across members. Uncovered units remain in the eligible denominator.

### b-sol-xhigh∪i-swe2-max

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.659574 (124/188) | 0.701923 (73/104) | 0.607143 (51/84) | 0.356322 (124/348) | 85/124 | 14 | [124, 127] | 137.326924 | 1097848.134025/1078004.763292 | 32/32 | 0 |

### b-sol-xhigh∪e-opus-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.659574 (124/188) | 0.701923 (73/104) | 0.607143 (51/84) | 0.353276 (124/351) | 87/124 | 14 | [124, 128] | 241.018593 | 1125386.052845/1078004.763292 | 32/32 | 0 |

### b-sol-xhigh∪g-fable-medium

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.664894 (125/188) | 0.701923 (73/104) | 0.619048 (52/84) | 0.363372 (125/344) | 86/125 | 15 | [125, 128] | 190.358727 | 1097848.134025/1078004.763292 | 32/32 | 0 |

### b-sol-xhigh∪b-sol-xhigh'

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.659574 (124/188) | 0.711538 (74/104) | 0.595238 (50/84) | 0.274336 (124/452) | 96/124 | 14 | [124, 130] | 245.06935 | 1228783.889977/1173335.498416 | 32/32 | 0 |

### b-sol-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.585106 (110/188) | 0.653846 (68/104) | 0.5 (42/84) | 0.486726 (110/226) | 0/110 | 0 | [110, 117] | 122.534675 | 1097848.134025/1078004.763292 | 32/32 | 0 |

b-sol-xhigh∪i-swe2-max: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.047619, 0.044944]; ordering=b-sol-xhigh∪i-swe2-max. Delta versus b-sol-xhigh: recall=0.074468, precision=-0.130404, dollars=14.792248, wall mean ms=0.
b-sol-xhigh∪e-opus-xhigh: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.047872, 0.046392]; ordering=b-sol-xhigh∪e-opus-xhigh. Delta versus b-sol-xhigh: recall=0.074468, precision=-0.133449, dollars=118.483918, wall mean ms=27537.91882.
b-sol-xhigh∪g-fable-medium: qualifies=false; recall gain=true; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.043956, 0.051136]; ordering=b-sol-xhigh∪g-fable-medium. Delta versus b-sol-xhigh: recall=0.079787, precision=-0.123354, dollars=67.824052, wall mean ms=0.

Candidate versus candidate: not applicable: fewer than two candidates qualify.
