# Bookkeys real-browser regression baseline

Date: 2026-11-02
Repository: `guiltythreee/Limitless`
Working branch: `work/bookkeys-node-migration-20261102`
Environment: production Bookkeys route, manually tested by the user

## Results

| Check | Result | Notes |
|---|---|---|
| Home/library screen loads | PASS | Production route and iframe render |
| Import and open a small PDF | PASS | Actual PDF import/open tested |
| Import EPUB and display chapters | PASS | Actual EPUB import and chapter display tested |
| Imported library survives a page reload | NOT TESTED | Explicit remaining persistence gate |
| Open a book, type, refresh and resume progress | PASS | User confirmed typing progress resumed |
| Export backup downloads | PASS | Backup download confirmed |
| Site-wide light/dark theme and Morning/Evening/Night scene backgrounds coexist | PASS | Both controls behaved without breaking one another |

## Interpretation

- Basic production route, PDF/EPUB import, chapter display, typing resume, backup export and theme coexistence have passed manual checks.
- Typing progress resuming after refresh is evidence that the tested book's reading/typing state persisted.
- It does **not** independently prove that an imported PDF/EPUB's original Blob and library metadata survive a reload and can be reopened from the Home/library screen.
- Therefore IndexedDB library persistence remains unverified until the imported book is still listed after a full page reload and opens successfully.

## Remaining browser gate

1. Import a small PDF or EPUB.
2. Return to Home/library.
3. Perform a full page reload.
4. Confirm the imported book is still listed.
5. Open it and confirm the original file can still be read.

Do not clear site data, delete books, or modify production data as part of this check.

## Migration decision

The manual checks support proceeding with isolated, non-production preparation and TypeScript project scaffolding. Do not cut over the active route or claim full feature parity until the IndexedDB reload/reopen check and remaining offline/CSP/browser-navigation checks are complete. The original `tools/typing/bookkeys.html` implementation remains the production source and rollback.
