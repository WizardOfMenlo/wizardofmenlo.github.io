---
title: "Lattice-Based Polynomial Commitments: Towards Asymptotic and Concrete Efficiency"
tags: ["lattices", "polynomial-commitments", "theory"]
date: 2023-06-06
author: "Giacomo Fenzi, Hossein Moghaddas, Ngoc Khanh Nguyen"
description: "In this paper, we introduce the powerBASIS assumption, and use it construct quasi-succinct polynomial commitment schemes from lattices."
editPost:
    URL: "https://eprint.iacr.org/2023/846"
    Text: "ePrint: 2023/846"
---
In this blog-post, I will be taking a look at my recent work with Hossein Moghaddas and Ngoc Khanh Nguyen, [full version](https://eprint.iacr.org/2023/846).
We extend the vector commitment scheme of [WW23][^WeeWu] with an evaluation proof, and achieve a lattice-based polynomial commitment scheme with polylogarithmic proof size and verifier complexity.
We further investigate the applicability of our techniques to the Polynomial IOP of [Marlin][^Marlin], show that our scheme is easily batchable and more!

---
## Polynomial Commitments
A polynomial commitment scheme is a natural generalization of a vector commitment scheme, in which a party is able to commit to a polynomial $f$, and later engage in a _evaluation protocol_ to show that $f(u) = z$. In this work, we consider polynomials of bounded degree $d$ with coefficients over the polynomial ring $\mathcal{R}_q$ (we also show to adapt this construction for polynomials in $\mathbb{F}^{\leq d}[X]$, but details are left for the full version). 

The interface of a polynomial commitment scheme follows partially that of standard commitmentscheme:
- $\mathsf{Setup}(1^\lambda) \to (\mathsf{pk}, \mathsf{vk})$ takes a security parameter and outputs a proving and a verification key.
- $\mathsf{Com}(\mathsf{pk}, f) \to (\sigma, \mathsf{aux})$ takes a proving key and a polynomial $f$ and outputs a commitment $\sigma$ and auxiliary decommitment information $\mathsf{aux}$. 
- $\mathsf{Open}(\mathsf{vk}, f, \sigma, \mathsf{aux})$ checks whether $(\sigma, \mathsf{aux})$ are a valid commitment-opening pair for $f$.

Furthermore, we extend the interface with an evaluation protocol between a prover and a verifier $\mathbf{P}, \mathbf{V}$. We denote the protocol as $\langle \mathbf{P}(\mathsf{pk}, f, \mathsf{aux}), \mathbf{V}(\mathsf{vk}) \rangle(\sigma, u, v)$.

The properties that we require from a polynomial commitment scheme are:
1. Completeness of the commitment scheme: If $\mathsf{pk}, \mathsf{vk}, \sigma, \mathsf{aux} $ are honestly generated (w.r.t to $f$), then $\mathsf{Open}(\mathsf{vk}, f, \sigma, \mathsf{aux}) = 1$.
2. Binding of the commitment scheme: The probability that an efficient adversary can find $\sigma, f,g, \mathsf{aux}_f, \mathsf{aux_g}$ such that $\mathsf{Open}(\mathsf{vk}, f, \sigma, \mathsf{aux}_f) = 1 = \mathsf{Open}(\mathsf{vk}, g, \sigma, \mathsf{aux}_g)$ is negligible.
3. Evaluation completeness: If $f(u) = z$, the evaluation protocol will accept.
4. Evaluation knowledge-soundness: There exists an efficient extractor that, if a malicous prover is able to make the verifier accept with non-negligible probability, is able to extract a polynomial $f$ and an opening $\mathsf{aux}$ such that $f(u) = z$ and $\mathsf{Open}(\mathsf{vk}, f, \sigma, \mathsf{aux}_f) = 1$.

In the paper, we also consider hiding, but in the interest of space we avoid this here.

---
## WeeWu Commitments
Our starting point is the commitment scheme introduced in [WW23][^WeeWu]. Their commitments relies on the BASIS assumption (Basis-Augmented Short Integer Solution). It roughly states that an adversary that is given access to a random matrix $\mathbf{A}$, should not be able to find a short vector $\mathbf{v}$ such that $\mathbf{A}\mathbf{v} = 0$ even when given access to a trapdoor to sample short preimages of a matrix $\mathbf{B}$ related to $\mathbf{A}$. In their work, the matrix $\mathbf{B}$ is defined as $$\begin{bmatrix}\mathbf{A}_0 &&& - \mathbf{G}\\\  & \ddots & & \\\ & & \mathbf{A}_d & - \mathbf{G} \end{bmatrix}$$ where $\mathbf{A}_i = \mathbf{W}_i \mathbf{A}$ for $\mathbf{W_i}$ random invertible matrices and $\mathbf{G}$ the gadget matrix of [MP12][^MP12].
We extend this to two new assumptions, the powerBASIS and PRISIS assumptions. Roughly, we introduce more structure in the $\mathbf{W}_i$. In powerBASIS, we let $\mathbf{W}_i = \mathbf{W}^{i}$, while in PRISIS we set $\mathbf{W}_i = w^{i} \mathbf{I}$.
With this added structure, the commitment scheme that we construct is exactly as in [WW23] (here we present the powerBASIS version). 
Namely:
- $\mathsf{Setup}(1^\lambda) \to (\mathsf{pk}, \mathsf{vk})$ samples $\mathbf{A}, \mathbf{W}$ and uses [MP12][^MP12] sampling to construct a trapdoor $\mathbf{T}$ of $\mathbf{B}$. The verification key consists of $\mathbf{A}, \mathbf{W}$ and the proving key additionally contains $\mathbf{T}$.
- $\mathsf{Com}(\mathsf{pk}, f) \to (\sigma, \mathsf{aux})$ uses $\mathbf{T}$ to sample short $\mathbf{z_i}$ and $\hat{\mathbf{c}}$ such that $\mathbf{B}[\mathbf{z}_0, \dots, \mathbf{z}_d, \hat{\mathbf{c}}]^\top = [-f_0 \mathbf{W}^0 \mathbf{e}_1, \dots, - f_d \mathbf{W}^d \mathbf{e}_1]^\top$, it then outputs $\mathbf{c} := \mathbf{G}\hat{\mathbf{c}}$ and $(\mathbf{z}_i)$ as decommitment.
- $\mathsf{Open}(\mathsf{vk}, f, \sigma, \mathsf{aux})$ checks that the openings are indeed short, and that the equations are all satisfied: namely it checks that $$\mathbf{A}\mathbf{z}_i + f_i \mathbf{e}_1 = \mathbf{W}^{-i}\mathbf{c} \enspace.$$

We then show that this commitment scheme is binding (even with respect to relaxed openings, as customary in the lattice-world).

---
## Evaluation Proofs
Now, our evaluation protocols are inspired partly by FRI (even though the setting and analysis are completely different). Suppose we aim to show that $f(u) = z$. 
We take our polynomial $f$ and write it as an odd an even part i.e.: 
$$f(X) = f_0(X^2) + Xf_1(X^2)$$
The prover then sends evaluations $z_0, z_1$ of $f_0, f_1$ on $u^2$.
The verifier checks that $z_0 + u z_1 = z$ and sends a random challenge $\alpha$ to the prover, and computes an updated commitment $\mathbf{c}' = (1 + \alpha \mathbf{W}^{-1}) \mathbf{c}$ and a new verification key where $\mathbf{W}' = \mathbf{W}^2$.
The prover computes a new folded polynomial $g$ and updated opening as follows:
$$g(X) = f_0(X) + \alpha f_1(X), \mathbf{s}_i = \mathbf{z}\_{2i} + \alpha \mathbf{z}\_{2i+1}\enspace.$$ 
The crucial observation is that the parties now can recurse on the claim that $g(u^2) = z_0 + \alpha z_1$, which is about a polynomial of degree $d/2$. We recurse thus $\log d$ times, until the prover can just send a constant sized opening.
Note in particular that the additional structure of the powerBASIS construction allowed the verifier to efficiently construct a commitment to $g$ from one to $f$. In particular, note that 
$$\mathbf{A}\mathbf{s}_i + g_i \mathbf{e}_1 = \mathbf{A}\mathbf{z}\_{2i} + f\_{2i}\mathbf{e}_1 + \alpha \cdot ( \mathbf{A}\mathbf{z}\_{2i+1} + f\_{2i+1}\mathbf{e}_1)$$
$$ = \mathbf{W}^{-2i}\mathbf{c} + \alpha \mathbf{W}^{-2i - 1}\mathbf{c} = (\mathbf{W}^2)^{-i} (1 + \alpha \mathbf{W}^{-1})\mathbf{c}$$

Crucially, compared to other protocols like lattice-bulletproofs, the extraction keeps the norm growth more manageable (at the cost of trusted setup), which should lead to more concretely efficient protocols. The details are in the paper, due to the requirement of a flurry of notation.

Now, what is left to do is to manage the norm growth. We do this in two ways, which leads to two different protocols (with different tradeoff).
- By selecting the challenge $\alpha$ to be a (signed) monomial, we can ensure that the norm (here and in extraction) remains polynomial throught the $\log d$ rounds of the protocol. This achieves a protocol with polylogarithmic communication and verifier complexity. However, since the challenge set is of size $\mathrm{poly}(\lambda)$, we obtain a non-negligible soundness error, which needs to be mitigated by parallel repetition, making the protocol unsuitable to be made non-interactive via Fiat-Shamir.
- Instead of folding the polynomial halfway, we can aim to fold it in $k$-parts, and sample from an exponentially sized set. The norm growth is then much higher, only making it affordable to run the protocol $\log \log d$ iterations. Choosing $k$ appropriately, we are able to obtain a protocol with negligible knowledge soundness error and verifier and communication complexity "quasi-polylogarithmic" $d^{1/\log \log d}$[^1].

---
## Instantiations
We then looked at how the scheme could perform concretely. The repetition needed to achieve 128 bits of security in the monomial protocol yields very large proof sizes, in the order of hundred of MBs. The other protocol strikes much closer to concrete efficiency, achieving proof sizes around 6 MBs.
We also looked at applying the two protocols in Marlin, making also use of some natural ways to aggregate our protocols. With this, we obtain a post-quantum zkSNARK for R1CS with proof size roughly 26 MBs. While this is still rather large, we are confident that further work will follow the asymptotic improvement to yield concretely efficient zkSNARKs from lattices.

---
## Drawbacks
We inherit many of the drawbacks of [WW23][^WeeWu], namely:
- The size of the proving key is quadratic in $d$.
- We could not reduce powerBASIS (or original BASIS) to standard assumptions.
- We require a trusted setup.

Furthermore, we our evaluations proof come with their own drawbacks:
- The concrete proof sizes are rather large.
- We could not achieve a fully polylogarithmic protocol with negligible soundness error.

We are confident that these drawbacks can be overcome in future work ([wink 😉]({{< ref "/papers/slap" >}})).

---
## Conclusion

Find the [full version](https://eprint.iacr.org/2023/846) for the gory details!

---
##### Citation

G. Fenzi, H. Moghaddas, N. K. Nguyen. "_Lattice-Based Polynomial Commitments: Towards Concrete and Asymptotical Efficiency_". Cryptology ePrint Archive, Paper 2023/846. Available at: https://ia.cr/2023/846.

```BibTeX
@misc{FenziMN23,
	author       = {Giacomo Fenzi and Hossein Moghaddas and Ngoc Khanh Nguyen},
	title        = {Lattice-Based Polynomial Commitments: Towards Asymptotic and Concrete Efficiency},
	howpublished = {Cryptology ePrint Archive, Paper 2023/846},
	year         = {2023},
	note         = {\url{https://eprint.iacr.org/2023/846}},
	url          = {https://eprint.iacr.org/2023/846}
}
```

---

##### Related material



[^WeeWu]: H. Wee and D. J. Wu. "Succinct Vector, Polynomial, and Functional Commitments from Lattices". In: EUROCRYPT (3). Vol. 14006. Lecture Notes in Computer Science. Full version: https://eprint.iacr.org/2022/1515. Springer, 2023, pp. 385–416.
[^Marlin]: A. Chiesa, Y. Hu, M. Maller, P. Mishra, N. Vesely, and N. Ward. "Marlin: Preprocessing zkSNARKs with Universal and Updatable SRS". In: Proceedings of the 39th Annual International Conference on the Theory and Applications of Cryptographic Techniques. EUROCRYPT ’20. 2020, pp. 738–768.
[^MP12]: D. Micciancio and C. Peikert. "Trapdoors for Lattices: Simpler, Tighter, Faster, Smaller". In: EUROCRYPT. 2012, pp. 700–718.
[^1]: We called this quasi-polylogarithmic because it roughly sits between sublinear ($d^{1/t}$ for $t$ a constant) and polylogarithmic $\mathrm{polylog}(d)$.
