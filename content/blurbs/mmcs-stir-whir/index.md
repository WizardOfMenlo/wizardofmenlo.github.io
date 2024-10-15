---
title: "Doing mixed matrix commitments (MMCS) with STIR & WHIR"
tags: ["hashes", "concrete", "theory"]
date: 2024-10-15
author: "Giacomo Fenzi"
description: "Domain shifting to the rescue"
editPost:
    URL: "https://eprint.iacr.org/2024/390"
    Text: "ePrint: 2024/390"
---
This post looks at [Plonky3](https://github.com/Plonky3/Plonky3) and combining Mixed Matrix Commitment Schemes with [STIR 🥣](/papers/stir) and [WHIR 🌪️](/papers/whir) as the low-degree test.

As far as I understand, the problem that we are aiming to solve is the following:
The prover has committed to a matrix of functions (note the possibly different number of columns in each row)
$$
\begin{bmatrix} f_{1, 1}, \dots, f_{1, n_1} \\\ \vdots \\\  f_{m, 1}, \dots, f_{m, n_m}  \end{bmatrix}
$$

where $f_{i, j}: \mathcal{L}\_i \to \mathbb{F}$ for a list of domains $\mathcal{L}\_1, \dots, \mathcal{L}\_m \subseteq \mathbb{F}$.[^1]

The prover wants to show that each $f_{i, j} \in \mathsf{RS}[\mathbb{F}, \mathcal{L}_i, d/2^{i-1}]$.

Suppose that we want to run an iteration of STIR or WHIR to check this. An important parameter to keep in mind here is the folding factor $k$, typically $4$.[^2]
A STIR or WHIR iteration at each step reduces testing that $f \in \mathsf{RS}[\mathbb{F}, \mathcal{L}, d]$ to testing that $f' \in \mathsf{RS}[\mathbb{F}, \mathcal{L}', d/2^k]$[^3].

Denote by $\mathcal{L}^{(1)} = \mathcal{L}_1, \mathcal{L}^{(2)}, ..., \mathcal{L}^{(M)}$ the domains appearing in the STIR iteration[^4].

## Easy case
The easy case is the one in which $\mathcal{L}_1, ..., \mathcal{L}_k = \mathcal{L}^{(1)}$, 
$\mathcal{L}\_{k+1}, ..., \mathcal{L}\_{2k} = \mathcal{L}^{(2)}$ and so on. In this case, the committer is aware of what STIR will do, and it choses the domain to simplify the accumulation.

In the first iteration, the prover simply tests a random linear combination of 
$$ \sum_{j \in [n_1]} \epsilon_1^{j - 1} f_{1, j} + \epsilon_1^{n_1} \cdot \sum_{j \in [n_2]} \epsilon_1^{j - 1} \mathsf{Cor}(f_{2, j}, d) + \dots  + \epsilon_i^{n_k} \cdot \sum_{j \in [n_k]} \epsilon_1^{j - 1} \mathsf{Cor}(f_{k, j}, d)$$
($\mathsf{Cor}(f, d)$ is just some notation for degree correction up to degree $d$ as in the STIR paper.)
This will define a new virtual function $g^{(1)}: \mathcal{L}^{(2)} \to \mathbb{F}$ to be tested.

In the next round, the prover instead of just testing $g^{(1)}$, it will test instead 

$$g^{(1)} + \epsilon_2 \cdot \left( \sum_{j \in [n_{k+1}]} \epsilon_2^{j - 1} f_{k+1, j} + \dots  + \epsilon_2^{n_{2k}} \cdot \sum_{j \in [n_{2k}]} \epsilon_2^{j - 1} \mathsf{Cor}(f_{2k, j}, d/2^k) \right)$$
and so on.

Soundness follows quite easily, if any of the functions do not satisfy the proximity claim, the sum will be far from low-degree by proximity gaps.

## Harder case
In the harder case, there is no relation between the domains that STIR chooses and the ones that the MMCS has committed to. To solve this, we have to do a domain shift. Conveniently, STIR is exactly a protocol for doing domain shifts.

The prover first does a STIR iteration on 
$$ \sum_{j \in [n_1]} \epsilon_1^{j - 1} f_{1, j} $$
which defines a function $g^{(1, 1)}: \mathcal{L}^{(2)} \to \mathbb{F}$.
Then, it does a STIR iteration with folding factor $k - 1$[^5] on 
$$ \sum_{j \in [n_2]} \epsilon_1^{j - 1} f_{2, j} $$
which defines a function $g^{(1, 2)}: \mathcal{L}^{(2)} \to \mathbb{F}$ and so on.
At the end you will have $k$ functions $g^{(1, 1)}, \dots, g^{(1, k)}$ over the same domain $\mathcal{L}^{(2)}$.

Then, first run a STIR iteration on a random linear combination of these functions (obtaining a new function $g^{(2, 0)}: \mathcal{L}^{(3)} \to \mathbb{F}$). Then, do $k$ STIR iteration as above on each row of the matrix, obtaining new functions $
g^{(2, 1)}, \dots, g^{(2, k)}: \mathcal{L}^{(3)} \to \mathbb{F}$.

Iterating the protocol yields a low-degree test for MMCS. Soundness should follow as above. Of course, if at any point the domains match one can use the same strategy as in the easier case to efficiently reduce the number of running accumulators.



[^1]: I am assuming that each row has the same domain, this can be generalized but it involves adding an extra index so I will not.
[^2]: I am using WHIR's folding factor convention, i.e. each iteration will reduce the degree by $2^k$.
[^3]: WHIR in fact reduces it to a test for constrained RS codes i.e. that $f' \in \mathsf{CRS}[\mathbb{F}, \mathcal{L}', d/2^k, \hat{w}', \sigma']$, but will ignore this distinction. I have to think it WHIR natively supports this or some more work is needed.
[^4]: Remember that these domains can also be chosen freely, see [this](/blurbs/stir-parameters).
[^5]: Alternatively, one can use the same folding parameter and then degree correct the resulting function.
