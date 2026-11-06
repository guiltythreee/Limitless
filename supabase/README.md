# Limitless + Supabase

## Current scope
This first integration adds the Supabase browser client and account sign-in/sign-up/sign-out UI to the Limitless hub, Meta Progression, Competition Tracker, and Math Trainer shell. It does not yet move each module's local progress into cloud tables; that migration is a separate, module-by-module step so existing Bookkeys and trainer data are not overwritten.

## Configure the database
1. Open the Supabase project dashboard.
2. Go to **SQL Editor**, create a new query, paste the complete contents of **schema.sql**, and run it.
3. In **Authentication → URL Configuration**, set the Site URL to the deployed Limitless origin and add the local development origin to Redirect URLs if needed.
4. In **Authentication → Providers → Email**, choose whether email confirmation is required.

## Browser configuration
**config.js** contains the project URL and publishable key. A publishable key is intended for browser clients; never put a service-role or secret key in this repository. Database access is controlled by Row Level Security.

## Verification
After running the SQL, open Limitless, create an account, confirm the email if requested, sign in, refresh, and verify the account remains signed in. Check the profiles table in Supabase: a profile row should be created automatically for each new user.

## Next migration stages
- Create per-user progress tables with RLS and versioned payload validation.
- Add an export/backup-first migration for existing local progress.
- Migrate Meta shared EXP and reward state before module-specific records.
- Integrate Math Trainer, Competition, Probability, Metallurgy, and Bookkeys independently; retain local-first fallback until each migration passes regression tests.
