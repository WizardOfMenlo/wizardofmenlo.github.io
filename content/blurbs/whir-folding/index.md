---
title: "Speeding up fold computation"
tags: ["hashes", "concrete"]
date: 2024-10-03
author: "Giacomo Fenzi"
description: "Computing folds is a large portion of the verifier work in schemes like FRI, STIR and WHIR. We describe an optimization to reduce this cost."
editPost:
    URL: "https://eprint.iacr.org/2024/1586"
    Text: "ePrint: 2024/1586"
---

Our recent work, WHIR 🌪️ (See [2024/1586](https://ia.cr/2024/1586) and [blog-post.]({{< ref "/papers/whir" >}})) is an IOPP for constrained RS codes with exceptionally fast verification.
In this blog we explain in detail one of the optimization that we used to achieve a faster verifier, with applications to schemes such as FRI and STIR as well.
Verifier complexity usually consists of two components: (i) an algebraic component and; (ii) computing hashes.
Reducing the second load (ii) usually involves reducing the IOPP query complexity, which is the main objective of STIR and WHIR.
The technique we describe next aims to reduce the other component of verifier cost.

## Folding
One of the main components of FRI, STIR, and WHIR is the _folding_ operation.
For $L \subseteq \mathbb{F}$[^1], define $L^{2^k} = \\{ z^{2^k} : z \in L \\}$ and, for $z \in L^{2^k}$, let $\mathcal{B}_z = \\{y \in L : y^{2^k} = z \\}$. We define $\mathsf{Interpol}$ to be the function that interpolates a polynomial given a list of evaluations, i.e. $\hat{p} := \mathsf{Interpol}(\\{1, ..., n\\}, (y_1, \dots, y_n))$ is the minimal univariate polynomial such that, for $i \in [n]$, $\hat{p}(i) = y_i$.

Given a function $f: L \to \mathbb{F}$, the *$k$-wise folding* of $f$ at $\alpha \in \mathbb{F}$ is defined as the function $\mathsf{Fold}(f, \alpha): L^{2^k} \to \mathbb{F}$ that maps
$$ z^{2^k} \mapsto \mathsf{Interpol}(\mathcal{B}_z, f(\mathcal{B}_z))(\alpha) $$

We also define the *$k$-multilinear folding* to be the function $\mathsf{Fold}^{(k)}(f, (\alpha_1, \dots, \alpha_k)): L^{2^k} \to \mathbb{F}$ obtained by applying the $2$-wise folding $k$ times.

Typically:
- FRI uses $1$-wise folding, possibly $k$-wise folding.
- STIR uses $k$-wise folding, with $k > 1$.
- WHIR uses $k$-multilinear folding, with $k > 1$.

In each of these schemes, the prover will commit to a function $f: L \to \mathbb{F}$ by sending a function $\tilde{f}: L^{2^k} \to \mathbb{F}^{2^k}$ such that $\tilde{f}(z^{2^k}) = f(\mathcal{B}_z)$. The verifier will sample (a single or many) challenges $\alpha$, and the verifier will require to compute the folding with respect to $\alpha$ at some randomly sampled element of $L^{2^k}$.

## Optimizing folding
The verifier can use the definition of folding to evaluate it. Naively, this is a quadratic cost, but in fact since $\mathcal{B}_z$ is a smooth coset of $L$, the verifier can use an FFT to evaluate it in time $O(k \cdot 2^k)$. In fact, since the verifier needs only to evaluate the polynomial at a single point, this can in fact be done in linear time via some version of barycentric evaluation for such subsets. (See E.2 in [SNARKs for C](https://eprint.iacr.org/2013/507.pdf) for example). Nonetheless, some benchmarks I ran[^2] seems to suggest that the quasi-linear FFT method is in fact cheaper despite the faster asymptotics.

We suggest the following optimization. Instead of committing to $f: L \to \mathbb{F}$ as beforehand:
- In the univariate folding case the prover will commit to a related function $\tilde{f}: L^{2^k} \to \mathbb{F}^{<2^k}[X]$ where $\tilde{g}(z^{2^k}) = \mathsf{Interpol}(\mathcal{B}_z, f(\mathcal{B_z}))$.
- In the multilinear folding case the prover will commit to a related function $\tilde{f}: L^{2^k} \to \mathbb{F}^{< 2}[X_1, \dots, X_k]$ where $\tilde{g}(z^{2^k}) = \mathsf{Interpol}(\mathcal{B}_z, f(\mathcal{B_z}))$ (interpreted as a $k$-variate multilinear polynomial).

Now, when computing the fold, the verifier can simply read the corresponding polynomial and evaluate it at the point $\alpha$, which takes linear time $O(2^k)$ (and is concretely efficient).
Soundness holds since the prover is sending the same exactly information (as the two representations can be recovered from one-another).

Experimentally, this gives around a 20% saving in the WHIR verification.

[^1]: which here we assume to be have a smooth order and a cyclic subgroup of $\mathbb{F}^*$ (or coset of one).
[^2]: and should be taken with a grain of salt since I did not do a super scientific job with those.

