# Proportionate child-data protection

**Founder Decision date:** 2026-08-04  
**Authority:** Founder decision for data classification and operator UX.  
**Scope:** ESSENCE Hạt Mầm and related private operational records.  
**Does not authorize:** a release-gate change, public activation, a new data category, provider connection, or a weakening of Auth/RLS/retention/deletion controls.

## Classification

The default classification is **RESTRICTED CHILD PERSONAL DATA — LIMITED OPERATIONAL SCOPE**.

This data is personal data of a child. It is private, must not be publicly indexed or casually accessed, and remains subject to consent, retention, deletion and the platform controls below. It is **not**, by default, public or anonymous data; nor is it a medical record, clinical record, psychological diagnosis, or high-severity safeguarding record. A record is elevated only when its actual content requires that treatment and a separate Founder Decision and appropriate consent cover the additional category.

## Approved default data

Only where needed to provide the service, the normal scope may contain:

- a child's nickname or name used at home, date of birth and minimum birth place/time information;
- a parent's contact information and versioned consent;
- minimal parent-provided intake context and the parent's question;
- a concise operational conclusion after Kenji has spoken with the parent;
- package snapshot, payment, production, revision, private-publication and deletion states; and
- audit metadata needed to operate and account for important actions.

## Not collected by default

The normal flow must not collect a full home address, school/class, identity documents, health information, psychological diagnoses, abuse/dispute details, biometrics, photos/video/audio, full conversation transcripts, or family detail not required for the product. Any such proposal needs a specific Founder Decision, threat model and consent before it is introduced.

## Operating principle

> **Lưu kết luận cần thiết, không lưu toàn bộ câu chuyện.**

Admin copy and operational practice should favour short summaries, product facts, decisions and next steps. They must discourage verbatim transcripts, speculation, diagnoses and unnecessary private detail.

## Baseline controls retained

The proportionate classification does not reduce security. The required baseline remains Admin Auth with MFA/AAL2, active-admin authorization, Supabase RLS, private database and Storage, expiring signed URLs, server-only secrets, TLS, audit for important actions, backup/recovery, retention/deletion, rate limiting, no public indexing, and exclusion of customer/child data from logs, analytics and Git.

Platform security remains layered: least privilege, attack-surface reduction, dependency and secret scanning, headers/CSP, abuse controls, Storage policy, monitoring, incident response, restore drills and blast-radius reduction. It does not claim that the platform cannot be compromised; its goal is detection, containment and recovery.

## Deliberately not over-engineered

Until a concrete threat model proves otherwise, ESSENCE will not add field-level application encryption for nicknames/dates of birth, a database per child, a password per record, repeated approvals simply to open a record, Drive copies, multi-SaaS fragmentation, n8n data movement, or free-form AI access to all child data.

## Governance alignment

Reviewed and aligned without weakening controls:

| File | Alignment |
| --- | --- |
| `docs/decisions/2026-08-03-b3-hat-mam-scope.md` | Minimal child-intake field boundary now explicitly follows this classification. |
| `docs/decisions/2026-08-03-b8-deletion-retention.md` | Private retention/deletion protections remain required; no severity claim is changed. |
| `docs/decisions/2026-08-04-wp1-admin-operating-experience.md` | Protected-detail UX remains intact; Founder review copy uses the proportionate classification. |
| `src/lib/api/schemas.ts` | Existing minimal schema/exclusions already match the approved default. |
| `docs/website/current/INDEXING_POLICY.md` and `docs/website/current/OFFER_STATE_MATRIX.md` | Private/noindex route protection remains valid; no public-treatment implication is introduced. |

No conflict with a stricter legal requirement, security baseline or release gate is resolved by this document. If such a conflict is found, record it in `docs/governance/CONFLICT_REGISTER.md`; this decision controls classification and UX wording only.
