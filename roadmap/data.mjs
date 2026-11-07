// The Progression Map definition. THIS is the file you edit to change the map.
//
// How to add something:
//   1. Add a node to NODES (copy a neighbour). Give it a unique id, put it in an existing stage,
//      list `prereqs` (ids that should be done first) and choose its `evidence`.
//   2. Run:  node roadmap/test-roadmap.mjs   — it rejects typos, cycles and unknown ids.
//
// Evidence kinds (see evidence.mjs for exact behaviour):
//   manual-check         you tick it yourself (todo / doing / done)
//   manual-number        you log a number; { label, unit, start, target }
//   codeforces-rating    peak rating cached from your linked Codeforces handle (falls back to a typed number); { label, start, target }
//   competition-problems problems logged in Regional Qualification with a first-attempt result; { minCount, outcomes }
//   probability-pathway  lessons completed in a Probability pathway; { pathway, minFraction }
//   competition-subject  competition topics marked "mastered"; { subject | "all", weeks: [from, to], minFraction }
//   course-coverage      MT201–MT203 questions answered correctly; { course, minFraction }
//   course-exam          MT201 / MT202 exam-simulator best score; { course, minPct }
//   math-test80          best Math Trainer 80-in-8 run; { minCorrect, minAccuracy }
//   global-level         global LSR-1 level; { atLeast }
//
// Honest-numbers note: every target below is a STARTING SUGGESTION, not a fact about what any
// firm requires. Tune them to your real baseline. Dates are plain YYYY-MM-DD (or null = no deadline).

export const TRACKS = [
  {
    id: "quant",
    title: "Quant internship",
    goal: "Land an off-campus quant internship (India or abroad) within about six months of 2 Nov 2026.",
    symbol: "♜",
    startDate: "2026-11-02", // matches the Regional Qualification campaign start; used for the timeline bar
    stages: [
      { id: "quant-foundations", title: "Foundations", targetDate: "2026-11-29",
        objective: "Fluent basics: C++ on easy problems, counting and probability vocabulary, quick arithmetic." },
      { id: "quant-core", title: "Core toolkit", targetDate: "2026-12-27",
        objective: "The standard toolkit every quant interview assumes: probability, linear algebra, Python, speed." },
      { id: "quant-depth", title: "Depth & integration", targetDate: "2027-02-21",
        objective: "Finish the 16-week campaign, reach the quant-finance probability material and a credible contest rating." },
      { id: "quant-interview", title: "Interview readiness", targetDate: "2027-04-04",
        objective: "Timed problems, mock interviews, derivatives basics and one project you can discuss." },
      { id: "quant-apply", title: "Apply & convert", targetDate: "2027-05-02",
        objective: "A target list, applications, online assessments and interviews until an offer lands." },
    ],
  },
  {
    id: "metallurgy",
    title: "B.Tech Metallurgy",
    goal: "Finish the degree on schedule with a strong CGPA and a clear exit route: the respectable fallback.",
    symbol: "⚗",
    startDate: null, // semester dates are not known here, so this track shows no timeline
    stages: [
      { id: "met-sem3", title: "Semester 3 (now)", targetDate: null,
        objective: "Know MT201, MT202, MT203 and WO200 well enough to clear them comfortably." },
      { id: "met-core", title: "Semesters 4–5", targetDate: null,
        objective: "Clear each semester without a backlog and protect the CGPA." },
      { id: "met-experience", title: "Semesters 6–7", targetDate: null,
        objective: "Add experience: an internship and one skill that carries beyond the classroom." },
      { id: "met-exit", title: "Semester 8: exit", targetDate: null,
        objective: "Submit the project and secure an exit route (placement, GATE, M.Tech or a quant offer)." },
    ],
  },
];

// Small helper keeps the table below readable. `href` is where in Limitless you work on the node.
const n = (track, stage, id, title, why, evidence, extra = {}) => ({
  id, track, stage, title, why, evidence, prereqs: [], weight: 1, ...extra,
});

const manualNumber = (label, unit, start, target) => ({ kind: "manual-number", label, unit, start, target });
const check = { kind: "manual-check" };

export const NODES = [
  // ================= QUANT · Foundations =================
  n("quant", "quant-foundations", "q-cf-1200", "Codeforces rating 1200",
    "A reliable signal that you can turn an idea into correct C++ under time pressure.",
    { kind: "codeforces-rating", label: "Codeforces rating", start: 1000, target: 1200 }, { weight: 2 }),
  n("quant", "quant-foundations", "q-problems-independent", "Log 25 problems you solved independently",
    "Problems cracked without a hint, recorded in the Regional Qualification problem review. This builds the speed and pattern recognition everything else relies on.",
    { kind: "competition-problems", minCount: 25, outcomes: ["independent"] },
    { href: "../competition/#problem-review" }),
  n("quant", "quant-foundations", "q-comp-foundations", "Campaign weeks 1–4 mastered",
    "Logic, counting, probability, graphs, DP and coding basics from your 16-week plan.",
    { kind: "competition-subject", subject: "all", weeks: [1, 4], minFraction: 0.75 },
    { weight: 2, href: "../competition/" }),
  n("quant", "quant-foundations", "q-prob-foundations-start", "Probability foundations pathway: 75%",
    "Sample spaces, counting, conditioning and Bayes: the base for every later probability topic.",
    { kind: "probability-pathway", pathway: "foundations", minFraction: 0.75 },
    { weight: 2, href: "../probability/studies/" }),
  n("quant", "quant-foundations", "q-mental-40", "80-in-8 arithmetic: 40 correct",
    "Fast, accurate mental arithmetic is tested directly by several trading-firm screens.",
    { kind: "math-test80", minCorrect: 40, minAccuracy: 0.9 },
    { href: "../tools/math-refactored/index.html" }),

  // ================= QUANT · Core toolkit =================
  n("quant", "quant-core", "q-comp-core", "Campaign weeks 5–8 mastered",
    "Invariants, stars and bars, Bayes, inclusion-exclusion, expectation and shortest paths.",
    { kind: "competition-subject", subject: "all", weeks: [5, 8], minFraction: 0.75 },
    { weight: 2, href: "../competition/", prereqs: ["q-comp-foundations"] }),
  n("quant", "quant-core", "q-prob-foundations", "Probability foundations pathway: complete",
    "Every foundations lesson done, so conditional probability and counting stop being a bottleneck.",
    { kind: "probability-pathway", pathway: "foundations", minFraction: 1 },
    { weight: 2, href: "../probability/studies/", prereqs: ["q-prob-foundations-start"] }),
  n("quant", "quant-core", "q-cf-1300", "Codeforces rating 1300",
    "Steady progress past the first plateau; mostly div2 B/C problems.",
    { kind: "codeforces-rating", label: "Codeforces rating", start: 1200, target: 1300 }, { prereqs: ["q-cf-1200"] }),
  n("quant", "quant-core", "q-mental-60", "80-in-8 arithmetic: 60 correct",
    "A competitive arithmetic score with high accuracy.",
    { kind: "math-test80", minCorrect: 60, minAccuracy: 0.9 },
    { href: "../tools/math-refactored/index.html", prereqs: ["q-mental-40"] }),
  n("quant", "quant-core", "q-linalg", "Linear algebra essentials",
    "Vectors, matrices, eigenvalues and least squares appear in regression, risk and factor models.",
    check),
  n("quant", "quant-core", "q-python", "Python with NumPy and pandas",
    "Research and many interview tasks are in Python. Show it with a small random-walk simulation.",
    check),
  n("quant", "quant-core", "q-level-5", "Reach global Level 5",
    "A consistency signal: steady verified study across Limitless, not one big burst.",
    { kind: "global-level", atLeast: 5 }, { weight: 0.5, href: "../meta/" }),

  // ================= QUANT · Depth & integration =================
  n("quant", "quant-depth", "q-comp-integrated", "Campaign weeks 9–12 mastered",
    "Recurrences, distributions, trees, mixed structures and advanced DP.",
    { kind: "competition-subject", subject: "all", weeks: [9, 12], minFraction: 0.75 },
    { weight: 2, href: "../competition/", prereqs: ["q-comp-core"] }),
  n("quant", "quant-depth", "q-comp-ready", "Campaign weeks 13–16 mastered",
    "Targeted repair, unseen mixed problems and competition-format simulations.",
    { kind: "competition-subject", subject: "all", weeks: [13, 16], minFraction: 0.75 },
    { weight: 2, href: "../competition/", prereqs: ["q-comp-integrated"] }),
  n("quant", "quant-depth", "q-prob-quantfin-60", "Quant-finance probability pathway: 60%",
    "Random variables, expectation, joint distributions, limit theorems and first stochastic processes.",
    { kind: "probability-pathway", pathway: "quant-finance", minFraction: 0.6 },
    { weight: 2, href: "../probability/studies/", prereqs: ["q-prob-foundations"] }),
  n("quant", "quant-depth", "q-stats", "Statistics pathway: 60%",
    "Estimation, hypothesis tests and regression: the language of research roles.",
    { kind: "probability-pathway", pathway: "statistics", minFraction: 0.6 },
    { href: "../probability/studies/", prereqs: ["q-prob-foundations"] }),
  n("quant", "quant-depth", "q-cf-1400", "Codeforces rating 1400",
    "A visible credential for applications and a sign your problem solving transfers.",
    { kind: "codeforces-rating", label: "Codeforces rating", start: 1300, target: 1400 }, { prereqs: ["q-cf-1300"] }),
  n("quant", "quant-depth", "q-iicpc", "Take part in IICPC / CodeFest",
    "A recognised contest result strengthens a quant application. Check the real dates when announced.",
    check, { prereqs: ["q-cf-1300"] }),

  // ================= QUANT · Interview readiness =================
  n("quant", "quant-interview", "q-prob-quantfin", "Quant-finance probability pathway: complete",
    "Markov chains, random walks, martingales and simulation: the material behind harder interview questions.",
    { kind: "probability-pathway", pathway: "quant-finance", minFraction: 1 },
    { weight: 2, href: "../probability/studies/", prereqs: ["q-prob-quantfin-60"] }),
  n("quant", "quant-interview", "q-mental-70", "80-in-8 arithmetic: 70 correct",
    "Interview-grade speed with accuracy held at 90% or better.",
    { kind: "math-test80", minCorrect: 70, minAccuracy: 0.9 },
    { href: "../tools/math-refactored/index.html", prereqs: ["q-mental-60"] }),
  n("quant", "quant-interview", "q-timed-problems", "50 timed probability / expected-value problems",
    "Practise under a clock with a mix of dice, cards, games and conditional expectation.",
    manualNumber("Problems solved", "", 0, 50), { prereqs: ["q-prob-quantfin-60"] }),
  n("quant", "quant-interview", "q-mocks", "Complete 6 mock interviews",
    "Explaining your reasoning aloud is its own skill; practise with a friend or a platform.",
    manualNumber("Mock interviews", "", 0, 6), { prereqs: ["q-timed-problems"] }),
  n("quant", "quant-interview", "q-markets", "Market-making and betting games",
    "Expected value, risk, Kelly intuition and quoting a two-sided market.",
    check, { prereqs: ["q-prob-quantfin-60"] }),
  n("quant", "quant-interview", "q-derivatives", "Derivatives basics",
    "Option payoffs, put–call parity and Black–Scholes intuition at interview level.",
    check, { prereqs: ["q-prob-quantfin-60"] }),
  n("quant", "quant-interview", "q-project", "One project you can discuss",
    "A backtest, simulation or pricing write-up on GitHub gives interviewers something concrete.",
    check, { prereqs: ["q-python"] }),

  // ================= QUANT · Apply & convert =================
  n("quant", "quant-apply", "q-target-list", "Target list with deadlines",
    "Firms and programmes in India and abroad, each with its application window and requirements.",
    check, { prereqs: ["q-project"] }),
  n("quant", "quant-apply", "q-applications", "Submit 15 applications",
    "Volume matters: response rates for off-campus applications are low.",
    manualNumber("Applications sent", "", 0, 15), { prereqs: ["q-target-list"] }),
  n("quant", "quant-apply", "q-assessments", "Attempt 5 online assessments",
    "Online assessments are the first filter; each one teaches you the format.",
    manualNumber("Assessments attempted", "", 0, 5), { prereqs: ["q-applications", "q-mental-60"] }),
  n("quant", "quant-apply", "q-interviews", "Complete 5 interviews",
    "Real interviews calibrate you far better than practice does.",
    manualNumber("Interviews completed", "", 0, 5), { prereqs: ["q-mocks", "q-applications"] }),
  n("quant", "quant-apply", "q-offer", "Secure an internship offer",
    "The goal of this track.", check, { weight: 3, prereqs: ["q-interviews"] }),

  // ================= METALLURGY · Semester 3 =================
  n("metallurgy", "met-sem3", "m-mt201-coverage", "MT201 Thermodynamics: 80% of questions correct",
    "289 chapter-wise questions. Coverage is practice, not an exam result.",
    { kind: "course-coverage", course: "mt201", minFraction: 0.8 },
    { weight: 2, href: "../metallurgy/mt201/" }),
  n("metallurgy", "met-sem3", "m-mt201-exam", "MT201 exam simulator: 70%",
    "A timed run exposes gaps that untimed practice hides.",
    { kind: "course-exam", course: "mt201", minPct: 0.7 },
    { href: "../metallurgy/mt201/", prereqs: ["m-mt201-coverage"] }),
  n("metallurgy", "met-sem3", "m-mt202-coverage", "MT202 Physical Metallurgy: 80% of questions correct",
    "522 chapter-wise questions with lessons for chapters 1–8.",
    { kind: "course-coverage", course: "mt202", minFraction: 0.8 },
    { weight: 2, href: "../metallurgy/mt202/" }),
  n("metallurgy", "met-sem3", "m-mt202-exam", "MT202 exam simulator: 70%",
    "Practise the full paper under time.",
    { kind: "course-exam", course: "mt202", minPct: 0.7 },
    { href: "../metallurgy/mt202/", prereqs: ["m-mt202-coverage"] }),
  n("metallurgy", "met-sem3", "m-mt203-coverage", "MT203 Polymer Science: 80% of questions correct",
    "286 questions across modules, with theory lessons and mastery tracking.",
    { kind: "course-coverage", course: "mt203", minFraction: 0.8 },
    { weight: 2, href: "../metallurgy/mt203/" }),
  n("metallurgy", "met-sem3", "m-wo200", "WO200 Mechanics of Materials: 6 note parts reviewed",
    "Statics, bending, shear stress, I-beam and deflection (Parts 0 to 5).",
    manualNumber("Parts reviewed", "", 0, 6)),
  n("metallurgy", "met-sem3", "m-sem3-clear", "Semester 3 cleared with no backlog",
    "Pass every course. This is the floor of the fallback.",
    check, { weight: 3, prereqs: ["m-mt201-coverage", "m-mt202-coverage", "m-mt203-coverage", "m-wo200"] }),
  n("metallurgy", "met-sem3", "m-sem3-sgpa", "Semester 3 SGPA target",
    "Log your SGPA when results are out. Change the target to match your own goal.",
    manualNumber("SGPA", "", 6, 8), { prereqs: ["m-sem3-clear"] }),

  // ================= METALLURGY · Semesters 4–5 =================
  // Replace these milestones with your real course lists as they become known.
  n("metallurgy", "met-core", "m-sem4-clear", "Semester 4 cleared with no backlog",
    "Add your semester 4 courses to this map when the list is final.",
    check, { weight: 3, prereqs: ["m-sem3-clear"] }),
  n("metallurgy", "met-core", "m-sem5-clear", "Semester 5 cleared with no backlog",
    "Add your semester 5 courses to this map when the list is final.",
    check, { weight: 3, prereqs: ["m-sem4-clear"] }),
  n("metallurgy", "met-core", "m-cgpa", "CGPA after semester 5",
    "Many recruiters and programmes filter on CGPA. Log it after results and set your own target.",
    manualNumber("CGPA", "", 6, 7.5), { weight: 2, prereqs: ["m-sem5-clear"] }),

  // ================= METALLURGY · Semesters 6–7 =================
  n("metallurgy", "met-experience", "m-sem6-clear", "Semester 6 cleared with no backlog",
    "Keep the streak of clean semesters.", check, { weight: 3, prereqs: ["m-sem5-clear"] }),
  n("metallurgy", "met-experience", "m-internship", "Summer internship or training",
    "A core, materials-data or software-adjacent internship strengthens every exit route.",
    check, { weight: 2, prereqs: ["m-sem5-clear"] }),
  n("metallurgy", "met-experience", "m-skill-bridge", "Computational skill for materials work",
    "Python or MATLAB applied to a materials dataset. It reuses the Python from your quant track.",
    check, { prereqs: ["q-python"] }),
  n("metallurgy", "met-experience", "m-sem7-clear", "Semester 7 cleared with no backlog",
    "Keep the streak of clean semesters.", check, { weight: 3, prereqs: ["m-sem6-clear"] }),

  // ================= METALLURGY · Semester 8 =================
  n("metallurgy", "met-exit", "m-project", "Final-year project submitted",
    "Choose a topic that you can also talk about in interviews.",
    check, { weight: 2, prereqs: ["m-sem7-clear"] }),
  n("metallurgy", "met-exit", "m-sem8-clear", "Degree requirements completed",
    "All courses and credits finished.", check, { weight: 3, prereqs: ["m-project"] }),
  n("metallurgy", "met-exit", "m-exit-route", "Exit route secured",
    "Placement, GATE, M.Tech or a quant offer. Any one of them counts.",
    check, { weight: 3, prereqs: ["m-cgpa"] }),
];

export const ROADMAP = Object.freeze({ tracks: TRACKS, nodes: NODES });
