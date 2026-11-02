# Metallurgical & Materials Engineering — The MT202 Archive

A Next.js learning site for the Limitless "Metallurgical and Materials Engineering"
discipline, styled as a gothic archive in the same family as the Probability Archive.
The first chamber is **MT202 — Physical Metallurgy**: condensed lessons, 522 chapter-wise
MCQs with concise *and* detailed solutions on reveal, a timed exam simulator, metallurgy
calculators and browser-local progress.

## Requirements
- Node.js 20.9 or later
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Production build (deploy to the Limitless repo)
```bash
npm run sync        # re-import the Markdown question bank (see below)
npm run build       # static export into "out/"
```
Copy the contents of `out/` into `../metallurgy/` in the Limitless repository — that is
the folder the hub card links to.

## Architecture
- `app/page.tsx`: discipline landing page ("Metallurgical and Materials Engineering") with
  one card per course; add a course by extending the `COURSES` list.
- `app/mt202/page.tsx`: the MT202 archive shell — sidebar, lesson reader, quiz routing.
- `app/mt202/quiz.tsx`: chapter quiz player (answer → reveal concise + detailed solution).
- `app/mt202/exam.tsx`: timed exam simulator (Ch09 mix or all-chapter random pull).
- `app/mt202/calculators.tsx`: lever rule, Schmid factor, Hall–Petch, carburising √(Dt).
- `app/data/lessons.ts`: condensed lesson theory per chapter + formula cards + memorise lists.
- `app/globals.css`: dark/light gothic palette (tokens shared with the Probability Archive).
- `localStorage` keys: `mm-mt202-v1` (progress, exam best) and `mm-theme-v1` (theme).

## Content sync — the Markdown is the source of truth
`npm run sync` parses the question bank and solutions folder:

```
node scripts/sync.mjs "C:\Users\DELL\OneDrive\Desktop\MT3rdSem\MT202PM\MCQ_Question_Bank"
```

into `public/data/mt202/ch01.json … ch09.json` (+ `index.json`). The app fetches one
chapter at a time, so re-run `npm run sync` and `npm run build` after editing any
Markdown file — nothing is retyped, nothing drifts.

## Connect it to the existing Limitless site
The hub (`tools.js` in the Limitless repo) links to this build as the
"Metallurgical and Materials Engineering" card under Studies & Disciplines, next to
Probability. The build uses `basePath = /metallurgy`, so keep the deployed folder named
`metallurgy`.
