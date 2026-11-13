# MT202 transformation audit — 2026-11-13

## Scope

This audit examines the existing MT202 revision overlay, question metadata registry, generated chapter JSON, and the saved whole-bank follow-up queue. It does not claim that every question has been rewritten or independently certified.

## Transformation counts

- Source bank: 522 questions across nine chapters.
- Durable revision overlay after the 2026-11-13 corrections: 389 unique question targets.
- No overlay entry: 133 questions.
- The existing authored revision pack contributed 47 MT202 target questions. These are targeted replacements/edits, not necessarily full stem rewrites.
- The optional deterministic answer-position pass changed the option order and answer key on 375 eligible four-option MCQs. This is a presentation/key-position change, not a substantive content rewrite.
- The 47 authored targets and 375 answer-position targets overlap; they must not be added as if they were disjoint.
- Before this pass, the 387-entry overlay contained 378 records with stem/statement/table/option fields updated and 9 explanation-only records. The structural-change count includes option/key reordering, so it is not a count of full rewrites.
- This evidence supports identifying overlay-covered and untouched questions. It does **not** support an exact minor-edit versus substantial-rewrite split for every target.


## Overlay field-level inspection

A direct inspection of the 389 overlay records shows that the changes are heterogeneous; they should not be described as 389 full rewrites:

- 42 records replace a broad set of question fields (including the stem/structure, options, answer and solution material).
- 154 records update options, answer and detailed solution.
- 139 records update options and answer only; these are consistent with answer-position/key changes and should not be counted as substantive rewrites without the original Markdown comparison.
- The remaining 54 records have narrower combinations of explanation, key, statement, assertion/reason or option updates.
- Across the overlay, 378 records update options and 376 update the answer field. Field presence alone does not establish whether the change is a shuffle, a distractor rewrite or a conceptual correction.

The metadata registry's introductory note was corrected: the 522 status values are current editorial approvals, not drafts, while approval remains provisional rather than independent faculty certification. A note explicitly warns that quality scores require calibration against student performance and faculty review. The registry README was reconciled to the current 522 approved / 0 review / 0 rejected state.

## Source-of-truth limitation

`scripts/sync.mjs` reads the authoritative Markdown question bank and solution files from an external folder. Those Markdown files are not checked into this GitHub branch. The repository contains generated chapter JSON and a fingerprint-guarded revision overlay. The original Markdown bank therefore could not be diffed line by line in this audit. The overlay fingerprints protect against applying edits to a changed source question, but they do not replace a complete original-to-revised Markdown diff.

## Corrections made during this audit

- `ch01-q10`: reconciled the durable overlay's table and key explanation with the generated question and the course companion, retaining Po in the course's metalloid list. The source question, answer and stable ID are unchanged; this resolves a stale overlay/output mismatch detected by CI.
- `ch02-q35`: replaced the misleading claim that close-packed planes generally have the largest interplanar spacing. The revised item distinguishes planar density from interplanar spacing using (d_{hkl}=a/\sqrt{h^2+k^2+l^2}), and correctly relates a smaller Burgers vector to lower dislocation line energy. The original question type (B) and stable question ID are preserved.
- `ch01-q14`: corrected an assertion–reason key. The reason explains ionic brittleness caused by charge ordering, but does not explain electrical insulation; both statements are true, while the reason does not fully explain the assertion (answer A).
- `ch01-q33`: corrected an assertion–reason key. Both the assertion and reason are true, and the interatomic-potential explanation supports the trend linking bond strength with melting point and elastic modulus (answer C).
- `ch04-q35`: corrected an explanation/key inconsistency: the option identifying solute partitioning is (a), not (c), and the solution now matches the keyed answer.
- `ch04-q38`: corrected a distractor-reference typo in the explanation (overheating is option (a), not (b)).
- `ch05-q40`: corrected the explanation's list of incorrect options so it no longer includes the keyed correct option (d).
- `ch05-q48`: corrected the explanation's distractor reference; option (a), not (b), describes a general grain boundary.
- `ch09-q44`: corrected the solution's mechanism explanation. Carbon diffusivity in ferrite is higher because its migration activation barrier is lower; lower packing factor alone is not an adequate explanation.
- `ch03-q42`: retained the course-supported, qualified claim that a moderate amount of dissolved gas can improve pressure-tightness in the specific context of interdendritic sponginess. The assertion/reason and explanation now explicitly state that this is context-specific and is not a general recommendation to tolerate gas porosity.
- `ch02-q35` and `ch03-q42` retain specific PDF section references, high mapping confidence, and reassessed difficulty/quality scores. Both are approved after correction.
- Two assertion–reason answer-key inconsistencies and four explanation-to-option inconsistencies were found during manual inspection of the high-risk queue (`ch01-q14` and `ch01-q33`) and corrected in the durable overlay.
- Eight further high-risk answer-length flags were addressed by making distractor lengths and specificity more comparable: `ch02-q37`, `ch02-q43`, `ch03-q33`, `ch03-q34`, `ch03-q47`, `ch03-q56`, `ch03-q70`, and `ch03-q73`. Correct-answer labels were preserved and the edits were added to the durable overlay.
- All 84 numerical (`E`) questions were additionally tagged with the `apply` reasoning skill. Before this correction, only one question in the entire bank carried that tag.

## Overlay synchronization and preservation

The CI-discovered overlay/output drift has now been reconciled:

- All 389 MT202 durable overlay records are present in the nine generated chapter JSON files.
- All 389 pinned source fingerprints match the recorded baseline commit.
- All overlay update fields match the generated question records; zero mismatches remain.
- All nine generated chapter JSON files match their checked-in `metallurgy/data/mt202` mirrors byte-for-byte.
- Chapter counts remain 35, 53, 73, 47, 70, 58, 60, 56 and 70 (522 total). Question IDs and ordering are unchanged.
- The course index generation date is refreshed to 2026-11-13; no course progress, storage keys, answer history or reward data are changed.

## Updated heuristic follow-up queue

The October 28 queue was a historical snapshot. It has been superseded for MT202 by a fresh scan of the current 522-question generated bank:

- 474 questions flagged for at least one heuristic review signal.
- High: 148; Medium: 246; Review: 80.
- The scan checks option-length cues, absolute wording, P1/P2/P3 strategy-code references, structured item types, duplicate stems and option-label references.
- Severity is a triage aid, not a scientific defect verdict. In particular, structured-item flags and absolute wording need contextual review rather than automatic rewriting.
- The queue is reproducible with `scripts/audit-mt202-question-quality.mjs`; the question-quality workflow now runs it in `--check` mode.

## Metadata and structural recheck

- 522 source question records and 522 metadata records.
- 522 unique question IDs.
- 522 approved, 0 in review, 0 rejected.
- Difficulty distribution: level 1 = 60, level 2 = 90, level 3 = 249, level 4 = 122, level 5 = 1. This distribution is populated but still needs calibration against actual solving time and cognitive demand.
- All 175 learning objectives have at least one mapped question; 36 objectives have only one question, so their practice depth is thin.
- The `apply` tag now appears on 85 questions (84 numerical items plus one existing non-numerical item).
- Every record has a learning objective, difficulty rating, reasoning-skill tags, misconception tags and a valid quality score.
- A remote parity check against all nine generated chapter JSON files reproduced the metadata validator's structural checks with zero errors: 522/522 IDs, counts, question types, objective links, topic links, difficulty values, reasoning tags, misconception tags, rubric dimensions, score totals and status rules passed. The actual Node.js validator command has not yet been run in a repository runtime.
- All 522 records now have at least one chapter/topic-level supporting reference mapped to the Physical Metallurgy Study Companion or the relevant merged/supplemented chapter PDF. `ch02-q35` and `ch03-q42` additionally retain precise PDF section references. These companion references improve course-resource traceability but do not replace exact citations to the original lecture slides, textbooks or PYQs; primary-source provenance remains incomplete.

## Remaining work — do not treat this audit as final approval

1. Obtain the authoritative Markdown bank and solution folder to generate an exact per-question original-to-revised diff. Then classify each question as retained, lightly edited, substantially rewritten, or replaced.
2. Manually inspect the regenerated 474-question MT202 heuristic follow-up queue (148 High, 246 Medium, 80 Review) in `reports/mt202-question-quality-follow-up-queue-2026-11-13.csv`. It is generated deterministically from the current nine chapter JSON files by `scripts/audit-mt202-question-quality.mjs`; CI checks that the committed queue matches the generator. Heuristic flags are review prompts, not confirmed defects.
3. Reassess distractor plausibility, conceptual depth, explanation completeness, and every numerical/data-reading answer. The existing metadata scores are editorial assessments, not independent faculty validation.
4. Replace or supplement the topic-mapped companion references with exact original lecture, textbook and PYQ citations wherever those sources can be identified. The current companion references are supporting course-resource pointers, not a complete primary-source audit.
5. Run `npm run validate:mt202-metadata`, the MT202 test suite, and the production build in the actual repository environment. These commands were not run by this remote GitHub-content audit.

## Preservation

Changes remain on `mt202/question-metadata-registry`. A pre-audit backup branch was created as `backup/mt202-before-final-qa-2026-11-13`. No merge to `main` or production deployment was performed by this work.
