# ESSENCE CONFLICT REGISTER

**Version:** v1.1
**Authority:** L2 — Current Website Operating Truth
**Status:** Active
**Owner:** Kenji Phạm
**Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc
**Last verified:** 733b19900d3f8c471fb90cbd6f17bc4acf8b1332
**Review trigger:** immediately on a Founder Decision or discovered same-level conflict.

**07/08/2026 update:** added C-17 (method/brand framework preservation) and
C-18 (Homepage route retirement) per Founder Decisions 07/08/2026. See the
paired cleanup PR for the runtime changes these rulings authorize.

## Closed conflicts

| ID | Conflict | Founder ruling |
|---|---|---|
| C-01 | Homepage route versus temporary homepage routes | Canonical public Villa route is /. ~~/trang-chu-v2 is implementation/migration candidate; no redirect in G0.~~ **Superseded by C-18 (07/08/2026):** /trang-chu-v2 is retired and removed, not merely contained. |
| C-02 | Villa indexing | / stays noindex until M6 Search Indexing Launch. Live does not mean indexed. |
| C-03 | Legacy child/payment flow | /kidbook, /thanh-toan-goi-1 and /thanh-toan-goi-2 are excluded from new journey, CTA, migration and payment flows. |
| C-04 | /ai-startup role | noindex; independent partner asset; outside consumer journey; rewrite pending. |
| C-05 | Lặng capacity/flow | 5 sessions/month; six questions → support report → Kenji Human Decision Gate → payment → Kenji payment confirmation → private booking link. |
| C-06 | Hạt Mầm age/funnel | Canonical age 0–7; new form, payment, confirmation, delivery and email flow; no legacy funnel. |
| C-07 | Public identity and entity | Official brand, organization and public entity: **Essence Coaching**.<br>Exact public positioning: **Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu, Essence Coach.<br>Người sáng lập Essence Coaching.**<br>“System” is not a brand, organization or public-identity suffix. It remains valid only as a common technical noun in context, such as typography system, image system or operating system. |
| C-08 | Public contact | contact@coachkenjipham.com is the public email. |
| C-09 | Roadmap | M0–M6 supersedes the prior 13-phase roadmap. |
| C-10 | FCP | FCP means Full Cycle Process. Older meanings are not canonical. |
| C-11 | Public giao thức | Allowed selectively only with approved plain-language context. |
| C-12 | Image authority | Kenji portraits: FLUX.1 + Kenji LoRA. Non-Kenji images: FLUX.2 Klein 9B. |
| C-13 | Agent merge authority | Historical self-merge permissions are superseded. An agent may merge only when a current task-specific Founder instruction explicitly authorizes that exact PR. A historical brief, earlier merge, prior standing permission or successful QA never authorizes a later PR. Without exact current approval, keep the PR Draft and stop for review. |
| C-14 | Canonical domain (02/08/2026) | The official canonical domain is **`https://coachkenjipham.com`** (apex, no `www`). `www.coachkenjipham.com` must redirect **permanently** to it. All canonical, Open Graph, JSON-LD and other absolute URLs use the apex form. Recording this ruling does not authorize indexing, sitemap, robots or Search Console action — C-02 still governs those. |
| C-15 | Homepage copy and background supersessions (02/08/2026, final) | For `/` these Founder Decisions supersede the corresponding rows of the Editorial Completion Package: Hero reads "Vẫn trả lời những tin nhắn."; Kenji closing line reads "Tôi giữ những khoảng lặng để bạn nhìn rõ điều đang diễn ra và nghe được chính mình."; S08 CTA reads "Mời bạn đọc đầy đủ →"; S04 and S08 keep their current approved background images, so package §8.4/§8.5 and DoD #12/#13 no longer apply. **Signal Moment reads exactly "Không phải mọi chương đều đẹp." — without "vì".** (An interim instruction on 02/08 had asked to insert "vì"; the Founder's final ruling is the sentence without it, and the interim change was reverted before merge. Production was always correct.) Do not re-open any of these as defects. |
| C-16 | Typography scope (02/08/2026) | Each page may have its **own typographic rhythm and hierarchy**; pages are not required to share one hierarchy or one font-pairing pattern. The whole site keeps the **two approved base fonts** — Cormorant Garamond (serif) and Inter (sans). **No new font may be added.** No global font redesign is to be performed as a side effect of a page-scoped task. Font *loading* performance is a system observation, not a page blocker (see the Homepage completion record §6). |
| C-17 | Method/brand framework preservation (07/08/2026) | The three-movement ESSENCE method framework — **Chill với cảm xúc → Thách thức giới hạn → Hiện thực ước mơ** — is a canonical brand and method asset and must not be deleted, deprecated or downgraded. Any six-movement orientation/journey map (e.g. LẶNG → AN ĐỊNH → NHẬN RA NHỊP RIÊNG → NHÌN RA BẢN SẮC → CHỌN MỘT NHỊP SỐNG CÓ THỂ GIỮ → AN THỊNH), wherever it is documented, is an **additional** layer describing what the broader journey helps a person recognize and embody — it does **not** replace or supersede the three-movement framework. No rigid one-to-one mapping between the two layers may be invented without a separate Founder approval. Any future `/phuong-phap` Page Contract must explain both layers; this ruling does not itself redesign or rewrite the Method page body. |
| C-18 | Homepage route retirement (07/08/2026) | `/` is the only canonical Homepage. `/trang-chu-v2` is **RETIRED and removed** (`src/pages/trang-chu-v2.tsx` deleted; `VillaPage.tsx` no longer takes a dual-route `pageUrl` contract, only self-renders at `/`). This supersedes the C-01 clause that held `/trang-chu-v2` as an "implementation/migration candidate" with a pending post-cutover disposition — that disposition is now resolved as retirement. C-01's ruling that **`/` is the canonical public Villa route** is unchanged. C-02 (noindex until M6) and C-07 (entity naming) are unaffected. Historical evidence of `/trang-chu-v2` remains in git history and in dated audit records; it is not restated as active-current documentation. |

## Open conflicts and follow-up gaps

| ID | Status | Owner | Required next action |
|---|---|---|---|
| O-01 | Runtime gap — partially resolved | Kenji | Root noindex resolved by P1 (PR #112 at 733b199: / emits noindex via shared VillaPage). Remaining: /ai-startup noindex alignment in its own approved task. |
| O-02 | Runtime gap | Kenji | Implement Lặng Human Decision Gate, payment confirmation and private booking in a separate task. |
| O-03 | Runtime gap | Kenji | Implement Hạt Mầm new form/payment/confirmation/delivery in a separate task. |
| O-04 | Runtime gap | Kenji | Replace public Gmail references only in a scoped runtime task. |
| O-05 | External dependency pending | Kenji | Approve any further external documentation intake after G0. |
| O-06 | Runtime/entity gap — partially resolved | Kenji | Villa scope resolved by P1 (PR #112 at 733b199): / and /trang-chu-v2 JSON-LD entities now use Essence Coaching. Remaining inventory rows below still need their own approved metadata/public-copy tasks. |
| O-07 | ✅ **CLOSED 02/08/2026** — C-14 honoured in production | Kenji (done) | Founder set the apex as Vercel Primary Domain and `www` as a 308 permanent redirect. Verified live: apex 200 with 0 redirects; `www` → 308 → apex; HTTP → HTTPS apex; no loop at any entry point; TLS valid on both hostnames. **Standing rule going forward:** host normalisation lives only in the Vercel dashboard — do **not** add host-based redirects to `vercel.json`, which would risk a redirect loop. Evidence: `docs/website/homepage/HOMEPAGE_FINAL_COMPLETION_RECORD.md` §4. |

This register is an L2 operating container. Every Closed conflict ruling recorded above is L0. Open conflicts block assumptions, not safe documentation of the gap.

## C-07 runtime impact inventory — implementation evidence only

The baseline is `origin/main` at `fe0739d6d88ba8c9b9a1a6bc9b467bc0f22f5dae`. These rows record runtime occurrences that require a separate approved task; they do not authorize edits in this docs/rules-only patch.

| Route / surface | File(s) | Observed occurrence | Required later handling |
|---|---|---|---|
| ~~`/trang-chu-v2`~~ | ~~`src/pages/trang-chu-v2.tsx`~~ | ~~Person `worksFor` and Organization JSON-LD use the former organization suffix.~~ | **Row obsolete — C-18 (07/08/2026):** route retired and file deleted; nothing left to reconcile. (Was resolved by PR #112 at 733b199 before retirement: both / and /trang-chu-v2 rendered shared `VillaPage.tsx` whose entities used **Essence Coaching**.) |
| `/ban-sac-cua-ban` | `src/pages/ban-sac-cua-ban.tsx` | Article publisher JSON-LD uses the former organization suffix. | Align schema only after route-level metadata review. |
| `/ban-sac-cua-con` | `src/pages/ban-sac-cua-con.tsx` | Article publisher JSON-LD uses the former organization suffix. | Align schema in a child-safe, route-scoped metadata task. |
| `/ban-la-duy-nhat` | `src/pages/ban-la-duy-nhat.tsx` | Product/offer-candidate brand entity uses the former organization suffix. | Align only with the held-offer contract and metadata task. |
| `/dau-an-cua-ban` | `src/pages/dau-an-cua-ban.tsx` | Product/offer-candidate brand entity uses the former organization suffix. | Align only with the held-offer contract and metadata task. |
| ~~`/phuong-phap`~~ | ~~`src/pages/phuong-phap.tsx`~~ | ~~Article publisher JSON-LD uses the former organization suffix.~~ | **Resolved (07/08/2026, cleanup PR):** Article publisher JSON-LD now uses **Essence Coaching**. Method-body/Page Contract rewrite is separate and still future (see C-17). |
| `/dieu-essence-khong-hua` | `src/pages/dieu-essence-khong-hua.tsx` | Article publisher JSON-LD uses the former organization suffix. | Align with the future trust-suite metadata/copy scope. |
| `/chinh-sach-rieng-tu` | `src/pages/chinh-sach-rieng-tu.tsx` | Article publisher JSON-LD uses the former organization suffix. | Align only with the approved privacy/metadata scope. |
| `/ai-startup` | `src/components/ai-startup/Room1Hero.tsx` | Visible founder line uses the former organization suffix. | Replace with exact C-07 only inside the separately approved partner rewrite. |
| `/ai-startup` | `src/pages/ai-startup.tsx`; `src/components/ai-startup/Room1Hero.tsx`; `src/components/ai-startup/Room3Technology.tsx`; `src/components/ai-startup/Room7ClosingAccess.tsx` | Public partner metadata/copy uses Personal Psychology Engine and AI-native language. | Review as partner-context historical positioning; do not promote it into consumer identity. Rewrite remains a separate C-04 task. |

No matching former organization suffix was found under `public/**`, `next.config.mjs` or `vercel.json` at the baseline.
