# Limitless Probability Archive

A Next.js learning app for probability. Its curriculum is a shared set of chapters that can be followed through overlapping pathways: foundations, statistics and data science, quantitative finance, stochastic processes, and computational probability.

## Run locally

- Node.js 20.9 or later
- npm

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Validate and build

```bash
npm run validate:curriculum
npm run test:rewards
npx tsc --noEmit
npm run build
```

## Curriculum architecture

- `app/content/types.ts`: shared lesson, example, formula, and quiz contracts.
- `app/content/index.ts`: canonical shared lesson catalogue and stable lesson IDs.
- `app/content/pathways.ts`: overlapping, ordered routes over the same lessons; the full archive remains available.
- `app/content/coverage.ts`: topic-by-topic coverage ledger using Blitzstein–Hwang and Sheldon Ross as scope references.
- `app/content/pathway-lessons.ts`: 30 original expanded lessons with 60 worked examples and 90 graded questions at easy, medium, and hard levels.
- `app/components/TopicTree.tsx`: pathway selector and route-specific chapter navigation.
- `app/components/Test.tsx`: cumulative tests restricted to the selected route unless the full archive is active.
- `app/lib/store.ts`: browser-local progress, attempts, and an additive `rewardLedger` persisted with the same write as each rewarded action.
- `../shared/rewards.mjs`: canonical LSR-1 award policy, pure calculator, repeat cap, level curve, registry and global summary.
- `../meta/index.html` + `../meta/meta.js`: static global EXP/level dashboard. It counts registered LSR-1 ledgers only. Math Trainer and Bookkeys have separate new ledgers; their historical module-local XP remains deliberately excluded.

## LSR-1 reward pilot

The shared `LSR-1` policy standardizes activity classes, difficulty multipliers, a capped quality bonus, a one-time checkpoint pass bonus, duplicate-event protection, and a configurable daily repeat cap. Probability was the first registered pilot; Math Trainer is the second and Bookkeys is the third. Probability practice/assessment awards remain in its progress root with the related attempt/test record, and resetting ordinary Probability progress preserves its lifetime reward ledger. Math Trainer writes new eligible session and verified Trick Chamber awards to the separate `limitless-math-lsr1-v1` ledger. Its existing `limitless.math.v1.*` records — including legacy rank XP — are not migrated or rewritten. Bookkeys records newly observed page, chapter, and required-section book completions in the separate `bookkeys-lsr1-v1` ledger through its same-origin shell bridge; historical `bookkeys:game` XP is not imported, and pre-existing pages or backup-imported progress without a fresh Bookkeys completion marker do not earn retroactive EXP.

The standard and starting values are provisional and require calibration from representative use. Global EXP is derived from saved LSR-1 award records rather than a separately incremented counter. The metallurgy modules (including legacy MT203 XP) remain outside the registry until they receive their own verified adapters.

## Pathway design

A pathway is an ordered list of lesson IDs, not a duplicate course. Shared prerequisites appear in several routes but retain one lesson, question history, and completion identity. Changing pathways filters navigation and test setup; it does not reset progress. Sequence numbers group related topics, while each pathway can skip content irrelevant to its focus.

## Scope and quality standard

Blitzstein–Hwang and Sheldon Ross guide topic selection and sequencing; this repository contains original explanations and problems rather than copied textbook text or solutions. The coverage ledger distinguishes expanded areas from starter and planned work. This is a substantial curriculum expansion, not a claim that every chapter or exercise in either textbook has been exhaustively covered.

A lesson should not be treated as complete merely because it has a title. The expected standard includes accurate definitions, stated assumptions, worked reasoning, variation in question difficulty, and explanations of common misconceptions. The validator checks route references, lesson identity, authored lesson question counts, difficulty coverage, worked-example counts, and MCQ answer indexes.

## Deployment

The GitHub Actions workflow builds a static export into `probability/` when changes reach `main`. Pull-request builds validate and build the app without modifying deployed files.