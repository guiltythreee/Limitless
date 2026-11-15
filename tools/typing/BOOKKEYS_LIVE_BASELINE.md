# Bookkeys live production baseline — initial browser pass

Date: 2026-11-02
URL: https://limitless.beyondthelimits.workers.dev/tools/typing/
Deployment: Cloudflare Workers static assets
Branch under migration: `work/bookkeys-node-migration-20261102`

## Verified observations

A read-only browser session loaded the production route and inspected the rendered shell and reader.

- The route loaded successfully.
- The same-origin iframe loaded `/tools/typing/bookkeys.html` and rendered the Bookkeys application.
- The Home/library screen rendered with the Bookkeys intro, sample-text action, Open book action, Library and Recent tabs, Add books control, shelf management and the sample chapter preview.
- No visible blank frame, loading failure, or runtime error was observed during this initial page-load pass.
- No book was imported, uploaded, deleted or modified. No user data or preferences were changed.

## Important theme-control distinction

The browser showed the in-app mode control with the label **“Mode: Morning. Switch to Evening.”** Source inspection confirms that `modeBtn` cycles the Bookkeys scene backgrounds (Night, Morning, Evening); it is not the site-wide dark/light theme control.

The outer shell's `.navbar` is currently hidden by `tools/typing/index.html` CSS. Therefore the shell's site-wide theme toggle is not visible in the current Bookkeys route, even though the shell code reads `limitless.site.theme` and synchronizes that theme into the same-origin iframe.

This is a real-browser UX gap to resolve as part of the migration/cutover design: retain a visible, correctly labelled site-wide dark/light control without confusing it with Bookkeys' existing Morning/Evening/Night scene control. Do not change it in the migration baseline checkpoint.

## Not yet verified

This first browser pass did not test:
- Importing real PDF/EPUB files.
- IndexedDB add/open/delete and persistence after reload.
- Custom artwork persistence.
- Backup export/import and restoration on another browser.
- Offline operation and worker loading after disconnecting the network.
- Actual browser Back/Forward gestures on physical touch/trackpad hardware.
- The functional effect of the hidden shell theme toggle on the iframe.

These remain required parity gates. The first pass only establishes that the live route, same-origin iframe and initial Home/library UI render successfully.
