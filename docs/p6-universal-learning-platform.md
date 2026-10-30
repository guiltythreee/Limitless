# P6 — Universal Learning Platform Architecture

Status: Architecture baseline; implementation not yet started.
Base: `main` after PR #28.
Branch: `architecture/p6-universal-learning-platform`

## 1. Objective

Build one discipline-independent learning experience that can host different subjects without forcing their question formats, grading rules, content renderers, or existing progress stores into one lossy model.

The first implementation target is the universal question-player foundation. The player should own common interaction flow; each discipline supplies its question presentation, answer control, grading, and explanation rendering.

## 2. Current repository facts

- `metallurgy-source/` and `probability-source/` are separate Next.js applications.
- Each app has its own `package.json`, lockfile, TypeScript configuration, and static-export workflow.
- The two apps currently deploy to separate static paths (`/metallurgy` and `/probability`).
- Metallurgy already has a course registry, manifests, content adapters, capability flags, and a shared activity log.
- Probability has a different question and progress model: indexed options, multi-select questions, partial-credit grading, question drafts, tests, and its own local-storage migration.
- Metallurgy's canonical question schema currently models one correct option label. It cannot represent Probability's multi-select/partial-credit semantics without an extension or a discipline adapter.
- The Probability static directory is generated output. Editable source is in `probability-source/`.

## 3. Non-negotiable compatibility rules

1. Preserve all existing local-storage keys and payload fields.
2. Do not migrate, rewrite, or reset a learner's saved progress as part of player extraction.
3. Preserve Probability's multi-select grading and partial-credit score exactly.
4. Preserve Metallurgy's current answer semantics, exam flows, and reward policies.
5. Keep discipline-specific question content and rich rendering in their owning content adapters.
6. A capability is exposed only when the course can actually support it.
7. Loading or viewing a question must not create an attempt or silently persist a draft.
8. A submitted answer is recorded once; batch exams must retain their existing one-write behavior.
9. Unknown timestamps and unknown elapsed time remain unknown; never fabricate them.
10. Existing question IDs remain verbatim.

## 4. Separation of responsibilities

### Universal player engine

Owns:
- Current question and queue position.
- Previous/next navigation and question-number navigation.
- Answering, submitted, and review phases.
- Common timer lifecycle and visibility handling.
- Optional bookmark and draft actions, gated by capabilities.
- Submission orchestration and transition to review.
- Common keyboard/accessibility interaction contracts.

Does not own:
- Subject-specific grading.
- Question wording, diagrams, tables, formulas, or rich-text rendering.
- Option indexing/label conversion.
- Explanation/solution rendering.
- Reward calculations or course-specific persistence schemas.

### Discipline question adapter

Each discipline supplies:
- Stable question ID and topic/unit metadata.
- A renderable prompt model or a prompt renderer.
- Its answer-input model and answer control.
- A grading function returning correctness, score, and status.
- Correct-answer and explanation/review rendering.
- Optional draft serialization and restoration.
- Optional metadata such as difficulty and source reference.

### Progress adapter

Each course keeps its existing storage and exposes the common player with operations such as:
- Read current question state.
- Load an in-progress draft when supported.
- Record one submitted answer.
- Toggle a bookmark when supported.
- Read attempt history for review.

The universal player must not directly know local-storage keys or mutate a course's raw progress object.

## 5. Answer contract: preserve different answer types

Do not reduce every answer to a string or a single option label.

The contract must be discriminated so it can represent at least:
- Single choice.
- Multiple choice.
- Numeric/free-response answers where a future discipline requires them.

The grading result must carry:
- `correct`: whether the response is fully correct.
- `score`: a normalised value in the range 0–1 where partial credit exists.
- `status`: a discipline-neutral state such as correct, partial, incorrect, or ungraded.
- Optional feedback needed by the discipline's review renderer.

Probability's existing rule remains authoritative: for multi-select, score is based on hits minus wrong selections divided by the number of correct options, floored at zero. The adapter must preserve the current exact implementation rather than reimplementing it differently in the shared engine.

Metallurgy's current single-answer model maps to a single-choice answer and its existing boolean correctness semantics.

## 6. First implementation sequence

### P6.0 — Contract and architecture tests
- Define player lifecycle, answer, grading, draft, timer, and capability contracts.
- Add contract tests using representative Probability and Metallurgy questions.
- Test multi-select partial credit, single-choice grading, unanswered submissions, retry behavior, and no-write-on-load.
- Do not change production player routes yet.

### P6.1 — Extract the player engine
- Implement the common state machine and navigation.
- Keep prompt, answer, and review rendering injected by adapters.
- Keep timers optional and use the already-established pause/resume semantics.
- Save a compiling checkpoint immediately after the first green test/build gate.

### P6.2 — Metallurgy integration
- Integrate one course first as the reference adapter.
- Preserve all three existing course routes and course-specific renderers.
- Run the full P5 regression suite plus TypeScript and production build.

### P6.3 — Probability integration
- Add a Probability adapter without changing its question bank or grading function.
- Preserve its multi-select questions, partial credit, drafts, tests, bookmarks, and analytics.
- Verify the existing `hc3-progress-v3` store and legacy v1/v2 migration remain compatible.
- Run Probability tests/build and verify static export.

### P6.4 — Cross-discipline validation
- Run both app builds independently.
- Test a mixed set of representative question types.
- Verify no local-storage key collisions and no cross-course data leakage.
- Confirm generated Probability deployment output is produced only by its existing workflow.

## 7. Repository/build-system decision required before sharing runtime components

The two Next.js applications currently install dependencies independently and compile from separate project roots. There is no root workspace or shared package boundary.

Therefore, do not immediately create a root React package and assume both builds can import it. Before sharing runtime components, validate a small proof of concept for module resolution, React peer dependencies, TypeScript path handling, and both static-export workflows.

If a root shared package requires workspace conversion, treat that as a separate, explicitly tested infrastructure change. Do not combine it invisibly with player extraction.

## 8. Out of scope for the first player milestone

- Redesigning the whole site.
- Replacing the Probability or Metallurgy question banks.
- Consolidating all storage into one database or key.
- Changing rewards, XP, mastery, or course progression rules.
- Enabling unsupported capabilities.
- Removing existing course-specific question players before parity is demonstrated.

## 9. Acceptance criteria

The first universal player is acceptable only when:
- It can render and navigate a Metallurgy single-choice question and a Probability multi-select question through adapters.
- Each discipline's grading output matches its current implementation.
- Review shows the correct answer and discipline-specific explanation.
- Timers and drafts behave only where supported.
- No existing storage key or saved payload is broken.
- Both applications pass their independent type-check/build and regression gates.
- The shared engine contains no discipline-specific IDs, grading assumptions, or local-storage keys.
