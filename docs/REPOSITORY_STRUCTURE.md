# Repository structure and deployment map

This document records the verified source-of-truth boundaries and deployment sequence. It is intended to prevent cleanup work from removing live routes, source material, or generated assets that Cloudflare currently serves.

## Source of truth

| Area | Authoritative files | Generated or compatibility files |
| --- | --- | --- |
| Probability | `probability-source/` | `probability/` is the static export served at `/probability/` |
| Metallurgy | `metallurgy-source/` | `metallurgy/` is the static export served at `/metallurgy/` |
| Math Trainer | `tools/math/` | `tools/math-refactored/index.html` redirects to `/tools/math/` |
| Tools entry route | `tools/math/` | `tools/index.html` redirects to `/tools/math/` |
| Bookkeys | `tools/typing/` | Keep its reader and user-data migration logic intact |

Do not edit generated Probability or Metallurgy exports by hand. Their source applications, content, scripts, and lockfiles belong in the corresponding `*-source/` directories.

## Why generated exports remain tracked

The current Cloudflare Worker configuration uses the repository root as its static asset directory. The generated exports are therefore part of the deployment input.

- `.github/workflows/build-probability.yml` installs dependencies, validates and builds `probability-source/`, copies the static export to `probability/`, and commits changed output to `main`.
- `.github/workflows/test-metallurgy.yml` runs Metallurgy regression checks and a production static-export build, copies the result to `metallurgy/`, and commits changed output to `main`.
- `.github/workflows/deploy-cloudflare.yml` deploys the repository's static assets to Cloudflare.

Removing the generated directories from Git is not a standalone cleanup. It requires a replacement deployment design that publishes both built outputs to Cloudflare, preserves their URL paths, handles concurrent builds, and only deploys after all required builds succeed.

## Deployment ordering

Source changes for Probability and Metallurgy must not trigger an immediate production deployment using stale generated output. The deployment workflow therefore ignores both source trees on its ordinary `push` trigger and deploys after the corresponding successful build workflow completes.

The build workflows use `GITHUB_TOKEN` to commit generated assets; those commits do not themselves trigger ordinary push workflows. The `workflow_run` trigger is the handoff that deploys the completed export.

## Compatibility routes to preserve

The following small HTML files are redirects, not abandoned applications:

- `tools/index.html` redirects to `/tools/math/`.
- `tools/math-refactored/index.html` redirects to `/tools/math/`.

Keep these until route usage and inbound links have been checked and a deliberate redirect-retirement plan exists.

## Cleanup rules

1. Never delete a directory solely because it is generated, small, or appears unused.
2. Before removing an asset, search all source files and stylesheets for references and check whether it is loaded dynamically.
3. Preserve user data, migrations, backups, and compatibility routes unless their replacement has been tested.
4. Make structural changes in isolated branches and inspect the complete diff.
5. Run the owning module's tests and build before merging.
6. Do not use production deployment as a test environment.

## Current known constraints

- The generated `probability/` and `metallurgy/` trees are tracked because Cloudflare currently serves them from the repository root.
- The root `cathedral-hd.webp` is referenced by `hub-theme.css`; it is not an unused image.
- Theme assets under `themes/` and `tools/math/themes/` serve separate theme implementations and should not be deduplicated without checking both consumers.
- `tools/math/` is the active Math Trainer, including its engine, storage, progression, theme assets, and tests.
