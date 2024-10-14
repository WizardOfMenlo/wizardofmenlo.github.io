---
title: "LDPC codes vs RS codes"
tags: ["hashes", "concrete", "theory"]
date: 2024-02-21
author: "Giacomo Fenzi"
description: "Some thoughts on LDPC codes vs RS codes"
editPost:
    URL: "https://eprint.iacr.org/2024/1586"
    Text: "ePrint: 2024/1586"
---

Just some spare thoughts on LDPC codes and RS codes (for IOPP based SNARKs), as an answer to [Dev's questions](https://x.com/valardragon/status/1845620037165425059).

**TLDR; LDPC are an amazing avenue of research, that I hope to explore more, but I am bit skeptical on the current maturity of prover and verifier performance that they bring to the table.**

I think it makes sense to consider the question on two parts: prover time and verifier complexity. This might be a bit simplistic, and I am hoping to learn more about these codes (soon).

----

## Prover time

On the prover side, I like breaking down the complexity into two buckets: (i) **arithmetic complexity** and; (ii) **hashing complexity**. The first is time devoted to FFTs, encodings, anything that involves fops, while the latter is mostly dominated by the hashing to commit to oracles.
Linear time encodable codes based SNARKs, such as Brakedown and Blaze, mainly improve on (i). Depending on how fast your hash is, I have seen this hashing cost to be the main chunk of the prover's work (accounting for anything between 40%-60% in e.g. WHIR's prover and the Polygon zkEVM). It is a very parallelizable chunk of work, but a large one at that.
Typically, the size of (ii) is linear in the oracles being committed to i.e. $O(n/\rho)$ (where $n$ is the instance size and $\rho$ the rate of the code).

LDPC codes improve (i), while either leaving (ii) unchanged or slightly worsening it (because the code have bad distance, typically a smaller rate is required, more on this on the verifier side).

Now, how much can the improvement on (i) be? Asymptotically, moving from $O(n \log n)$ to $O(n)$ can be a factor of 30x, which is very notable. However, the LDPC codes encoding is now competing against heavily optimized FFTs. Further, these FFTs are very parallel and running (typically) over small fields. And they are **fast**. While I think that the RAA codes encoding, when properly optimized, will leave FFTs behind, I can't confidently say how much quicker we can feasibly get them. My gut feeling is that moving a RS based implementation to a small field is a much larger improvement gain (at a smaller engineering effort) than moving to a LDPC code.

Just to give some datapoints on this, I was comparing the Blaze and Brakedown numbers with some of our measurements in WHIR. Take this comparison with a bunch of grains of salts: (i) the fields are different; (ii) the machines are different; (iii) we optimized our implementation a fair bit; and (iv) different number of cores (also unclear where the memory bandwidth bottleneck occur, so cannot just divide). 
WHIR on 2^28 variables (on 32 threads) produces a proof in 42s. Blaze (on 192 cores) takes 21s, and Brakedown (on 64 threads) takes similar time. 
So, the 28x theoretical speed-up only results in around a 2x concrete speed-up, at the moment. I am excited to see this reducing further, as I am sure it will, but that's why I'm a bit lukewarm on it now.

## Verifier complexity
Regarding verifier complexity, the term to really consider is (in the soundness error) $(1 - \delta)^t \leq 2^{-\lambda}$, where $\delta$ is the distance the system operates on and $t$ the number of queries to the initial oracle.
WHIR and STIR basically show that this $t$ is the bottleneck on the verifier side, as with domain shifting the latter rounds are basically "free". Note that $t$ is the bottleneck for both **native verification** and **recursive verification**.
LDPC codes suffer from two factors: (i) not amazing initial distance to start with (ii) weak generic proximity gaps results (up to $\delta_\mathsf{C}/3$). This effectively limits how large of a distance $\delta$ the prover can run at, making the verifier perform around 1000 queries[^1] (to this initial oracle).
In comparison, for Reed-Solomon codes one can set $\delta = 1 - \sqrt{\rho}$ or even $1- \rho$ (depending on your religious belief) which can lead to as few as 50 or 25 queries to the initial oracle.

Since the verifier needs to verify $t$ authentication paths (roughly $t \cdot \log n$) hashes, and this typically is its bottleneck (70% of the verifier runtime in WHIR), I don't really expect that currently LDPC codes can give super competitive verifiers.

Improving the distance of the LDPC code and getting stronger proximity gaps results would of course completely change this section, but if I said I understood what is going on in both these areas I would lie.

[^1]: This is for RAA codes in the Blaze paper, Brakedown is around 3000.
