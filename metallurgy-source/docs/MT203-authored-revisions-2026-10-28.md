# MT203 Authored Question Revisions — 28 October 2026

## Scope

Applied 25 exact authored replacements from the supplied Metallurgy Question Revision Batches 01–06 to the authoritative typed MT203 sources under `app/data/qbank/`. Batch 04 had no MT203 records. The changes target existing stable IDs; question counts, IDs, topic ordering, and course routing are unchanged.

## Applied IDs

| Source topic | Existing question IDs revised |
|---|---|
| t1 | `t1-11`, `t1-27` |
| t2 | `t2-01`, `t2-15`, `t2-32` |
| t3 | `t3-21` |
| t7 | `t7-16` |
| t8 | `t8-02`, `t8-05`, `t8-14`, `t8-17`, `t8-19`, `t8-26`, `t8-29`, `t8-30` |
| t9 | `t9-13` |
| t10 | `t10-01`, `t10-06`, `t10-28` |
| t11 | `t11-07`, `t11-08`, `t11-13`, `t11-14`, `t11-24`, `t11-26` |
| **Total** | **25 existing questions** |

The supplied updates address weak or unrelated distractors, concept precision, material-selection ambiguity, and technical/explanation accuracy. Replacement text, option order, answer key, explanation and distractor explanations came from the authored packs; no substitute questions were invented.

## Compatibility exception

The authored pack lists `t8-05` as `recall`, but the current GitHub source at the start of this change was already typed `concept`. To avoid changing the live course taxonomy on the basis of a stale-pack mismatch, its supplied stem/options/key/explanation/distractors were applied while retaining the current `concept` type. This is the only declared type discrepancy in the 25 targets.

## Deferred work and source limitation

The same packs contain 12 MT201 and 47 MT202 replacements. Those were **not applied** in this pass: their authoritative banks are external to this repository and were not included in the uploaded source ZIP. MT201's `sync-mt201.mjs` reads an external JavaScript bank; MT202's `sync.mjs` reads an external Markdown bank and solutions. Editing only generated `public/data/mt201` or `public/data/mt202` JSON would risk losing the revisions at the next sync, so those generated files were left unchanged.

The answer-position balancing for MT203 is complete and has a passing automated regression test. A separate, targeted wording and distractor pass has also been applied, but full manual verification of every scientific claim across all 286 MT203 questions—and the complete 1,097-question Metallurgy bank—remains separate QA work. The screening metrics below are string-length heuristics, not a claim that every distractor is now ideal.

## Answer-position bias remediation — 2026-10-29

After applying the 25 authored MT203 replacements, and immediately before the separate answer-position balancing pass, the 286 four-option questions had answers distributed as A 142, B 109, C 28 and D 7. The source now has A 72, B 72, C 71 and D 71. Within every topic, the number of correct answers assigned to any two positions differs by at most one.

A total of 285 question option orders were changed. The option content itself was not rewritten by this pass: option objects were reordered, their labels reassigned sequentially (a–d), the answer key remapped to the same correct option, and keyed distractor explanations remapped with their associated options. Question IDs, question order, stems, explanations, difficulty and type were retained. The only frozen item was `t1-08`, whose explanation explicitly says “Only (a) matches all four”; its surrounding topic was still balanced.

The regression guard `scripts/test-answer-key-balance.mjs` is wired into `.github/workflows/test-metallurgy-content.yml`. This work edits the typed MT203 source only; generated JSON was not edited. MT201/MT202 authored replacement packs remain pending because their authoritative authoring banks are external to the repository.



## Targeted factual and answer-cue review — 2026-10-29

A further targeted pass revised option wording in **124 question records** to reduce conspicuously long correct options and replace obviously unrelated distractors with topic-relevant misconceptions. These are textual content changes; stable question IDs, question order, option labels and correct-answer labels were retained. Some of these records also appear in the 25-record authored revision-pack list above.

The basic length-cue screen (four-option records only) changed as follows:

| Heuristic | Before this wording pass | Current source |
|---|---:|---:|
| Correct option is uniquely longest | 179 / 286 | 90 / 286 |
| Correct option is at least 1.5× the average length of the three distractors | 157 / 286 | 15 / 286 |
| Correct option is at least 2× the shortest option | 174 / 286 | 37 / 286 |

These counts are diagnostic flags, not automatic defect counts: short numerical answers, terminology questions and standardized assertion–reason options can legitimately trip a length-only test. Distractor quality still requires subject-matter judgement.

Three specific content corrections were made during this pass:

- `t4-27`: the 50% point on a cumulative weight-fraction curve is the weight-median molecular weight (`M_50`), not the mode (`M_p`).
- `t1-26`: saponifying PVAc to PVA is hydrolysis; blending PVA with starch is physical mixing, not a second polymerization.
- `t3-20`: changed a stated particle size from `0.5 mm` to `0.5 μm` so the measurement matches the stated submicrometre emulsion-polymerization process.

## Final automated regression

The latest completed GitHub Actions run for this branch passed:
- MT203 validation: 286 questions across 11 topics.
- Course registry validation.
- MT203 tests: 47 passed, 0 failed.
- MT203 migration tests: 123 assertions passed, 0 failed.
- Shared question-renderer tests: 90 assertions passed, 0 failed.
- Answer-key-balance regression: A=72, B=72, C=71, D=71; maximum per-topic spread 1.
- TypeScript `npx tsc --noEmit --incremental false`.

The Vercel status remains a separate build-rate-limit/upgrade failure. No deployment was performed.


## Answer-sequence QA — 2026-10-30

A sequence-level audit found that balanced answer totals alone still allowed long runs of identical keys in question order (up to seven consecutive answers in one topic). The option order, answer key and option-keyed distractor explanations have now been remapped across the 286 four-option questions. Question IDs, order, stems, option wording, correct-option meaning, difficulty and question types are preserved. The existing label-dependent explanation in `t1-08` remains untouched.

The new regression guard checks that no topic has a run longer than three identical answer positions, every eight-question MCQ window contains all four positions with no position appearing more than four times, and no four-answer sequence repeats within a topic. The existing per-topic/global answer-count test remains in place. These are safeguards against conspicuous patterns, not a claim that answer position can never be guessed.
