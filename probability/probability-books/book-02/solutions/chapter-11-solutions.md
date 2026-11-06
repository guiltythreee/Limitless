# Chapter 11: Markov Chains — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY | CHAPTER 11                                                         DETAILED SOLUTIONS




 CHAPTER 11


 Markov Chains
 Detailed, step-by-step exercise solutions



                26                       Separate chapter volume
                numbered exercises       based on the uploaded chapter PDF



 Scope
 Exercises 1–26 from Section 11.7 of the uploaded Markov Chains chapter. The diagram-based exercises use
 the arrows and probabilities in the source PDF (including the closed classes, reversible networks, and the
 Chutes and Ladders transition matrix).

 Notation and conventions
  • Q is row-stochastic; distributions are written as row vectors, so stationarity means πQ=π.
  • A finite irreducible chain has a unique stationary distribution. For random walks on undirected graphs,
    stationary mass is proportional to vertex degree.
  • The book's Geom(p) convention counts failures before the first success; a geometric number of trials has
    support {1,2,…}.
  • Return-time identities are used only for positive recurrent states, and absorbing-chain calculations use the
    transient submatrix R.

 How to use this volume
 Each solution follows the original exercise numbering. Intermediate reasoning is shown where it clarifies the
 method; final distributions, probabilities, and expectations are stated explicitly. Diagrams from the source
 are translated into transition rules or equations when needed.




Markov Chains                                                                                                 Page 1


INTRODUCTION TO PROBABILITY | CHAPTER 11                                                          DETAILED SOLUTIONS




 SOLUTIONS


 Chapter 11: Markov Chains
 Exercise 1. Even-indexed observations
 Let Z = X . To check the Markov property, condition on the entire even-time history. By the original Markov
      n     2n
 property, the two-step future conditional distribution depends only on the current state:

                                                                   2
   P(Zn+1 = j | Zn = i, Zn-1, …, Z0) = P(X2n+2 = j | X2n = i) = (Q )ij.

 Thus (X , X , X , …) is a Markov chain with transition matrix Q². Intuitively, it is the original chain observed
        0   2   4
 every two steps; the skipped intermediate state is averaged over by matrix multiplication.



 Exercise 2. Stationary start and a Markov function
 (a) Expected number of visits to state 3
 Because X0 has the stationary distribution s, every Xn also has distribution s. Let In = 1{Xn=3}. Then
 E(In)=s3 for each n=0,…,9.

          9                   9
   E[∑        1{X =3}] = ∑        s = 10s .
      n=0        n         n=0    3      3

 (b) Examples for Yn=(Xn−1)(Xn−2)
 For M=3, Y=0 when X is 1 or 2, and Y=2 when X=3. A sufficient condition for Y to be Markov is that states 1
 and 2 have the same total transition probability into each block {1,2} and {3}.

 A Markov example is the matrix with every entry equal to 1/3. Then Xn are i.i.d. uniform on {1,2,3}, so Yn are
 i.i.d. (P(Y=0)=2/3, P(Y=2)=1/3), hence Markov. This Q is irreducible and has positive diagonal entries.

 A non-Markov example is Q below. It is irreducible (1→2→3→1 is possible) and q11=1/2.

  Q = [ [1/2, 1/2, 0],
        [0,   0,   1],
        [1,   0,   0] ]

 If Yn−1=2, then Xn−1=3 and therefore Xn=1, so P(Yn+1=2 | Yn=0, Yn−1=2)=0. But the event Yn−1=0, Yn=0
 can occur through Xn−1=1→Xn=2; on that part of the event the next transition goes to 3 with probability 1.
 Thus P(Yn+1=2 | Yn=0, Yn−1=0)>0. The next-step law depends on the past beyond Yn, so Y is not Markov.



 Exercise 3. A hidden two-state chain and its observations
 (a) The observed sequence is not Markov
 The hidden chain has A→A with probability 1/2, A→B with probability 1/2, and B→A with probability 1. The
 observation Yn is 0 for A→A and 1 for a change of state.

 If Yn−1=0, the hidden state after that transition is A. If also Yn=1, then the transition is A→B, so the hidden
 state after Yn is B and the next observation must be 1: P(Yn+1=0 | Yn=1,Yn−1=0)=0.

 On the other hand, if Yn−2=0, Yn−1=1, and Yn=1, then the hidden path is A→A, A→B, B→A. The hidden state
 after Yn is A, so the next observation is 0 with probability 1/2. The same current observation Yn=1 therefore
 has different next-step probabilities depending on the past.



Markov Chains                                                                                                  Page 2


INTRODUCTION TO PROBABILITY | CHAPTER 11                                                          DETAILED SOLUTIONS




 (b) No finite block of observations is Markov
 Fix any finite m. Consider two positive-probability histories whose last m observations are all 1. In the first,
 put a 0 immediately before that run; this forces the hidden state at the start of the run to be A. In the second,
 put 0,1 immediately before the run; this forces the hidden state at the start of the run to be B. Each 1
 corresponds to a state switch, so after m switches the hidden states in the two cases are opposite.

 Consequently the same current block Zn=(1,…,1) can leave the hidden chain in A or B. From A the next
 observation is 0 with probability 1/2; from B it is 0 with probability 0. The last m observations do not contain
 enough information to determine the next-step law. Since m was arbitrary, no finite-memory block process Z
 is Markov.



 Exercise 4. Kangaroo crossing the lava
 Let E be the expected number of remaining jumps from block 1 and E the expected number from block 2.
      1                                                                2
 From block 1, the next jump succeeds to block 2 with probability 1/2 and otherwise resets to block 1. From
 block 2, success finishes the game; failure resets to block 1.

   E = 1 + ½E + ½E , E = 1 + ½·0 + ½E .
    1              2       1   2                   1

 The second equation gives E2=1+E1/2. Substitution into the first gives E1=6 jumps.

 This is exactly the waiting time for two consecutive Heads in fair coin tosses: a successful jump is a Head,
 and any Tail resets the required sequence. The familiar two-consecutive-success waiting-time mean is 6.



 Exercise 5. Two-state chain with self-loops
 With state order (1,2), each state keeps the chain in place with probability p and switches with probability
 1−p.

   Q = [[p, 1−p],[1−p,p]].

 The rows of Q are identical after averaging the two states, and the chain is symmetric. Solving πQ=π gives
 π=(1/2,1/2). The nontrivial eigenvalue is 2p−1; because 0<p<1, its absolute value is strictly less than 1.

   lim        Qn = [[1/2, 1/2],[1/2, 1/2]].
        n→∞




 Exercise 6. Two closed communicating classes
 (a) Transition matrix
 Reading the arrows in state order (1,2,3,4), the left class is {1,2} and the right class is {3,4}.

   Q = [[1/2, 1/2, 0, 0], [1/4, 3/4, 0, 0], [0, 0, 1/4, 3/4], [0, 0, 3/4, 1/4]].

 (b) Recurrent and transient states
 Both {1,2} and {3,4} are closed finite communicating classes. Every state in a closed finite irreducible class
 is recurrent. Therefore all four states are recurrent and none are transient.

 (c) Two stationary distributions
 For the left class, detailed balance gives π1(1/2)=π2(1/4), so π2=2π1. For the right class, the two transition
 probabilities between 3 and 4 are both 3/4, so its stationary distribution is uniform.

   π(L)=(1/3, 2/3, 0, 0), π(R)=(0, 0, 1/2, 1/2).



Markov Chains                                                                                                 Page 3


INTRODUCTION TO PROBABILITY | CHAPTER 11                                                         DETAILED SOLUTIONS




 Exercise 7. Three independent dragons
 (a) Expected number of home visits
 Drogon starts in stationarity, so P(Xn=0)=s0 for every n. There are 25 observations X0,…,X24.

          24
   E[∑n=0       1{Xn=0}] = 25s0.

 (b) Joint process
 The vector W =(X ,Y ,Z ) is Markov. Conditional on its current vector, the three dragons move
               n    n n n
 independently, and the probability of the next vector factors into the product of the three component
 transition probabilities.

   P(Wn+1=(i′,j′,k′) | Wn=(i,j,k)) = qii′qjj′qkk′.

 (c) Expected time for all three to be home together again
 The product chain has stationary distribution s⊗s⊗s. The stationary probability of the state (0,0,0) is s03. By
 the recurrence-time identity for a positive recurrent finite Markov chain, the expected first return time to that
 state, starting there, is the reciprocal.

   E(T         ) = 1/s 3.
      return          0




 Exercise 8. Randomly transposing two cards
 Each deck ordering has exactly C(52,2) possible swaps, each chosen with the same probability. A swap is its
 own inverse, so the probability of moving from deck g to deck h equals the probability of moving from h to g.
 The transition matrix is symmetric.

 Any permutation can be transformed into any other by a sequence of pairwise swaps, so the chain is
 irreducible. A symmetric transition matrix has the uniform stationary distribution.

   π(g)=1/52! for every deck ordering g.



 Exercise 9. Reflected random walk on −3,…,3
 (a) Absolute values
 Yes. From |X|=0 the next absolute value is 1. From |X|=1 or 2 the next absolute value is one less or one
 more, each with probability 1/2. From |X|=3 it is 2 with probability 1. These rules do not depend on the sign
 of X or on earlier history, so |Xn| is Markov.

 (b) Signs
 No. The sign alone loses the distance from zero. For example, if the observed sign history is 0,+1, then the
 underlying path forces Xn=1, so the next sign is 0 with probability 1/2. If the history is 0,+1,+1, the
 underlying path forces the next hidden value to be 2; from 2 the next sign cannot be 0. Thus the next sign
 law depends on more than the present sign.

 (c) Stationary distribution
 This is a random walk on the seven-vertex path. The endpoint states have degree 1 and the five interior
 states have degree 2. For a simple random walk on an undirected graph, stationary mass is proportional to
 degree. The total degree is 1+5·2+1=12.




Markov Chains                                                                                                Page 4


INTRODUCTION TO PROBABILITY | CHAPTER 11                                                        DETAILED SOLUTIONS




   π(−3)=π(3)=1/12; π(−2)=π(−1)=π(0)=π(1)=π(2)=1/6.

 (d) Make the stationary distribution uniform
 At each endpoint, replace the deterministic inward move by probability 1/2 of moving inward and probability
 1/2 of staying at the endpoint. Then every pair of neighboring states has equal transition probability in both
 directions (1/2), and the endpoint self-loops preserve row sums. The transition matrix becomes doubly
 stochastic, so the uniform distribution is stationary.



 Exercise 10. Metropolis walk on an undirected network
 (a) Transition probabilities
 Let i∼j denote an edge and d the degree of i. The proposal probability is 1/d ; its acceptance probability is
                             i                                                i
 min(di/dj,1). Thus for i≠j:

   q = 1{ i∼j } · (1/d )min(d /d ,1) = 1{i∼j} min(1/d ,1/d ).
    ij                i       i   j                   i    j

 The diagonal entry is qii=1−∑j≠iqij.

 (b) Stationary distribution
 For every adjacent pair, qij=qji by the minimum expression above. Therefore Q is symmetric (including its
 diagonal), and the uniform distribution is stationary.

   π =1/M, i=1,…,M.
    i




 Exercise 11. Random walk on a 7-cycle and on a path
 (a) Cycle
 Every vertex of the 7-cycle has degree 2, so the simple random walk is symmetric. Its stationary distribution
 is uniform.

   π =1/7, i=1,…,7.
    i

 (b) Unfolded path
 On the path 1−2−…−7, the endpoints have degree 1 and the five interior states have degree 2. Total degree
 is 12, so the stationary distribution is proportional to degree.

   π1=π7=1/12; π2=…=π6=1/6.



 Exercise 12. A discretized stock-price chain
 (a) Annual observations
 Yes. Let Yn=X365n. Applying the Markov property over 365 daily transitions gives P(Yn+1=j | Yn=i, earlier Y
 values)=P(X365n+365=j | X365n=i). The annual transition matrix is Q365.

   Qannual = Q365.

 (b) Stationary distribution
 The allowed moves connect i to i±1 and i±2 whenever those states are in {0,…,28}. This is an undirected
 graph, and the transition is uniform over the legal neighbors. Its degrees are 2 at 0 and 28, 3 at 1 and 27,
 and 4 at 2,…,26. The sum of degrees is 2+3+25·4+3+2=110.


Markov Chains                                                                                                Page 5


INTRODUCTION TO PROBABILITY | CHAPTER 11                                                          DETAILED SOLUTIONS




   π0=π28=2/110; π1=π27=3/110; πi=4/110 for 2≤i≤26.



 Exercise 13. Random walk of a king on the chessboard
 For a random walk on an undirected graph, stationary probability is proportional to the number of legal
 moves. A corner square has 3 legal moves, a non-corner edge square has 5, and an interior square has 8.
 There are 4 corners, 24 non-corner edge squares, and 36 interior squares.

   Total degree = 4·3 + 24·5 + 36·8 = 420.

   Per-square stationary mass: corner = 3/420=1/140; edge (not corner)=5/420=1/84;
   interior=8/420=2/105.



 Exercise 14. Chess-piece random walks
 (a) Irreducibility and aperiodicity
  • King: irreducible; aperiodic. The king's move graph is connected and contains triangles (three mutually
    adjacent squares), so the period is 1.
  • Queen: irreducible; aperiodic. The queen can connect the board through rows, columns, and diagonals, and
    three squares on a common row form a 3-cycle; a 2-step return also exists.
  • Rook: irreducible; aperiodic. Any square can reach any other in at most two rook moves. A row contains
    3-cycles, while two-step returns are possible.
  • Bishop: not irreducible on all 64 squares; it has two closed classes, one for each square color. Each color
    class is connected and contains both 2-cycles and 3-cycles, so each class is aperiodic.
  • Knight: irreducible, but not aperiodic. The knight graph is connected, but every move changes square color.
    Returns therefore require an even number of moves, and 2-step returns exist; the period is 2.
 (b) Rook started uniformly
 Every square has exactly 14 legal rook moves, and the transition matrix is symmetric. Hence the uniform
 distribution is stationary. Since the initial distribution is already uniform, it remains uniform after any number
 n of moves.

   P(Rn=square i)=1/64 for every square i and every n≥0.

 (c) Expected king return time to the upper-left corner
 The corner has stationary probability 1/140 from the king's stationary distribution (3/420). By the
 Markov-chain return-time formula, the expected first return time is the reciprocal.

   E(Treturn) = 1/(1/140) = 140 moves.

 (d) Metropolis modification for uniform stationarity
 From i propose a uniformly random legal neighbor j, with proposal probability 1/di, and accept with
 α(i,j)=min(di/dj,1). The resulting off-diagonal transition probability is

   qij = (1/di) min(di/dj,1) = min(1/di,1/dj) = qji.

 Thus the modified transition matrix is symmetric, and the uniform distribution over all 64 squares satisfies
 detailed balance and is stationary.




Markov Chains                                                                                                 Page 6


INTRODUCTION TO PROBABILITY | CHAPTER 11                                                         DETAILED SOLUTIONS




 Exercise 15. Five-state chain: stationary distribution without
 matrices
 The diagram is a line with transitions 1→2 (probability 1), 2→1 and 2→3 (each 1/2), 3→2 (1/4), 3→4 (1/3), 4→3
 (1/6), 4→5 (1/4), and 5→4 (1/8), with self-loops at 3, 4, and 5. Detailed balance along each edge gives the
 relative weights.

   π2=2π1; π3=2π2; π4=2π3; π5=2π4.

 Thus the unnormalized weights are (1,2,4,8,16), whose sum is 31.

   π = (1,2,4,8,16)/31.



 Exercise 16. Exchanging balls between two urns
 (a) Transition probabilities
 If the first urn currently contains i black and N−i white balls, the second contains N−i black and i white balls.
 X increases to i+1 when a white is drawn from the first urn and a black from the second; it decreases to i−1
 for the opposite pair.

   P(i→i+1)=((N−i)/N)²; P(i→i−1)=(i/N)²; P(i→i)=2i(N−i)/N².

 At i=0 or i=N, the impossible transition has probability 0, as the formulas also indicate.

 (b) Detailed balance
 The proposed stationary probabilities are πi=C(N,i)C(N,N−i)/C(2N,N)=C(N,i)²/C(2N,N). For adjacent states,
 use C(N,i)(N−i)=C(N,i+1)(i+1):

   π P(i→i+1) = [C(N,i)(N−i)]²/[C(2N,N)N²] = [C(N,i+1)(i+1)]²/[C(2N,N)N²] = π     P(i+1→i).
    i                                                                          i+1

 Detailed balance holds for every neighboring pair, and the probabilities sum to 1 by Vandermonde's identity.
 Therefore the stated hypergeometric distribution is stationary.



 Exercise 17. One hub and 110 leaf states
 For each leaf state j, detailed balance between 0 and j requires π0p=πjr. Hence every leaf has πj=(p/r)π0.
 Normalizing across 0 and the 110 leaves gives

   π0(1+110p/r)=1, so π0=r/(r+110p), πj=p/(r+110p), j=1,…,110.

 The self-loops do not affect the detailed-balance equations; the balance on each hub-leaf edge is sufficient.



 Exercise 18. Seven-state chain: reversibility and stationarity
 Every non-loop edge in the diagram is paired with a reverse edge. The ratios of stationary weights along the
 edges are obtained from πiqij=πjqji:

   π2/π1=0.4/0.2=2; π3/π1=2; π4/π2=2; π5/π2=2; π6/π3=2; π7/π3=2.

 Taking π1=1 gives weights (1,2,2,4,4,4,4), with total 21. The same ratios satisfy detailed balance on every
 edge; self-loops satisfy it automatically. The chain is reversible.




Markov Chains                                                                                                 Page 7


INTRODUCTION TO PROBABILITY | CHAPTER 11                                                              DETAILED SOLUTIONS




   π = (1,2,2,4,4,4,4)/21.



 Exercise 19. Adaptive choice between two photographs
 (a) Transition matrix
 With state order (A1,B1,A0,B0), success keeps the same photo for the next visitor, while failure switches
 photos. Therefore:

   Q = [[a, 0, 1−a, 0], [0, b, 0, 1−b], [0, b, 0, 1−b], [a, 0, 1−a, 0]].

 (b) Reversibility
 The chain is not reversible. For example, q       =1−a>0, but q       =0. A reversible chain cannot have a
                                             A1,A0               A0,A1
 positive one-way transition without a reverse transition.

 (c) Stationary distribution
 Let the unnormalized weights be w=(a/(1−a), b/(1−b), 1, 1), in the prescribed state order. Multiplying by Q
 shows that the weights are invariant up to the same normalizing factor. The normalizing constant is

   Z = a/(1−a)+b/(1−b)+2 = (2−a−b)/[(1−a)(1−b)].

   π = (a(1−b), b(1−a), (1−a)(1−b), (1−a)(1−b))/(2−a−b).

 (d) Improvement over choosing photos independently
 The stationary probability of success is πA1+πB1=

   p            = [a(1−b)+b(1−a)]/(2−a−b) = (a+b−2ab)/(2−a−b).
    adaptive

 Independent equal-probability photo selection succeeds with probability (a+b)/2. Their difference is

   p        −(a+b)/2 = (a−b)²/[2(2−a−b)] > 0 when a≠b.
    adaptive




 Exercise 20. Random walk on a weighted undirected network
 (a) Stationary distribution
 Let vi=∑jwij. The transition probability is qij=wij/vi. Since wij=wji,

   viqij = wij = wji = vjqji.

 Thus detailed balance holds with stationary mass proportional to vi: πi=vi/∑kvk.

 (b) Representing any reversible chain
 Let s be the stationary distribution of a reversible chain with transition matrix Q. Define wij=siqij. Reversibility
 gives siqij=sjqji, so wij=wji. Also vi=∑jwij=si∑jqij=si. Hence wij/vi=qij, exactly recovering the original transition
 matrix.



 Exercise 21. Independent cat and mouse
 (a) Individual stationary distributions
 For the cat, the transition matrix is [[0.2,0.8],[0.8,0.2]], so its stationary distribution is (1/2,1/2). For the
 mouse, the transition matrix is [[0.7,0.3],[0.6,0.4]]. Detailed balance gives 0.3π1=0.6π2, hence




Markov Chains                                                                                                        Page 8


INTRODUCTION TO PROBABILITY | CHAPTER 11                                                            DETAILED SOLUTIONS




 πmouse=(2/3,1/3).

 (b) Joint process
 The pair process is Markov because the two chains move independently and each component is Markov. Its
 stationary distribution is the product distribution. In state order (1,1),(1,2),(2,1),(2,2), it is

       joint
   π        =(1/3, 1/6, 1/3, 1/6).

 (c) Expected capture times
 Let t12 be the expected time to capture from (cat 1, mouse 2), and t21 from (cat 2, mouse 1). From (1,2), the
 process remains in (1,2) with probability 0.2·0.4=0.08, moves to (2,1) with probability 0.8·0.6=0.48, and is
 captured otherwise. From (2,1), the two non-capture probabilities are 0.8·0.3=0.24 to (1,2) and 0.2·0.7=0.14
 to (2,1).

   t12=1+0.08t12+0.48t21; t21=1+0.24t12+0.14t21.

 Solving the two equations gives

   t     =335/169 ≈ 1.982 steps; t              =290/169 ≈ 1.716 steps.
    12                                     21




 Exercise 22. Two independent walkers in a house
 (a) Limiting joint distribution
 A random walk on an undirected room network has stationary distribution proportional to room degree. For
 one walker, πi=di/D, where D=∑kdk. The problem states each walk is irreducible and aperiodic, so each
 converges to this distribution. Independence gives the product limit:

   lim         P(A =i,B =j) = (d /D)(d /D).
         n→∞      n      n            i     j

 (b) Equations for the meeting time
 Let tik be the expected first meeting time, with tii=0. Condition on the independent first moves of Alice and
 Bob. For i≠k,

                      M         M
   t     =1+∑            ∑          p p t , with t =0.
    ik             u=1       v=1     iu kv uv        ii




 Exercise 23. Expected time and variance to absorption
 From state 0, the chain waits until it moves to state 1; from state 1, it waits until it moves to absorbing state
 2. Each wait is a geometric number of steps with success probability 0.2. By the Markov property, the two
 waiting times are independent.

   E(T)=2(1/0.2)=10; Var(T)=2[(1−0.2)/(0.2)²]=2·20=40.



 Exercise 24. A six-state chain with a transient pair
 (a) Distribution of the number of returns to state 1
 Starting from state 1, each visit has probability 1/2 of staying at 1 for the next step. If it moves to state 2, it
 returns to state 1 with probability 1/2 and escapes to state 3 with probability 1/2. Thus the probability of
 eventually returning to 1 after a visit is 1/2+(1/2)(1/2)=3/4. The probability of leaving the transient class
 forever is 1/4. By the geometric story, the number R of returns after the initial visit is Geom(1/4), using the



Markov Chains                                                                                                    Page 9


INTRODUCTION TO PROBABILITY | CHAPTER 11                                                                    DETAILED SOLUTIONS




 book's convention of counting failures before the first success.

   P(R=k)=(3/4)k(1/4), k=0,1,2,… .

 (b) Long-run fraction of time in state 3
 States 1 and 2 are transient; {3,4,5,6} is the closed recurrent class. On every edge of this class, the
 transition probability is the same in both directions: 3↔4 has 0.3, 3↔5 has 0.2, and 4↔6 has 0.7. Detailed
 balance therefore gives equal stationary mass to states 3,4,5,6. The long-run fraction in state 3 is 1/4.

   π3=1/4.



 Exercise 25. A finite chain with one absorbing state
 (a) Recurrent and transient states
 State M is absorbing and therefore recurrent. Every other state can reach M, so in a finite chain it cannot
 belong to a closed recurrent class; states 1,…,M−1 are transient.

 (b) Limit of Qⁿ

   lim       Qn = matrix with every row (0,…,0,1).
      n→∞

 From every starting state absorption occurs with probability 1, so the chain is at M with probability tending to
 1.

 (c) Probability of being at a transient state at time n
 Let R be the upper-left (M−1)×(M−1) submatrix of Q. A path that is at a transient state at time n has
 remained within the transient states for all n steps, so

   P(X =j | X =i) = (Rn) , i,j<M.
         n      0         ij

 (d) Expected number of visits through time n
                                                              n
   E[number of visits to j at times 0,…,n | X =i] = ∑            (Rk) .
                                                 0         k=0       ij

 (e) Expected visits before absorption
                                                                          k
 Because all nonabsorbing states are transient, the powers R tend to zero and the matrix geometric series
 converges. Its sum is the fundamental matrix.

   I+R+R²+… = (I−R)−1.

 The (i,j) entry is therefore the expected total number of visits to j, counting time 0, before absorption when
 starting at i.



 Exercise 26. A simplified Chutes and Ladders game
 (a) Why a 5×5 transition matrix is enough
 A landing on the base of a chute or ladder is followed immediately by the forced move to its endpoint. Such
 intermediate squares do not persist as states at turn boundaries. After resolving every chute/ladder, the only
 possible positions are the four nonterminal positions represented by the first four rows of the supplied
 matrix, plus the absorbing destination (state 5). Thus the transition matrix has five states even though the
 board has nine squares.

   Q = [[0, 1/2, 1/2, 0, 0], [0, 0, 1/2, 1/2, 0], [1/2, 0, 0, 1/2, 0], [1/2, 0, 0, 0, 1/2], [0, 0, 0, 0, 1]].



Markov Chains                                                                                                          Page 10


INTRODUCTION TO PROBABILITY | CHAPTER 11                                                          DETAILED SOLUTIONS




 (b) Number of visits to square 7
 In the reduced chain, square 7 is the fourth transient state. From state 4, the next flip ends the game with
 probability 1/2; with probability 1/2 it returns to state 1. From state 1 the chain reaches state 4 with
 probability 1 (the first three states form a transient route that eventually reaches 4). Thus each visit to
 square 7 independently has probability 1/2 of being the final visit.

   N7 ~ GeomTrials(1/2) on {1,2,…}; E(N7)=2, Var(N7)=2.

 (c) Median duration
 Let R be the upper-left 4×4 transient submatrix. The survival probability after n flips is e TRn1. Directly from
                                                                                             1
 the supplied matrix, the cumulative probabilities at n=6 and n=7 are

   P(T≤6)=31/64≈0.4844; P(T≤7)=69/128≈0.5391.

 The CDF first reaches 1/2 at n=7, so the median duration is 7 coin flips.

 (d) Mean duration
                                                                      −1
 For an absorbing finite Markov chain, the fundamental matrix (I−R)        gives expected visits to each transient
 state before absorption. Its first row, computed from the given R, is

   e T(I−R)−1 = (16/5, 8/5, 12/5, 2).
    1

 The total number of flips equals the total number of transient-state visits before absorption. Summing the
 row gives

   E(T)=16/5+8/5+12/5+2 = 46/5 = 9.2 flips.




Markov Chains                                                                                                Page 11
```
