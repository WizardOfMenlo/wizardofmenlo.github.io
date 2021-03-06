---
title: "Composite Order Linear Algebra"
date: 2021-06-21T21:40:21+02:00
draft: true
---

# Fun in Composite Land
When talking about numbers, certain classes deservedly steal the spotlight. Of those, none are as ubiquitous and talked about as prime numbers. This is, of course, the case as well when working with cryptographic protocols. 

## Modules

We will start with the abstract definition of a module, and some facts about them. This is by no means meant to be an extensive list, but just collection of things I found to be convenient to know. Let us have $R$ denote a commutative ring with identity. Then $(M, +, \cdot)$ is a $R$-module if 
- $(M, +)$ is an abelian group
- $\cdot : R \times M \to M$ and it satisfies the following conditions, for $x,y \in M$, $r, s \in R$
    - $r \cdot (x + y) = r\cdot x + r \cdot y$
    - $(r + s) \cdot x = r \cdot x + s \cdot x$
    - $(rs)\cdot x = r \cdot (s \cdot x)$
    - $1\cdot x = x$

As usual, we will drop some formalism and denote $r \cdot x$ as simply $r x$ and just say that $M$ is a $R$-module letting the operations be inferred by context. This might look very familiar with the definition of a vector space, and this is not a coincidence, a vector space is simply a module over a field. 

### Modules Homomorphisms
As always, a $R$-module homomorphism is a map between $R$-modules that respects the structure. In particular, let $M, N$ be $R$-modules. Then $\phi: M \to N$ is a $R$-module homomorphism if $\phi(x + y) = \phi(x) + \phi(y)$ and $\phi(rx) = r \phi(x)$

As usual, an homomorphism is an isomorphism if it is injective and surjective, and if so we write $M \cong N$. We define kernels and images as usual.

There are isomorphisms theorem for modules, that pretty much are the same as those in graphs. In particular, the First Isomorphism Theorem states states that:
$$ M/ \ker{\phi} \cong \phi(M) $$

You might have spotted that module homomorphisms are in fact linear transformations, and you might have asked if we can represents them as matrices as well. In general, this is either not possible or not as nice as in the vector space case. However, for one particular class of modules we actually can get an equivalent representation!

### Free modules

We focus on a particular form of modules, namely those that are _free_. Informally, these are modules that are sufficiently nice and that have a basis. 

Let $M$ be a $R$-module. $M$ is free on $A \subset F$ iff for every $m \in M$ there exist _unique_ coefficients $r_1, \dots r_n \in R$ and _unique_ $a_1, \dots, a_n \in A$ such that

$$m = r_1 a_1 + \dots + r_n a_n $$

Then, $A$ is a _basis_ for $M$ and we define the _rank_ of $M$ to be $|A|$. Note that vector spaces are automatically free and that the rank coincides with the the dimension. We will consider in particular modules of finite rank. 

It will not be too surprising that if $M$ is a free $R$-module of rank $n$ then $M \cong R^n$. To see
this, take a basis $a_1, \dots, a_n \in M$, and consider the mapping $m = \sum_{i=1}^n r_i a_i \mapsto (r_1, \dots r_n)$. We can show that this is a $R$-module homomorphism, that it has trivial kernel and that its image is $R^n$, so it follows by the first isomorphism theorem.

As hinted before, we can also write module homomorphism such as $\phi: R^n \to R^m$ in matrices form. 
Letting $e_1, \dots, e_n$ be a basis for the source and $f_1, \dots, f_m$ be one for the target, $\phi$ is uniquely determined by its values at the basis, say that $\phi(e_j) = \sum_{i=1}^m \phi_{i, j} f_i$. Then the matrix $[\phi_{i, j}] \in R^{m \times n}$ will be our representation. 

Our main object of investigation will be the $\mathbb{Z}_q$-module $\mathbb{Z}_q^n$, where $q$ will be either prime or composite. 

## The Promised Land
Before seeing what can go wrong, let us recall some of the nice things that vector spaces give us for free. Let us take a field $\mathbb{F}$ and a linear transformation $T: \mathbb{F}^n \to \mathbb{F}^m$.
Then the Rank-Nullity theorem holds, that is:
$$ n = \dim \ker T + \dim \mathrm{im} F $$

This automatically implies that $T$ being an isomorphism is equivalent to it being surjective or injective. In particular, if $M \in \mathbb{F}^{n \times n}$ we see that the following are equivalent:
- $M$ is invertible
- $M$'s columns are linearly independent
- $M$ spans $\mathbb{F}^n$

## Dreams Shattered
It would be very nice for this to hold generally for our free modules. Tough luck.


## Some Solace