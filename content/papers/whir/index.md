---
title: "WHIR: Reed–Solomon Proximity Testing with Super-Fast Verification"
tags: ["hashes", "concrete", "theory"]
date: 2024-09-27
author: "Gal Arnon, Alessandro Chiesa, Giacomo Fenzi, Eylon Yogev"
description: "We present WHIR (Weights Help Improving Rate), an interactive oracle proof of proximity (IOPP) for constrained Reed–Solomon codes. WHIR doubles as a multilinear polynomial commitment scheme, achieving the fastest verification speed of any such scheme while mantaining state-of-the-art argument size, verifier hash complexity and prover times."
editPost:
    URL: "https://eprint.iacr.org/2024/XXX"
    Text: "ePrint: 2024/XXX"
---

This blog-post is a short introduction to our new work: "WHIR: Reed--Solomon Proximity Testing with Super-Fast Verification". This is joint work with [Gal Arnon,](https://galarnon42.github.io/) [Alessandro Chiesa,](https://ic-people.epfl.ch/~achiesa/) and [Eylon Yogev,](https://www.eylonyogev.com/about) and the full version is [available on ePrint](https://eprint.iacr.org/2024/XXX). Code is also available at [WizardOfMenlo/whir.](https://github.com/WizardOfMenlo/whir)


# WHIR 🌪️
We present WHIR (Weights Help Improving Rate), a concretely efficient IOPP for constrained Reed--Solomon codes[^1]. 

WHIR is both an IOPP for Reed--Solomon codes and a multilinear polynomial commitment scheme (PCS), and achieves the _fastest verification_ speed of *any* such scheme, even including univariate PCS with trusted setup. 
It does so while mantaining state-of-the-art argument size and verifier hash complexity for hash-based schemes, requiring only transparent setup and guaranteeing post-quantum security.

As a multilinear and univariate PCS, WHIR achieve by far the smallest verification time across all scheme that we tested.
Taking $d = 2^{24}$ as an example:
- At the 100-bit security level, a WHIR proof takes between 740μs (with $\rho = 1/2$) to 340μs (with $\rho = 1/16$). This is a speedup of between **5300×-10600×** against Brakedown, **1100×- 2200×** against Ligero, **150×-300×** against Hyrax, **12×-24×** against PST and **3.7×-7.3×** against KZG.
- At the 128-bit security level, a WHIR proof takes between 1.4ms to 700μs achieving a speedup of between **2600×-5300×** against Brakedown, **535×-1100×** against Ligero, **93×-186×** against Greyhound, **108×-216×** against Hyrax, **7×-14×** against PST and **2.6×-5.2×** against KZG.

As an hash-based multilinear PCS, WHIR compares favourably to BaseFold in (i) argument size (ii) verifier time (iii) verifier hashes.

Taking $d = 2^{24}$ and $\rho = 1/2$ as an example, at the 100-bit security level:
- WHIR's arguments are 101 KiB vs BaseFold's 7.95 MiB (**74× better**).
- WHIR's verifier runs in 740μs vs BaseFold's 24ms (**34× better**).

As a low-degree test, WHIR achieves best-in-class verifier time, while mantaining state-of-the-art argument size and verifier hash complexity.
Taking $d = 2^{24}$ and $\rho = 1/2$ as an example, at the 128-bit security level:
- WHIR's arguments occupy 157 KiB vs STIR's 160 KiB and FRI's 306 KiB (**1.95× better**).
- WHIR's verifier perform 2.8k hashes vs STIR's 2.6k and FRI's 5.6k (**2× better**).
- WHIR's verifier runs in 1.1ms vs STIR's 3.8ms and FRI's 3.9ms (**3.5× better**).

---
## High-level overview



---
##### Citation

G. Arnon, A. Chiesa, G. Fenzi, E. Yogev. "_WHIR: Reed–Solomon Proximity Testing with Super-Fast Verification_". Cryptology ePrint Archive, Paper 2024/XXX. Available at: https://ia.cr/2024/XXX.

```BibTeX
@misc{ArnonCFY,
	author       = {Gal Arnon and Alessandro Chiesa and Giacomo Fenzi and Eylon Yogev},
	title        = {WHIR: Reed–Solomon Proximity Testing with Super-Fast Verification},
	howpublished = {Cryptology ePrint Archive, Paper 2024/XXX},
	year         = {2024},
	note         = {\url{https://eprint.iacr.org/2024/XXX}},
	url          = {https://eprint.iacr.org/2024/XXX}
}
```

---
##### Related material
[^1]: constrained Reed--Solomon codes are a generalization of Reed--Solomon codes which we introduce later. 
[^fri]: [BBHR18] Eli Ben-Sasson, Iddo Bentov, Yinon Horesh, and Michael Riabzev. “Fast Reed–Solomon Interactive Oracle Proofs of Proximity”. In: Proceedings of the 45th International Colloquium on Automata, Languages and Programming. ICALP ’18. 2018,
[^ethSTARK]: [ethSTARK] StarkWare. ethSTARK Documentation. Cryptology ePrint Archive, Paper 2021/582. https://eprint.iacr.org/2021/582. 2021.
[^proximitygaps]: [BCIKS20] Eli Ben-Sasson, Dan Carmon, Yuval Ishai, Swastik Kopparty, and Shubhangi Saraf. “Proximity Gaps for Reed–Solomon Codes”. In: Proceedings of the 61st Annual IEEE Symposium on Foundations of Computer Science. FOCS ’20. 2020.
[^deepfri]: [BGKS20] Eli Ben-Sasson, Lior Goldberg, Swastik Kopparty, and Shubhangi Saraf. “DEEP-FRI: Sampling Outside the Box Improves Soundness”. In: Proceedings of the 11th Innovations in Theoretical Computer Science Conference. ITCS ’20.
