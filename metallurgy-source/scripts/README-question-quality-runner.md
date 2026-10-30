# Metallurgy Question-Quality Test Branch

This branch carries a guarded runner for the 84 authored metallurgy question revisions.

- MT201: 12 authored replacements
- MT202: 47 authored replacements
- MT203: 25 authored replacements

The committed branch already contains the authored revisions, durable MT201/MT202 overlays, generated output mirrors, answer-position balancing, and the audit/follow-up reports.

The GitHub Actions workflow is deliberately read-only with respect to repository content: it validates the committed overlays and generated mirrors, runs the MT201/MT202/MT203 regression checks and validators, and builds the metallurgy site. It does not apply revisions, modify files, or commit generated output.

Workflow: .github/workflows/test-metallurgy-question-quality.yml

Runner: metallurgy-source/scripts/apply-authored-revisions.py

## Manual run

From the repository root, using Python 3.10+ and installed Node dependencies:

```powershell
py "metallurgy-source/scripts/apply-authored-revisions.py" --repo "$PWD" --balance-answers
```

This command is a read-only preflight. To apply the revision pack locally, only after preflight succeeds:

```powershell
py "metallurgy-source/scripts/apply-authored-revisions.py" --repo "$PWD" --apply --balance-answers --run-tests --build
```

The runner creates a dated backup outside the repository before edits, stops on stale target fingerprints or pre-existing changes to target files, preserves stable question IDs/types/counts, installs durable overlays for MT201/MT202 because their original authoring banks are external to the repository, and writes a whole-bank mechanical audit plus a ranked follow-up queue.

The heuristic audit is not a substitute for expert scientific review. No changes are deployed by this workflow.
