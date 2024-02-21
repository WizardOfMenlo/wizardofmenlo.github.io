---
title: "SLAP: Succinct Lattice-Based Polynomial Commitments from Standard Assumptions"
tags: ["lattices", "polynomial-commitments"]
date: 2023-09-25
author: "M.R. Albrecht, G. Fenzi, N.K. Nguyen, O. Lapiha"
description: "In this paper, we construct a succinct polynomial commitment scheme from standard assumptions."
aliases:
- /lattices/slap
editPost:
    URL: "https://eprint.iacr.org/2023/1469"
    Text: "EUROCRYPT 2024 - ePrint: 2023/1469"
---
This blog-post is a short introduction to our new work: "SLAP: Succinct Lattice-Based Polynomial Commitments from Standard Assumptions". This is joint work with Martin Albrecht, Oleksandra Lapiha and Ngoc Khanh Nguyen, and the full version is [available on eprint](https://eprint.iacr.org/2023/1469). Here are also [some slides](/presentations/slap.pdf) that might be helpful.

In our [previous paper]({{< ref "/papers/towards-pcs" >}}), we looked at the problem of constructing efficient lattice-based polynomial commitments, to be used in as a drop-in replacement to non-post-quantum secure schemes such as KZG. 
In doing so we constructed two schemes making use of the techniques in [WW23][^WeeWu] to obtain succinct verification and extractability. The schemes that we came up two came with a number of caveats namely:
- a common reference string of quadratic size in the degree of the polynomial to commit
- reliance on a non-standard assumption: powerBASIS.
- one of our schemes achieves polylogarithmic verification time, but has non-negligible (inverse polynomial) soundness error.
- the other scheme instead has negligible soundness error, but only quasi-polylogarithmic verification time.

In this work, we address all of these issues and obtain a lattice-based polynomial commitment scheme with:
- polylogarithmic common reference string size
- quasi-linear commitment time
- polylogarithmic verification time
- negligible soundness error (without parallel repetition)
- security that reduces to the hardness of Module-SIS, a standard lattice assumption.

---
## Roadmap 
Refer to the [previous blog post]({{< ref "/papers/towards-pcs" >}}) for a refresher on polynomial commitment schemes and more.

Construction of a polynomial commitment scheme is a two-step process:
1. Construction of a commitment scheme
2. Designing of a proof system for the statement "$f(u) = z$ and $\mathbf{t}$ is a commitment to $f$".

We take a brief look at both of these steps.

---
## Merkle-PRISIS commitment
In order to achieve succinct verification, we require that the first commitment is _compressing_. Further, we would like the scheme to be binding for _arbitrary_ vectors in $\mathcal{R}_q$.

Our starting point is a "toy" 2-to-1 commitment scheme. Below, for some fixed $w, \mathbf{A}$, and denoting by $\mathbf{G}$ the "gadget matrix" let 
$$
\mathbf{B} = \begin{bmatrix} \mathbf{A} & & - \mathbf{G} \\\ & w\mathbf{A}& -\mathbf{G} \end{bmatrix} \enspace.
$$

- $\mathsf{Setup}(1^\lambda) \to (\mathsf{pk}, \mathsf{vk})$ samples $\mathbf{A}, w$ and uses [MP12][^MP12] sampling to construct a trapdoor $\mathbf{T}$ of $\mathbf{B}$. The verification key consists of $\mathbf{A}, \mathbf{W}$ and the proving key additionally contains $\mathbf{T}$.
- $\mathsf{Com}(\mathsf{pk}, f_0, f_1) \to (\sigma, \mathsf{aux})$ sets $\mathbf{t}_b := f_b \cdot \mathbf{e}_1$. It then uses $\mathbf{T}$ to sample short $\mathbf{s}_0, \mathbf{s}_1$ and $\hat{\mathbf{t}}$ such that $\mathbf{B}[\mathbf{s}_0, \mathbf{s}_1, \hat{\mathbf{t}}]^\top = [-\mathbf{t}_0, -\mathbf{t}_1]^\top$, it then outputs $\mathbf{t} := \mathbf{G}\hat{\mathbf{t}}$ and $(\mathbf{s}_b)_b$ as decommitment.
- $\mathsf{Open}(\mathsf{vk}, f, \sigma, \mathsf{aux})$ checks that the openings are indeed short, and that the equations are all satisfied: namely it checks that, for $b \in \\{0,1\\}$, $$w^b \mathbf{A}\mathbf{s}_b + \mathbf{t} = \mathbf{t}_b \enspace.$$

This scheme is binding under a 2-arity version of the PRISIS assumption introduced in our previous work, which we had shown to Module-SIS! 
With this observation, the natural next step is to use this "toy" scheme recursively, and construct a "Merkle tree"-like structure. 
To do so, we sample a matrix and a trapdoor for _each layer_ of the tree, and commit to the commitments originating for the bottom layer. Note that this achieves already the efficiency goals that we had set for ourselves, as building a Merkle tree only requires a linear number of invokations of the inner commitment scheme. 
Does this overall scheme satisfy the binding property? Well, in fact if you look at the commitment that is used in the inner nodes of the tree, that is _not_ by itself binding. However, we show that the overall construction is binding under a multi-instance version of the PRISIS assumption of arity 2!
We then provide a reduction of this multi-instance assumption to the single instance version, which combined with our previous observation reduces binding to Module-SIS. We further show a direct tighter reduction from multi-instance arity 2 PRISIS to Module-SIS, which we use for parameters later on.

---
## Evaluation protocol
The evaluation protocol that we design is conceptually very similar to the one that we developed in our previous work. We take inspiration from FRI and Bulletproofs. In each round of the protocol, the prover splits the polynomial in $2^k$ components (when $k=1$, components correspond to the odd and even coefficients). It sends evaluations of these polynomials and _partial opening_ corresponding to the $k$-th layer of the tree.
and receives randomness from the verifier, that it uses to compute a new polynomial, of degree roughly $d/2^k$, that corresponds to the random linear combination of those components. Prover and verifier then can efficiently update the common reference string, instance and witness and recurse on the claim.

By itself, this protocol achieves polylogarithmic verifier and communication complexity, but inherits many of the drawbacks of the previous protocol, namely the inverse polynomial soundness error. To improve, while avoiding parallel repetition, we make use of the techniques of [BHRRS21][^BHRRS21], combined with the amortization techniques that we had talked about in our previous work. Our new protocol (as our old) has efficient proof aggregation, in the sense that proving many statements of the form $\\{ f_i(u) = z_i \\}_{i \in [r]}$ has cost roughly equivalent to proving a single claim. To amplify soundness, we prove the same claim multiple times, and use the aggregation techniques in order to mantain efficiency. An appropriate setting of parameters then enables us to have an evaluation protocol that has polylogarithmic verifier and communication complexity, and negligible knowledge soundness error.
In particular, this means that we can compile the protocol to a non-interactive argument using the Fiat-Shamir transform, and achieve a sound non-interactive polynomial commitment scheme with polylogarithmic proof sizes, common reference string, and quasi-linear time prover.

The scheme here presented is for proving evaluations of polynomials over polynomial rings, while most uses of polynomial commitments in the wild are concerned with finite fields. While we could make use of the techniques in the previous work to obtain such a scheme, we also present a new generic transformation that could be of independent interest.

---
## Instantiations
We performed an evaluation of the concrete efficiency of our scheme, details of which you can find in the full version. Concretely, proof sizes for a polynomial of degree $d = 2^{20}$ are around 36 MB, which makes the scheme concretely inefficient. Some of these inefficiencies are inherent in the [MP12][^MP12] trapdoor sampling techniques that we make use of, some from the high number of repetitions that our techniques require. Reaching concrete efficiency is left for, ambitious, future work.


---
##### Citation

M. R. Albrecht, G. Fenzi, O. Lapiha, N. K. Nguyen. "_SLAP: Succinct Lattice-Based Polynomial Commitments from Standard Assumptions_". In: _Proceedings of the 43rd Annual International Conference on Theory and Application of Cryptographic Techniques_. EUROCRYPT '24. 2024. 


```BibTeX
@inproceedings{AlbrechtFNL23,
  author    = {Martin R. Albrecht and Giacomo Fenzi and Ngoc Khanh Nguyen and Oleksandra Lapiha},
  title     = {SLAP: Succinct Lattice-Based Polynomial Commitments from Standard Assumptions},
  booktitle = {Proceedings of the 43rd Annual International Conference on Theory and Application of Cryptographic Techniques},
  series    = {EUROCRYPT~'24},
  year      = {2024},
}
```

---

##### Related material


[^MP12]: D. Micciancio and C. Peikert. "Trapdoors for Lattices: Simpler, Tighter, Faster, Smaller". In: EUROCRYPT. 2012, pp. 700–718.
[^WeeWu]: H. Wee and D. J. Wu. "Succinct Vector, Polynomial, and Functional Commitments from Lattices". In: EUROCRYPT (3). Vol. 14006. Lecture Notes in Computer Science. Full version: https://eprint.iacr.org/2022/1515. Springer, 2023, pp. 385–416.
[^BHRRS21]: Alexander R. Block, Justin Holmgren, Alon Rosen, Ron D. Rothblum, and Pratik Soni. "Time and Space-Efficient Arguments from Groups of Unknown Order". In: CRYPTO 2021. Lecture Notes in Computer Science. Heidelberg, 2021, pp. 123–152.
