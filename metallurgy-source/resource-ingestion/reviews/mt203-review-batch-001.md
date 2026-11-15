# MT203 source review — batch 001

- Source: `MT203 – PST 2026(1).pdf`
- Source SHA-256: `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`
- Source pages use PDF page numbering (1–212).
- Mapping: MT203 / Polymer Science and Technology. The PDF metadata title contains the legacy label MT255; do not change the course mapping.
- Status: **review queue only**. No records in this batch are approved, corrected, rejected, or applied.

> Review rule: use the original page image as the authority. Extracted text is a locator, not a scientifically validated transcription. Keep question generation and course-bank changes out of this stage.

## Batch overview

| PDF page | Review target | Records | Primary risk |
|---:|---|---:|---|
| 36 | Molecular-weight equations | 9 | equation OCR / notation |
| 102 | Silicone-based TPU reaction scheme | 8 | chemical structures / formula OCR |
| 154 | Permeability data table | 5 | multi-column table / numeric OCR |
| 178 | Single-screw extruder diagram | 10 | diagram labels / spatial relationships |
| 212 | Polymer recycling symbols | 8 | symbol labels / polymer names |

## Page 36 — Molecular-weight equations

The source preview clearly shows number-average (Mn), weight-average (Mw), and z-average (Mz) molecular-weight equations plus definitions of n, w and M. The extracted equation fragments split across blocks and contain damaged summation symbols/subscripts. Transcribe only from the page image; preserve each equation and the source notation. Do not infer missing terms from memory.

**Records in scope:**
- `src-83bcbea4d4853475` — `equation` / `equation` / `exception`: `Mn=`
- `src-43e0a4a967f3f8d3` — `equation` / `equation` / `exception`: ` niMi =  wi`
- `src-cf29300bc53f9d3f` — `equation` / `equation` / `exception`: `Mw=`
- `src-21d0403e70bf8723` — `equation` / `equation` / `exception`: `=`
- `src-4636f56ebd1263c8` — `equation` / `equation` / `exception`: `Mz=`
- `src-9fac3a4918eed099` — `equation` / `equation` / `exception`: `=`
- `src-3ddca9d734d53b25` — `equation` / `equation` / `exception`: `n=      Moles of molecules (n1 + n2 + n3 + ----------ni) i.e. weight`
- `src-65d2e52482d0ae4d` — `equation` / `equation` / `exception`: `w=       Weight of individual molecules (w1 + w2 + w3 + ---------wi)`
- `src-65f71eac6ba4a851` — `equation` / `equation` / `exception`: `M=       Molecular weight of each molecules`

**Reviewer outcome:** leave pending until the source page has been checked. If approved/corrected, choose the destination using the existing MT203 course structure; do not invent a new chapter or topic. If the record is only a diagram/table fragment, retain it as an illustration/reference rather than forcing it into prose.


## Page 102 — Silicone-based TPU reaction scheme

This page is a reaction-scheme slide. The OCR exception is justified: chemical structures, subscripts and polymer repeat-unit notation are not reliably represented in extracted text. Review the whole scheme visually; do not treat OCR fragments as usable prose or reconstruct chemical structures from OCR.

**Records in scope:**
- `src-87704e72c87ae2c2` — `heading` / `unknown` / `exception`: `Silicone based TPU`
- `src-3f467301f8e5589d` — `paragraph` / `explanation` / `exception`: `oon) {neo + HO—(CH2)4—[O(CH»)4. OH +`
- `src-ec5f6f961e60511d` — `heading` / `unknown` / `exception`: `H;oMDI`
- `src-fabc1ed446096ec7` — `heading` / `unknown` / `exception`: `HO—(CHz)-O—(CHz)s—($i—O)ySi— (CH) O— (CHa) OH + HO—(CH),-OH`
- `src-86495464bd7b0a13` — `heading` / `unknown` / `exception`: `PDMS 1,4-BD`
- `src-9a304c87602d8ca8` — `paragraph` / `explanation` / `exception`: `nro T-12`
- `src-b1e394a264bccd50` — `paragraph` / `explanation` / `exception`: `ww ey( 0 “Oe C—O—(CH»})-O—(CH)3— go Yn as “\|`
- `src-4343ee0e0704dd4c` — `paragraph` / `explanation` / `exception`: `ons —c—o— (Heke 1016 —0-C— Oe Ons é aw t O—(CH>)4-O— 6 ou( 0 Oe C-Ow`

**Reviewer outcome:** leave pending until the source page has been checked. If approved/corrected, choose the destination using the existing MT203 course structure; do not invent a new chapter or topic. If the record is only a diagram/table fragment, retain it as an illustration/reference rather than forcing it into prose.


## Page 154 — Permeability data table

The source page contains Table 4.5, “Permeability in polymers at 25°C”. OCR has flattened multiple columns and corrupted chemical subscripts and decimal values. Treat the table as a single visual reference until every header, unit, polymer, permeant and numeric cell has been checked against the page image. Do not use OCR values directly.

**Records in scope:**
- `src-189b3dce54245817` — `heading` / `unknown` / `routine`: `Permeability Data`
- `src-5572ecc255d7d7e1` — `paragraph` / `table` / `exception`: `Table 4.5 Permeability in polymers at 25°C (70)`
- `src-0ab282746fcf703f` — `heading` / `unknown` / `routine`: `Polymer Permeant P x10” Py x 10° AE`
- `src-24c1101f2c6d8d40` — `paragraph` / `table` / `exception`: `Polyethylene (LDPE) O, 22. 66.5 42.7 N; 0.73 329 49.9 CO, 9.5 62 38.9 H,0 68 48.8 bof cis-1,4-Polybutadiene N, 14.4 0.078 Ble He 24.5 0.0855 20.3 Poly(ethyl methacrylate) O, 0.889 Dik 36.4 CO, 3.79 0.435 28.9 Poly(ethyle`
- `src-cd1d59be64405683` — `heading` / `unknown` / `routine`: `Cellulose H,0 18900 — _`

**Reviewer outcome:** leave pending until the source page has been checked. If approved/corrected, choose the destination using the existing MT203 course structure; do not invent a new chapter or topic. If the record is only a diagram/table fragment, retain it as an illustration/reference rather than forcing it into prose.


## Page 178 — Single-screw extruder diagram

The source page is a labelled equipment diagram. OCR recovered some labels but also produced fragments and incorrect word boundaries. Review labels and their arrows/positions from the page image; preserve diagram relationships. Keep the diagram as an illustration/reference rather than converting isolated OCR labels into standalone theory paragraphs.

**Records in scope:**
- `src-85dd712204f7b9ba` — `heading` / `unknown` / `exception`: `Single screw extruder`
- `src-7becc8999291953b` — `paragraph` / `explanation` / `exception`: `, EE ae ——SCREW BREAKER PLATE \wopper / r / eran ¥2 oe COOLING system————._ / cScREEN / f — HE ATI \ / \ gearing / \| eel ae \| \ _-PRESSURE CONTROL a \| o Rp : ” VALVE`
- `src-799f48d9056afdb7` — `heading` / `unknown` / `exception`: `SPEED VARIATOR’`
- `src-e6e54d61e01e4aa1` — `heading` / `unknown` / `exception`: `GEAR BOX`
- `src-1f8cca0f4dc03b8a` — `paragraph` / `explanation` / `exception`: `— TO DIE & TAKEOFF`
- `src-d637cfdd721e2422` — `paragraph` / `explanation` / `exception`: `\_GATE ASSEMBLY`
- `src-b61be05d17839086` — `heading` / `unknown` / `exception`: `INSTRUMENT PANEL _`
- `src-6ca5b2f1bab7806f` — `paragraph` / `explanation` / `exception`: `[Trower HEAD \| [ SCREW \| [oe \|`
- `src-87ca32c6de50ea08` — `paragraph` / `explanation` / `exception`: `\| TO MOTOR pressure \| \| SPEED \| TEMP fe) (a3)`
- `src-c66507d7db4aa3d5` — `paragraph` / `explanation` / `exception`: `\| BARREL TEMP`

**Reviewer outcome:** leave pending until the source page has been checked. If approved/corrected, choose the destination using the existing MT203 course structure; do not invent a new chapter or topic. If the record is only a diagram/table fragment, retain it as an illustration/reference rather than forcing it into prose.


## Page 212 — Polymer recycling symbols

The source page contains resin-identification/recycling symbols and example plastic items. OCR fragments are not dependable. Review symbol numbers, abbreviations and polymer names visually; preserve the source’s labels as shown and do not silently normalize any apparent spelling or terminology.

**Records in scope:**
- `src-6c5c3123eed2a0a7` — `heading` / `unknown` / `exception`: `Polymer Recycling`
- `src-f4a6533ec5944dab` — `paragraph` / `explanation` / `exception`: `2 Sle GL! A`
- `src-d95fd52db86b0898` — `paragraph` / `explanation` / `exception`: `(RY ERY AY & Pins da a: ce & Pix 5 ae ay ss`
- `src-2923cd139f683ff9` — `paragraph` / `explanation` / `exception`: `ee es in`
- `src-a4d629bc8358cdc3` — `heading` / `unknown` / `exception`: `PS OTHER`
- `src-d8965ffd864e63a9` — `equation` / `equation` / `exception`: `Polyethylen High Den sity Vinyl = = Low Dens it Polypropylen Polystyrene`
- `src-1e37a0d1b69b7649` — `heading` / `unknown` / `exception`: `Terephtha alate Polyethylen (v) Pe slpethylen (PP) [PS]`
- `src-6577139028bc6426` — `paragraph` / `explanation` / `exception`: `(PETE) (HDPE) (LOPE)`

**Reviewer outcome:** leave pending until the source page has been checked. If approved/corrected, choose the destination using the existing MT203 course structure; do not invent a new chapter or topic. If the record is only a diagram/table fragment, retain it as an illustration/reference rather than forcing it into prose.

## Review decision checklist

- [ ] Confirm each record belongs to the displayed source page.
- [ ] Compare the extracted text with the page image.
- [ ] For equations, preserve symbols, indices, exponents, fractions and definitions exactly.
- [ ] For tables, verify all headers, units, row labels and numeric cells before approving any text representation.
- [ ] For diagrams, preserve label-to-component relationships; do not approve detached OCR fragments as prose.
- [ ] Keep unclear records pending rather than guessing.
- [ ] Only after verification, record an explicit `approved`, `corrected`, or `rejected` decision using the review CLI.

## Decision state

- Decisions supplied: **0**
- Records approved: **0**
- Records corrected: **0**
- Records rejected: **0**
- Content patch: **not generated from this batch**
- Course content / question bank modified: **no**