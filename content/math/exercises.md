---
title: "Exercises"
date: 2021-07-30T01:01:55+02:00
draft: false
---

# Exercises
Hi! This is just a collection of write-ups of exercises that I found around and, for one reason or another, found quite cool. Spoiler warning, I guess?

# Algebra: Chapter 0
## Group Theory
### 3.1+3.2
Let us be in a category with products. Let $\varphi: G \to H$ be a morphism. We show that there is a unique morphism denoted as $\varphi \times \varphi: G \times G \to H \times H$ compatible with the natural projections. Then, consider $\psi: H \to K$. Show that:
$$ (\psi \varphi) \times (\psi \varphi)  = (\psi \times \psi)(\varphi \times \varphi) $$

The proof is by abstract nonsense, which unfortunately my Latex Renderer does not support at the moment.
### 3.4
Suppose that we have two groups $G, H$, such that $G \cong G \times H$ . Can we conclude that $H$ must 
be trivial?

While the finite case seems to suggest this (since $|G| = |G||H|$ implies that $|H| = 1$) we can look at the infinite case for a simple counterexample. We consider $\mathbb{Z}[x]$ as the ring of polynomials with coefficients in $\mathbb{Z}$ that we consider as an additive ring.
Consider the mapping:
$$ \mathbb{Z}[x] \times \mathbb{Z} \rightarrow \mathbb{Z}[x] $$
$$ (p(x), c) \mapsto x p(x) + c$$
First note that it is injective as if $x p(x) + c = x q(x) + d$ then it must be that $x (p(x) - q(x)) + c - d = 0$ and as such $p(x) = q(x)$ and $c = d$. It is also surjective, since given any polynomial we can write in the form $x p(x) + c$. Finally, it is a group homomorphism since:
$$ (p(x) + q(x), c + d) \mapsto x(p(x) + q(x)) + c + d = xp(x) + c + xq(x) + d $$
Therefore we have $\mathbb{Z}[x] \times \mathbb{Z} \cong \mathbb{Z}[x]$ but clearly $\mathbb{Z}$ is non-trivial.

### 3.5
Show that $\mathbb{Q}$ is not the direct product of two non trivial groups.

This is an awesome question, and it can be answered in a really categorical manner. For completeness we
will be proving all of the steps so this will probably include some stuff from previous exercises.

We proceed by contradiction, assume that $\mathbb{Q} \cong G \times H$ for $G, H$ non trivial.
We let $\phi: \mathbb{Q} \xrightarrow{\sim} G\times H$ be the isomorphism. 

First, we notice that $G, H$ must be abelian. WLOG, suppose that $G$ were not, then there would be $f, g \in G$ s.t. $f + g \neq g + f$ . Then clearly $(f, 0) + (g, 0) \neq (g, 0) + (f, 0)$. Then, we can find $q_1 = \phi^{-1}(f, 0)$, $q_2 = \phi^{-1}(g, 0)$ in $\mathbb{Q}$ and since $\phi$ is a bijections then 
$q_1 + q_2 \neq q_2 + q_1$ which contradicts $\mathbb{Q}$ being abelian. In fact this argument works for any abelian group and is non specific to $\mathbb{Q}$

Next, we show that in the category of abelian groups, products and coproducts agree. Letting $G \times H$
be the direct product, we let $i_G: G \to H$ be defined by mapping $g \mapsto (g, 0)$ and similarly for $i_H$. Clearly these maps are group homomorphisms. We now show that $(G \times H, i_G, i_H)$ is universal for the property of the coproduct. Let $(X, p_G: G \to X, p_H: H \to X)$ be another candidate.
We then define a map $p_G \oplus p_H : G \times H \to X$ by mapping $(g, h) \mapsto p_G(g) + p_H(h)$.
It is clear that $p_G = (p_G \oplus p_H) i_G$ and $p_H = (p_G \oplus p_H) i_H$ since $p_G, p_H$ must map 0 to 0 since they are group homomorphisms. It is also clear that $p_G \oplus p_H$ is unique with this property, since any other map $f: G \times H \to X$ must also satisfy $p_G = f i_G, p_H = f i_H$ and so $f(g, 0) = p_G(g), f(0, h) = p_H(h)$ which then, implies by the homomorphism property that $f(g, h) = p_G(g) + p_H(h)$. 
So the only thing left to show is that $p_G \oplus p_H$ is an abelian group homomorphism.

$$ (p_G \oplus p_H)(g + g', h + h') = p_G(g + g') + p_H(h + h') = p_G(g) + p_H(h) + p_G(g') + p_H(h')$$
$$ = (p_G \oplus p_H)(g, h) + (p_G \oplus p_H)(g', h') $$

Where we crucially use here the property that we are working with abelian groups to reorder the sum.

$\mathbb{Q}$ has a very interesting property, namely that any two non trivial subgroups have a non trivial intersection. $A, B \leq \mathbb{Q}$. Let $\frac{m}{n} \in A$ be non-zero. Then $n \times \frac{m}{n} = m \in A$ and as such we have that $m\mathbb{Z} \subseteq A$. Similary we can find a $m'$ such that $m'\mathbb{Z} \subseteq B$. But then clearly $\mathrm{lcm}(m, m')\mathbb{Z} \subseteq A \cap B$ and as such the intersection is non trivial.

Next, note that the injections that we defined are actually injective functions, and as such monomorphisms in the category. (The direction injective $\implies$ mono follows from Set, while the other can be seen considering morphisms from $\mathbb{Z}$ ). As such, the injection $i_G, i_H$ can be composed with the isomorphism $\phi$ which results in an injection of $G, H$ into $\mathbb{Q}$. Denoting by $\widetilde{G}, \widetilde{H}$ the images of $G, H$ under such injections, we see that  $\widetilde{G}, \widetilde{H}$ will be non trivial subgroups of $\mathbb{Q}$ and as such must have a non trivial intersection. However, $i_G(G) \cap i_H(H)$ is trivial in $G \times H$, and as such must be carried to the trivial subgroup in $\mathbb{Q}$, which is a contradiction.

