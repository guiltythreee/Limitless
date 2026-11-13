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

The metadata registry's introductory note was also corrected: the 522 status values are current editorial approvals, not drafts, while approval remains provisional rather than independent faculty certification. A note now explicitly warns that quality scores require calibration against student performance and faculty review.

## Source-of-truth limitation

`scripts/sync.mjs` reads the authoritative Markdown question bank and solution files from an external folder. Those Markdown files are not checked into this GitHub branch. The repository contains generated chapter JSON and a fingerprint-guarded revision overlay. The original Markdown bank therefore could not be diffed line by line in this audit. The overlay fingerprints protect against applying edits to a changed source question, but they do not replace a complete original-to-revised Markdown diff.

## Corrections made during this audit

- `ch02-q35`: replaced the misleading claim that close-packed planes generally have the largest interplanar spacing. The revised item distinguishes planar density from interplanar spacing using (d_{hkl}=a/\sqrt{h^2+k^2+l^2}), and correctly relates a smaller Burgers vector to lower dislocation line energy. The original question type (B) and stable question ID are preserved.
- `ch01-q14`: corrected an assertion–reason key. The reason explains ionic brittleness caused by charge ordering, but does not explain electrical insulation; both statements are true, while the reason does not fully explain the assertion (answer A).
- `ch01-q33`: corrected an assertion–reason key. Both the assertion and reason are true, and the interatomic-potential explanation supports the trend linking bond strength with melting point and elastic modulus (answer C).
- `ch04-q35`: corrected an explanation/key inconsistency: the option identifying solute partitioning is (a), not (c), and the solution now matches the keyed answer.
- `ch04-q38`: corrected a distractor-reference typo in the explanation (overheating is option (a), not (b)).
- `ch05-q40`: corrected the explanation's list of incorrect options so it no longer includes the keyed correct option (d).
- `ch05-q48`: corrected the explanation's distractor reference; option (a), not (b), describes a general grain boundary.
- `ch03-q42`: retained the course-supported, qualified claim that a moderate amount of dissolved gas can improve pressure-tightness in the specific context of interdendritic sponginess. The assertion/reason and explanation now explicitly state that this is context-specific and is not a general recommendation to tolerate gas porosity.
- Both questions now have source references, high mapping confidence, reassessed difficulty and quality scores. Both are marked approved after the corrections.
- Two assertion–reason answer-key inconsistencies and four explanation-to-option inconsistencies were found during manual inspection of the high-risk queue (`ch01-q14` and `ch01-q33`) and corrected in the durable overlay.
- Eight further high-risk answer-length flags were addressed by making distractor lengths and specificity more comparable: `ch02-q37`, `ch02-q43`, `ch03-q33`, `ch03-q34`, `ch03-q47`, `ch03-q56`, `ch03-q70`, and `ch03-q73`. Correct-answer labels were preserved and the edits were added to the durable overlay.
- All 84 numerical (`E`) questions were additionally tagged with the `apply` reasoning skill. Before this correction, only one question in the entire bank carried that tag.

## Metadata and structural recheck

- 522 source question records and 522 metadata records.
- 522 unique question IDs.
- 522 approved, 0 in review, 0 rejected.
- Difficulty distribution: level 1 = 60, level 2 = 90, level 3 = 249, level 4 = 122, level 5 = 1. This distribution is populated but still needs calibration against actual solving time and cognitive demand.
- All 175 learning objectives have at least one mapped question; 36 objectives have only one question, so their practice depth is thin.
- The `apply` tag now appears on 85 questions (84 numerical items plus one existing non-numerical item).
- Every record has a learning objective, difficulty rating, reasoning-skill tags, misconception tags and a valid quality score.
- The remote recheck of the repository validator's structural rules returned zero errors.
- The two corrected questions are referenced to the relevant Chapter 2 and Chapter 3 course PDFs. Only 2 of 522 metadata records currently have source references; source provenance remains a major unfinished task.

## Remaining work — do not treat this audit as final approval

1. Obtain the authoritative Markdown bank and solution folder to generate an exact per-question original-to-revised diff. Then classify each question as retained, lightly edited, substantially rewritten, or replaced.
2. Manually inspect the 461 MT202 entries in the saved heuristic follow-up queue (151 High, 231 Medium, 79 Review). This queue predates the latest eight distractor edits and must be regenerated after a real source sync. Heuristic flags are review prompts, not confirmed defects.
3. Reassess distractor plausibility, conceptual depth, explanation completeness, and every numerical/data-reading answer. The existing metadata scores are editorial assessments, not independent faculty validation.
4. Add source references for the remaining 520 records where the supporting course source can be identified.
5. Run `npm run validate:mt202-metadata`, the MT202 test suite, and the production build in the actual repository environment. These commands were not run by this remote GitHub-content audit.

## Preservation

Changes remain on `mt202/question-metadata-registry`. A pre-audit backup branch was created as `backup/mt202-before-final-qa-2026-11-13`. No merge to `main` or production deployment was performed by this work.
