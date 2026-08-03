# Manual rollback scripts

`supabase/migrations/` contains forward-only migrations for Supabase CLI.
Files in this directory are manual rollback scripts and **must never be run automatically**.

Each script may be destructive. Use only on staging after a verified snapshot and a separate explicit approval; never use it as a substitute for `supabase migration repair`.
