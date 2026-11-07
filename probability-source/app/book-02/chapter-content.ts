// Chapter 1 learning content supplied with the Book 02 patch.
// The patch contains learning examples for Chapter 1 only; later chapters
// deliberately remain empty until their own verified content is supplied.

export type Step = { note: string; work?: string };

export type Illustration = {
  title: string;
  setup: string;
  steps: Step[];
  takeaway: string;
};

export type Problem = {
  level: "Warm-up" | "Core" | "Challenge";
  statement: string;
  hint: string;
  solution: Step[];
  answer: string;
};

export type ChapterContent = {
  illustrations: Illustration[];
  problems: Problem[];
};

const chapter1: ChapterContent = {
  illustrations: [
    {
      title: "The multiplication rule: PIN codes",
      setup: "A PIN has 4 digits, each from 0 to 9. How many PINs are possible if digits may repeat, and how many if no digit may repeat?",
      steps: [
        { note: "Build the PIN one position at a time. Ask how many choices remain at each position." },
        { note: "Repeats allowed: every position has all 10 digits available.", work: "10 × 10 × 10 × 10 = 10^4 = 10000" },
        { note: "No repeats: each later position loses the digits already used.", work: "10 × 9 × 8 × 7 = 5040" },
      ],
      takeaway: "If a task has stages with n₁, n₂, … choices and each stage's number of choices is independent of earlier selections, multiply: n₁ × n₂ × ···.",
    },
    {
      title: "The naive definition: two dice",
      setup: "Roll two fair six-sided dice. What is the probability that the sum is 7?",
      steps: [
        { note: "Use ordered pairs (first die, second die). Each die has 6 faces.", work: "|S| = 6 × 6 = 36" },
        { note: "The pairs summing to 7 are (1,6), (2,5), (3,4), (4,3), (5,2), and (6,1): 6 outcomes." },
        { note: "All 36 outcomes are equally likely, so divide favorable outcomes by total outcomes.", work: "P(sum = 7) = 6/36 = 1/6" },
      ],
      takeaway: "The naive definition applies when every outcome in the sample space is equally likely. Keep ordered outcomes distinct when the experiment distinguishes order.",
    },
    {
      title: "Unordered choices and the complement trick",
      setup: "A club has 6 men and 4 women. A 3-person committee is chosen at random. How many committees contain at least one woman?",
      steps: [
        { note: "Count all committees. Order does not matter.", work: "C(10, 3) = 120" },
        { note: "Count the complement: committees with no women, so all three members are men.", work: "C(6, 3) = 20" },
        { note: "Subtract the complement from the total.", work: "120 − 20 = 100" },
      ],
      takeaway: "When 'at least one' is awkward to count directly, count the complement ('none') and subtract from the total.",
    },
    {
      title: "Arrangements with repeated letters",
      setup: "How many distinct strings can be made by rearranging all the letters of BANANA?",
      steps: [
        { note: "Pretend all six letters are different. There are 6! orderings." , work: "6! = 720" },
        { note: "The three A's can be swapped in 3! ways without changing the string, and the two N's in 2! ways." },
        { note: "Divide out the overcounting.", work: "6!/(3! 2! 1!) = 720/12 = 60" },
      ],
      takeaway: "For n objects with repeated groups of sizes a, b, …, the number of distinct arrangements is n!/(a! b! ···).",
    },
    {
      title: "Counting favorable hands: exactly two hearts",
      setup: "A 5-card hand is dealt from a standard 52-card deck. What is the probability that it has exactly two hearts?",
      steps: [
        { note: "A hand is an unordered set of 5 cards, so the total number is C(52, 5).", work: "C(52, 5) = 2,598,960" },
        { note: "Choose 2 of the 13 hearts and 3 of the 39 non-hearts.", work: "C(13, 2) × C(39, 3) = 712,842" },
        { note: "Divide favorable hands by all hands.", work: "P = 712,842/2,598,960 ≈ 0.274" },
      ],
      takeaway: "For an exact number of items of a type, choose that type and its complement separately, then multiply.",
    },
    {
      title: "The birthday problem",
      setup: "In a room of 23 people, what is the probability that at least two share a birthday? Assume 365 equally likely birthdays and ignore leap years.",
      steps: [
        { note: "Use the complement: nobody shares a birthday." },
        { note: "Assign birthdays one person at a time. Each new person must avoid all birthdays already taken.", work: "P(no match) = (365/365)(364/365)…(343/365) ≈ 0.493" },
        { note: "Take the complement.", work: "P(at least one match) = 1 − 0.493 = 0.507" },
      ],
      takeaway: "The complement often turns a difficult 'at least one match' count into a simple product.",
    },
  ],
  problems: [
    {
      level: "Warm-up",
      statement: "A restaurant offers 5 starters, 6 main courses and 4 desserts. How many three-course meals are possible if one of each is chosen?",
      hint: "Build the meal course by course.",
      solution: [{ note: "Multiply the independent choices at each stage.", work: "5 × 6 × 4 = 120" }],
      answer: "120",
    },
    {
      level: "Warm-up",
      statement: "A fair coin is flipped 3 times. What is the probability of exactly two heads?",
      hint: "There are 2³ equally likely sequences. Choose which 2 of the 3 positions are heads.",
      solution: [
        { note: "There are 2³ = 8 equally likely sequences.", work: "|S| = 8" },
        { note: "Choose the two positions occupied by heads.", work: "C(3, 2) = 3" },
        { note: "Divide.", work: "P(exactly 2 heads) = 3/8" },
      ],
      answer: "3/8",
    },
    {
      level: "Warm-up",
      statement: "A class has 12 students. In how many ways can a president, vice-president and treasurer be chosen as three different people?",
      hint: "The roles are distinct, so order matters.",
      solution: [{ note: "Choose each role in order.", work: "12 × 11 × 10 = 1320" }],
      answer: "1320",
    },
    {
      level: "Core",
      statement: "Of 40 students, 25 play chess, 18 play cricket and 8 play both. How many play neither, and what is the probability a randomly chosen student plays exactly one of the two games?",
      hint: "Use inclusion-exclusion for at least one game, then subtract the intersection to get exactly one.",
      solution: [
        { note: "At least one game:", work: "25 + 18 − 8 = 35" },
        { note: "Neither:", work: "40 − 35 = 5" },
        { note: "Exactly one game means chess only or cricket only.", work: "(25 − 8) + (18 − 8) = 27; P = 27/40" },
      ],
      answer: "5 play neither; P(exactly one) = 27/40",
    },
    {
      level: "Core",
      statement: "Three cards are dealt from a standard 52-card deck. What is the probability that all three have the same suit?",
      hint: "Choose the suit first, then choose 3 cards from its 13 cards. The total is C(52, 3).",
      solution: [
        { note: "Total number of 3-card hands:", work: "C(52, 3) = 22,100" },
        { note: "Favorable hands: 4 choices of suit, then C(13, 3) choices.", work: "4 × C(13, 3) = 4 × 286 = 1,144" },
        { note: "Divide.", work: "P = 1,144/22,100 = 286/5,525 ≈ 0.052" },
      ],
      answer: "286/5525 ≈ 0.052",
    },
    {
      level: "Challenge",
      statement: "Without using algebra, explain why C(n, k) = C(n, n − k). Give a story that counts the same thing in two ways.",
      hint: "Think of choosing a team of k people from n. What else is decided at the same time?",
      solution: [
        { note: "C(n, k) counts the ways to pick k people to be on a team." },
        { note: "Every time you choose the k team members, you have also chosen the n − k people left out." },
        { note: "Choosing the team and choosing who is left out describe the same split, so both counts are equal." },
      ],
      answer: "Choosing the k members is the same as choosing the n − k non-members.",
    },
  ],
};

export const chapterContent: Record<number, ChapterContent> = {
  1: chapter1,
};
