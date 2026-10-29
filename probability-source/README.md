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
- `../meta/index.html` + `../meta/meta.js`: static global EXP/level dashboard. It currently counts only registered LSR-1 sources; legacy module-specific XP is deliberately excluded until migrated.

## LSR-1 reward pilot

The shared `LSR-1` policy standardizes activity classes, difficulty multipliers, a capped quality bonus, a one-time checkpoint pass bonus, duplicate-event protection, and a configurable daily repeat cap. Probability is the first registered pilot. Practice awards and assessment awards are stored in the Probability progress root with the related attempt/test record; assessment answers do not also pay per-question EXP. Resetting ordinary Probability progress preserves the lifetime reward ledger.

The standard and starting values are provisional and require calibration from representative use. Global EXP is derived from saved LSR-1 award records rather than a separately incremented counter. Existing MT203 XP and other module-local rewards are not counted as global EXP until migrated to the common policy.

## Pathway design

A pathway is an ordered list of lesson IDs, not a duplicate course. Shared prerequisites appear in several routes but retain one lesson, question history, and completion identity. Changing pathways filters navigation and test setup; it does not reset progress. Sequence numbers group related topics, while each pathway can skip content irrelevant to its focus.

## Scope and quality standard

Blitzstein–Hwang and Sheldon Ross guide topic selection and sequencing; this repository contains original explanations and problems rather than copied textbook text or solutions. The coverage ledger distinguishes expanded areas from starter and planned work. This is a substantial curriculum expansion, not a claim that every chapter or exercise in either textbook has been exhaustively covered.

A lesson should not be treated as complete merely because it has a title. The expected standard includes accurate definitions, stated assumptions, worked reasoning, variation in question difficulty, and explanations of common misconceptions. The validator checks route references, lesson identity, authored lesson question counts, difficulty coverage, worked-example counts, and MCQ answer indexes.

## Deployment

The GitHub Actions workflow builds a static export into `probability/` when changes reach `main`. Pull-request builds validate and build the app without modifying deployed files.