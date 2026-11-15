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
