# INDEXING POLICY

> **Authority:** L2 — Current Website Operating Truth
> **Status:** Active
> **Owner:** Kenji Phạm
> **Purpose:** Current indexing truth and the M6 launch gate; documents source observation without changing robots, sitemap, metadata or Search Console.
> **Decision scope:** Pre-M6 constraints, governed indexing intent, and gap recording. **Non-decision scope:** Any runtime indexing change, crawler permission, sitemap generation, metadata rewrite or Search Console action.
> **Governing basis:** [Conflict Register](../../governance/CONFLICT_REGISTER.md) C-02, C-03 and C-04; [Route State Matrix](ROUTE_STATE_MATRIX.md); [Security and Child Data Policy](../master-plan/09_SECURITY_PRIVACY_AND_CHILD_DATA_POLICY.md).
> **Baseline evidence commit:** origin/main at a45e4242c0e68f52e0004ee8dd5d02745e4212dd
> **Last verified:** fe0739d6d88ba8c9b9a1a6bc9b467bc0f22f5dae
> **Review:** Founder Decision, robots/sitemap/metadata change, M6 launch trigger, or 90 days.

## 1. Governing rule

- **L0 C-02:** / remains noindex until M6 Search Indexing Launch. Live does not mean indexed.
- **L0 C-03:** legacy child/payment routes are outside the new journey.
- **L0 C-04:** /ai-startup is a noindex partner asset.

Therefore, no robots file, sitemap file, robots directive, canonical metadata, noindex removal, crawler policy or Search Console action may be changed before M6 without a new Founder Decision.

## 2. Current observed implementation

| Observation | Evidence | Meaning |
|---|---|---|
| No robots file or sitemap implementation exists. | No matching route/static implementation found; next.config.mjs contains no sitemap/robots logic. | G1 documents a gap; it does not create either artifact. |
| Page-level noindex is inconsistent. | 17 of 21 concrete source routes emit explicit noindex (two also emit nofollow). /, /kidbook, /ai-startup and /chinh-sach-rieng-tu do not emit an observed directive. | Absence of a directive is an implementation fact, never evidence that a route may index. |
| SEO component emits title, description, Open Graph and Twitter tags. | src/components/SEO.tsx | It has no noindex prop or centralized canonical policy. |
| No runtime canonical link policy was found. | Source audit of pages and SEO component. | Canonical URL intent is a future M6 implementation decision. |
| Entity/schema organization naming is inconsistent. | Some source already uses the current entity “Essence Coaching”; the Conflict Register C-07 runtime inventory identifies routes whose JSON-LD or visible partner copy still uses the former organization suffix. | C-07 governs the canonical organization name. Reconciliation requires a scoped metadata/entity runtime task; G1.1 changes no schema. |
| One configured redirect exists. | vercel.json: /old-path → /new-path. | It is not a sitemap/canonical decision and its target has no source page observed. |

## 3. Governed route policy

| Route class | Governed state before M6 | Public sitemap eligibility | Runtime observation / required future action |
|---|---|---|---|
| Villa route / | noindex | Excluded | Source lacks observed noindex; separate approved runtime task required. |
| Implemented public discovery/trust pages | noindex | Excluded | Most emit noindex; each M6 inclusion requires route and metadata review. |
| /kidbook legacy funnel | Do not infer indexability or journey membership from live code. | Excluded from canonical new sitemap/journey. | Source lacks observed noindex; preserve while a separate legacy/privacy task determines runtime action. |
| Legacy payment pages | noindex | Never include | Source emits noindex; remain outside new journey. |
| Lặng intake/confirmation | noindex | Never include | Source emits noindex; private-flow redesign remains a gap. |
| Current Hạt Mầm landing and previews | noindex | Excluded before M6 | Source emits noindex; later inclusion is not implied by a rendered page. |
| Future private delivery, booking, admin | noindex plus access protections | Never include | Planned/Missing; require security scope. |
| /ai-startup partner asset | **L0 noindex** | Never include | Source lacks observed noindex; dedicated approved task required. |
| 404 and technical redirect alias | Not public content nodes | Never include | Review only during M6 route validation. |

## 4. Canonical URL and metadata boundary

The baseline code supplies page URLs to the shared SEO component, but G1 does not certify those URLs as canonical tags or public-index candidates. At M6, a scoped implementation task must:

1. inventory every implemented and planned route against Route State Matrix;
2. confirm public-source-page contracts and exact L0 identity;
3. implement canonical, robots and sitemap behavior together;
4. exclude all payment, confirmation, booking, private-delivery, child-sensitive, admin, legacy-excluded and partner routes;
5. test rendered HTTP/HTML behavior, not merely source text;
6. obtain Founder approval before Search Console submission or crawler-policy changes.

## 5. M6 launch gate

M6 cannot begin merely because a page is live. All of the following are required:

- Founder Decision authorizing M6 indexing work;
- approved current route, journey, offer and public-copy state;
- verified noindex protection for private, payment, confirmation, booking and child-sensitive routes;
- partner and legacy boundary review, including /ai-startup and /kidbook;
- reviewed canonical/metadata implementation;
- generated public sitemap that contains only approved public-source nodes;
- robots policy reviewed as a crawler boundary, not a security control;
- Search Console action explicitly approved;
- production verification and rollback plan.

## 6. G1 versus future runtime work

| G1 documents | Future task implements |
|---|---|
| L0/L2 indexing intent, observed gaps, route classifications and M6 prerequisites | robots, sitemap, meta robots, canonicals, schema changes, crawler rules, Search Console, HTTP/header tests and deployment validation |

No G1 document changes search visibility. Every route remains subject to source observation plus the governed pre-M6 noindex constraint.
