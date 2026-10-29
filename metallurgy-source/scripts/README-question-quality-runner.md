# Metallurgy Question-Quality Test Branch

This branch carries a guarded runner for the 84 authored metallurgy question revisions.

- MT201: 12 authored replacements
- MT202: 47 authored replacements
- MT203: 25 authored replacements

The branch workflow applies the revisions to a clean checkout, performs safe deterministic answer-position balancing, runs the existing course test and validation scripts, and runs the production build. Only if all checks pass does the workflow commit the generated source/output changes back to this test branch. It never writes to main.

Workflow: .github/workflows/test-metallurgy-question-quality.yml

Runner: metallurgy-source/scripts/apply-authored-revisions.py

## Manual run

From the repository root, using Python 3.10+ and installed Node dependencies:

```powershell
py "metallurgy-source/scripts/apply-authored-revisions.py" --repo "$PWD" --balance-answers
```

This command is a read-only preflight. To apply and run tests/build locally, only after preflight succeeds:

```powershell
py "metallurgy-source/scripts/apply-authored-revisions.py" --repo "$PWD" --apply --balance-answers --run-tests --build
```

The runner creates a dated backup outside the repository before edits, stops on stale target fingerprints or pre-existing changes to target files, preserves stable question IDs/types/counts, installs durable overlays for MT201/MT202 because their original authoring banks are external to the repository, and writes a whole-bank mechanical audit plus a ranked follow-up queue.

The heuristic audit is not a substitute for expert scientific review. No changes are deployed by this workflow.
