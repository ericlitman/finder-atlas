# MASTRA-411 union analysis

Precision is duplicates-penalized: labels count once per unit; published findings sum across members. Uncovered units remain in the eligible denominator.

### b-sol-xhigh∪r-sol6-max

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.62766 (118/188) | 0.721154 (75/104) | 0.511905 (43/84) | 0.309711 (118/381) | 81/118 | 8 | [118, 122] | 165.999068 | 1107181.308552/1078004.763292 | 32/32 | 0 |

### b-sol-xhigh∪s-opus55-max

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.654255 (123/188) | 0.730769 (76/104) | 0.559524 (47/84) | 0.33515 (123/367) | 94/123 | 13 | [123, 127] | 238.712056 | 1130501.530674/1095149.250208 | 32/32 | 0 |

### b-sol-xhigh∪b-sol-xhigh'

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.659574 (124/188) | 0.711538 (74/104) | 0.595238 (50/84) | 0.274336 (124/452) | 96/124 | 14 | [124, 130] | 245.06935 | 1228783.889977/1173335.498416 | 32/32 | 0 |

### b-sol-xhigh

| Recall | Functional | Practice | Precision | Overlap intersection/union | Marginal | Envelope | Dollars | Wall mean/median ms | Covered | One member covered |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.585106 (110/188) | 0.653846 (68/104) | 0.5 (42/84) | 0.486726 (110/226) | 0/110 | 0 | [110, 117] | 122.534675 | 1097848.134025/1078004.763292 | 32/32 | 0 |

b-sol-xhigh∪r-sol6-max: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.071429, 0.005814]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0.042553, precision=-0.177014, dollars=43.464393, wall mean ms=9333.174527.
b-sol-xhigh∪s-opus55-max: qualifies=false; recall gain=false; envelope survives=false; bootstrap excludes zero=false; 95% interval=[-0.060444, 0.054878]; ordering=b-sol-xhigh∪b-sol-xhigh'. Delta versus b-sol-xhigh: recall=0.069149, precision=-0.151576, dollars=116.177381, wall mean ms=32653.39665.

Candidate versus candidate: not applicable: fewer than two candidates qualify.
