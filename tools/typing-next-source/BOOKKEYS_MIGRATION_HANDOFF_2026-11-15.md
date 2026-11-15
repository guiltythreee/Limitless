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


## Preview redeployment result — 15 November 2026, 17:57 IST

- The preview deployment workflow was independently queried through the GitHub Actions runs API (the specialized commit-workflow helper only exposes PR-triggered runs).
- Push deployment run `43713633836` for commit `3fb152ebfe0cfc3dadcb6cf64f22ea1f23f16bcc` completed SUCCESS.
- All deployment steps passed: dependency installation, isolated static build, staging under `/tools/typing-next-preview/`, and deploy of the separate `limitless-bookkeys-preview` Worker.
- This successful deployment occurred AFTER the user's screenshots (the screenshots were sent at 12:08:48Z; the preview deployment completed after 12:23Z). Therefore the supplied preview screenshot predates this successful redeployment. This materially supports the stale-preview hypothesis for that screenshot; it does not yet prove the new deployed render is visually correct.
- A second deployment run `43713692832` for the documentation-only current PR head `35ad6adcef9e5d1274c5df3d049cd74861591ab3` was still in progress when checked. The source code in that commit is unchanged from `3fb152e`; the successful deployment at `3fb152e` already includes the test-only assertion correction and all existing UI source.
- New regression test run `43713699526` and migration verification run `43713699416` for current PR head `35ad6ad...` were in progress at the last check; no pass/fail claim yet.
- User should hard-refresh the isolated preview URL after the successful deployment, preferably Ctrl+Shift+R, then inspect the same viewport. Do not clear or overwrite production local data. If it still differs, capture a fresh screenshot and investigate the current deployed HTML/CSS rather than assuming stale output.
- Vercel's separate `build-rate-limit` status remains unrelated to the successful Cloudflare preview Worker deployment.


## User rechecked preview; CSS cascade root cause and targeted fix — 15 November 2026, 18:05 IST

User's new screenshot at 12:30:59Z confirms the preview still showed the large opaque light panel after the first successful redeployment. The previous stale-deployment explanation was not sufficient: the new preview was indeed still visually wrong.

Direct source-level root cause identified:
- `globals.css` contains a legacy higher-specificity light-theme rule at approximately line 161: `html[data-theme="light"] .bk-library { background: #fffdf8; border-color: #d8d0c3; }`
- Later, the full-viewport home composition sets only the lower-specificity `.bk-library { background: transparent; border: 0; border-radius: 0; ... }` around line 916.
- Because `html[data-theme="light"] .bk-library` has greater specificity than `.bk-library`, the legacy light-theme background wins even though it appears earlier in the file. This is why the full-width shelf remains an opaque white panel over the scenic background. This is a confirmed CSS cascade issue, not an inference about cache.
- The JSX does render the two-column `.bk-home-top`, separate `.bk-home-hero` and `.bk-home-demo`, the shelf tab row and the `.bk-header`. The current source therefore contains the expected structural composition; the conflicting legacy theme override was overriding the transparent shelf.
- A narrow CSS-only fix was committed: append an explicit later rule `html[data-theme="light"] .bk-library { background: transparent; border-color: transparent; }` after the legacy styles. No React, data, import, storage, production or unrelated code was changed.
- Fix commit: `45b23fb54769dbc10ffadd1270c76a9208d3d34e`.
- Exact pre-fix backup branch: `backup/bookkeys-before-light-library-cascade-fix-20261115` → `8773331465119039adc9bab43956967ce68f6b35`.
- CI and isolated preview deployment for fix commit were queued/in progress at the time of this handoff update. Do not claim the fix works until a new screenshot is checked.

CI baseline before the CSS fix:
- Current PR head immediately before the CSS fix: `8773331465119039adc9bab43956967ce68f6b35`.
- Bookkeys Regression Tests run `43713746194`: SUCCESS.
- Bookkeys TypeScript Migration run `43713746213`: SUCCESS.
- Isolated preview deployment run `43713737437`: SUCCESS.
- These green checks validate the pre-fix source and test alignment; the CSS fix itself still requires its own CI/build/deploy.

Next actions:
1. Wait for CI and isolated preview deployment for `45b23fb...`.
2. Once build passes, immediately create a backup branch from the exact successful fix commit.
3. Ask user to hard-refresh the preview and inspect the new render. Compare the outer shelf transparency, two-column hero/demo and header against production at the same viewport.
4. If header still does not appear, inspect its actual rendered DOM and computed styles separately; the CSS cascade fix above specifically addresses the confirmed opaque library panel and must not be misrepresented as having fixed every visual difference.
5. Continue only from screenshot evidence; no speculative redesign, no production deploy, no merge.


## CSS cascade fix build/deploy checkpoint — 15 November 2026, 18:09 IST

- CSS fix commit `45b23fb54769dbc10ffadd1270c76a9208d3d34e` built successfully and was deployed to the isolated Cloudflare preview Worker.
- Deploy workflow run `43714388530`: SUCCESS. Dependency install, static build, base-path staging and Cloudflare Worker deployment all completed.
- Regression suite run `43714392712` for the CSS-fix commit: SUCCESS.
- The migration verification run for the CSS-fix commit `43714392701` was cancelled by a subsequent documentation-only push; a replacement full verification run `43714426696` for documentation commit `3d7a5ad2d460fa1481bef4be75bf518f67b3b846` is running. At last check, legacy preservation, dependency install, persistence tests and TypeScript type-check all passed; static export was running; Chromium/browser tests remain pending. Do not claim full migration verification until the run finishes.
- New exact successful build/deploy backup created: `backup/bookkeys-light-library-fix-built-20261115` → `45b23fb54769dbc10ffadd1270c76a9208d3d34e`.
- The latest docs commit `3d7a5ad...` contains the same CSS source plus this handoff update; it does not alter product source. A follow-on preview deployment for the docs commit may run separately.
- User should now hard-refresh the preview URL and recheck. The specific light-theme cascade defect is fixed in the deployed commit; verify the rendered screenshot before asserting visual parity. Header visibility remains a separate screenshot-level check if still absent.


## All-green verification and next visual checkpoint — 15 November 2026, 20:45 IST

Current PR head:
- `0742a941966271f012fc077e139c28357a3d252e`
- PR #232 remains OPEN, DRAFT, UNMERGED; mergeable=true.
- Full migration verification run `43714529639`: SUCCESS. All steps passed: legacy preservation, dependency install, persistence tests, TypeScript type-check, static export build, Chromium install and browser regressions.
- Bookkeys regression run `43714529698`: SUCCESS.
- Isolated Cloudflare preview deployment run `43714525113`: SUCCESS. All steps including static build, base-path staging and Worker deployment passed.
- New immutable branch created at exact current all-green PR/handoff head: `backup/bookkeys-all-green-handoff-20261115` → `0742a941966271f012fc077e139c28357a3d252e`.
- Existing exact product-source build backup remains: `backup/bookkeys-light-library-fix-built-20261115` → `45b23fb54769dbc10ffadd1270c76a9208d3d34e`.
- The PR branch's latest changes after the product CSS fix are documentation-only.

Remaining visual acceptance:
- The latest successful deployment includes the CSS cascade override for `html[data-theme="light"] .bk-library`, making the library container transparent after the legacy light-theme rule.
- User has NOT yet supplied a screenshot taken after this latest successful deployment. Their prior screenshot showing the opaque white rectangle predates the CSS fix deployment and therefore cannot validate or invalidate the new CSS.
- JSX source includes a `.bk-header` with home, text-size, Archive, settings and appearance controls, plus separate hero and demo markup. The old screenshot showed no header; current rendered header visibility is not yet confirmed. Existing Playwright tests do not assert the full home header/hero visual composition.
- The live production shell's visible header is not identical to the current migrated JSX header (production screenshot shows home, Chronicle Lv 1, settings and theme control). Do not assume merely showing a header is sufficient; compare exact visible controls and geometry against production.
- The actual production page at `tools/typing/index.html` wraps the legacy `bookkeys.html` in a full-screen iframe and syncs site theme/artwork into it. This is useful architectural context for parity work.
- Browser web retrieval could not access the Cloudflare Worker URL; do not claim direct remote DOM inspection.
- Next step is to ask user to hard-refresh the currently deployed preview and provide a screenshot at the same viewport as production. Then compare actual header, hero/demo positions, transparent shelf, card grid and artwork. Only then decide whether a separate header/layout implementation change is necessary.
- Do not make another speculative CSS change before this screenshot. No production merge/deploy and no data migration/copy.


## Home-header visual regression coverage — 15 November 2026, 21:28 IST

- Created exact pre-change backup branch: `backup/bookkeys-before-home-header-e2e-20261115` → `8f157133a35f6dcfd2adf1fc2e9b64357354c7ad`.
- Added one focused Playwright test to `tools/typing-next-source/e2e/bookkeys.spec.ts` in commit `edf7ae239f8dbf9fb1a9f94592d670dc7191ad36`.
- The new test checks that the home header, home icon, settings button, appearance-mode button, hero, demo text and shelf tab row are all visible, and that the shelf's computed background is transparent.
- Regression workflow `43732650658`: SUCCESS, including the new test.
- Isolated preview deploy workflow `43732645821`: SUCCESS. Exact commit `edf7ae2` is deployed to the preview Worker.
- Static export build, TypeScript type-check and legacy/persistence verification steps in full migration workflow `43732650685` all passed. Chromium installation passed; browser regression step was still running at the time of this note. Do not yet claim the full migration workflow has passed.
- Exact built/deployed commit backup: `backup/bookkeys-header-e2e-built-20261115` → `edf7ae239f8dbf9fb1a9f94592d670dc7191ad36`.
- The new test establishes that the intended header and home composition render in Playwright's browser environment; it does not prove the user's manually opened Worker tab is displaying the same deployed bundle. User has not yet supplied a screenshot captured after this latest deploy.
- Next: confirm workflow `43732650685` finishes successfully; then ask user to hard-refresh the preview and capture the latest page. If the screenshot still omits the header despite the passing browser test, investigate deployed Worker/browser asset mismatch (request caching, stale tab, route fallback, wrong origin/build) rather than changing CSS blindly.
- No product UI code changed in this step; only E2E coverage was added. PR #232 remains draft and unmerged. Production remains untouched.


## Full migration verification and preview deployment — 16 November 2026

Exact verified PR head:
- `de3234804671993982cad988541dca38ae1a1917`.
- PR #232 remains OPEN, DRAFT and UNMERGED.
- The PR contains 53 commits at this checkpoint (the original 52 plus the test-only readiness correction).
- New immutable exact-head backup created before this handoff update: `backup/bookkeys-full-verification-green-20261115` → `de3234804671993982cad988541dca38ae1a1917`.
- The earlier pre-correction backup `backup/bookkeys-before-continue-reading-test-fix-20261115` remains preserved at `e942e3175911f1eb2325a1bf5f69013e72899552`.
- The current PR head's migration verification workflow `43746699699` completed SUCCESS. The job log explicitly reports 29 browser tests passed in 56.9 seconds. This includes the home composition/header test, EPUB/PDF/TXT import and reload flows, progress and rewards, IndexedDB v1 compatibility, chapter edits, IME composition, mobile viewport, appearance settings and backup/restore coverage.
- The separate Bookkeys Regression Tests workflow `43746699730` completed SUCCESS.
- The isolated Cloudflare preview deployment workflow `43746694529` completed SUCCESS, including dependency installation, static export build, base-path staging and deployment of the separate `limitless-bookkeys-preview` Worker.
- The full verification job also passed legacy preservation tests, persistence tests, TypeScript type-check, static export build and Chromium installation before the 29/29 browser suite passed.

Important remaining qualifications:
- The successful browser suite proves the tested source works in the CI browser; it does NOT prove pixel-level visual parity with the live production page.
- No user screenshot captured after deployment of `de3234804671993982cad988541dca38ae1a1917` has been reviewed. Keep visual acceptance marked UNACCEPTED until the preview is compared with production at the same viewport and zoom.
- The preview deployment is isolated. No production Worker deployment, production data copy, or merge occurred.
- The combined GitHub commit status still shows a separate Vercel context failure with `build-rate-limit` as its description. The three GitHub Actions workflows listed above are successful; do not conflate the Vercel status with the successful Cloudflare preview deployment.
- `main` has advanced since the PR base snapshot. At the latest comparison, the integration branch is 53 commits ahead and 21 behind `main`, with merge base `77e7c894ed8629d4494d7e22f2eed6a99af10a74`. This divergence must be reviewed before any future integration; do not merge automatically.

Next actions:
1. Ask the user to hard-refresh the deployed isolated preview at https://limitless-bookkeys-preview.beyondthelimits.workers.dev/tools/typing-next-preview/ and compare it with https://limitless.beyondthelimits.workers.dev/tools/typing/bookkeys.html at matching viewport dimensions and browser zoom.
2. If the preview still differs, use fresh screenshots and exact production source comparisons to identify the specific discrepancy. Do not make speculative CSS changes.
3. Separately inspect the 21 commits now on `main` but not in this branch, identifying overlap with Bookkeys files before proposing any rebase or merge. Keep PR #232 draft and unmerged until the user explicitly approves integration.
4. Preserve the existing backup branches and do not deploy production.
