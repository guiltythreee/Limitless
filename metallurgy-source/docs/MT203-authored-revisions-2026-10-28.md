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

The answer-position balancing for MT203 is now complete and has a passing automated regression test. The larger manual-review residue list remains separate QA work. This PR does not claim that every scientific claim, distractor, explanation or wording cue in all 286 MT203 questions—or the complete 1,097-question Metallurgy bank—has been fully validated.

## Answer-position bias remediation — 2026-10-29

After applying the 25 authored MT203 replacements, and immediately before the separate answer-position balancing pass, the 286 four-option questions had answers distributed as A 142, B 109, C 28 and D 7. The source now has A 72, B 72, C 71 and D 71. Within every topic, the number of correct answers assigned to any two positions differs by at most one.

A total of 285 question option orders were changed. The option content itself was not rewritten by this pass: option objects were reordered, their labels reassigned sequentially (a–d), the answer key remapped to the same correct option, and keyed distractor explanations remapped with their associated options. Question IDs, question order, stems, explanations, difficulty and type were retained. The only frozen item was `t1-08`, whose explanation explicitly says “Only (a) matches all four”; its surrounding topic was still balanced.

The regression guard `scripts/test-answer-key-balance.mjs` is wired into `.github/workflows/test-metallurgy-content.yml`. This work edits the typed MT203 source only; generated JSON was not edited. MT201/MT202 authored replacement packs remain pending because their authoritative authoring banks are external to the repository.

