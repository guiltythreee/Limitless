# Limitless

A personal study and training hub, deployed as a Cloudflare Worker with static assets.

## What's in here

| Path | What it is |
| --- | --- |
| `index.html`, `tools.js`, `studies-catalog.js` | Hub home page and catalogue of tools and studies |
| `tools/math/` | Math Trainer application; automated checks are isolated in `tools/math/tests/` |
| `tools/typing/` | Bookkeys typing trainer |
| `competition/` | Competition tracker |
| `codeforces-red/` | Codeforces problem and contest tracker |
| `meta/` | Meta progression dashboard |
| `shared/` | Shared rewards, profile, project and learning-player modules |
| `supabase/` | Optional sign-in and cloud sync |
| `probability-source/` | Next.js source for Probability |
| `metallurgy-source/` | Next.js source for Metallurgy |
| `probability/`, `metallurgy/` | Generated static exports; do not edit by hand |
| `worker.js`, `wrangler.jsonc` | Cloudflare Worker and static-asset configuration |
| `scripts/` | Catalogue generators |
| `docs/` | Architecture notes |

## Run and test locally

The hub and Math Trainer are plain static files. Serve the repository root with a static server, for example `npx serve .`.

```bash
# Math Trainer regression tests
set -euo pipefail
shopt -s nullglob
test_files=(tools/math/tests/test-*.cjs tools/math/tests/test-*.mjs)
if (( ${#test_files[@]} == 0 )); then echo 'No Math Trainer tests found.'; exit 1; fi
for t in "${test_files[@]}"; do node "$t"; done
node tools/math/tests/learning-intelligence.test.mjs
node --check tools/math/learning-intelligence.mjs
node --check tools/math/game.js
```

```bash
# Bookkeys tests
(cd tools/typing/tests && npm ci && npm test)
```

```bash
# Probability app (Node 20.9+; CI uses Node 22)
(cd probability-source && npm ci)
# Start the development server in its own terminal
(cd probability-source && npm run dev)
# Validate and build
(cd probability-source && npm run validate:curriculum && npm run test:rewards && npx tsc --noEmit && npm run build)
```

```bash
# Metallurgy app
(cd metallurgy-source && npm ci)
# Start the development server in its own terminal
(cd metallurgy-source && npm run dev)
# Run the LSR-1 checks
(cd metallurgy-source && npm run test:lsr1)
```

## Deploy

Pushes to `main` deploy through `.github/workflows/deploy-cloudflare.yml` using Wrangler. The repository needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.

Probability and Metallurgy are built by their own workflows, which commit generated output into `probability/` and `metallurgy/` before deployment.

## Conventions

- Edit `*-source/` folders, never the generated `probability/` or `metallurgy/` folders.
- Keep automated tests in the owning module's `tests/` directory.
- Progress is stored in `localStorage` first; Supabase sync mirrors it only when signed in.
