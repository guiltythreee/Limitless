# Hidden Chamber III — The Probability Archive

A separate Next.js learning site for probability, styled as a gothic occult archive. This first version includes nine progressive lessons, short quizzes, a dice-frequency simulation, and browser-local progress.

## Requirements
- Node.js 20.9 or later
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Production build
```bash
npm run build
npm start
```

## Architecture
- `app/page.tsx`: interactive archive, lesson content, quiz state, experiment and local progress.
- `app/globals.css`: dark gothic palette, gold accents and background treatments.
- `app/layout.tsx`: app shell and metadata.
- `tailwind.config.ts`: Tailwind theme tokens.
- `localStorage` key `hc3-progress-v1`: completed lesson IDs and selected quiz answers.

## Connect it to the existing Limitless site
The existing Limitless repository is a plain static `index.html`, so keep the projects separate. Deploy this app as its own Next.js project, then update the Hidden Chamber III card in the existing `index.html` to link to the deployed URL.

Example:
```html
<a class="chamber-card" href="https://YOUR-DEPLOYED-URL.example">
  <!-- existing Hidden Chamber III card content -->
</a>
```
If the current card already has an outer clickable element, update its `href` rather than nesting another link inside it.

## Deployment notes
This is a standard Next.js app and can be deployed to a platform that supports Next.js, such as Vercel. For static-only hosting, configure Next.js static export and ensure the hosting platform supports the generated output. Browser-local progress is specific to the browser and device; it does not sync between devices.

## Current scope
This is a functional first release, not yet a complete textbook. It has nine starter lessons, quizzes, a dice simulation, and locally saved progress. Advanced lessons such as continuous distributions, covariance, generating functions, concentration inequalities, Poisson processes and martingales can be added next.
