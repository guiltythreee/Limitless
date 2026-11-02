# Bookkeys persistence inventory — source-level pass

Date: 2026-11-02
Repository: `guiltythreee/Limitless`
Source file: `tools/typing/bookkeys.html`
Source blob: `310da8014c6c1ca9c80a75bce89b4ff1b2aa1e28`
Working branch: `work/bookkeys-node-migration-20261102`

This inventory is read-only analysis of the preserved production source. No application code or stored data formats were changed.

## 1. Settings object

The settings object is stored as JSON in localStorage key `bookkeys:settings`. The source defines 34 supported settings in `DEF`; initialization copies each saved field when present and otherwise uses the corresponding default. Unknown saved fields are not copied into the active `ST` object. Backup import only accepts fields present in `DEF` whose JavaScript type matches the default, and rejects non-finite numbers.

| Field | Default | Type / notes |
|---|---:|---|
| `skin` | `"auto"` | string |
| `accent` | `"theme"` | string |
| `accentCustom` | `"#E11D48"` | string |
| `fontColor` | `"theme"` | string |
| `fontColorCustom` | `"#FF8A00"` | string |
| `bgMatch` | `true` | boolean |
| `bg` | `"pic-morning"` | string |
| `bgDensity` | `1` | number |
| `bgAnim` | `!prefers-reduced-motion` | boolean, derived from OS reduced-motion preference at initialization |
| `backdrop` | `0` | number |
| `picVeil` | `0` | number |
| `picBlur` | `0` | number |
| `font` | `"newsreader"` | string |
| `size` | `20` | number; legacy `bookkeys:size` is read only if this field is absent and the legacy value is 14–34 |
| `lineH` | `1.7` | number |
| `spacing` | `0` | number |
| `tfx` | `"none"` | string |
| `fxInt` | `1` | number |
| `efx` | `"flash"` | string |
| `sparks` | `"off"` | string |
| `sound` | `"off"` | string |
| `volume` | `50` | number |
| `errSound` | `true` | boolean |
| `centered` | `false` | boolean |
| `celebrate` | `true` | boolean |
| `cstyle` | `"block"` | string |
| `cblink` | `"blink"` | string |
| `csmooth` | `true` | boolean |
| `cglow` | `false` | boolean |
| `ccolor` | `"accent"` | string |
| `lglow` | `true` | boolean |
| `motion` | `"system"` | string |
| `punct` | `"simplify"` | string |
| `deco` | `"on"` | string |

Settings are edited live while the panel is open but are committed on Save. `commitST()` writes the serialized full settings object. Save/discard and save-failure retry flows must be retained. The one-time background migrations use `bookkeys:bgdef1` and `bookkeys:bgdef2`; they adjust the old `bg`, `bgMatch`, and `picVeil` values and must not be replayed incorrectly during migration.

## 2. IndexedDB schema

Database: `bookkeys-lib`, version: `1`.

| Store | Key definition | Indexes | Values |
|---|---|---|---|
| `meta` | `keyPath: "id"` | none created | Library-book metadata objects |
| `files` | out-of-line key | none created | Original PDF/EPUB `Blob` values and custom-artwork data URL strings |

The upgrade handler creates both stores only when the database is first created at version 1. There is no application-defined upgrade path beyond this initial schema. Do not increment the version or alter stores as part of extraction without a separate tested migration.

### Library metadata fields

The PDF and EPUB import paths construct these fields:

| Field | PDF | EPUB | Meaning |
|---|---|---|---|
| `id` | yes | yes | Generated library identifier; also the key used in `files` |
| `shelf` | yes | yes | Current shelf id; imports from Recent are assigned to `main` |
| `name` | yes | yes | Display/book name derived from imported filename |
| `size` | yes | yes | Original file size in bytes |
| `pages` | yes | yes | PDF page count or EPUB normalized section count |
| `added` | yes | yes | Import timestamp in milliseconds |
| `fp` | yes | yes | Content fingerprint used for duplicate detection |
| `cover` | yes | yes | Cover data URL; PDF cover may be generated later |
| `author` | yes | yes | Author metadata when available; may be empty/absent |
| `fmt` | absent | `"epub"` | EPUB format discriminator; PDF is the legacy/default format |
| `opened` | later | later | Last-opened timestamp in milliseconds, added when a saved book is opened |

The metadata is intentionally extensible: fields are added to the object and written with `put`. Preserve unknown metadata fields when reading and writing existing records.

### Store keys beyond library files

The `files` store also contains:
- `art:gothic` — custom Gothic theme artwork data URL.
- `art:garden` — custom Garden theme artwork data URL.

These values are strings (JPEG data URLs produced by the app's image resize/compression flow), not uploaded assets.

## 3. Transaction and operation boundaries

The current DB wrapper uses a Promise around one IndexedDB transaction. It resolves on `transaction.oncomplete` and rejects on `onerror` or `onabort`.

| Operation | Stores | Mode | Behaviour |
|---|---|---|---|
| List library | `meta` | readonly | `getAll()` |
| Read file | `files` | readonly | `get(id)` |
| Save artwork | `files` | readwrite | `put(dataUrl, "art:" + themeId)` |
| Delete artwork | `files` | readwrite | `delete("art:" + themeId)` |
| Add library book | `meta`, `files` | readwrite | Put metadata and original Blob in one transaction |
| Update metadata | `meta` | readwrite | Put metadata object |
| Delete library book | `meta`, `files` | readwrite | Delete metadata and Blob in one transaction |

The library's metadata and original file are deliberately added/deleted atomically. Do not split these operations into separate transactions.

## 4. localStorage and backup compatibility

The app wraps localStorage reads/writes in `load(key)` and `store(key, value)`; write failures display a save warning. Preserve the existing key namespace and all key families:

- `bookkeys:settings`, `bookkeys:size`, `bookkeys:game`, `bookkeys:shelves`
- `bookkeys:<book-key>`, `bookkeys:lib:<library-id>`
- `bookkeys:chap:<book-key>`, `bookkeys:chap:lib:<library-id>`
- `bookkeys:draft:<book-key>:<page-index>`
- `bookkeys:bgdef1`, `bookkeys:bgdef2`

The v1 backup export includes every localStorage key beginning `bookkeys:`, but does not include IndexedDB blobs or custom artwork. Import validates `app === "bookkeys"` and `v === 1`, merges rather than replacing, preserves existing generic keys, and uses specialized merge logic for game/settings/shelves/chapter records. Any migration/export enhancement must remain able to import existing v1 backups without deleting local data.

The site-wide theme key `limitless.site.theme` is a separate shell/session concern and is not part of the Bookkeys backup namespace.

## 5. Remaining work after this inventory

- Map every settings field to its exact UI control and allowed option/range constraints.
- Trace all localStorage key call sites, including draft trimming and page-position writes.
- Verify shelf object shape and chapter/draft schemas against all read/write paths.
- Run the current main-branch test suite on this working branch; the earlier 91-pass result remains historical until rerun.
- Complete real-browser verification of IndexedDB, artwork, PDF/EPUB import, offline resources, iframe CSP and shared theme behaviour.

No migration code should be extracted until those remaining checks are complete.


## 6. Settings UI control mapping

The 34 settings are exposed through six settings tabs. The settings UI is built dynamically; the control helpers write the same \`ST\` object and call the existing save/apply routines. This mapping must be reproduced without changing labels, choices, ranges or behaviour.

| Tab | Setting | Visible control | Options / range |
|---|---|---|---|
| Theme | \`bgMatch\` | Toggle | on/off |
| Theme | \`skin\` | Theme tiles | \`THEMES\` catalogue (includes Auto, Gothic Night, Letter Garden, Paper, Sepia, Contrast and other source-defined themes) |
| Theme | \`accent\` | Swatches | \`ACC\` catalogue plus Custom |
| Theme | \`accentCustom\` | Native color picker | six-digit hex color; also sets \`accent = "custom"\` |
| Theme | \`deco\` | Chips | On / Off |
| Background | \`bg\` | Background tiles | \`BGS\` catalogue |
| Background | \`bgDensity\` | Range | 0.3–2, step 0.1 |
| Background | \`backdrop\` | Range | 0–100, step 5 (%) |
| Background | \`picVeil\` | Range | 0–90, step 5 (%) |
| Background | \`picBlur\` | Range | 0–12, step 1 (px) |
| Background | \`bgAnim\` | Toggle | on/off |
| Background | \`bgMatch\` | Toggle | on/off; appears in both Theme and Background tabs |
| Font | \`font\` | Typeface tiles | \`FONTS\` catalogue |
| Font | \`fontColor\` | Swatches | \`FCOLS\` catalogue plus Custom |
| Font | \`fontColorCustom\` | Native color picker | six-digit hex color; also sets \`fontColor = "custom"\` |
| Font | \`size\` | Range | 14–34, step 1 (px) |
| Font | \`lineH\` | Range | 1.3–2.4, step 0.05 |
| Font | \`spacing\` | Range | 0–0.15, step 0.01 (em) |
| Font | \`punct\` | Chips | Plain keys / As printed |
| Font | \`lglow\` | Toggle | on/off |
| Typing | \`motion\` | Chips | Follow system / Reduce / Full |
| Typing | \`tfx\` | Chips | None, Glow, Rise, Fade in, Flash, Crunch, Explode, Fireworks, Shatter, Sparkle, Burn, Float, Shock, Ink corrupt, Pixelate, Embers |
| Typing | \`fxInt\` | Range | 0.4–2, step 0.1 |
| Typing | \`efx\` | Chips | Off / Red flash / Shake |
| Typing | \`sparks\` | Chips | Off / Sparks / Ripple |
| Typing | \`sound\` | Chips | Off / Click / Soft / Typewriter |
| Typing | \`volume\` | Range | 0–100, step 5 (%) |
| Typing | \`errSound\` | Toggle | on/off |
| Typing | \`centered\` | Toggle | on/off |
| Typing | \`celebrate\` | Toggle | on/off |
| Cursor | \`cstyle\` | Chips | Block / Bar / Underline / Outline |
| Cursor | \`cblink\` | Chips | Steady / Blink / Pulse |
| Cursor | \`csmooth\` | Toggle | on/off |
| Cursor | \`cglow\` | Toggle | on/off |
| Cursor | \`ccolor\` | Swatches | \`CARETS\` catalogue |
| Data | — | Backup controls | Download backup / Merge a backup; not a setting field |

The UI also exposes two custom-artwork upload controls, one each for Gothic Night and Letter Garden. These are not settings fields: their JPEG data URLs are stored in IndexedDB \`files\` under \`art:gothic\` and \`art:garden\`. The UI resizes artwork to at most 1600×900 and encodes JPEG at quality 0.78 before saving.

The source defines the swatch/tile catalogues (\`THEMES\`, \`ACC\`, \`BGS\`, \`FONTS\`, \`FCOLS\`, \`CARETS\`) separately from the settings defaults. A later UI port must carry the full catalogues, not replace them with a smaller set of guessed options.

## 7. Updated inventory status

Completed in this source-level pass:
- All 34 settings keys, defaults and primitive types.
- UI control type and ranges/options for each setting.
- IndexedDB database version, store definitions, keys, absence of indexes, metadata fields and transaction boundaries.
- Local-only artwork storage and current v1 backup boundary.

Still open:
- Enumerate the full option catalogues and every UI label/conditional visibility rule.
- Trace every localStorage key read/write, including draft trimming and page-position writes.
- Verify shelf object, chapter segmentation and draft record schemas from all read/write paths.
- Run the current suite on this fresh branch and complete the real-browser baseline.
