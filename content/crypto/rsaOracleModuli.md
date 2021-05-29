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

Also, this oracle will reject any moduli that is too small, i.e. it will return $\bot$ for any $N'$ where $N' < 2^{270}$.

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
$$ \dots $$
$$ x \equiv a_k \pmod{n_k} $$

we can compute a $x$ satisfying all of them, and furthermore this $x$ is unique $\mod n_1 \dots n_k$. From a more abstract perspective, the CRT defines one direction of the ring isomorphism $\mathbb{Z}_{n_1 \dots n_k} \xrightarrow{\sim}  \mathbb{Z}_n \times \dots \times \mathbb{Z}_n$. The other direction is given by the natural $n \mapsto (n \mod n_1, \dots, n \mod n_k)$.

Finally, we are going to need a very simple result from Euler, namely that, when $m$ is coprime to $n$,  $x \equiv y \mod \phi(n)$ implies that $m^x \equiv m^y \mod n$. It is interesting to note that the reverse direction does not hold. 


## Attack 1
The first attack is very simple, and it works most of the time with no issue. If you manage to find a practical setting similar to this one, this is the attack that you should use. 

The approach is by 'divide-and-conquer'. Since recovering $d$ from $m^d$ in $N$ will be quite difficult, we aim to recover it in some easier instances and then 'lift' the result to a solution of the original problem using the CRT.

The first step is reducing the problem to some discrete logs in smaller groups. We need to pay some attention here, since the oracle has a size restriction and so we cannot naively plug in small moduli. However, there is a way to sidestep the issue. We start by selecting some primes $p_1, \dots, p_k$. Then, we set $N' = p_1 \dots p_k$. It will be helpful to choose our primes to be 'safe', in the sense that $p_i = 2q_i + 1$ where $q_i$ is also prime. This will ensure that the group of units of $\mathbb{Z}_{p_i}$ will have a very simple structure and that every moduli that we will apply the CRT over will be coprime (apart from the common factor of 2). We will ensure that $2q_1 \dots q_k > N$ and that each of the $p_i$ is small enough so that solving the DLP in the corresponding group is feasible.

We query the oracle, and obtain a pair $m, s$ where $s \equiv m^d \pmod{N'}$. Reducing modulo $p_i$ for every $i$, we obtain a number of instances of the discrete log, one for each prime $p_i$. 

We solve the instances individually. How to exactly do so will depend mostly on the size of $p_i$, and it is not the focus of this writeup. We just remark that for small instances even bruteforce will have an accettable running time, while for intermediate ones the use of the Baby-step Giant-step will probably suffice. There are more advanced algorithms available as well, but since we are in control of $|p_i|$ those will not be required.

Now, once those instances are solved, we will have obtained some exponents $d_1, \dots, d_k$ such that $m^{d_i} \equiv m^d \pmod{p_i}$. Now, here is where some issues might arise. By Euler's theorem, we have that $d \equiv d_i \pmod{\phi(p_i)}$ implies that $m^{d_i} \equiv m^d \pmod{p_i}$ but the reverse is not in general true. However, we wish to shown that this holds with high enough probability.

Let us fix a $p = 2q + 1$, for $p,q$ primes. Suppose that $ m^d \equiv m^{e} \pmod{p}$. Since $p$ is prime, we get that $m^{d - e} \equiv 1 \pmod{p}$ and as such by Lagrange Theorem then the order of  $m$ will divide $d - e$ and as such $d \equiv e \pmod{|m|}$. Note that that $|(\mathbb{Z}_p)^\times| = p - 1 = 2q$ and as such by Lagrange Theorem the order of $m$ will divide $2q$. There are exactly four possibilites then: $|m| = 1, |m| = 2, |m| = q, |m| = 2q$. The first case happens only if $m = 1$, which happens with probability $\frac{1}{p - 1}$ (and should be extremely easy to detect...). The second case also happens on only one element, namely when $m = p - 1$. The last case is exactly the setting described by Euler's theorem, and the one we want. Finally the case that $|m| = q$ occurs with probability $\frac{\phi(q)}{p - 1} = \frac{q-1}{2q} = \frac{1}{2} - \frac{1}{2q}$

Now, assuming that in fact $d \equiv d_i \pmod{\phi(p_i)}$ for every $i$, recovering the correct $d$ is just a matter of applying the CRT. Note that since our $p_i$ are safe primes[^3] (and distinct) this will determine $d \bmod{2 q_1 \dots q_k}$, which by construction will be bigger than $N$, so determining $d$.

## Attack 2

## Acknowledgements 
I wanted to thank here in particular Kien Tuong Truong and Giacomo Fabris, for their help and willingness to hear me ramble about moduli

[^1]: In fact, the original setting of the challenge used PKCS #1 v1.5 RSA, but this does not change the attack considerably. 
[^2]: Originally, the message would be the PKCS #1 v1.5 RSA padding of a single fixed message, but this would give problems with some of our attacks.
[^3]: Actually, the $p_i$s being safe is not a strict requirement, we only wish to have that $\phi(p_i)$ have few common factors. This way we will determine $d$ with respect to a large moduli, while using a small number of $p_i$s. 
