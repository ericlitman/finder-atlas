# MASTRA-411 union analysis

Precision is duplicates-penalized: labels count once per unit; published findings sum across members. Uncovered units remain in the eligible denominator.

### t-sol61-xhigh∪w-musewonder-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.574468 (108/188) | 0.701923 (73/104) | 0.416667 (35/84) | 0.404494 (108/267) | 84/108 | 15 | [108, 110] | n/a | 784618.510928/829591.789416 | 30/32 | 2 |
One member covered: 080/r1, 080/r2.

### t-sol61-xhigh∪x-musewonder-max

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.574468 (108/188) | 0.701923 (73/104) | 0.416667 (35/84) | 0.389892 (108/277) | 81/108 | 15 | [108, 110] | n/a | 791750.437852/807284.85675 | 30/32 | 2 |
One member covered: 080/r1, 080/r2.

### t-sol61-xhigh∪t-sol61-xhigh'

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.5 (94/188) | 0.653846 (68/104) | 0.309524 (26/84) | 0.317568 (94/296) | 92/94 | 1 | [94, 96] | n/a | 878442.01935/894471.977458 | 30/32 | 0 |

### t-sol61-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.494681 (93/188) | 0.644231 (67/104) | 0.309524 (26/84) | 0.628378 (93/148) | 0/93 | 0 | [93, 94] | n/a | 813866.129757/829591.789416 | 30/32 | 0 |

t-sol61-xhigh∪w-musewonder-xhigh: qualifies=true; recall gain=true; envelope survives=true; bootstrap excludes zero=true; 95% interval=[0.021277, 0.136364]; ordering=t-sol61-xhigh∪w-musewonder-xhigh. Delta versus t-sol61-xhigh: recall=0.079787, precision=-0.223884, dollars=n/a, wall mean ms=-29247.618829.
t-sol61-xhigh∪x-musewonder-max: qualifies=true; recall gain=true; envelope survives=true; bootstrap excludes zero=true; 95% interval=[0.019802, 0.142045]; ordering=t-sol61-xhigh∪x-musewonder-max. Delta versus t-sol61-xhigh: recall=0.079787, precision=-0.238487, dollars=n/a, wall mean ms=-22115.691905.

t-sol61-xhigh∪w-musewonder-xhigh versus t-sol61-xhigh∪x-musewonder-max: undecided: operator.
Candidate versus candidate: undecided: operator.
