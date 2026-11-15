# Bookkeys migration handoff — 2026-11-15

## Non-negotiable safety rules
- Do not merge PR #232.
- Do not deploy to the production Worker or change the live `/tools/typing/` route.
- Do not make speculative CSS/layout changes. The acceptance requirement is visual parity with the existing live Bookkeys page, not a redesign or approximation.
- Before any further code edits, create a new backup branch from the exact current working commit. Preserve all existing `backup/bookkeys-*` branches.

## Repository and current refs
- Repository: `guiltythreee/Limitless`
- Active integration branch: `work/bookkeys-clean-main-integration-20261115`
- Draft PR: #232 — https://github.com/guiltythreee/Limitless/pull/232
- Code snapshot preserved by immutable handoff backup: `c394321e12eceda41f4b8a9725bd896c98abefa5`.
- Handoff-document commit: `a4f5cf9d39e9f0e2a0db7e7945dea129ade19126` (adds this file; does not change product source).
- Immutable handoff snapshot branch: `backup/bookkeys-visual-parity-handoff-20261115`, pointing to code snapshot `c394321e12eceda41f4b8a9725bd896c98abefa5`.
- Earlier recovery point: `backup/bookkeys-clean-main-before-visual-acceptance-20261115`, pointing to `25ffa59b738ae93bc2217b9a1b51056e33304a5f`.
- PR base recorded at handoff: `main` at `77e7c894ed8629d4494d7e22f2eed6a99af10a74`.

## Preview and production reference
- Isolated preview URL: https://limitless-bookkeys-preview.beyondthelimits.workers.dev/tools/typing-next-preview/
- Production reference URL: https://limitless.beyondthelimits.workers.dev/tools/typing/bookkeys.html
- User explicitly reports that the preview still does **not** match the live page. Treat visual parity as failed / unaccepted.
- No true side-by-side browser screenshot comparison has been completed. Previous attempts to access the preview from the container failed at DNS resolution. A successful build or passing automated tests is not evidence of visual parity.
- Do not claim that the page looks identical. Next step: obtain actual rendered screenshots of both URLs at the same viewport and compare original library/shelf layout, typography, spacing, controls, background/artwork and responsive behavior. If browser access is unavailable, ask the user for screenshots of preview and live page rather than guessing.

## Validation at code snapshot c394321
GitHub check-runs on `c394321e12eceda41f4b8a9725bd896c98abefa5` reported:
- `test`: success.
- `verify`: success.
- `deploy`: success (isolated preview workflow; not permission to deploy production).
- Cloudflare Workers build: success.
The prior run `43706731417` was cancelled because a newer verification run superseded it. The successful checks above are on the current code snapshot.
The latest product-code commit at that snapshot is `test(bookkeys): wait for local library before batch import`; it adds a storage-ready wait to the multi-EPUB browser test.
The handoff-doc commit `a4f5cf9...` triggered another CI run; at the time this file was written, `test`, `verify`, and isolated `deploy` were still in progress. Recheck those on the current branch head before relying on them.

## Known testing and implementation notes
- A previous browser run at commit `25ffa59b738ae93bc2217b9a1b51056e33304a5f` had 27/28 browser tests passing. The sole failure was a test clicking the card's Remove action without hovering the card first; that test was corrected later.
- Card actions are intentionally hidden until hover/focus (`.bk-book-card-actions` in `tools/typing-next-source/globals.css`). Tests must hover/focus before using them; do not change intended product behavior just to satisfy a test.
- `bgMatch` setting and its UI exist in `BookkeysApp.tsx`; a previous rerun passed that setting test.
- A previous progress-counter test asserted a legacy library stat element that was not part of the current library UI; it was adjusted to validate the persisted page counter instead.
- `tools/typing-next-source/FEATURE_PARITY_MATRIX.md` records settings/catalogue parity (palettes, backgrounds, effects, fonts and tabs), but is an audit document, not proof of rendered visual parity.
- High-risk acceptance still includes representative PDF/EPUB/TXT flows, populated IndexedDB v1 and backup/restore behavior, IME/mobile keyboard behavior, offline/CSP/storage/quota behavior, and actual visual comparison. Do not treat fixtures alone as real-user data validation.

## Next actions
1. Keep PR #232 draft and unmerged.
2. Capture same-viewport screenshots of live and preview, and identify concrete visual differences before changing code.
3. Compare against the known-good original Bookkeys UI/assets and preserved backup branches. Recover the exact known-good visual implementation rather than recreating it from memory.
4. Make one narrowly scoped visual correction at a time; run typecheck/build/browser tests after each change.
5. After a compiling, tested milestone, create a new backup branch immediately and update this handoff with the new SHA and evidence.
6. Only discuss merge/cutover after user approval and after visual plus functional acceptance.

## Continuation instruction for a new chat
Start by reading this file and checking the current PR #232 head and check-runs. Do not ask the user to restate the safety rules or project context. The latest explicit correction is that the preview still differs from live; preserving the near-identical original visuals is the priority.


## Visual-parity recovery update — 15 November 2026, 17:00 IST

Latest isolated integration code checkpoint:
- PR #232 remains open, draft and unmerged.
- Current source commit: `01d4754a7a188bc5716c17a061acab74b3ec70bb`.
- Backup branch created from this exact compiled checkpoint: `backup/bookkeys-card-parity-pass-2-built-20261115`.
- Previous compiled checkpoint: `1fa09b54c01501bb3f8ff42f04a6c751408665af`, preserved as `backup/bookkeys-card-parity-pass-1-built-20261115`.
- Pre-edit checkpoint: `6d4df30e8754afc10ca36709253e6609f34b5f28`, preserved as `backup/bookkeys-before-card-parity-pass-1-20261115`.

Source-based parity corrections made on the integration branch:
1. Restored production design-token typography for the home hero, reading demonstration and book cards (22 px hero heading, 16 px hero bullets, 17 px demo text, 20 px book title, 15 px author, 17 px page count).
2. Restored production author spacing, right-aligned page count, 8 px progress spacing and 3 px card radius.
3. Restored production page-count formatting, including thousands separators, singular/plural and title-case labels.
4. Restored two-letter generated cover placeholders for books without artwork.
5. Restored the original distinct empty-state messages for Recent and ordinary shelves.
6. Hid the migration-only format badge from the visual card.

Validation at commit `01d4754a7a188bc5716c17a061acab74b3ec70bb`:
- Bookkeys regression suite: passed.
- Legacy preservation tests: passed.
- Persistence tests: passed.
- TypeScript type-check: passed.
- Static export build: passed.
- Chromium browser regressions: pending at checkpoint creation; recheck current PR head check-runs before relying on this.
- The earlier pass-1 verification run was cancelled when pass 2 superseded it; do not describe it as a full pass.
- Workers build result on the prior pass-1 commit: success.

Manual visual acceptance remains unresolved:
- The production URL and isolated preview URL could not be opened by the available browser/search clients in this session.
- No same-viewport screenshots were available, so pixel-level parity has NOT been verified and must not be claimed.
- The original live HTML source was inspected directly from the repository. The hero and demo are present in production too; do not remove them.
- Continue with source-based comparisons only where exact production declarations can be established. For final visual acceptance, compare user-provided screenshots of live and preview at identical viewport dimensions.

Safety:
- Keep PR #232 draft and unmerged.
- Do not deploy to production.
- Preserve all existing backup branches.
- Make a fresh backup before further product-source edits; after a successful build, immediately snapshot that exact commit.


## User-provided visual comparison and CI diagnosis — 15 November 2026, 17:50 IST

The user supplied two actual screenshots in the continuation chat:
- Migration preview screenshot: 1912 × 987 px (first image).
- Production screenshot at `https://limitless.beyondthelimits.workers.dev/tools/typing/`: 1917 × 977 px (second image).
- The captures differ by only 5 px in width and 10 px in height; this small viewport difference cannot explain the major layout/style differences.

Observed visual differences (directly from screenshots):
1. Both show the same illustrated scenic background, but the preview's main library panel is an opaque, large white rectangle occupying most of the left/center viewport; production uses separate translucent hero/demo panels and a translucent shelf/card region.
2. Production header has home control, Chronicle XP/level indicator, settings and appearance controls. Those are absent in the preview screenshot.
3. Production hero heading is large italic serif, within a compact translucent panel on the left. Preview heading is smaller sans-serif inside a large opaque white panel.
4. Production hero has purple buttons, including a prominent Continue Where You Left Off card; preview uses brown/gold controls and has no visible Continue card.
5. Production reading demo is a separate right-side translucent panel with actual imported book text. Preview demo is embedded in the large white panel and shows the generic sample passage.
6. Production shelf is a narrow translucent horizontal strip with three populated book cards visible below. Preview shelf is inside the large white panel and displays an empty state.
7. Production screenshot has a light translucent/illustrated composition; preview panel opacity, dimensions, placement, typography and controls are visibly different.

Important data distinction:
- The production screenshot contains three personal library entries and a resume-reading item. The preview screenshot shows an empty library. Do not copy production user's books, reading progress, IndexedDB or localStorage into preview. This data-state difference is separate from visual parity and must remain isolated.
- Screenshot viewport sizes are close but not pixel-identical. For final pixel comparison, recapture at exactly the same viewport and browser zoom.

Current PR/branch state verified after screenshot receipt:
- PR #232 is OPEN, DRAFT, UNMERGED; head branch `work/bookkeys-clean-main-integration-20261115`; head SHA at audit: `5c5428db2fdb9e11fc7b8f40bacc9b5f44bdda33`; base `main` at `77e7c894ed8629d4494d7e22f2eed6a99af10a74`.
- New immutable safety backup created from that exact PR head: `backup/bookkeys-visual-audit-20261115` → `5c5428db2fdb9e11fc7b8f40bacc9b5f44bdda33`.
- No product source files were changed during this audit. No production deployment or merge was attempted.

CI diagnosis at the PR head:
- Bookkeys Regression Tests run `43709804065` (run #1019): SUCCESS.
- Bookkeys TypeScript Migration run `43709804007` (run #678): FAILURE in the Chromium browser regression step; 27/28 tests passed.
- Earlier steps in the failed migration job passed: legacy preservation, dependency install, persistence tests, TypeScript type-check, static export build and Chromium installation.
- The single browser failure is in `e2e/bookkeys.spec.ts`, test "library supports Recent, moving books between shelves and removing a book from its card". After removing the last book, the test expects legacy text `No books yet`, but the current UI intentionally renders the revised empty-state message `This shelf is empty. Use “Add books” to put books on it.`. This is a stale test assertion, not evidence of a product regression. Update the test expectation to match the current intended empty-state copy; do not revert the UI copy.
- A separate Vercel commit status was FAILURE with target `https://vercel.com/ouroboros9?upgradeToPro=build-rate-limit`. This is a Vercel build-rate-limit status, not proof that the Cloudflare preview deployment failed or that a stale deployment is the cause. Do not conflate these systems.
- The failed browser workflow means the latest head does not have fully green migration CI. Re-run after correcting the stale assertion and inspect the preview-specific deploy workflow independently.

Next actions:
1. Inspect the exact production `tools/typing/bookkeys.html` source and production theme/design-token styles; inspect preview entry point, preview-specific CSS imports and Worker/Pages routing/build workflow.
2. Determine which exact commit and assets the preview URL is serving. The user's screenshot proves the currently viewed preview differs; do not assume stale deployment until deployment metadata or rendered asset evidence establishes it.
3. Compare actual production and preview DOM/CSS structure and computed styles. Prioritize missing production header/hero/demo/shelf/card visual system and purple/light appearance, not isolated card typography.
4. Fix the stale Playwright assertion to match the deliberate empty-state copy. Keep test and product behavior aligned.
5. Before any product-source changes, create a fresh backup from the exact current branch head. After a compiling/tested milestone, immediately create a new backup branch from that exact commit.
6. Run full migration checks, inspect preview deployment result and obtain a new preview screenshot. Do not claim visual acceptance until compared against a same-viewport production screenshot.

Continuation safety:
- Never merge PR #232 or deploy production without explicit user approval.
- Never mutate production user data or import personal library records into the preview.
- Preserve all existing backups, including `backup/bookkeys-visual-audit-20261115`.


## Follow-up source audit and CI test correction — 15 November 2026, 17:55 IST

Source audit:
- The current React source at `tools/typing-next-source/src/app/BookkeysApp.tsx` does render the production-style header, home hero, separate demo, shelf tabs, Add books control and Continue reading button (when a resumable entry exists).
- The current CSS at `tools/typing-next-source/src/app/globals.css` contains explicit production-composition rules for `.bk-shell`, `.bk-library`, `.bk-home-in`, `.bk-home-top`, `.bk-home-hero`, `.bk-home-demo`, `.bk-home-tabrow`, `.bk-header`, `.bk-header-book`, `.bk-home-icon`, and appearance controls. These rules describe a transparent full-width library composition and two-column hero/demo layout, not the large opaque white rectangle shown in the user's preview screenshot.
- Therefore, the screenshot's missing header and production composition is inconsistent with the current checked-in source. A stale preview deployment or a different asset/build being served is now a strong hypothesis. It is NOT yet proven; inspect the deployed HTML/build asset hashes or workflow deployment record before making that claim definitive.
- The preview worker config points to `tools/typing-next-source/deploy`, and `.github/workflows/deploy-bookkeys-preview.yml` builds the Next static export, stages it at `/tools/typing-next-preview/`, and deploys a separate Worker named `limitless-bookkeys-preview`. Its push trigger includes the integration branch and paths under `tools/typing-next-source/**`.
- The web browser/search retrieval clients could not access either Worker URL, so they cannot currently provide deployed DOM or asset hashes.

Test-only correction committed:
- Before editing, a new exact-head backup was created: `backup/bookkeys-before-ci-test-alignment-20261115` → `3970b44aa5809f408d02cadbd19eaa94ddb18158`.
- Updated only `tools/typing-next-source/e2e/bookkeys.spec.ts` to assert the intended current empty-shelf text after deleting the last item: `This shelf is empty. Use “Add books” to put books on it.`
- Test-only commit: `3fb152ebfe0cfc3dadcb6cf64f22ea1f23f16bcc`.
- No product UI, CSS, database, user data, or production files were modified.
- The PR-triggered workflow query did not yet return a run for this commit. The separate Vercel status continues to show `build-rate-limit`; it must not be treated as the Cloudflare preview Worker deployment result.
- The preview deployment workflow is push-triggered, while the available commit-workflow query only returns pull-request-triggered runs. Thus absence from that query does not prove that the preview deploy did not run.

Next:
1. Check the new PR head's CI run and confirm the stale assertion is fixed.
2. Independently verify whether the preview push deployment ran and which commit it deployed; do not infer this from Vercel status.
3. If the preview is stale, redeploy the exact reviewed branch to the isolated preview Worker only, then inspect the resulting page. Do not touch production.
4. Compare preview screenshot again. Only make product CSS/JS changes if the newly deployed exact current source still differs.
5. Before any UI/source change, create a new backup from the exact current PR head; after a successful build, immediately back up that compiled commit.

Current state:
- PR #232 remains draft, open and unmerged.
- The prior exact code+handoff backup `backup/bookkeys-visual-audit-20261115` is preserved.
- The pre-test-alignment exact-head backup `backup/bookkeys-before-ci-test-alignment-20261115` is preserved.
- Test-only commit `3fb152e` is on the PR branch.
- No production deploy or merge has occurred.
