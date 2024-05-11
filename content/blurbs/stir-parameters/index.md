---
title: "STIR: Setting Parameters"
tags: ["hashes", "concrete", "theory"]
date: 2024-02-21
author: "Giacomo Fenzi"
description: "STIR has a few more parameters to tweak compared to FRI. Here we mention a few and how they impact the concrete performance of the scheme."
editPost:
    URL: "https://eprint.iacr.org/2024/390"
    Text: "ePrint: 2024/390"
---

Our recent work, STIR 🥣 (See [2024/390](https://ia.cr/2024/390) and [blog-post.]({{< ref "/papers/stir" >}})) is an IOPP for RS codes with improved query complexity compared to the state-of-the art, FRI.
Compared to FRI, STIR has a few more parameters that one can tweak, which can have a rather large impact on prover time, verifier time and argument size. This short blurb details what these parameters are, and how they translate, concretely, in the resulting argument. 
I won't be completely formal here, details worked out are in Subsection 5.3, Section 6 and Appendix C of the STIR paper.

## Parameters
In this note, we focus on a single iteration of STIR. 
We assume that the following parameters are given:
- A security parameter$\lambda \in \mathbb{N}$.
- The Reed-Solomon code being tested, this includes:
    - A field $\mathbb{F}$[^1].
    - A smooth evaluation domain $\mathcal{L} \subseteq \mathbb{F}$.
    - A degree bound $d \in \mathbb{N}$.
    - An initial rate $\rho := \frac{d}{|\mathcal{L}|}$.

We assume that the proximity bound to be tested from here on is $\delta := 1 - \rho$ (i.e. we are assuming the conjecture and ignoring $\eta$.)
If instead $\delta$ is in unique decoding range, the protocol can be made simpler by removing the OOD samples. We do not discuss this here.

A parametrization for a STIR iteration consists of the following:
- An evaluation domain $\mathcal{L}^\star \subseteq \mathbb{F}$.
- A folding parameter $k$.
- The number of OOD-samples $s$.
- The number of queries $t$.
- The PoW bits $\lambda_b$.

We note that the parameters of each STIR iteration can be chosen independently. 

## Setting parameters
This is not the place to precisely tell people how to set the parameters for soundness to hold, that's what the paper is for. 
Here I just want to give some intuition on how one would go about doing this.
First, I suppose that you would pick evaluation domain $\mathcal{L}^\star$ and folding parameter $k$. Letting $c := \frac{|\mathcal{L}|}{|\mathcal{L}^\star|}$, note that the rate of the new code being tested is $\rho^\star := (c/k) \cdot \rho$. The key observation of STIR is that a lower rate makes testing easier, so the smaller the value $c/k$ is the fewer queries we require in latter iterations. In the paper, we set $c = 2$ to keep a linear proof length, but this is by no means necessary. You can even pick $c < 1$. 
The tradeoff in chosing $\mathcal{L}^\star$ is that:
- Large $\mathcal{L}^\star$ drives the rate down and thus the number of queries in the _next_ iteration quicker.
- However, the prover is then less efficient (as an FFT over $\mathcal{L}^\star$ must be performed).

Regarding the folding parameter $k$:
- A larger folding parameter $k$ reduces _both_ the degree of the polynomial quicker and decreases the rate of the next iteration, also driving down the number of queris.
- On the other end, the verifier now needs to (at least) compute larger folds, each of which has cost at least linear in $k$, and also needs to read more field elements. 

Once those two parameters are set, the OOD-samples should be set so that they reach $\lambda$ bits of security. In general, for most sane configurations $s = 1$ or $s = 2$ should suffice.

Finally, $t$ and $\lambda_b$ should be set so that $(1 - \delta)^t < 2^{\lambda - \lambda_b}$. Here there are also some tradeoffs:
- A larger value of $\lambda_b$ drives down verifier time and argument size, at the cost of increased prover time.
- Further, larger $t$ not only increases the argument size but also the verifier running time, as it requires to compute more folds (and the virtual functions become more expensive to compute).


## Prover time
Prover time in a STIR iteration is easy to estimate.
We assume that the prover has access to the message $\hat{f} \in \mathbb{F}[X]$ of degree $d$ for the codeword $f: \mathcal{L} \to \mathbb{F}$ being tested.
The STIR prover does the following:
1. Derives $\alpha \in \mathbb{F}$ by FS.
2. Computes $\hat{g} := \mathsf{PolyFold}(\hat{f}, \alpha, k) \in \mathbb{F}[X]$ of degree $d/k$.
3. Evaluates $\hat{g}$ on $\mathcal{L}^\star $ via a FFT to compute a vector of evaluations $g: \mathcal{L}^\star \to \mathbb{F}$.
4. Commits to $g$ using a Merkle tree.
5. Derives $x_1, \dots, x_s \in \mathbb{F}$ by FS.
6. Evaluates $g$ at $x_1, \dots, x_s$ using Horner's rule.
7. Derives $v_1, \dots, v_t \in \mathcal{L}^k$ by FS.
8. Computes a new function $\hat{f}^\star \in \mathbb{F}[X]$ of degree $d/k$ by quotienting $\hat{g}$ at $s + t$ points, and degree correcting.

All summed up, the prover does:
1. Squeeze $1 + s + t$ elements out of the FS sponge.
2. Computes $2 \cdot |\mathcal{L}^\star|$ hashes for the Merkle commitment.
3. Computes an FFT of size $|\mathcal{L}^\star|$ for polynomial of size $d/k$, resulting in $O(|\mathcal{L}^\star| \cdot \log d/k)$ fops.
4. Does an additional $O(d)$ fops to compute the folds and $O(d/k)$ fops to compute the quotient and the degree correction.

So the prover costs are:
$$ 
(1 + s + t) \cdot \mathsf{FS} + 2 \cdot |\mathcal{L}^\star| \cdot \mathsf{H} + \mathsf{FFT}(\mathcal{L}^\star , d/k) + O(d + d/k) \cdot \mathbb{F}
$$

## Argument size
Argument size is also easy to estimate, it consists of:
1. A single Merkle root (for $g: \mathcal{L}^\star \to \mathbb{F}$).
2. $s$ elements of $\mathbb{F}$ (for OOD-samples).
3. $t$ authentication paths, for a Merkle tree of $|\mathcal{L}|/k$ leaves, where each leaf is in $\mathbb{F}^k$.

Assuming that the digest size of the Merkle hash is $2\lambda$ bits, and not accounting for path pruning (which in practice has a large impact), the argument size in bits is then:
$$
(1 + t \cdot \log(|\mathcal{L}|/k)) \cdot 2\lambda + (s + t \cdot k) \cdot \log |\mathbb{F}| \enspace.
$$


## Verifier time
The verifier performs the following operations:
1. Derives $\alpha \in \mathbb{F}$ by FS.
2. Derives $x_1, \dots, x_s \in \mathbb{F}$ by FS.
3. Derives $v_1, \dots, v_t \in \mathcal{L}^k$ by FS.
4. Queries $f$ at $t$ locations:
    - Each query involves reading $k$ fields element and verify a Merkle authentication path of a Merkle tree with $|L|/k$ leaves.
    - Derive the value of $f$ at those $t \cdot k$ locations.
        - In the first iteration, this requires no additional field operations.
        - In latter rounds, the function $f$ is defined as 
        $$ 
            f(x) = \mathsf{DegCorr}\left(\frac{g'(x) - \mathsf{Ans}(x)}{V(x)}\right)
        $$ where $g'$ is the oracle sent in the previous round, $\mathsf{Ans}, V$ are polynomials of degree $< t' + s'$ (where $t', s'$ are the queries and OOD repetition of the last iterations). 
        - The degree correction is a (small) constant number of field operations.
        - The two polynomials can be computed by interpolation (or with prover assistance, more on this soon™️) at the beginning of the iteration and so the cost is ammortised across each queries.
        - Thus, each of these queries only requires evaluating these polynomials at a random point, which costs $O(t' + s')$ fops.
    - Once the value of $f$ is computed, the verifier computes the Fold which costs $O(k)$ fops (or $O(k \cdot \log k)$ fops if using an IFFT for this interpolation, the latter seems asymptotically worse but concretely more efficient in my experiments).

So, in the first iteration the verifier cost is:
$$ 
(1 + s + t) \cdot \mathsf{FS} + t \cdot \log(|L|/k) \cdot \mathsf{H} + O(t \cdot k) \cdot \mathbb{F} \enspace.
$$
In the latter iterations instead it is
$$ 
(1 + s + t) \cdot \mathsf{FS} + t \cdot \log(|L|/k) \cdot \mathsf{H} + O\left(t \cdot k \cdot (t' + s' + 1) \right) \cdot \mathbb{F} \enspace.
$$

There are additional tricks that can be done to further drive down the verifier costs. For example, instead of quotienting by $t + s$ points to define the next function to be tested, one can define $t$ functions, each of them consisting of quotients of $1 + s$ points, and test a (degree corrected) random linear combination of them.


[^1]: For simplicity, I am using a single field here. In practice, you probably would want to have $\mathbb{F} \subseteq \mathbb{H}$ where $\mathbb{H}$ is the extension field you sample from. Since handling this is identical to FRI, I simply won't.
