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
