# MASTRA-411 union analysis

Precision is duplicates-penalized: labels count once per unit; published findings sum across members. Uncovered units remain in the eligible denominator.

### b-sol-xhigh∪j-grok47-high

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.606383 (114/188) | 0.692308 (72/104) | 0.5 (42/84) | 0.364217 (114/313) | 60/114 | 4 | [114, 121] | 173.837645 | 1097848.134025/1078004.763292 | 32/32 | 0 |

### b-sol-xhigh∪k-grok47-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.62234 (117/188) | 0.711538 (74/104) | 0.511905 (43/84) | 0.378641 (117/309) | 56/117 | 7 | [117, 123] | n/a | 1102541.391435/1078004.763292 | 30/32 | 2 |
One member covered: 050/r1, 050/r2.

### b-sol-xhigh∪b-sol-xhigh'

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.659574 (124/188) | 0.711538 (74/104) | 0.595238 (50/84) | 0.274336 (124/452) | 96/124 | 14 | [124, 130] | 245.06935 | 1228783.889977/1173335.498416 | 32/32 | 0 |

### b-sol-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.585106 (110/188) | 0.653846 (68/104) | 0.5 (42/84) | 0.486726 (110/226) | 0/110 | 0 | [110, 117] | 122.534675 | 1097848.134025/1078004.763292 | 32/32 | 0 |

b-sol-xhigh∪j-grok47-high: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.109533, 0]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0.021277, precision=-0.122508, dollars=51.30297, wall mean ms=0.
b-sol-xhigh∪k-grok47-xhigh: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.09184, 0.015957]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0.037234, precision=-0.108085, dollars=n/a, wall mean ms=4693.25741.

Candidate versus candidate: not applicable: fewer than two candidates qualify.
