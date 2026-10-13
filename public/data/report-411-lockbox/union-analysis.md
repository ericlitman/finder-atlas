# MASTRA-411 union analysis

Precision is duplicates-penalized: labels count once per unit; published findings sum across members. Uncovered units remain in the eligible denominator.

### b-sol-xhigh∪e-opus-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.664894 (125/188) | 0.711538 (74/104) | 0.607143 (51/84) | 0.356125 (125/351) | 88/125 | 12 | [124, 129] | 241.018593 | 1125386.052845/1078004.763292 | 32/32 | 0 |

### b-sol-xhigh∪f-grok

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.601064 (113/188) | 0.682692 (71/104) | 0.5 (42/84) | 0.364516 (113/310) | 74/113 | 0 | [112, 118] | 193.890489 | 1523050.235957/1512059.22 | 32/32 | 0 |

### b-sol-xhigh∪g-fable-medium

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.664894 (125/188) | 0.721154 (75/104) | 0.595238 (50/84) | 0.363372 (125/344) | 90/125 | 12 | [123, 130] | 190.358727 | 1097848.134025/1078004.763292 | 32/32 | 0 |

### b-sol-xhigh∪b-sol-xhigh'

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.670213 (126/188) | 0.730769 (76/104) | 0.595238 (50/84) | 0.278761 (126/452) | 100/126 | 13 | [124, 132] | 245.06935 | 1228783.889977/1173335.498416 | 32/32 | 0 |

### b-sol-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.601064 (113/188) | 0.682692 (71/104) | 0.5 (42/84) | 0.5 (113/226) | 0/113 | 0 | [112, 118] | 122.534675 | 1097848.134025/1078004.763292 | 32/32 | 0 |

b-sol-xhigh∪e-opus-xhigh: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.051402, 0.04023]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0.06383, precision=-0.143875, dollars=118.483918, wall mean ms=27537.91882.
b-sol-xhigh∪f-grok: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.126126, -0.020202]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0, precision=-0.135484, dollars=71.355814, wall mean ms=425202.101932.
b-sol-xhigh∪g-fable-medium: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.049505, 0.036458]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0.06383, precision=-0.136628, dollars=67.824052, wall mean ms=0.

Candidate versus candidate: not applicable: fewer than two candidates qualify.
