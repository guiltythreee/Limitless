# Metallurgy Question-Quality Test Branch

This branch carries a guarded runner for **59 MT201/MT202 authored revisions**.

- MT201: 12 authored replacements
- MT202: 47 authored replacements

MT203 is maintained independently by the authoritative typed question bank and its own content-quality workflow. Its authored revisions, answer-position balancing, sequence regression, and subject-specific quality notes are documented in `docs/MT203-authored-revisions-2026-10-28.md`. The MT201/MT202 runner deliberately does not rewrite or rebalance MT203.

The committed branch contains the durable MT201/MT202 overlays, generated output mirrors, optional MT201/MT202 answer-position balancing, and the mechanical audit/follow-up reports.

The GitHub Actions workflows are read-only with respect to repository content. They validate the committed overlays and generated mirrors, run MT201/MT202/MT203 regression checks and validators, and build the metallurgy site. They do not apply revisions, modify files, or commit generated output.

Workflows:
- `.github/workflows/test-metallurgy-question-quality.yml`
- `.github/workflows/test-metallurgy-content.yml`

Runner: `metallurgy-source/scripts/apply-authored-revisions.py`

## Manual run

From the repository root, using Python 3.10+ and installed Node dependencies:

```powershell
py "metallurgy-source/scripts/apply-authored-revisions.py" --repo "$PWD" --balance-answers
```

This command is a read-only preflight. To apply the MT201/MT202 revision pack locally, only after preflight succeeds:

```powershell
py "metallurgy-source/scripts/apply-authored-revisions.py" --repo "$PWD" --apply --balance-answers --run-tests --build
```

The runner creates a dated backup outside the repository before edits, stops on stale target fingerprints or pre-existing changes to target files, preserves stable question IDs/types/counts, installs durable overlays for MT201/MT202 because their original authoring banks are external to the repository, and writes a whole-bank mechanical audit plus a ranked follow-up queue. The audit reads the current MT203 bank but does not change it.

The heuristic audit is not a substitute for expert scientific review. No changes are deployed by these workflows.

## MT203 semantic quality layer

`scripts/validate-mt203.mjs` is the **structural** validator (schema, ids, counts). It cannot tell whether a well-formed question is *right*. The semantic layer in `scripts/quality/` sits on top of it and is run by `scripts/quality-mt203.mjs`.

```powershell
npm run quality:mt203                # gate: exits 1 on any NEW error
npm run test:mt203-quality           # planted-defect tests + real-bank grading through the player adapter
node ... scripts/quality-mt203.mjs --verbose                  # every warning
node ... scripts/quality-mt203.mjs --worksheet review.json    # review queue, riskiest first
node ... scripts/quality-mt203.mjs --require-review           # also fail unless every question has a current verified review
```

| Dimension | What it detects | Where |
|---|---|---|
| Format | Per-format shape rules for all 11 types (statement numbers vs. options and the explanation, match bijections, sequence permutations, assertion–reason verdict set, graph data present, numerical quantities). An unregistered format is an error. | `format-profiles.mjs` |
| Answer uniqueness | Duplicate options, "of the above" options, explanations that concede a distractor is also correct | `dimensions.mjs` |
| Distractor quality | Longest-key and absolute-word clues, overlapping distractors, precision/unit clues | `dimensions.mjs` |
| Explanation quality | Thin or unsupported explanations, explanations that crown a different option, notes on the keyed option | `dimensions.mjs` |
| Difficulty | Level vs. worked reasoning, step count of the recalculation, format contract | `dimensions.mjs` |
| Syllabus relevance | TF-IDF of each question against every topic's lesson text | `dimensions.mjs` |
| Numerical verification | Independent recalculation of every numerical question from the stem's givens; the key must be the nearest option and no distractor may be as close | `numeric-verifiers.mjs` |
| Scientific accuracy | **Review ledger**: a script cannot certify science, so each question needs a current `verified` entry (`expert` or `assisted`). Editing a question changes its fingerprint and invalidates the review. | `ledger.mjs`, `review-ledger-mt203.json` |

Errors are definite defects and fail the build. Warnings are a review queue and never fail it. Known open errors are listed in `baseline-mt203.json` (a ratchet): they do not fail the build but are printed every run and block certification, and an entry that stops firing must be deleted. The verdict is `CERTIFIED` only when there are no errors and every question has a current verified review; otherwise it says `NOT CERTIFIED`.

Adding a numerical question requires adding its recalculation to `numeric-verifiers.mjs` (or an explicit waiver).
