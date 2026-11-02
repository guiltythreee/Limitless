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
