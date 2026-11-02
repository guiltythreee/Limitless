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
| Imported library survives a page reload | PASS | User confirmed the imported book remained available after a full page reload |
| Open a book, type, refresh and resume progress | PASS | User confirmed typing progress resumed |
| Export backup downloads | PASS | Backup download confirmed |
| Site-wide light/dark theme and Morning/Evening/Night scene backgrounds coexist | PASS | Both controls behaved without breaking one another |
| Delete an imported library book | PASS | User confirmed deletion works |

## Interpretation

- Basic production route, PDF/EPUB import, chapter display, typing resume, backup export and theme coexistence have passed manual checks.
- Typing progress resuming after refresh is evidence that the tested book's reading/typing state persisted.
- It does **not** independently prove that an imported PDF/EPUB's original Blob and library metadata survive a reload and can be reopened from the Home/library screen.
- The user has confirmed the imported book remains available after a full page reload and that deleting an imported library book works. These close the basic IndexedDB reload/reopen and delete gates for the tested browser. Repeat reload/reopen with both PDF and EPUB during full parity verification, and separately test artwork persistence.

## Remaining browser gate

Completed by user: import a book, return to Home/library, perform a full page reload, confirm the book remains listed and reopen it successfully.

Remaining browser gates:
1. Repeat the reload/reopen check for both PDF and EPUB formats if only one format was used for the confirmed test.
2. Verify backup restore/merge in a safe test profile.
3. Verify offline assets, iframe CSP, browser Back/Forward and custom artwork persistence.

Do not clear site data, delete books, or modify production data as part of this check.

## Migration decision

The manual checks support proceeding with isolated, non-production TypeScript project scaffolding and preparation for subsystem extraction. The tested book's reload/reopen check passes. Do not cut over the active route or claim full feature parity until deletion, backup restore/merge, offline/CSP/browser-navigation and custom-artwork checks are complete. The original `tools/typing/bookkeys.html` implementation remains the production source and rollback.
