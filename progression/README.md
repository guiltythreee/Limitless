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
| Bespoke project | 20–100 | An immutable project definition registered before work starts; one canonical completion event |

## Difficulty and quality

- Foundational: ×1.0
- Intermediate: ×1.25
- Advanced: ×1.5
- Optional quality bonus: from 0 EXP at 80% quality to at most 20% of the activity's base EXP at 100% quality.
- A successful first pass is persisted as a separate 15 EXP award record with its own deterministic ID, once per pass key.

The activity-award formula is:

`round((base EXP × difficulty multiplier + quality bonus) × repeat multiplier)`

A qualifying first pass is a separate, idempotent 15 EXP award record. Each activity and bonus record is stored independently so the ledger shows why every point was granted.

## Anti-farming and persistence

- The first 3 eligible completions of the same content key per local calendar day receive full activity EXP; the next 3 receive half (rounded with the final result); further repeats receive no activity EXP.
- Event IDs are idempotent. Replaying the same event ID never increases global EXP again.
- Milestone/course-completion events need a stable one-time key and cannot pay twice.
- Bespoke projects must be registered under an approved module namespace before completion. Their integer base reward is fixed from 20 to 100 EXP, and title, scope, and acceptance criteria are immutable after registration. Completion uses a canonical event ID, so changing the ID cannot rerun the payout.
- Opening a lesson, typing sample text, clicking a manual “complete” button, speed by itself, or idle time does not qualify.
- The ledger is local-first in `localStorage` under `limitless.reward-ledger.v1`. The lifetime total is recomputed from award history, not trusted from a parallel counter. If storage is unavailable, the reward call fails closed rather than claiming an award was saved.
- Each award stores the LSR version, completion evidence, activity class, content key, difficulty, quality and repeat multipliers, credited EXP, and a human-readable reason. The global dashboard exposes recent award breakdowns.
- Existing module records and local XP are preserved. Global EXP is a separate account-wide total. If an activity persists but the separate reward write fails, the adapters retry using the same event ID.

## Global level curve

The EXP cost from level L to L+1 is `100 + 25 × (L - 1)`. Thus Level 1 → 2 costs 100 EXP, Level 2 → 3 costs 125 EXP, and Level 3 → 4 costs 150 EXP.

## Universal level rewards

Unlocks are derived directly from the account-wide level, regardless of which discipline earned the EXP. LSR-1 initially defines:

| Level | Reward | Type |
| ---: | --- | --- |
| 2 | First Light | Title |
| 5 | Scholar's Mark | Emblem |
| 10 | Polymath | Title |
| 10 | Polymath Glow | Profile effect |
| 15 | Wayfinder | Emblem |
| 20 | Keeper of Knowledge | Title |
| 20 | Radiant Archive | Profile effect |
| 25 | Luminous Archive | Emblem |
| 30 | Limitless Sigil | Emblem |
| 30 | Limitless Aura | Profile effect |

The dashboard shows unlocked rewards and the next milestone. Unlocked titles, emblems and profile effects can be equipped independently, and level-up notifications acknowledge every level crossing. The catalogue provides modest unlocks every 5 levels and profile effects at multiples of 10.

## Bespoke project workflow

The Limitless home dashboard has a self-service project form. Register the module, stable project ID, title, scope, acceptance criteria, and the 20–100 EXP base value before starting. Project definitions are stored in the shared ledger and cannot be edited later. When the project is finished, the user confirms the written criteria and the ledger grants one reward from the registered value with the selected difficulty multiplier. The same project completion cannot be claimed twice.

Allowed project namespaces are `personal-projects`, `probability`, `math-trainer`, `bookkeys`, and `metallurgy`. Work not yet represented by a module can use `personal-projects` and explain its discipline in the scope.

## Initial adapters

- **Bookkeys:** 10 EXP for each newly recorded completed book page; the canonical page-progress record is the evidence, and Bookkeys itself only records pages after its typing/accuracy checks. A capped local XP counter does not suppress global rewards. A 50 EXP book milestone is paid once when Bookkeys records the book as complete and at least 3 pages are present. The bridge seeds a baseline on first run so legacy pages are not retroactively rewarded, and retries if the separate reward write fails. Short one-page PDFs cannot farm the completion milestone.
- **Zetamac / Math Trainer:** primarily session-level, not per-answer. A run with at least 3 answered questions earns 10 EXP, or 20 EXP at 10 or more answers. Difficulty comes from the selected tier and quality from accuracy. A run that meets the trainer's existing clear criteria generates a separate assessment award and can earn the one-time first-pass bonus.
- **Probability:** 5 EXP for each persisted submitted question attempt and 25 EXP for a meaningful assessment with at least five answers. Test quality determines the optional quality bonus; an 80%-or-better assessment earns the one-time first-pass bonus. A one-time 50 EXP topic-mastery milestone is awarded when every question in a lesson has a latest result averaging at least 80%. Completing the current archive requires every question-bearing topic to meet that mastery bar.

## Persistence and recovery

The central ledger is separate from each module's existing local-first record. Adapters therefore persist the canonical learning record first, then submit a deterministic reward event. If a ledger write fails, the same event is retried on reload/focus or on the next Bookkeys storage update; replay is idempotent. Probability recovery only considers attempts/tests saved after the LSR-1 activation timestamp, preventing legacy attempts from being paid retroactively. Math Trainer seeds a seen-run cursor before new sessions and treats imported runs as historical.

## Calibration and regression

Run:

```sh
node --test progression/reward-standard.test.cjs progression/bookkeys-bridge.test.cjs
node progression/calibrate-week.cjs
```

The calibration script is a transparent synthetic five-day scenario, not measured user telemetry. It compares 13 Bookkeys pages plus one book milestone, three substantive Math Trainer sessions plus one tier clear/mastery, and 20 Probability question attempts plus one assessment. Its gate requires the largest weekly module total to remain within 1.25× of the smallest under those stated assumptions. Replace the scenario counts with real study-log observations before treating the balance as validated in actual use.

The regression matrix covers all six fixed activity classes across foundational/intermediate/advanced difficulty, quality caps, evidence compatibility, duplicate and one-time events, repeat limits, ledger-authoritative totals, level boundaries, cosmetic equipment, project immutability, and level-up events. CI also runs Bookkeys' full app tests, checks that the Probability engine copy matches the root engine, verifies that Probability preserves unknown progress-root extension fields, and builds Probability.
