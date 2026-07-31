# ESSENCE SITE JOURNEY MAP

> **Authority:** L2 — Current Website Operating Truth
> **Status:** Active
> **Owner:** Kenji Phạm
> **Purpose:** Canonical information architecture and journey map; separates permitted journey intent from routes currently rendered by code.
> **Decision scope:** Journey membership and operating boundaries. **Non-decision scope:** Public copy, route deletion/redirect, payment/booking architecture, indexing launch, or runtime changes.
> **Governing basis:** [Conflict Register](../../governance/CONFLICT_REGISTER.md) C-01–C-09; [Route State Matrix](ROUTE_STATE_MATRIX.md); [Offer State Matrix](OFFER_STATE_MATRIX.md); [Indexing Policy](INDEXING_POLICY.md).
> **Baseline evidence commit:** origin/main at a45e4242c0e68f52e0004ee8dd5d02745e4212dd
> **Last verified:** fe0739d6d88ba8c9b9a1a6bc9b467bc0f22f5dae
> **Review:** Founder Decision, material route/CTA change, or 90 days.

## 1. Evidence labels

| Label | Meaning |
|---|---|
| **FACT** | Observed in baseline code or configuration. |
| **L0** | Founder ruling recorded in the Conflict Register. |
| **GOVERNED CONCLUSION** | L2 classification derived from facts under L0. |
| **INFERENCE** | A tentative interpretation from evidence; never treated as Founder approval or implementation fact. |
| **OPEN GAP** | A required decision or runtime task not supplied by the baseline. |

The Experience Bible supplies emotional architecture, not runtime CTA, payment, route, or indexing decisions. Clarity, accessibility and required information remain non-negotiable.

## 2. Canonical information architecture

| Layer | Canonical role | Routes/nodes | Boundary |
|---|---|---|---|
| Villa entry | **L0:** / is the canonical public Villa route. | / | Current source is a stub; no redirect is authorized. |
| Adult entry | Discover the appropriate adult path without treating every rendered offer as approved. | /ban-sac-cua-ban → /lang-90; planned adult offers | Lặng is governed by C-05; other adult offers require offer-specific approval. |
| Parent entry | Observe a child without labels; discover the age-appropriate line. | /ban-sac-cua-con → /an-pham-ban-sac-hat-mam | **L0:** Hạt Mầm is 0–7 and uses a new flow, not the legacy funnel. |
| Trust and identity | Explain identity, method, boundaries and privacy. | /ve-kenji, /phuong-phap, /dieu-essence-khong-hua, /chinh-sach-rieng-tu, /lien-he | Rendered support nodes; no indexing before M6. |
| Private operations | Intake, payment confirmation, delivery and booking. | /lang-90/dat-phien, /lang-90/xac-nhan; future private delivery | Never public-sitemap nodes. Human gates apply. |
| Legacy containment | Preserve legacy revenue/sensitive flows without placing them on a new journey. | /kidbook, /thanh-toan-goi-1, /thanh-toan-goi-2 | **L0 C-03:** excluded from new journey, CTA, migration and payment flows. |
| Partner boundary | Independent partner evidence, never consumer conversion. | /ai-startup | **L0 C-04:** noindex, outside consumer journey, rewrite pending. |
| Future/planned | Only Planned/Missing until scoped. | /ve-essence, /goc-doc, /an-pham/[random-slug], /admin/* | Requires a scoped task and governing approval. |

## 3. Audience entry states and experience constraints

| Arrival state | First useful node | Emotional operating logic | Clarity/accessibility constraint |
|---|---|---|---|
| “Tôi đang cần nhìn lại chính mình.” | /ban-sac-cua-ban | Reduce pressure; present bounded choices without diagnosing the visitor. | State availability and next action in plain language; do not make narrative the only navigation. |
| “Tôi đang muốn hiểu con dịu hơn.” | /ban-sac-cua-con | Observation before interpretation; no deterministic child label. | Age, privacy and active/planned status must be explicit before any form. |
| “Tôi cần biết Kenji/Essence là ai và làm việc thế nào.” | /ve-kenji, /phuong-phap, /dieu-essence-khong-hua | Trust through identity, method and limits rather than inflated promise. | C-07 identity is exact; headings, links and boundaries remain scannable and keyboard-usable. |
| “Tôi đến vì hợp tác/đầu tư.” | /ai-startup only through partner context | Keep partner evidence independent from consumer emotion and conversion. | Do not mix this asset into consumer navigation or sitemap. |

Every canonical public node must preserve clear headings, direct route labels, usable focus order, readable contrast and a non-narrative way to identify the next step. The Experience Bible may shape pacing and emotional tone; it cannot hide availability, privacy, payment, human gates or route status.

## 4. Human-readable journeys

### Adult: seek clarity, then choose a bounded path

1. **FACT:** /ban-sac-cua-ban renders three cards; only /lang-90 is labelled “Đang mở.”
2. **L0 C-05:** Lặng is limited to five sessions/month: six questions → support report → Kenji Human Decision Gate → payment → Kenji payment confirmation → private booking link.
3. **GOVERNED CONCLUSION:** adult conversion is not a direct checkout. Intake is the first operating step; payment and booking remain human-gated.
4. **OPEN GAP:** source sends intake to confirmation immediately. It does not implement the L0 Human Decision Gate, payment confirmation by Kenji, or a private booking link.

### Parent: observe, then enter the 0–7 offer safely

1. **FACT:** /ban-sac-cua-con links 0–7, 7–14 and 14–21 landing pages; only 0–7 is labelled “Đang mở.”
2. **L0 C-06:** Hạt Mầm is canonical for age 0–7 and requires a new form → payment → confirmation → delivery → email flow.
3. **GOVERNED CONCLUSION:** a parent may discover Hạt Mầm at /an-pham-ban-sac-hat-mam, but existing Tally and legacy-payment links do not define the canonical new flow.
4. **OPEN GAP:** no approved new-flow implementation, private delivery route, confirmation route, or email workflow exists in this repository.

### Trust and partner boundaries

**FACT:** shared header/footer link hubs and trust routes. **GOVERNED CONCLUSION:** these are support nodes, not independent conversion funnels.

**L0 C-04:** /ai-startup is a partner asset outside the consumer journey. Its source has a partner mailto CTA, but no observed robots directive.

## 5. Machine-readable route/journey map

| Node | Audience | Journey class | Permitted next node | Exclusion/gate | Basis |
|---|---|---|---|---|---|
| / | Public | canonical Villa entry | adult or parent discovery when CTA is scoped | Current CTA to /kidbook is runtime evidence only | L0 C-01 + source |
| /ban-sac-cua-ban | Adults | adult discovery | /lang-90; planned adult offers | No direct payment inferred | source + C-05 |
| /lang-90 | Adults | Lặng discovery | /lang-90/dat-phien | capacity and human decision boundary | L0 C-05 |
| /lang-90/dat-phien | Adult applicant | private intake | human review; code currently goes to confirmation | no direct checkout/automated booking | C-05 + source |
| /ban-sac-cua-con | Parents | parent discovery | /an-pham-ban-sac-hat-mam for 0–7 | older age pages are not active offers | C-06 + source |
| /an-pham-ban-sac-hat-mam | Parents of 0–7 | Hạt Mầm discovery | future approved new form | legacy Tally/payment is not canonical | C-03/C-06 |
| trust routes | Public | trust/support | contextual only | no index action pre-M6 | source + Indexing Policy |
| legacy routes | Existing customers | containment | remain available only | excluded from every new journey | L0 C-03 |
| /ai-startup | Partners | partner-only | partner contact only | excluded from consumer journey | L0 C-04 |

## 6. Canonical public sitemap intent

This is an information-architecture sitemap, not an XML sitemap and not authorization to index or deploy.

| Primary public node | Role | Current route state |
|---|---|---|
| / | Canonical Villa entry | Implemented stub; no observed noindex, gap against C-02 |
| /ban-sac-cua-ban | Adult discovery | Implemented; noindex |
| /ban-sac-cua-con | Parent discovery | Implemented; noindex |
| /lang-90 | Lặng discovery | Implemented; noindex |
| /an-pham-ban-sac-hat-mam | Hạt Mầm 0–7 discovery | Implemented; noindex |
| /ve-kenji, /phuong-phap, /dieu-essence-khong-hua | Trust | Implemented; noindex |
| /chinh-sach-rieng-tu, /lien-he | Privacy/contact support | Implemented; pre-M6 noindex governed state |

Never include intake, payment, confirmation, booking, private delivery, legacy payment, internal, or partner nodes in a public sitemap. XML sitemap, robots, and Search Console work is an M6 runtime task only.

## 7. Operating gaps

| ID | Gap | Required next action | Owner/gate |
|---|---|---|---|
| J-01 | Root is a stub whose only CTA is /kidbook. | Scoped homepage/CTA task; no redirect implied. | Kenji approval |
| J-02 | Lặng bypasses the L0 Human Decision Gate. | Scoped private-flow task. | Kenji |
| J-03 | Hạt Mầm uses legacy Tally/payment entrypoints. | Scoped child-data/payment/delivery task. | Kenji approval |
| J-04 | Trust-page Page Contracts are Planned/Missing. | Task must provide approved contract. | Kenji |
| J-05 | /ai-startup has no observed noindex. | Scoped runtime noindex/rewrite task. | Kenji approval |
| J-06 | Several JSON-LD/product schema blocks still use the former organization suffix, while others already use “Essence Coaching.” | Apply the C-07 runtime impact inventory in the Conflict Register through a scoped metadata/entity task; no G1.1 runtime edit. | Kenji approval |

## 8. Evidence notes

- Route and CTA observations: src/pages, src/components/homepage, src/components/lang-90, and src/components/landing-hat-mam.
- Redirect evidence: vercel.json has only /old-path → /new-path; no journey redirect/rewrite is configured.
- Emotional framing: docs/brand/ESSENCE_EXPERIENCE_BIBLE_2026.md; it does not override the route/flow boundaries above.
- The route inventory is maintained in [ROUTE_STATE_MATRIX.md](ROUTE_STATE_MATRIX.md); it covers 21 concrete source page routes, the technical /404 page, one configured redirect alias and its unresolved target, plus governance- or historical-evidence-named planned/internal candidates. It is not an XML sitemap.
