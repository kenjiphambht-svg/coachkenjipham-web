\set ON_ERROR_STOP on

-- Disposable-local-only seed owner for the non-empty recovery round trip.
-- It intentionally COMMITs because separate CLI migration/rollback commands
-- must observe this state. Never use this runner on staging.

begin;
\ir wo04_non_empty_fixture.sql
\ir wo04_legacy_review_fixture.sql
commit;
