# Supabase integration plan

## Principles
- Keep Limitless as the existing static HTML/JavaScript application.
- Preserve Bookkeys as a standalone application and keep local-first behavior during migration.
- Use Supabase Auth for identity and Postgres with Row Level Security for user-owned records.
- Never ship a service-role key to the browser.
- Back up existing local data before enabling cloud writes; make migrations reversible.

## Phases
1. **Foundation:** browser SDK, public project config, account UI, profile table and RLS. (Initial implementation.)
2. **Identity:** account settings, profile editing, password reset, email confirmation and redirect configuration.
3. **Meta Progression:** cloud-backed EXP ledger, reward state, equipped rewards and goals. Preserve the existing reward standard and validate events server-side before awarding EXP.
4. **Competition:** per-user weekly progress, mocks and metrics.
5. **Learning modules:** Math Trainer, Probability and Metallurgy progress and attempts.
6. **Bookkeys:** separately migrate library metadata, chapter position and typing progress; do not upload book files by default. Keep offline functionality and export/import.
7. **Cross-device QA:** verify RLS isolation, refresh/session recovery, offline behavior, backup/restore and existing browser regressions.

## Initial schema
See `../supabase/schema.sql`. The initial `profiles` table stores only account-level display metadata; module data is intentionally not migrated in this first phase.
