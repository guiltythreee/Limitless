# Limitless Probability Archive

A Next.js learning app for probability. Its curriculum is a shared set of chapters that can be followed through overlapping pathways: foundations, statistics and data science, quantitative finance, stochastic processes, and computational probability.

## Run locally

- Node.js 20.9 or later
- npm

\`\`\`bash
npm ci
npm run dev
\`\`\`

Open http://localhost:3000.

## Validate and build

\`\`\`bash
npm run validate:curriculum
npx tsc --noEmit
npm run build
\`\`\`

## Curriculum architecture

- \`app/content/types.ts\`: shared lesson, example, formula, and quiz contracts.
- \`app/content/index.ts\`: canonical shared lesson catalogue and stable lesson IDs.
- \`app/content/pathways.ts\`: overlapping, ordered routes over the same lessons; the full archive remains available.
- \`app/content/coverage.ts\`: topic-by-topic coverage ledger using Blitzstein–Hwang and Sheldon Ross as scope references.
- \`app/content/pathway-lessons.ts\`: 17 original expanded lessons with 34 worked examples and 51 graded questions at easy, medium, and hard levels.
- \`app/components/TopicTree.tsx\`: pathway selector and route-specific chapter navigation.
- \`app/components/Test.tsx\`: cumulative tests restricted to the selected route unless the full archive is active.
- \`app/lib/store.ts\`: browser-local progress and attempts. Existing lesson IDs are retained to preserve saved records.

## Pathway design

A pathway is an ordered list of lesson IDs, not a duplicate course. Shared prerequisites appear in several routes but retain one lesson, question history, and completion identity. Changing pathways filters navigation and test setup; it does not reset progress. Sequence numbers group related topics, while each pathway can skip content irrelevant to its focus.

## Scope and quality standard

Blitzstein–Hwang and Sheldon Ross guide topic selection and sequencing; this repository contains original explanations and problems rather than copied textbook text or solutions. The coverage ledger distinguishes expanded areas from starter and planned work. This is a substantial curriculum expansion, not a claim that every chapter or exercise in either textbook has been exhaustively covered.

A lesson should not be treated as complete merely because it has a title. The expected standard includes accurate definitions, stated assumptions, worked reasoning, variation in question difficulty, and explanations of common misconceptions. The validator checks route references, lesson identity, authored lesson question counts, difficulty coverage, worked-example counts, and MCQ answer indexes.

## Deployment

The GitHub Actions workflow builds a static export into \`probability/\` when changes reach \`main\`. Pull-request builds validate and build the app without modifying deployed files.