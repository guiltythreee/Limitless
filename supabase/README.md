# Limitless + Supabase

## Current scope
Limitless authentication and account-scoped cloud progress are provided by the browser Supabase client. The cloud adapter mirrors first-party `localStorage` records without changing the modules' existing storage formats or reward calculations.

Covered entry points:
- Limitless hub and Meta Progression
- Competition Tracker
- Math Trainer
- Probability and Metallurgy landing applications
- Bookkeys shell (the standalone Bookkeys document remains intact; its same-origin storage changes are observed by the shell)

The sync layer keeps the existing module APIs local-first. When signed in, writes are mirrored to `public.user_progress`; after sign-in on another device, cloud values hydrate the same storage keys. The Supabase auth session keys and the site's theme preference are excluded.

## Database setup
Run the **complete current** `schema.sql` in Supabase Dashboard → SQL Editor. It creates:
- `profiles`, populated by the auth-user trigger
- `user_progress`, a per-user key/value mirror protected by Row Level Security

If you previously ran an earlier version of `schema.sql`, running the updated file again is safe: table and trigger creation are idempotent, and policies are recreated.

## Authentication configuration
1. In Authentication → URL Configuration, set the Site URL to the deployed Limitless origin.
2. Add any local development origin to Redirect URLs.
3. In Authentication → Providers → Email, choose whether email confirmation is required.

## Browser configuration
`config.js` contains the project URL and publishable key. A publishable key is intended for browser clients; never put a service-role or secret key in this repository. Database access is controlled by Row Level Security.

## Sync behaviour and boundaries
- The cloud is authoritative for keys already present in the signed-in account.
- Local-only keys are uploaded on first sync, so offline work is not discarded.
- A browser remembers which account last hydrated it; switching accounts clears the previous account's mirrored local keys before loading the new account.
- Deletes are represented by tombstones so they propagate to other devices.
- Local writes are batched and sent after a short debounce. Pending writes are also kept in a per-account local outbox and replayed after reload if the network or browser interrupts an upload.
- The adapter makes a best-effort flush when the page is backgrounded or closed; localStorage remains the immediate durable copy.
- In-flight uploads are isolated from account switches, so one account's pending queue cannot be written into another account's outbox.
- The bridge intentionally excludes Supabase auth tokens, internal test keys, and the theme preference.
- The adapter mirrors `localStorage`. Bookkeys' current primary book data is stored under `bookkeys:game`, which is mirrored via the same-origin shell's storage event. IndexedDB-only or server-side storage is not covered by this generic adapter.

## Verification
1. Run the current `schema.sql` in Supabase SQL Editor.
2. Sign in to Limitless.
3. Open Meta Progression, Competition, Math Trainer and Bookkeys; create a small test record in each module.
4. In Supabase Table Editor, confirm rows appear in `user_progress`.
5. Open the site in another browser/device, sign in to the same account, and confirm the records hydrate.
6. Delete a disposable test record and verify the deletion propagates on the other device.

The cloud adapter does not rewrite reward rules, award historical EXP, or replace the standalone Bookkeys implementation.
