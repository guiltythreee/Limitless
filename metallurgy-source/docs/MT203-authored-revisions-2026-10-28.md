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

The full-bank answer-position rebalancing and the larger manual-review residue list remain separate QA work. This PR does not claim that all 286 MT203 questions, or the complete 1,097-question Metallurgy bank, have been fully validated.
