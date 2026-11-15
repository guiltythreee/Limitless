# MT203 source-to-course coverage programme

Status: **active — source inventory and lesson reconciliation**
Source: `MT203 – PST 2026(1).pdf`
Source SHA-256: `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`
Branch: `feat/study-resource-ingestion-foundation`
Course structure authority: `app/courses/manifests/mt203.ts` and `app/data/qbank/meta.ts`
Lesson authority: `app/data/lessons-mt203.ts`
Question authority: `app/data/qbank/t1.ts` through `t11.ts`

## Objective

Turn the already-ingested MT203 lecture source into a complete, source-traceable learning course. The work order is:

1. Audit and consolidate extracted source knowledge.
2. Reconcile that knowledge against the existing 11-topic / 4-module course.
3. Update lessons and reference material with verified source content.
4. Only after lesson coverage is reviewed, design and add an appropriate number of new questions to close demonstrated assessment gaps.
5. Validate coverage, scientific correctness, answer keys, difficulty, distractors and explanations. Preserve all existing question IDs and learner progress.

A second PDF is **not** a prerequisite for this work. It would be useful for later generalization testing, but the current MT203 source is sufficient to proceed.

## Verified baseline

- Source PDF: 212 pages.
- Extracted knowledge records: 2,449.
- Record kinds: 554 headings, 491 paragraphs, 317 bullets, 283 table rows, 83 equations, 721 image references.
- All extraction records are still `needs-review`; the source manifest remains unreviewed. Extraction is not equivalent to academic approval.
- Existing course structure: 4 modules, 11 topics.
- Existing question bank: 305 questions according to the current course manifest and qbank metadata.
- No questions have been added from this ingestion run.
- No automatic question generation is permitted.
- The source PDF and full extracted asset directory are not committed to Git; the compact validation snapshot is backed up in the user's Library.

## Existing lesson work — preserve and audit, do not duplicate

The existing batch-001 source audit documents these specific comparisons:

| Source page | Destination | Existing coverage / work already recorded |
|---:|---|---|
| 36 | T4 — Molecular Weight & Distribution | Core Mn, Mw and Mz equations already covered; notation difference recorded. No duplicate lesson addition needed. |
| 102 | T8 — Industrial Polymers | Silicone-based TPU scheme identified as a source-specific addition; prior branch work records a concise source-linked addition. |
| 154 | T10 — Mechanical, Viscoelastic & Physical Properties | Solution–diffusion principle already covered; source table has unit/footnote caveats and must remain visibly source-linked unless fully verified. |
| 178 | T11 — Compounding & Processing | Screw zones and flow already covered; prior branch work records additional hardware/control-panel detail. |
| 212 | T9 — Blends, Composites, Modification & Degradation | Prior branch work records the seven source resin-identification labels. Preserve labels exactly as printed, including `V` and `OTHER`. |

These five pages are a targeted sample, not a complete audit of all 212 pages or all 2,449 records. The prior batch-001 documents and the current lesson file must be checked together before changing any of these topics again.

## Required source-to-course audit

Create a complete mapping with one row per meaningful source concept (not merely one row per extraction record). Each row must retain:

- source page(s) and source record IDs;
- source wording, equation, table or figure reference;
- destination module, topic and subtopic;
- coverage status: already covered / partially covered / missing / duplicate / unclear;
- evidence in the current lesson (section heading or formula);
- proposed lesson action;
- verification status and any unresolved source ambiguity.

Do not infer missing equations, table units, figure labels, chemical structures, reaction conditions or footnotes. Mark unresolved material for manual visual inspection against the original PDF.

## Lesson update acceptance criteria

- Keep the existing 4 modules and 11 topic IDs; do not invent a replacement syllabus.
- Integrate material into the correct existing topic/subtopic rather than creating detached notes.
- Preserve source terminology, notation, units, examples and sequence where they matter.
- Use Markdown/LaTeX consistent with the current lesson renderer.
- Preserve diagrams/tables as source-linked visual references when transcription is uncertain.
- Avoid duplicate explanations; extend an existing section where appropriate.
- Keep an explicit source page/record trace for each new or materially revised lesson element.
- Run the relevant content and production-build tests after each coherent lesson batch.
- Commit a working, compiling lesson batch before proceeding to the next batch.

## Question development — gated until lesson coverage is reviewed

Do not choose a final question count from the 2,449 extraction-record count. Determine it from the topic/subtopic learning objectives and coverage gaps after lesson updates.

For each subtopic, build an assessment blueprint that records:
- concepts and skills to master;
- existing question IDs already assessing them;
- uncovered learning objectives;
- required question formats and difficulty levels;
- proposed new question count and rationale;
- source pages/lesson sections supporting the key.

New questions must complement, not clone, the existing bank. Retain the existing MT203 format taxonomy and difficulty system. Apply the established MCQ quality standard: plausible distractors, scientifically correct unique answer, meaningful reasoning, no answer giveaways, clear wording, source traceability, and explanations for the correct answer and incorrect options. Numerical items require independent recomputation with standard units. Assertion–reason, matching, sequence, graph and data-reading formats need format-specific validation.

All new questions must be manually reviewed and validated before being added to the live course data. Preserve existing stable IDs and progress mappings; allocate new IDs only after confirming the current maximum per topic.

## Work sequence and checkpoints

- [x] Recover the original MT203 PDF and validate the ingestion output.
- [x] Preserve the 2,449-record inventory in the validation backup.
- [x] Confirm the existing course has 4 modules, 11 topics and 305 questions.
- [x] Record the correction that a second PDF is not required for the current MT203 content programme.
- [ ] Build the complete page/topic/subtopic knowledge inventory from the 212-page source.
- [ ] Reconcile every meaningful source concept against the current lessons.
- [ ] Update and validate lesson content in small topic batches.
- [ ] Freeze the updated lesson coverage map.
- [ ] Build the per-subtopic assessment blueprint and justified question counts.
- [ ] Author, review and validate new questions in topic batches.
- [ ] Update metadata/counts only after question files and tests agree.
- [ ] Run all MT203 content, question-quality, learning and production-build checks.
- [ ] Back up the final source-to-course inventory, lesson diff and question-bank diff.

## Safety / preservation boundary

No merge or production deployment is authorized by this programme. Do not alter learner progress, existing question IDs, answer history or unrelated MT202 Physical Metallurgy content. MT203 Polymer Science and Technology remains separate from MT202.
