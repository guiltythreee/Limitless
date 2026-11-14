# Limitless Question Authoring & Quality Standard

**Standard ID:** LQAS-1.0  
**Status:** Active authoring standard  
**Applies to:** All Limitless study banks, including Metallurgy (MT201/MT202/MT203), Testing of Materials, Thermodynamics, Probability/Mathematics and future disciplines.

This document is the canonical, reusable specification for turning uploaded lecture PDFs, PPTs, notes, textbooks or syllabi into Limitless questions. Follow it for every new question-generation batch and every substantial revision. Do not rely on conversational memory or silently invent missing syllabus content.

## 1. Core objective

Optimize for **learning value and correctness, not question count**. Questions must test understanding, reasoning, application and problem-solving rather than reward superficial recognition or memorization alone.

Every question must:
- Test a clearly identifiable concept, learning objective or skill from the supplied source.
- Have a precise, self-contained stem and a defensible answer.
- Use plausible alternatives based on realistic misconceptions or common errors.
- Avoid wording, length, grammar, formatting or answer-position clues.
- Include an explanation that teaches the underlying idea and, where applicable, why each distractor is wrong.
- Be traceable to its source, chapter, topic and learning objective.
- Match the course's existing structure, taxonomy, IDs, types and metadata conventions unless a deliberate migration is separately approved.

**Source fidelity rule:** the uploaded material is the primary authority for what is in scope. Preserve its terminology, chapter structure, assumptions, notation and level. Do not silently fill gaps with outside knowledge, reconcile contradictions, or change the syllabus. If a source is unclear, incomplete, contradictory or scientifically suspect, flag it for review rather than inventing a resolution. External verification may be used only when explicitly requested or when a correctness check is necessary; label source-derived content separately from verified corrections.

## 2. Source-to-question workflow

### Step 1 — Inventory and preserve the source
1. Identify every uploaded file and its format.
2. Extract the full usable content, including equations, diagrams, tables, worked examples, captions and relevant footnotes. For scanned/image-based pages, inspect the page images; do not assume missing extracted text means missing content.
3. Record file name, page/slide number, chapter/section heading and any source limitations.
4. Keep the original source unchanged. Never treat generated question JSON or a previous question bank as the authority for a newly supplied source.

### Step 2 — Build a coverage map before drafting
Create a hierarchy that follows the source:
- Course / module
- Original chapter or unit
- Topic and subtopic
- Learning objective / examinable concept
- Source locator (page, slide, section, figure, table or example)

Do not create a replacement syllabus or merge separate courses. In particular, preserve course boundaries (for example MT202 Physical Metallurgy is not MT203 Polymer Science and Technology).

For each objective, identify:
- Essential definitions, principles and relationships.
- Mechanisms and causal reasoning.
- Equations, assumptions, units and boundary conditions.
- Diagrams, graphs, tables and data interpretation.
- Typical misconceptions and common calculation errors.
- Applications and links to other concepts only where supported by the source.

### Step 3 — Plan the question mix
Use a balanced mix appropriate to the source and course:
- Conceptual understanding and explanation.
- Application and prediction.
- Numerical/problem-solving questions where the source supports them.
- Interpretation of diagrams, graphs, tables or experimental data.
- Comparison, mechanism and cause-effect reasoning.
- Recall questions only when factual recall is itself an explicit learning objective.

Do not inflate counts by paraphrasing the same learning objective repeatedly. Prefer a smaller set of distinct, high-quality questions over repetitive coverage.

### Step 4 — Draft and validate
Draft questions against the coverage map. Verify the correct answer independently, including every calculation, unit conversion, sign convention, assumption and intermediate step. Then run the quality checks in Sections 4–7. Keep unresolved items out of the approved bank.

### Step 5 — Deliver an auditable batch
Each batch must include:
- Source inventory and coverage map.
- New/revised question count by chapter, topic, type and difficulty.
- Question records with stable IDs and source locators.
- Correct answers and complete explanations.
- QA scores, hard-reject flags and unresolved review items.
- A change log separating additions, revisions, deletions and deferred items.
- Regression/build results where the target bank is integrated into Limitless.

## 3. Question formats and construction rules

Preserve the target course's supported question types. The standard recognizes these formats:

1. **Single correct:** normally four options (one key plus three distractors); exactly one defensible answer.
2. **Multiple correct:** state clearly that more than one option may be selected; define the complete correct set and explain each option.
3. **Assertion–reason:** use the course's declared response convention; assess both truth values and the logical relationship. Do not rely on ambiguous causal wording.
4. **Match:** sets must be unambiguous, balanced and not solvable through accidental elimination or formatting clues.
5. **Numerical:** state all necessary data, units, precision/rounding rules and assumptions. The worked solution must show the governing relation, substitution, units and final result.
6. **True/false:** use only when the proposition is precise and not dependent on unstated qualifications; avoid trivial wording traps.
7. **Data reading:** provide or faithfully reference the graph, table, diagram or experimental data needed. Axes, units, scales and labels must be legible and sufficient.

Do not force every format into four-option single-correct form. Use the format supported by the course schema and the learning objective.

### Single-correct MCQ rules
- Exactly four options labelled according to the course convention (normally A–D / a–d).
- One and only one correct option under the stated assumptions.
- Three plausible distractors, each representing a credible misconception, incomplete model, wrong assumption, common calculation error or misinterpretation.
- Options must be mutually exclusive, parallel in grammar and comparable in specificity.
- Avoid “all of the above” / “none of the above” unless the source and assessment design make them genuinely necessary.
- Avoid absurd, unrelated, joke, obviously false or dimensionally impossible distractors.
- Do not make the correct option conspicuously longer, more qualified, more precise or more technical than the others.
- Do not use grammatical agreement, repeated words from the stem, option formatting or answer-position patterns as clues.
- Avoid negative stems. If a negative is essential, emphasize the negative word clearly and ensure the task remains unambiguous.

## 4. Difficulty classification

Use five consistent levels. Assign difficulty based on the thinking required, not on long wording or arithmetic burden alone.

| Level | Name | Expected demand |
|---|---|---|
| L1 | Fundamental | Direct understanding of a core fact, definition, relation or one-step interpretation. |
| L2 | Basic application | Apply a known principle or equation in a familiar, clearly specified context. |
| L3 | Intermediate reasoning | Connect concepts, interpret conditions, perform multi-step work or distinguish close alternatives. |
| L4 | Advanced application | Solve unfamiliar or combined problems, evaluate mechanisms, interpret data or reason across multiple steps. |
| L5 | Challenging | Integrate several ideas, handle non-obvious constraints, evaluate competing explanations or solve demanding multi-stage problems. |

**Default distribution target** for a sufficiently large bank:
- L1: 15%
- L2: 25%
- L3: 30%
- L4: 20%
- L5: 10%

Treat this as a planning target, not a quota that justifies artificial questions. Small chapters and source-limited topics may differ; record the reason for material deviations. Do not label a question L4/L5 merely because it is lengthy or computationally tedious.

## 5. Explanation standard

An approved question must teach, not merely reveal the key.

**Correct-answer explanation must:**
- State the governing concept, principle, mechanism or equation.
- Explain why the answer follows from the stem and stated assumptions.
- Show intermediate reasoning for non-trivial deductions.
- Show calculations with correct standard units, substitutions and rounding.
- Explain relevant physical/chemical meaning where appropriate.
- Be concise enough to follow, but complete enough to learn from without searching for another source.

**Distractor explanations must:**
- Explain why each incorrect option is wrong.
- Identify the misconception, invalid assumption, reversed relationship, wrong mechanism, calculation error or data misreading it represents.
- Avoid merely saying “incorrect” or repeating the correct answer.
- Be tied to the actual option meaning, not just its letter, so that option reordering does not detach explanations from their distractors.

For formats without conventional distractors, explain the correct reasoning and the relevant alternatives or common errors where useful.

## 6. Metadata and traceability

Use the existing target-bank schema; do not create a competing schema or rename existing fields without a migration plan. At minimum, the authoring record should capture or map to:

- Stable question ID.
- Course, original chapter, topic and subtopic.
- Source file and page/slide/section locator.
- Learning objective or concept tested.
- Question type / format.
- Difficulty level (L1–L5).
- Stem, options and answer key (as applicable).
- Correct-answer explanation.
- Per-distractor explanation (where applicable).
- Concept / misconception tags.
- Review status and QA score.
- Revision provenance (new, revised, imported, verified) and batch identifier.

If the production schema does not support one of these fields, keep it in the authoring/QA manifest rather than silently dropping traceability. Preserve stable IDs, question order, option meaning, answer-key mapping and course routing unless a change is explicitly required and tested.

## 7. Quality scoring rubric (100 points)

Score each question using the following rubric. Record evidence for deductions; do not award points merely because a field is present.

| Criterion | Points | What earns full credit |
|---|---:|---|
| Conceptual / technical accuracy | 20 | Correct, source-faithful and internally consistent; calculations and units verified. |
| Distractor plausibility | 20 | Alternatives are credible, misconception-based and relevant; no absurd or unrelated choices. |
| Reasoning / cognitive value | 15 | Tests the intended objective through meaningful understanding, application or reasoning. |
| Absence of giveaways | 15 | No length, grammar, wording, specificity, formatting or answer-position clue. |
| Clarity and precision | 15 | Self-contained, unambiguous, readable and appropriately scoped. |
| Explanation quality | 10 | Teaches the solution and explains distractors/common errors where applicable. |
| Syllabus relevance and traceability | 5 | Correct chapter/topic/objective and source locator are recorded. |
| **Total** | **100** | |

### Score bands and disposition
- **90–100 — Excellent:** approve.
- **80–89 — Good:** approve; record minor improvements if useful.
- **70–79 — Needs revision:** do not publish until revised and rescored.
- **Below 70 — Reject:** rewrite from the learning objective or discard.

**Hard-reject / mandatory-revision overrides:** a scientific or mathematical error; more than one defensible key in a single-correct item; no defensible key; missing essential data or assumptions; a source contradiction that has not been resolved; an explanation that contradicts the key; an incorrect numerical result/unit; an unrelated or absurd distractor that makes the item trivial; or content outside the specified syllabus. A high numerical score cannot override a hard failure.

## 8. Bank-level quality controls

Run both human review and automated checks. Automated heuristics are screening signals, not proof of quality.

### Human review
- Verify the science, mathematics, terminology and source alignment.
- Check whether each distractor represents a plausible error a learner might actually make.
- Check for ambiguity, hidden assumptions and multiple interpretations.
- Confirm the question tests the intended objective rather than a wording trick.
- Check numerical solutions independently.
- Inspect the whole chapter for topic gaps, repetition and overconcentration.

### Automated / mechanical review
- Required fields, valid schema and stable unique IDs.
- Valid option count and answer key for each question type.
- Every single-correct item has exactly one key.
- No duplicate or near-duplicate stems without an explicit reason.
- Detect suspicious correct-option length/specificity and absolute-word cues.
- Detect malformed units, missing data, broken LaTeX and invalid references.
- Check answer-key distribution globally and within each topic.
- Check answer sequences: no conspicuous long runs, repeated patterns or predictable cycles.
- Verify option-keyed distractor explanations remain attached to the correct option after reordering.
- Run course-specific regression tests, shared renderer/player tests, type checks and production build.

For four-option MCQs, use the existing MT203 sequence safeguards as a reference point where applicable: no topic run longer than three identical answer positions; every eight-question window contains all four positions and no position appears more than four times; no repeated four-answer sequence within a topic. Adapt only when the course's assessment format requires it, and document exceptions. Answer balancing must never change which option is substantively correct.

## 9. Revision and integration rules

- Prefer editing the authoritative source, not generated output.
- Determine the source-of-truth file for the target course before editing. Generated JSON/build output may be overwritten by sync.
- Preserve course boundaries and the original chapter/topic structure.
- Preserve IDs and question types for revisions unless a deliberate migration is approved.
- When replacing options, remap the answer key and option-keyed explanations together.
- Use fingerprints or equivalent preconditions for bulk authored replacements; stop if the target question has changed since the revision pack was prepared.
- Back up the current working version before applying a batch.
- Run relevant tests and builds after the edit. Do not claim completion based only on a successful script invocation.
- Do not deploy a content change until the required checks pass and deployment is explicitly intended.
- Report what changed, what passed, what failed, and what remains unverified.

## 10. Existing Limitless work and known boundaries

This standard consolidates the established authoring rules with the repository's documented question-quality work. It does not imply that every course bank has already been brought to this standard.

### Metallurgy — documented work
- MT202 Physical Metallurgy originally has 522 chapter-wise MCQs across nine chapters in its source description. Its source of truth is the Markdown question bank and solutions; generated chapter JSON is produced by the sync script.
- A documented MT201/MT202 authored-revision pack contains 12 MT201 and 47 MT202 replacements. The repository runner applies guarded durable overlays because the authoritative authoring banks are external to the repository. It preserves IDs and types and refuses stale fingerprints.
- MT203 Polymer Science and Technology has an independent typed question bank and quality workflow. It must not be mixed with MT202 Physical Metallurgy.
- MT203's 286-question / 11-topic pass applied 25 authored replacements; revised wording in 124 records to reduce obvious length cues and improve distractors; corrected specific technical inaccuracies; balanced answer positions to A=72, B=72, C=71, D=71; and added answer-sequence regression safeguards. Its documented automated checks passed (47 MT203 tests, 123 migration assertions, 90 shared renderer assertions, TypeScript and answer-balance regression). This is not equivalent to full manual scientific verification of every item.
- Metallurgy quality reports explicitly warn that string-length and answer-key heuristics are review indicators, not proof of scientific correctness. Full expert review remains necessary.

### Other disciplines
Testing of Materials, Thermodynamics and Probability/Mathematics should use this common standard while retaining their own source files, chapter taxonomy, question types, metadata and test pipelines. Their current compliance must be audited independently; do not assume the Metallurgy changes automatically updated them.

## 11. Reusable instruction for future uploads

When new source material is uploaded, use this instruction:

> Generate a new Limitless question batch from the supplied source using **Limitless Question Authoring & Quality Standard LQAS-1.0**. First inspect all source files and build a chapter/topic/learning-objective coverage map that preserves the original organization. Do not invent or silently supplement missing source content. Draft a balanced set of conceptual, application, numerical and data-interpretation questions as appropriate. Use the course's existing question formats and metadata schema. For single-correct MCQs, use four options with one defensible key and three plausible misconception-based distractors. Assign L1–L5 difficulty using the standard distribution as a target, not a quota. Provide a teaching explanation and explain every distractor. Score each question using the 100-point rubric; hard-reject scientific errors and ambiguity regardless of score. Include source locators, misconception tags, coverage statistics, a revision log and unresolved issues. Validate the complete batch before integration and report exactly which tests/builds passed.

## 12. Batch completion checklist

- [ ] All supplied files inspected; scanned pages/figures/tables checked where needed.
- [ ] Original chapter and topic structure preserved.
- [ ] Coverage map and learning objectives prepared before drafting.
- [ ] No unsupported or invented source content.
- [ ] Question types appropriate to the objective and supported by the target course.
- [ ] Four-option single-correct items have exactly one defensible key and three plausible distractors.
- [ ] Difficulty labels reflect cognitive demand.
- [ ] Correct explanations teach the reasoning; distractor explanations identify the misconception.
- [ ] Numerical answers, equations, units and rounding independently verified.
- [ ] Every question has source traceability and required metadata.
- [ ] Each question scored; hard failures rejected or held for revision.
- [ ] Bank-level duplication, coverage, answer-position and schema checks run.
- [ ] Authoritative source updated; generated outputs rebuilt rather than hand-edited.
- [ ] Backups, regression tests, type checks and production build completed as applicable.
- [ ] Final report separates completed, pending and unverified work.

---
**Maintenance rule:** update this standard only through an explicit versioned change. Course-specific exceptions belong in a course addendum and must not silently weaken the common quality gates.
