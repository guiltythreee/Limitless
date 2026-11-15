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
- Current branch head at handoff: `c394321e12eceda41f4b8a9725bd896c98abefa5`
- Current base recorded by PR: `main` at `77e7c894ed8629d4494d7e22f2eed6a99af10a74`
- Immutable handoff snapshot branch created before this document: `backup/bookkeys-visual-parity-handoff-20261115`, pointing to `c394321e12eceda41f4b8a9725bd896c98abefa5`.
- Earlier recovery point: `backup/bookkeys-clean-main-before-visual-acceptance-20261115`, pointing to `25ffa59b738ae93bc2217b9a1b51056e33304a5f`.

## Preview and production reference
- Isolated preview URL: https://limitless-bookkeys-preview.beyondthelimits.workers.dev/tools/typing-next-preview/
- Production reference URL: https://limitless.beyondthelimits.workers.dev/tools/typing/bookkeys.html
- User explicitly reports that the preview still does **not** match the live page. Treat visual parity as failed / unaccepted.
- The model has not completed a true side-by-side browser screenshot comparison. Previous attempts to access the preview from the container failed at DNS resolution. A successful build or passing automated tests is not evidence of visual parity.
- Do not claim that the page looks identical. The next step is to obtain actual rendered screenshots of both URLs at the same viewport and compare the original library/shelf layout, typography, spacing, controls, background/artwork and responsive behavior. If browser access is unavailable, ask the user for a screenshot of the preview and live page rather than guessing.

## Validation at current head
At `c394321e12eceda41f4b8a9725bd896c98abefa5`, GitHub check-runs reported:
- `test`: success.
- `verify`: success.
- `deploy`: success (isolated preview build/deploy workflow; this is not permission to deploy production).
- Cloudflare Workers build check: success.
The earlier run `43706731417` was cancelled because a newer verification run superseded it; use the successful checks on the current head above.
The latest commit at handoff is `test(bookkeys): wait for local library before batch import`; it adds a storage-ready wait to the multi-EPUB browser test.

## Known testing and implementation notes
- A previous browser run at commit `25ffa59b738ae93bc2217b9a1b51056e33304a5f` had 27/28 browser tests passing. The sole failure was a test clicking the card's Remove action without hovering the card first; that test was corrected in a later commit.
- Card actions are intentionally hidden until hover/focus (`.bk-book-card-actions` in `tools/typing-next-source/globals.css`). Tests must hover/focus before using them; do not change intended product behavior just to satisfy a test.
- `bgMatch` setting and its UI exist in `BookkeysApp.tsx`; a previous rerun passed that setting test.
- The previous progress-counter test was asserting a legacy library stat element that was not part of the current library UI; it was adjusted to validate the persisted page counter instead.
- `tools/typing-next-source/FEATURE_PARITY_MATRIX.md` records catalog/settings parity (including palettes, backgrounds, effects, fonts and tabs), but it is an audit document, not proof of rendered visual parity.
- High-risk acceptance still includes representative PDF/EPUB/TXT flows, populated IndexedDB v1 and backup/restore behavior, IME/mobile keyboard behavior, offline/CSP/storage/quota behavior, and true visual comparison. Do not treat fixtures alone as real-user data validation.

## Next actions
1. Keep PR #232 draft and unmerged.
2. Capture same-viewport screenshots of live and preview, and identify concrete pixel/layout differences before changing code.
3. Compare against the known-good original Bookkeys UI/assets and the existing preserved backup branches. Recover the exact known-good visual implementation rather than recreating it from memory.
4. Make one narrowly scoped visual correction at a time; run typecheck/build/browser tests after each change.
5. After a compiling, tested milestone, create a new backup branch immediately and update this handoff document with the new SHA and evidence.
6. Only discuss merge/cutover after user approval and after visual plus functional acceptance.

## Continuation instruction for a new chat
Start by reading this file and checking the current PR #232 head and check-runs. Do not ask the user to restate the safety rules or project context. The user's latest explicit correction is that the preview still differs from live; preserving the near-identical original visuals is the priority.
