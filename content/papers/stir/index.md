---
title: "STIR: Reed–Solomon Proximity Testing with Fewer Queries"
tags: ["hashes", "concrete", "theory"]
date: 2024-02-21
author: "Gal Arnon, Alessandro Chiesa, Giacomo Fenzi, Eylon Yogev"
description: "We present STIR (Shift To Improve Rate), a concretely efficient interactive oracle proof of proximity (IOPP) for Reed–Solomon codes that achieves the best known query complexity of any concretely efficient IOPP for this problem."
editPost:
    URL: "https://eprint.iacr.org/2024/XXX"
    Text: "ePrint: 2024/XXX"
---
Testing proximity to Reed-Solomon (RS) codes is the problem of, when given oracle access to $f: \mathcal{L} \to \mathbb{F}$, determining whether
- $f \in \mathsf{RS}[\mathbb{F}, d, \mathcal{L}]$ i.e. $f$ is a RS codeword.
- $\Delta(f, \mathsf{RS}[\mathbb{F}, d, \mathcal{L}]) > \delta$ i.e. $f$ is $\delta$-far (in terms of Hamming distance) from any RS codeword.
In this work, we consider Interactive Oracle Proofs of Proximity (IOPP) for RS codes, i.e. interactive protocols between a prover and a verifier that aims to test proximity to a RS code in which the prover sends oracle messages.

The FRI protocol [BBHR18][^fri] is one such IOPP, and underlies many SNARK-based real-world systems which offer state-of-the-art technology that protects billions of dollars' worth of transactions in blockchains.

# STIR 🥣
We present STIR (Shift To Improve Rate), a concretely efficient IOPP for RS codes that achieves the best known query complexity of any concretely efficient IOPP for this problem.

When compiled into an argument, STIR compares favourably to FRI in (i) argument size (ii) verifier time (iii) verifier hashes.

### Why rate matters
Consider the "simplest possible" interactive proof of proximity for RS codes.
1. The prover send a polynomial $\hat{f} \in \mathbb{F}^{< d}[X]$.
2. The verifier samples $z_1, \dots, z_t \gets \mathcal{L}$ and checks that $f(z_i) = \hat{f}(z_i)$.

The soundness of the above protocol is $(1 - \delta)^t$.

### Benchmarks

### Practical considerations
We consider the prover costs of STIR. In practice, FRI is run in a heavily batched context i.e. instead of testing proximity of a single polynomial to a RS code, a random linear combination of a list of polynomials $f_1, \dots, f_\ell$ is tested. The dominating prover cost is then that of committing to the polynomials, which involves performing $\ell$ FFTs to compute the evaluations of the $f_i$s over $\mathcal{L}$ and then committing to said evaluation. This cost is shared by both FRI and STIR, and, especially in this batch setting, comes to dominate. The rest of the proximity test, which is where STIR is slower than FRI, is independent of the number of polynomials committed. So changing from FRI to STIR should have an almost negligible effect on prover runtime. 

Further, STIR's better argument size and verifier hash complexity enables setting larger rates while still achieving better metrics than FRI. For example, [ethSTARK][^ethSTARK] uses FRI with $d = 2^{22}$ and $\rho = 1/4$. In our experiments, FRI yields arguments of size 154 KiB and which can be verified by performing $\approx 2800$ hashes. Instead, using STIR with $d = 2^{22}$ and $\rho = 1/2$ yields arguments of size 143 KiB whose verifier performs $\approx 2200$ hashes. Further, the dominating costs of FRI and STIR has costs quasi-linear in $d/\rho$. Thus, with these parameters, we expect the dominating costs to be approximately half as large in STIR compared to FRI. Thus, we expect to achieve _better prover costs while achieving smaller proofs and a more efficient verifier_ than FRI.

---
##### Citation

G. Arnon, A. Chiesa, G. Fenzi, E. Yogev. "_STIR: Reed–Solomon Proximity Testing with Fewer Queries_". Cryptology ePrint Archive, Paper 2024/XXX. Available at: https://ia.cr/2024/XXX.

```BibTeX
@misc{ArnonCFY,
	author       = {Gal Arnon and Alessandro Chiesa and Giacomo Fenzi and Eylon Yogev},
	title        = {STIR: Reed–Solomon Proximity Testing with Fewer Queries},
	howpublished = {Cryptology ePrint Archive, Paper 2024/XXX},
	year         = {2024},
	note         = {\url{https://eprint.iacr.org/2024/XXX}},
	url          = {https://eprint.iacr.org/2024/XXX}
}
```

---
##### Related material
[^fri]: Eli Ben-Sasson, Iddo Bentov, Yinon Horesh, and Michael Riabzev. “Fast Reed–Solomon In- teractive Oracle Proofs of Proximity”. In: Proceedings of the 45th International Colloquium on Automata, Languages and Programming. ICALP ’18. 2018,
[^ethSTARK]: StarkWare. ethSTARK Documentation. Cryptology ePrint Archive, Paper 2021/582. https://eprint.iacr.org/2021/582. 2021.
