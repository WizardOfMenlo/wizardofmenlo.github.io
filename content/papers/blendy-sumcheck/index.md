---
title: "A Time-Space Tradeoff for the Sumcheck Prover"
tags: ["sumcheck"]
date: 2024-02-21
author: "Alessandro Chiesa, Elisabetta Fedele, Giacomo Fenzi, Andrew Zitek-Estrada"
description: "We present a new family of algorithms for the sumcheck protocol prover that offer new time-space tradeoffs."
draft: true
editPost:
    URL: "https://eprint.iacr.org/2024/XXX"
    Text: "ePrint: 2024/XXX"
---
This blog-post is a short introduction to our new work: "A Time-Space Tradeoff for the Sumcheck Prover". This is joint work with Alessandro Chiesa, Elisabetta Fedele, Andrew Zitek-Estrada, and the full version is [available on ePrint.](https://eprint.iacr.org/2024/XXX) Code accompanying this work can be found at [space-efficient-sumcheck.](https://github.com/compsec-epfl/space-efficient-sumcheck)

The sumcheck protocol [LFKN92][^sumcheck] is an interactive protocol between a prover and a verifier that allows a verifier to _succinctly_ check claims of the form
$$ \sum_{\mathbf{b} \in \\{0, 1\\}^n} p(\mathbf{b}) = \gamma \enspace. $$

In this note, we consider the case where $p \in \mathbb{F}[X_1, \dots, X_n]$ is a multi-linear polynomial, and write $N = 2^n$ for the size of the prover input. 
For concrete deployments, maximising the prover's efficiency is paramount, as both its time and space complexity can be bottlenecks.
Previous to this work, two main algorithms to efficiently implement the sumcheck prover were known
- [CTY11][^CTY]: which runs in time $O(N \log N)$ and uses space $O(\log N)$.
- [VSBW13][^VSBW]: which runs in time $O(N)$ and uses space $O(N)$.

# Blendy 🍹
We introduce **Blendy**, a new family of algorithms for the sumcheck prover which run in time $O(k N)$ and use space $O(N^{1/k})$. Before, $k$ is a parameter that regulates the Time-Space tradeoff of our algorithms.

Our algorithms, at an high level, divides the $n$ rounds of sumcheck into $k$ stages. At the start of each stage, it performs a precomputation to populate a table of size $O(N^{1/k})$, which is then used to compute the polynomials related to that particular stage.

We implement our algorithms (which is made available at [space-efficient-sumcheck](https://github.com/compsec-epfl/space-efficient-sumcheck/)) and observe that our algorithm has a similar time-complexity to the state-of-the-art ([VSBW13][^VSBW]) while using much less memory. Concretely, for $n = 28$, [VSBW] runs in 20.4s while using 5.2 GiB of memory, while Blendy (with $k = 2$) runs in 21.8s while using 1MiB of memory: a 0.93x slowdown traded for a **650x** improvement in memory usage.

---
##### Citation

A. Chiesa, E. Fedele, G. Fenzi, A. Zitek-Estrada. "_A Time-Space Tradeoff for the Sumcheck Prover_". Cryptology ePrint Archive, Paper 2024/XXX. Available at: https://ia.cr/2024/XXX.

```BibTeX
@misc{ChiesaFFZ24,
	author       = {Alessandro Chiesa and Elisabetta Fedele and Giacomo Fenzi and Andrew Zitek-Estrada},
	title        = {A Time-Space Tradeoff for the Sumcheck Prover},
	howpublished = {Cryptology ePrint Archive, Paper 2024/XXX},
	year         = {2024},
	note         = {\url{https://eprint.iacr.org/2024/XXX}},
	url          = {https://eprint.iacr.org/2024/XXX}
}
```

---
##### Related material

[^sumcheck]: Carsten Lund, Lance Fortnow, Howard J. Karloff, and Noam Nisan. “Algebraic Methods for Interactive Proof Systems”. In: Journal of the ACM 39.4 (1992).
[^CTY]: Graham Cormode, Justin Thaler, and Ke Yi. “Verifying computations with streaming interactive proofs”. In: Proceedings of the VLDB Endowment 5.1 (2011), pp. 25–36.
[^VSBW]: Victor Vu, Srinath Setty, Andrew J. Blumberg, and Michael Walfish. “A hybrid architecture for interactive verifiable computation”. In: Proceedings of the 34th IEEE Symposium on Security and Privacy. Oakland ’13. 2013, pp. 223–237.
