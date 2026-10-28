# Limitless Reward Standard — LSR-1

LSR-1 is the shared global progression contract. Module-specific skill/rank XP remains available for mastery and local mechanics; it is **not** counted a second time as global EXP.

## Activity reference line

| Activity class | Base EXP | Completion evidence |
| --- | ---: | --- |
| Micro-practice | 5 | A real question or short recall attempt is submitted |
| Standard task | 10 | A discrete task is completed (for example, a Bookkeys page) |
| Focused practice | 20 | A substantive practice block is completed |
| Assessment | 25 | A scored assessment is finished with a meaningful sample |
| Milestone | 50 | A one-time, objectively verified module milestone |
| Course completion | 100 | A verified course/pathway completion |

## Difficulty and quality

- Foundational: ×1.0
- Intermediate: ×1.25
- Advanced: ×1.5
- Optional quality bonus: from 0 EXP at 80% quality to at most 20% of the activity's base EXP at 100% quality.
- The first successful pass for a stable assessment key grants +15 EXP once.

The pre-rounding formula is:

`(base EXP × difficulty multiplier + quality bonus) × repeat multiplier + first-pass bonus`

The final award is rounded to the nearest integer.

## Anti-farming and persistence

- The first 3 eligible completions of the same content key per local calendar day receive full activity EXP; the next 3 receive half (rounded with the final result); further repeats receive no activity EXP.
- Event IDs are idempotent. Replaying the same event ID never increases global EXP again.
- Milestone/course-completion events need a stable one-time key and cannot pay twice.
- Opening a lesson, typing sample text, clicking a manual “complete” button, speed by itself, or idle time does not qualify.
- The ledger is local-first in `localStorage` under `limitless.reward-ledger.v1`. If storage is unavailable, the reward call fails closed rather than claiming an award was saved.
- Existing module records and local XP are preserved. Global EXP is a separate account-wide total.

## Global level curve

The EXP cost from level L to L+1 is `100 + 25 × (L - 1)`. Thus Level 1 → 2 costs 100 EXP, Level 2 → 3 costs 125 EXP, and Level 3 → 4 costs 150 EXP.

## Initial adapters

- **Bookkeys:** 10 EXP for each newly completed real book page; 50 EXP once when a book's required sections are complete. The bridge seeds a baseline on its first run so legacy pages are not retroactively rewarded.
- **Zetamac / Math Trainer:** 10 EXP for a run with at least 3 attempted answers, or 20 EXP for a run with at least 10 attempted answers; difficulty comes from the selected tier and quality from accuracy. A cleared tier can earn the one-time first-pass bonus.
- **Probability:** 5 EXP for each submitted question attempt and 25 EXP for a meaningful test. Test quality determines the optional quality bonus; an 80%-or-better meaningful assessment earns the one-time first-pass bonus.

## Test

Run `node --test progression/reward-standard.test.cjs`. The test suite covers the reference line, multipliers, caps, duplicate events, repeat limits, first-pass bonuses, one-time milestones and level thresholds.
