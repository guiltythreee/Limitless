# Limitless Standard Rewards (LSR-1)

**Policy identifier:** `LSR-1`  
**Status:** Provisional, versioned implementation in the open Probability-pathways PR. It is not deployed until that PR is merged and the site build completes.

LSR-1 supplies one shared EXP calculation and global level curve. Each learning module retains its own progress, rankings, accuracy, mastery, and exam history. Global EXP is not skill mastery and is never spendable currency.

## Fixed activity table

| Activity class | Base EXP | Typical verified evidence |
| --- | ---: | --- |
| Micro-practice | 5 | A real non-empty submitted answer |
| Standard task | 10 | A substantial completed task or typed page |
| Focused practice | 20 | A completed practice block |
| Assessment | 25 | A meaningful completed, scored assessment |
| Unit milestone | 50 | First verified topic/chapter mastery |
| Major completion | 100 | First verified pathway/course completion |
| Bespoke project | 20–100 | An immutable, pre-registered project with confirmed acceptance criteria |

Difficulty is foundational ×1.00, intermediate ×1.25, or advanced ×1.50. The shared engine chooses the base from the activity class; adapters cannot send custom multipliers or arbitrary EXP values.

Quality bonus is independent of the pass threshold: it starts at zero below 80% quality and rises to at most 20% of base EXP at 100%. A checkpoint that passes the provisional 70% threshold may receive +15 EXP once per checkpoint. The pass bonus is stored as its **own stable, idempotent award record** rather than hidden inside the assessment record.

## Repeat and identity rules

The first three completed instances of the same module/item on a local calendar day may earn EXP. Later same-item repeats earn zero global EXP while remaining valid local practice. Event IDs are idempotent; one-time milestone IDs and checkpoint IDs prevent renaming or replaying an event to get paid again.

Bookkeys uses the hash of normalized page text as the repeat-policy item ID, not a book/page filename. Its bridge only submits a newly verified completion with a transient Bookkeys check marker, a visible passage of at least 150 normalized characters, and an accepted local completion record. The text itself is never copied into the global ledger. A short page is still usable in Bookkeys, but it is not eligible for a global page reward.

Practice mistakes are not punished: a real submitted attempt can earn base micro-practice EXP. Accuracy only contributes the small quality bonus, while mastery and passing remain separate metrics. Empty or abandoned work, an open page, idle time, and speed alone do not qualify.

## Authoritative records and storage

There is no second parallel global XP counter. The Meta page recomputes totals and levels from versioned `rewardLedger` records in the registered module roots:

| Source | Canonical local root |
| --- | --- |
| Probability | `hc3-progress-v3` |
| Math Trainer LSR-1 adapter | `limitless-math-lsr1-v1` |
| Bookkeys LSR-1 adapter | `bookkeys-lsr1-v1` |
| MT201 | `mm-mt201-v1` |
| MT202 | `mm-mt202-v1` |
| MT203 | `mm-mt203-v1` |
| Bespoke projects (other disciplines) | `limitless-lsr1-personal-projects-v1` |

Existing local XP is not imported into global EXP. Progress records retain unrelated root fields during additive writes and resets. For Probability, a submitted answer and its reward, or a test's answers/result/rewards, are saved together in the same canonical root write. Reward notifications are dispatched only after that write succeeds. First-use reward activation timestamps keep legacy Probability attempts from receiving retroactive EXP or mastery milestones.

The profile-equipment preference is separate under `limitless.profile-equipment.v1`; equipping or unequipping a title, emblem, or profile effect never spends or changes lifetime EXP.

## Initial adapters

- **Bookkeys:** one standard-task reward for each eligible, newly completed substantial page; unit chapter and major book-completion rewards use the shared milestone classes.
- **Math Trainer / Zetamac:** session-level rewards, not answer-click rewards. The adapter requires the run's existing completion/attempt gate; the selected Easy/Normal/Hard setting adjusts the mapped difficulty tier, while accuracy can provide the quality bonus. A qualifying checkpoint pass has its own +15 record.
- **Probability:** standalone submitted questions earn micro-practice rewards. Answers in an assessment still populate answer history, mastery, and analytics but are not double-paid as independent practice. Meaningful assessments require at least five answers and a full answer set to earn assessment EXP. A topic milestone requires a latest eligible result for every question in that topic with at least 80% average; pathway/course completion requires every topic in that scope to meet the same bar.
- **Metallurgy MT201–MT203:** additive LSR-1 records are stored alongside the existing course progress roots; legacy local ranks/XP are retained but excluded from global totals. Each course's answer/exam flow has a course-specific regression suite.
- **Bespoke projects:** register module, ID, title, scope, fixed 20–100 base EXP, difficulty and acceptance criteria before starting. Project definitions are immutable. Completion requires an explicit acceptance confirmation and grants one reward only.

## Levels and universal rewards

The EXP cost to move from level (L) to (L+1) is (100 + 25(L-1)): Level 1→2 costs 100, Level 2→3 costs 125, and so on. Levels and unlocks use global EXP across all registered sources.

| Level | Unlock |
| ---: | --- |
| 2 | First Light · title |
| 5 | Scholar's Mark · emblem |
| 10 | Polymath · title; Polymath Glow · profile effect |
| 15 | Wayfinder · emblem |
| 20 | Keeper of Knowledge · title; Radiant Archive · profile effect |
| 25 | Luminous Archive · emblem |
| 30 | Limitless Sigil · emblem; Limitless Aura · profile effect |

Meta lists the next universal unlock and all unlocked rewards. Titles, emblems, and effects are equipable and saved separately from EXP. The effect currently changes Meta's appearance; applying equipped profile cosmetics consistently across every module is a separate presentation enhancement.

## Calibration and regression

Run from the Probability app:

```sh
npm run test:rewards
```

This command runs the policy matrix, Probability store/data-preservation tests, and a transparent synthetic five-day comparison of routine work: ten substantial Bookkeys pages, three Math Trainer sessions plus one assessment, and ten Probability question attempts plus one assessment. One-off book, topic, and pathway completions are excluded from the routine-week ratio because their frequency varies widely; their stable one-time behavior is tested independently.

The calibration is a stated scenario, **not measured personal study telemetry**. Use actual study logs to tune activity classification and repeat caps before treating the provisional values as final. The other CI workflows run Math Trainer, Bookkeys, and MT201–MT203 regression tests and the Probability type-check/static build.

## Deliberately deferred

Cloud sync, a spendable shop/currency, daily quests/streak EXP, and a global profile-cosmetic renderer on every module remain out of scope. Lifetime EXP cannot be spent. A module's local skill/rank progression remains separate from the global reward policy.
