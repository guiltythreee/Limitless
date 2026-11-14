# MT202 question metadata registry

This directory contains a separate metadata layer for the 522-question Physical Metallurgy (MT202) bank.

## Files

- `question-metadata.v1.json`: one metadata record per stable question ID.
- `topics.v1.json`: curriculum topic catalogue, including explicitly marked proposed additions.

## Stable identity and compatibility

Question IDs follow the current adapter convention: `ch01-q1` through `ch09-q70`. The registry is joined to source questions by this ID.

**Do not** write curriculum subtopic IDs into the application's existing `topicId` field. In the current shared course model, that field identifies the chapter (for example, `ch01`). The new registry uses `curriculumTopicId` for the more granular taxonomy.

**Do not** change the existing shared `Difficulty` union or reinterpret legacy `stars`. The new `assessedDifficulty` field is independent and uses a 1–5 educational scale.

## Metadata fields

| Field | Meaning |
|---|---|
| `questionId` | Stable source question ID |
| `chapterId` | Existing chapter ID |
| `curriculumTopicId` | Primary curriculum topic |
| `relatedTopicIds` | Secondary topic links; do not double-count the question |
| `learningObjectiveIds` | Learning objectives assessed |
| `questionType` | One of A–G; copied and checked against the source question bank |
| `assessedDifficulty` | 1–5; completed editorial assessment, not independently calibrated against student performance |
| `reasoningSkills` | Recall, distinguish, apply, calculate, interpret, analyse, synthesise |
| `misconceptionTags` | Specific misconceptions targeted |
| `sourceReferences` | Supporting course-companion chapter/topic references; primary source citations where available |
| `mappingConfidence` | High, medium or low |
| `quality` | Seven scored rubric dimensions and their total |
| `reviewNotes` | Required rationale for questions left in review or rejected |
| `status` | `approved`, `review` or `rejected` after quality assessment |

## Difficulty assessment (1–5)

- **1 — Fundamental:** direct recognition, definition or single-step fact retrieval.
- **2 — Conceptual:** one core idea must be understood or distinguished from a close alternative.
- **3 — Application:** a concept must be applied to a stated situation, or a standard calculation/interpretation completed.
- **4 — Analytical:** multiple linked steps, non-routine calculation, comparison of competing mechanisms, or integration of related objectives.
- **5 — Challenging:** substantial synthesis or unfamiliar multi-stage reasoning; use sparingly and only when the question itself warrants it.

Difficulty is independent of legacy stars and question format. A numerical question is not automatically difficult, and a multi-statement question is not automatically analytical.

## Reasoning-skill tags

Use one or more of: `recall`, `distinguish`, `classify`, `apply`, `calculate`, `interpret`, `analyse`, `synthesise`. Tags describe the cognitive work required by the question, not merely its format.

## Misconception tags

Tags identify the misconception families a question is intended to detect. They are curriculum-level diagnostic labels, not claims about a particular student's thinking. Prefer a small number of relevant tags; avoid adding unrelated tags merely because they belong to the same chapter.

## Quality rubric (100 points)

- Conceptual accuracy: 20
- Distractor plausibility: 20
- Reasoning demand: 15
- No giveaways: 15
- Clarity: 15
- Explanation quality: 10
- Syllabus relevance: 5

Bands: 90–100 Excellent; 80–89 Good; 70–79 Needs revision; below 70 Reject.

Hard rejection overrides the score: wrong answer key, scientifically incorrect explanation, ambiguous single answer, multiple defensible answers where only one is allowed, or missing required information.

## Quality review outcome

The question-level rubric pass covers all 522 questions. The current metadata registry records:

| Status | Questions | Meaning |
|---|---:|---|
| Approved | 522 | Passed the recorded editorial review; applicable corrections are preserved in the durable revision overlay |
| Review | 0 | No questions remain in the review queue |
| Rejected | 0 | No questions remain rejected after the latest correction pass |

Every record has all seven rubric dimensions scored, and `quality.total` is the sum of those dimensions. Scores range from **80 to 95**, with a mean of **85.06/100**. The score distribution is highly concentrated: 274 questions score 81 and 146 score 91, so the rubric requires calibration before these totals should be treated as discriminating measurements. Approval is a provisional editorial status, not independent faculty certification or proof of performance-based calibration.

The assessed-difficulty distribution is: level 1 = 57; level 2 = 94; level 3 = 248; level 4 = 122; level 5 = 1. All 175 learning objectives have at least one mapped question (626 objective links); 36 objectives currently have only one question, so their practice depth is thin.

The registry contains 19 misconception-tag families (1,227 tag assignments). All 84 numerical (type E) questions carry the `apply` reasoning-skill tag. Reasoning-skill tags may overlap, so their counts are not expected to sum to 522.

## Source references and traceability

All 522 records now have at least one supporting reference mapped from their curriculum topic. The references point to the corresponding chapter/topic in the Physical Metallurgy Study Companion or the relevant merged/supplemented chapter PDF. Two corrected questions retain additional, more specific PDF section citations.

These are **supporting course-resource references**, not a complete primary-source audit. They do not replace exact citations to the original lecture slides, textbooks or PYQs. The original Markdown question bank and solution folder used by `scripts/sync.mjs` are external to this repository, so an exact line-by-line original-to-revised comparison is still unavailable.

## Workflow

1. Verify primary topic mapping and add learning objectives.
2. Classify question type and assessed difficulty independently.
3. Tag reasoning skills and misconceptions.
4. Score all seven quality dimensions and calculate the total.
5. Approve only if the score is at least 80 and no unresolved issue remains; retain review notes for unresolved items.
6. Reject scores below 70 or any hard-rejection defect; revise and reassess before approval.
7. Validate registry IDs, scores, totals and status consistency against all chapter JSON files before integration.

Current branch review outcome: **522 approved, 0 in review, 0 rejected**. The actual `npm run validate:mt202-metadata` command and production build passed in GitHub Actions on the current draft PR. Re-run the workflow after rebasing or cherry-picking onto current `main`.

## Source-of-truth warning

The chapter JSON files are generated by `scripts/sync.mjs` from local Markdown and revision overlays. Keep this metadata separate from generated question JSON. Proposed topics must be reconciled with the upstream Markdown source before they are treated as canonical.
