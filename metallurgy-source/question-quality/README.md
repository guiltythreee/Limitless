# Limitless Question Quality Engine

This is the shared validation foundation. It is intentionally independent of any
course's stored question schema: each course supplies an adapter that maps its
native record to `NormalizedQuestion`, then selects a profile by both discipline
and question format.

## Architecture

- `core/types.ts`: shared normalized contracts.
- `core/validate.mjs`: format-neutral validation runner.
- `profiles/`: versioned discipline/format profiles.
- Course adapters remain beside their existing question banks; they must not
  rewrite chapter ids, question ids, or persisted attempt data.

## Current support

- Shared validation contracts and runner.
- Initial general single-choice profile.
- No course is enrolled in enforcement yet. The MT203 MCQ-QS validator remains
  the legacy course-specific audit until its adapter is implemented and compared
  against its existing results.

## Adding a discipline

1. Inspect the course's actual question schema and question formats.
2. Write a lossless adapter to `NormalizedQuestion`.
3. Add a versioned profile for each format that course uses.
4. Add fixtures from real questions, including edge cases.
5. Compare old and new audit outputs before replacing any validator.
6. Enrol the course only after a human review; never infer scientific correctness
   from structural checks alone.

## Safety guarantees

The engine is read-only. It does not rewrite question text, alter answers,
renumber questions, migrate user progress, or change the study UI.
