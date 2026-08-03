-- ============================================================
-- 0008 · Staging integration fix: pgcrypto lives in `extensions`.
--
-- 0006 created this SECURITY DEFINER function with search_path=public,
-- while its order-code generator calls gen_random_bytes(). On Supabase
-- pgcrypto is installed in the extensions schema. Add that trusted schema
-- explicitly; do not rely on a caller-controlled search_path.
-- ============================================================

alter function create_lang_application_from_intake(
  text, text, text, text, text, text, text, text, text, text
) set search_path = public, extensions;
