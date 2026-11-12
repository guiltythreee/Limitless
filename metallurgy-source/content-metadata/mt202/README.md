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
| `assessedDifficulty` | 1–5; pending independent assessment |
| `reasoningSkills` | Recall, distinguish, apply, calculate, interpret, analyse, synthesise |
| `misconceptionTags` | Specific misconceptions targeted |
| `sourceReferences` | Syllabus, lecture, textbook or PYQ references |
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

The complete question-level rubric pass has been recorded for all 522 questions. Subsequent source-level reassessment corrected question wording and explanations where needed, and revised the status assignments.

| Status | Questions | Meaning |
|---|---:|---|
| Approved | 519 | Passed the recorded editorial review; corrected wording is stored in the durable revision overlay where applicable |
| Review | 0 | No questions remain in the review queue |
| Rejected | 3 | Retained for substantive correction before reconsideration |

Every question has all seven rubric dimensions scored, and `quality.total` is the sum of those dimensions. Non-approved records carry a `reviewNotes` explanation. A review status is not approval: do not expose those items as fully validated exam questions until the note is resolved and the record is reassessed.

The scores are a structured editorial assessment of the question-bank JSON (stem, options, keyed answer and supplied explanation). They are not a substitute for independent faculty sign-off or checking the upstream lecture/PYQ source. Two questions remain rejected because their claims require source-specific support or a more defensible formulation. The approved status means the available item and its corrected explanation passed this editorial review; it does not imply independent faculty certification.

## Workflow

1. Verify primary topic mapping and add learning objectives.
2. Classify question type and assessed difficulty independently.
3. Tag reasoning skills and misconceptions.
4. Score all seven quality dimensions and calculate the total.
5. Approve only if the score is at least 80 and no unresolved issue remains; retain review notes for unresolved items.
6. Reject scores below 70 or any hard-rejection defect; revise and reassess before approval.
7. Validate registry IDs, scores, totals and status consistency against all chapter JSON files before integration.

Current branch review outcome: 519 approved, 0 in review, 3 rejected. Local execution of `npm run validate:mt202-metadata` remains required; GitHub-side structural checks do not substitute for running the repository validator.

## Source-of-truth warning

The chapter JSON files are generated by `scripts/sync.mjs` from local Markdown and revision overlays. Keep this metadata separate from generated question JSON. Proposed topics must be reconciled with the upstream Markdown source before they are treated as canonical.
