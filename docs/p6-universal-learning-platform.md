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


## 10. P6.0 source-inspection finding and contract decision

Inspection of the live source confirms that the current shared Metallurgy activity model is not a valid universal answer model:

- Metallurgy's canonical `Question` currently has one correct option label and its activity record stores one picked label plus a boolean correctness value.
- Probability's `QuizItem` supports both `answer: number` and `answers: number[]`. Its `grade()` function implements partial credit for multi-select responses, and its persisted `Attempt` stores the selected index array, score, and status.
- Probability's existing store key is `hc3-progress-v3`; it reads v1/v2 for migration. This store remains Probability-owned.

Accordingly, P6 does **not** reuse or widen the P5 activity record as its answer contract. The first neutral contract lives at `shared/learning-player/contracts.ts` and defines discriminated single-choice, multi-choice, numeric, and text answers, plus an explicit normalised grade. Adapters call the existing course grading function and map the result; the shared player must never recalculate a course's score.

This is a contracts-only foundation. It is not yet imported by either application, and no production player, storage, deployment output, or workflow has been changed. The next gate is a small compilation/test harness for the shared contract and a verified import path into each independent Next app before extracting UI/runtime code.


## 11. P6.0 lifecycle checkpoint

The shared foundation now includes a pure navigation/lifecycle reducer at `shared/learning-player/state.ts`. It owns only the current index, answering/review phase, and elapsed-time value. It does not own timer scheduling, grading, answer state, or persistence.

The lifecycle test at `shared/learning-player/state.test.mjs` covers initial state, elapsed-time normalisation, submit/review transition, stopping elapsed-time updates after submission, next/previous bounds, reset, and empty queues.

GitHub Actions run `41059775942` completed successfully for both independent projects:
- Probability: lifecycle test and shared-contract TypeScript check passed.
- Metallurgy: lifecycle test and shared-contract TypeScript check passed.

This validates the shared files with both installed TypeScript toolchains and confirms the pure lifecycle test executes in both CI environments. It does **not** yet validate either full Next.js app build or any production integration. The branch remains isolated and the PR remains draft.

## 12. P6.1 adapter-driven session runtime checkpoint

The first reusable session runtime now lives in `shared/learning-player/runtime.ts`. It is framework-neutral and generic over the course question and answer types. It owns the in-memory queue, answer map, current lifecycle state, and submission records.

The runtime deliberately delegates question identity and grading to the supplied course adapter. It does not import either course, infer correctness, persist data, or render controls. It refuses submission when no answer exists and prevents a second submission or answer mutation while the current question is in review. Navigation retains answers and prior submissions while resetting the per-question lifecycle timer.

Runtime tests cover unanswered submission, adapter-based single-choice grading, multi-choice partial-credit preservation, elapsed-time capture, review locking, duplicate-submit prevention, and queue navigation.

GitHub Actions run `41060608354` completed successfully for both Probability and Metallurgy:
- Both runtime/lifecycle test scripts passed.
- Both projects' TypeScript toolchains type-checked the shared contracts, reducer, runtime, and type fixtures.

This is still a shared-runtime validation gate, not a production integration or full Next.js build. Course adapters, existing grading functions, persistence, and UI remain unchanged. The next work is to prove adapters against the actual course models and existing graders before integrating either course.

## 13. P6.1 course-adapter compatibility checkpoint

Source inspection confirmed the answer-shape boundary against live course code:

- Probability's `Q` uses stable `key` IDs and its authoritative `grade(item, picked: number[])` returns score plus correct/partial/incorrect status. Its adapter translates shared option IDs back to the original numeric option indices and calls that exact function. It does not duplicate the partial-credit formula.
- Metallurgy's canonical `Question` uses the original question ID, option labels, and one answer label. MT201/MT202 progress stores the selected label and boolean correctness; the MT202 practice and exam flows compare the selected label with `question.answer`. The adapter preserves that behaviour for MT201, MT202, and MT203.
- MT202's taxonomy label `multiple-correct` describes question stems where several statements may be true; the answer options are combinations (for example, "1, 2 and 3"), and the player selects one combination option. It is not Probability-style multi-select input. The canonical single-choice answer shape is therefore correct for current MT202 UI behaviour.

Adapter files:
- `probability-source/app/learning-player/adapter-core.ts` translates shared answer IDs and delegates grading.
- `probability-source/app/learning-player/adapter.ts` binds the core to the real Probability `grade()` function.
- `metallurgy-source/app/learning-player/adapter.ts` creates course-ID-specific adapters over the canonical Metallurgy question model.

The adapters are not yet imported by production player routes and do not write progress. The adapter contract now also exposes an optional retry policy: Probability permits retries, while the three Metallurgy course adapters lock a question after its first submission. The runtime enforces that policy when a user revisits a question, so it does not accidentally turn a one-attempt course into a retryable one.

Tests and strict TypeScript checks were added to the P6 workflow. GitHub Actions run `41062224892` completed successfully for both apps:
- Probability: 13 lifecycle + 19 runtime + 15 adapter assertions passed. The adapter test exercises the production binding against the actual Probability grader for single-choice, partial-credit multi-select, fully correct multi-select, and over-selection.
- Metallurgy: 13 lifecycle + 19 runtime + 12 adapter assertions passed; adapter and shared files type-checked.

The Node test-only loader resolves extensionless TypeScript imports for these tests; it does not alter production module resolution. This gate validates adapter mapping and type compatibility, not full app builds or production integration.

## 14. Independent application build checkpoint

The P6 workflow now runs both applications' production builds independently, without running the Probability deployment/synchronisation workflow. GitHub Actions run `41062402968` completed successfully:
- Metallurgy: Next.js production compilation and static page generation succeeded.
- Probability: Next.js production compilation and static page generation succeeded.
- The contract/runtime/adapter test and type-check matrix also passed in the same run.

This confirms the current branch still builds both applications. The shared runtime is not yet imported by either production route, so this is a baseline build checkpoint before the first live integration.

## 15. P6.2 first live integration — MT201 practice quiz

The MT201 chapter quiz now uses the shared player session runtime for:
- Current question index and previous/next navigation.
- Direct selection from the question palette and deep-link initial question selection.
- Single-choice answer capture and adapter-driven grading.
- Submission phase and elapsed-time capture.

The existing MT201 renderer, solution/peek UI, bookmark action, timer scheduling/visibility behaviour, progress shape, and `mm-mt201-v1` storage remain course-owned. On submission, the shared adapter's correctness result is passed into the existing `recordAnswer` function; no new storage format or persistence path was introduced.

The first production build exposed a genuine module-boundary issue: Next.js Turbopack treated each app directory as its root and could not resolve the repository-level shared runtime. Both Next configs now set Turbopack's root to the repository root, allowing the two independent apps to import one shared implementation without copying it into either app. The existing static-export settings and deployment workflows are unchanged.

Validation:
- P6 workflow run `41063007319`: both app production builds and both shared contract/runtime/adapter type-check matrices passed.
- Metallurgy regression run `41063007334`: 109 learning-core checks, 196 capability checks, MT201/MT202 attempt tests, attempt parity, bookmarks, timers, daily goals, and the full Metallurgy TypeScript check all passed.
- The MT201 route compiled and was prerendered by the Metallurgy production build.

This is the first production-route integration, limited to MT201 practice. MT201 exam, MT202, MT203, and Probability production players remain unchanged. No deployment was run.
