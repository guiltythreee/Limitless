# Studies & Disciplines Layer — Architecture Proposal

Status: S0 contracts, S1 read-only reference registrations, S2a registration-backed homepage directory, and S2b.1 read-only progress projections implemented and validated; S2b.2 shared landing composition implemented, final CI validation pending. No storage migration.
Branch: `architecture/studies-discipline-layer-20261101`
Base: P6.6 branch head `13ab67766c5ad572e2c9e3133d1cedf9e31be3b8`.

## 1. Purpose

Add a general Studies / Disciplines area to Limitless so a learner can enter a discipline and use the learning facilities that discipline actually supports. The shared layer should reduce repeated platform work when another discipline is added, while preserving each discipline's own curriculum, content, grading, mastery rules, and canonical progress.

This is **not** an attempt to make Probability itself discipline-independent. Probability remains a discipline with its own subject matter, lesson catalogue, overlapping pathways, question bank, grading, tests, and mastery/progress model.

## 2. Keep these responsibilities separate

### Discipline and curriculum
A discipline owns its identity, learning objectives, content catalogue, topic/lesson structure, and any curated routes through that content. A route is a view over stable content IDs, not a second copy of the lessons. One lesson may appear in several pathways (as Probability already does) while retaining one content identity and one progress history.

### Shared study experience
The platform may provide reusable navigation, content-section layout, study-session orchestration, question-player integration, revision entry points, and common progress views. These are composition and presentation capabilities, not a universal subject syllabus.

### Discipline adapters
Each discipline remains authoritative for:
- content and rich rendering (theory, formulas, diagrams, examples, source material);
- supported answer formats and input controls;
- grading, partial credit, and assessment rules;
- completion and mastery criteria;
- canonical progress persistence and migration;
- optional capabilities such as bookmarks, drafts, timers, analytics, and revision.

A capability must be declared only when it is implemented and supported by the adapter. Missing capabilities must not be simulated by generic UI.

### Global Meta / LSR-1
Meta reads verified reward records and calculates global EXP, levels, and universal unlocks. It does not own curriculum, question history, mastery, or discipline-local progression. A study action may submit eligible evidence through the existing LSR-1 adapter; the study layer must not award arbitrary EXP or maintain a second global counter.

## 3. What already exists (and what it does not provide)

- The root home page already has a static `Studies & Disciplines` group in `tools.js`, currently listing Probability and Metallurgy. The missing piece is registration-backed discovery and consistent metadata, not the existence of a Studies section.
- P6 shared learning-player contracts/runtime handle question navigation, answer state, submission, and adapter-owned grading. They are not a curriculum or discipline registry.
- P6.5 provides a common structural shell for question-player surfaces. It does not provide a universal lesson renderer or study dashboard.
- Metallurgy has a course registry, manifests, capability flags, and a P5 activity/history/goal core. That core currently lives under `metallurgy-source/app/platform/learning/` and imports Metallurgy course types; it must not be treated as a drop-in cross-app package.
- Probability has its own rich lesson model, pathway graph, question bank, partial-credit grading, attempts, tests, bookmarks, drafts, goal data, and migration logic under `probability-source/`.
- LSR-1 already provides shared global rewards and source adapters. The existing local progress stores remain authoritative.

Therefore the missing capability is a **cross-discipline discovery/composition contract and shared study surface**, not another Probability engine and not another global progress database.

## 4. Proposed boundary and data model

Introduce a framework-neutral `shared/studies/` contract layer. Keep it dependency-free: no React, Next.js, browser storage, course imports, or reward-policy implementation.

The first contract set should describe:

1. **Discipline descriptor** — stable ID, display metadata, route, status, and declared study capabilities.
2. **Content reference** — stable discipline-scoped ID and content kind. It identifies content but does not copy content into the shared layer.
3. **Curriculum node** — a content reference with optional parent/topic/unit relationships and learning-objective metadata.
4. **Learning pathway** — ordered references to existing curriculum nodes. Multiple pathways may reference the same node; duplicate content and duplicate progress records are not created.
5. **Study capability declaration** — truthful availability of theory, examples, practice, assessment, revision, bookmarks, drafts, timers, attempt history, analytics, goals, and mastery views. Capabilities are explicit and may be absent.
6. **Discipline adapter** — read-only access to descriptors, curriculum/pathways, supported study actions, and a normalized progress projection. The adapter delegates writes to the discipline's existing implementation.
7. **Progress projection** — a read model for cross-discipline summaries. It may report completion/mastery only when the discipline adapter can define those meanings. Unknown values remain unknown; no inferred timestamps, grades, or mastery.

The shared layer should not require every discipline to implement every content kind or answer type.

## 5. Progress and persistence rules

- Do not move Probability or Metallurgy records into a new shared store.
- Do not change existing local-storage keys, schemas, migrations, attempt IDs, or reward event IDs.
- Do not reconstruct or overwrite legacy history as part of registration.
- Shared dashboards consume adapter-provided read projections; action writes return to the owning discipline.
- Keep question attempts distinct from lesson completion, assessment results, and project milestones.
- Preserve the existing P6 player contract for question-based activities; non-question content remains discipline-rendered.
- Keep mastery discipline-owned. A common display may show a normalized status or percentage only when the adapter explicitly provides a valid mapping.
- Keep LSR-1 as the sole global EXP authority. Do not pay twice for an assessment and its constituent answers.

## 6. Reference integrations

### Probability
Register Probability as one discipline. Its five pathways remain curated overlapping views over the existing lesson IDs. Lessons, question content, grading, tests, attempts, bookmarks, drafts, and mastery remain owned by Probability. The shared Studies surface may discover and launch them through an adapter; it must not flatten or duplicate the curriculum.

### Metallurgy
Register MT201, MT202, and MT203 as courses under the Metallurgy discipline (or as separately addressable course entries if the existing route model requires it). Preserve each manifest's actual capability flags, canonical question formats, activity logs, and course progress. Do not imply that all three courses have theory lessons or identical capabilities.

### Future disciplines
A new discipline should be able to register its own content and adapters without importing Probability or Metallurgy implementation files. It may start with only reading/study content, only question practice, or a richer combination.

## 7. Delivery sequence

### S0 — Architecture and contract tests — implemented
- Framework-neutral contracts and pure registry functions live under `shared/studies/`.
- Tests cover registration validation, stable discipline-scoped content identities, overlapping pathways, capability declarations, and unknown progress values.
- Both app TypeScript matrices and production builds passed; Metallurgy and Bookkeys regression workflows also passed on the S0 checkpoint.

### S1 — Read-only reference registrations — implemented; UI pending
- Probability registers its existing lesson IDs and five pathways without copying lessons or touching its progress store.
- Metallurgy registers MT201, MT202 and MT203 under one discipline, retaining course-specific capability declarations rather than advertising the union as universally available.
- Registrations are static/read-only. S2b.1 attaches direct, read-only projections over the existing canonical local-storage payloads; it does not call app hydration/load functions, migrate, initialise, normalise, or write data. Missing keys represent an empty record; malformed or inaccessible payloads remain unknown.\n- Probability reports its explicit completed lesson flags and in-progress lessons from submitted attempts. Metallurgy reports activity-only course/topic status from MT201/MT202 answered maps and MT203 attempt history; it does not infer mastery or completion from activity.
- The registrations remain static/read-only. No progress adapter is attached, so progress is unknown rather than triggering a migration or inventing state.

### S2 — Registration-backed Studies directory and landing surface
- Replace duplicated static subject metadata in the existing root `tools.js` Studies group with a generated/validated catalogue derived from the app-owned registrations; do not create a competing second directory.
- Add common discipline/course landing composition: description, learning routes, available activity types, and adapter-provided progress summary.
- Render only capabilities actually declared by the selected discipline.
- Launch existing Probability and Metallurgy routes without replacing their current content screens.

### S3 — Cross-discipline progress views
- Add read-only aggregation across adapter projections.
- Preserve separate course mastery and global Meta EXP; label them distinctly.
- Validate that the same Probability lesson appearing in multiple pathways is counted once in discipline progress.

### S4 — Optional shared study workflows
- Generalize only the workflow primitives proven common by both reference integrations (e.g. activity history filters or revision entry points).
- Keep discipline-specific grading, content rendering, and persistence behind adapters.
- Add more disciplines only after both reference integrations pass.

## 8. Acceptance gates

- Probability remains a complete, independently owned discipline and all five pathways resolve to existing lesson IDs.
- A shared lesson referenced by multiple Probability pathways is represented once in the content catalogue and once in progress aggregation.
- MT201/MT202/MT203 expose only their real capabilities.
- The shared layer can register a third fixture discipline without importing either app's source.
- Existing Probability and Metallurgy progress payloads are byte-for-byte untouched by registry reads and discovery.
- No new central attempt/progress database is introduced.
- LSR-1 rewards and Meta totals remain unchanged by read-only discovery.
- Both app builds and existing player, learning-core, curriculum, reward, and regression tests pass before production integration.

## 9. Explicit non-goals

- Rewriting Probability as a generic engine.
- Replacing the Probability curriculum or its five pathways.
- Replacing Metallurgy's course registry or P5 activity log in this first milestone.
- Forcing all disciplines into one question schema, grading rule, mastery formula, or local-storage key.
- Creating a second global XP ledger or changing LSR-1.
- A root workspace conversion, shared React package, cloud sync, or database migration.
- Redesigning every discipline's content UI before the registry and adapters are validated.
