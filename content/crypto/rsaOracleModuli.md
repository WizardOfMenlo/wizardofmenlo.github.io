---
title: "Attacking RSA by Changing Moduli"
date: 2021-05-18T23:52:06+02:00
draft: true
---


## The Setup
This problem takes place in the context of a PGP protocol execution. 
Recall that PGP is a protocol that uses both symmetric and public key encryption in order to secure online communications, mainly within the context of emails. A full description of this problem is most likely out of scope, but for our purposes we only need to know that we will have an RSA keypair to be stored in the form of a Secret Key Packet (SKP). This SKP is partially protected with a symmetric encryption scheme, which guarantees both integrity and confidentiality of the data which it covers. In particular, the RSA private keys (namely $d, p, q$) are protected, while the public parameters $N, e$ are in the clear. 

We take the role of an attacker that has full access to this packet, but that has no knowledge of the symmetric encryption key, and as such can only access and modify the public parameters.  We also suppose that the attacker is able to obtain signatures of some messages, where these signatures are obtained by reading the SKP. Those signatures will be done, for simplicity, with textbook RSA[^1]. In particular, for a message $m$ the signature will be $m^d \mod N$. Those messages will be selected uniformly at random[^2] from $\mathbb{Z}^\times _N$

Our goal, as an attacker, is to recover the private keys by any means necessary.

## Modeling

First of all, we will model the problem in the most straightforward possible way. Since $d,p,q$ are protected, we will assume that we have no power over them, and as such assume they are fixed and unknown. We will assume that we can read the public parameters $N, e$. Furthermore, we will model the signing process as an oracle. We note that we can also modify both $N, e$ freely, since they are not integrity protected. 

We reflect this by letting the oracle take an input $N'$ denoting the moduli that it will use to compute the signature. We do not allow for $e$ to be varied for the simple reason that doing so does not have any bearing on the signature operation. The oracle returns $(m, m^d \mod N') \leftarrow O(N')$ where $m$ is drawn uniformly at random.

### Helpful Maths
As always, some mathematics helps in tackling the problem. I hope that most of what is shown here will already be known to the reader, and I will try to link references where possible. 

We start by recalling some basic number theory. Any natural number $n$ specifies a ring $\mathbb{Z}_n$ where operations are done modulo $n$. In particular, $\mathbb{Z}_n$ has an associated group of units, denoted by $\mathbb{Z}^\times_n$ which is the group of elements that have a multiplicative inverses modulo $n$. In particular, it is easy to show that $x \in \mathbb{Z}^\times _n \iff \gcd(x, n) = 1$. This shows that $|\mathbb{Z}^\times _n| = \phi(n)$ where $\phi(n)$ is Euler's totient function. 
Euler's totient function is fundamental in a lot of number theory, and we will use one particular property extensively:

$$ \phi(p_1^{a_1} \dots p_k^{a_k} ) = p_1^{a_1 - 1} (p_1 - 1) \dots p_k^{a_1 - 1} (p_k - 1) $$

For $p_1, \dots, p_k$ distinct primes. We can easily verify then that $\phi(p) = p - 1$ and $\phi(pq) = (p-1)(q-1)$

Next, we introduce the discrete logarithm problem. We will just introduce it with respect to $\mathbb{Z}_n$ but a very similar definition can be made for any group. Let $g$ be a generator for $\mathbb{Z}^\times_n$, computing the discrete logarithm of $y$ in $g$ amounts to finding an $x$ such that $g^x = y \mod n$. 
Most importantly for us, solving this problem[3^] is _tremendously_ difficult. 

Finally, we introduce one of the most important tools in our belt: the [Chinese Remainder Theorem](https://dave4math.com/chinese-remainder-theorem/). This theorem essentially says that, given a list of pairwise coprime moduli $n_1, \dots n_k$ and a system of congruences

$$ x \equiv a_1 \pmod{n_1} $$

we can compute a $x$ satisfying all of them, and furthermore this $x$ is unique $\mod n_1 \dots n_k$. From a more abstract perspective, the CRT defines one direction of the ring isomorphism $\mathbb{Z}_{n_1 \dots n_k} \xrightarrow{\sim} \mathbb{Z}_n \times \dots \times \mathbb{Z}_n$. The other direction is given by the natural $n \mapsto (n \mod n_1, \dots, n \mod n_k)$.


## Attack 1
The first attack is very simple, and it works most of the time with no issue. If you manage to find a practical setting similar to this one, this is the attack that you should use. We first start with some mathematics that will help us.


## Attack 2

## Acknowledgements 
I wanted to thank here in particular Kien Tuong Truong and Giacomo Fabris, for their help and willingness to hear me ramble about moduli

[^1]: In fact, the original setting of the challenge used PKCS #1 v1.5 RSA, but this does not change the attack considerably. 
[^2]: Originally, the message would be the PKCS #1 v1.5 RSA padding of a single fixed message, but this would give problems with some of our attacks.
[^3]: When suitable parameters are chosen!
