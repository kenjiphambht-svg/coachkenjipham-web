# ESSENCE DOCUMENT REGISTRY

**Version:** v1.0
**Authority:** L2 — Current Website Operating Truth
**Status:** Active
**Owner:** Kenji Phạm
**Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc
**Last verified:** PR #110 head; finalize at merge
**Review trigger:** Founder Decision, status/replacement change, or 90 days.

This registry records authority-bearing, default-reading, imported-canonical, historical-evidence, external-dependency and planned current-truth documents. It contains **39 entries**.

## Verification metadata convention

**baseline_evidence_commit** records the repository commit examined before G0. It is not a claim that a G0 file existed at that commit. Every file created, imported or patched by PR #110 uses **last_verified: PR #110 head; finalize at merge** until the merged commit SHA exists. Thereafter, its last_verified_commit is the merged SHA.

| Path | Title / purpose | Authority / status / owner | Decision scope / non-decision scope | Still valid / outdated | Replacement | Next review / notes |
|---|---|---|---|---|---|---|
| docs/governance/ESSENCE_DOCUMENTATION_AUTHORITY.md | hierarchy and protocol | L0 / Active / Kenji | Founder-approved constitution / no product ruling | hierarchy / — | — | Founder Decision only |
| docs/governance/DOCUMENT_REGISTRY.md | registry | L2 / Active / Kenji | status/provenance / no content ruling | model / — | — | trigger + 90d |
| docs/governance/CONFLICT_REGISTER.md | L2 operating container | L2 / Active / Kenji | conflict record / no runtime fix | closed rulings are L0 / — | — | immediate |
| docs/governance/READING_BUNDLES.md | required reading | L2 / Active / Kenji | reading order / no implementation | bundles / — | — | trigger + 90d |
| docs/governance/ARCHIVE_POLICY.md | archive rules | L2 / Active / Kenji | status handling / no content ruling | policy / — | — | trigger + 90d |
| docs/brand/essence-typography-composition-system-v1.md | canonical typography | L3 / Active / Kenji | roles/composition / no font runtime decision | composition / — | — | trigger + 180d |
| docs/brand/ESSENCE_EXPERIENCE_BIBLE_2026.md | canonical experience truth | L1 / Active / Kenji | experience principles / no runtime/font choice | emotional architecture / — | — | trigger + 90d |
| AGENTS.md | default agent rules | L2 / Active with Patch / Kenji | safeguards / no L0 override | scope/QA / old public identity | governance authority | trigger + 90d |
| PLAYBOOK.md | workshop workflow | L2 / Active with Patch / Kenji | branch/QA / no L0 override | QA/safety / old phase truth | governance authority | trigger + 90d |
| BACKLOG.md | task queue | L2 / Active with Patch / Kenji | work state / no roadmap authority | tracking / old phases | planned G1 matrices | trigger + 90d |
| docs/brand/BRAND_SYSTEM_INDEX.md | brand entrypoint | L2 / Active with Patch / Kenji | reading index / no hierarchy | inventory / three-system completeness | reading bundles | trigger + 90d |
| docs/website/master-plan/00_READ_ME_FIRST_WEBSITE_MASTER_PLAN.md | old entrypoint | L5 / Historical / Kenji | history / no current workflow | privacy history / 13-phase authority | governance + M0–M6 | no cadence |
| docs/website/master-plan/01_WEBSITE_NORTH_STAR_AND_POSITIONING.md | positioning principles | L1 / Active with Patch / Kenji | positioning / no L0 override | human-first / incomplete public identity | C-07 | trigger + 90d |
| docs/website/master-plan/02_PUBLIC_SITEMAP_AND_ROUTE_POLICY.md | route policy | L2 / Active with Patch / Kenji | safeguards / no M6 indexing decision | private protections / old index journey | G1 Route/Indexing | trigger + 90d |
| docs/website/master-plan/05_BAN_SAC_HAT_MAM_FUNNEL_AND_LANDING_SPEC.md | Hạt Mầm spec | L3 / Active with Patch / Kenji | 0–7/safety / no tool approval | child safety / legacy flow | C-06 + G1 Offer State | trigger + 180d |
| docs/website/master-plan/07_BACKEND_CRM_PAYMENT_AND_DATA_ARCHITECTURE.md | backend options | L3 / Active with Patch / Kenji | privacy / no new-flow approval | data separation / old tool assumptions | C-05/C-06 | trigger + 180d |
| docs/website/master-plan/10_SEO_AIO_GEO_CONTENT_SYSTEM.md | SEO principles | L3 / Active with Patch / Kenji | schema/privacy / no indexing launch | schema / pre-M6 indexing | C-02 + G1 Indexing | trigger + 180d |
| docs/website/master-plan/11_CLAUDE_CODE_CODEX_AI_AGENT_SETUP.md | task workflow | L2 / Active with Patch / Kenji | task rules / no L0 override | scope rules / old reading order | Reading Bundles | trigger + 90d |
| docs/website/master-plan/12_IMPLEMENTATION_ROADMAP_PHASES.md | 13-phase roadmap | L5 / Superseded / Kenji | historical sequence / no current roadmap | dependencies / roadmap | M0–M6 | no cadence |
| docs/website/master-plan/13_QA_CHECKLIST_10000_USD_WEBSITE.md | QA checklist | L2 / Active with Patch / Kenji | QA / no G0 merge authority | build/safety / unconditional approval | governance authority | trigger + 90d |
| docs/website/master-plan/15_DECISION_LOG_AND_NEXT_ACTIONS.md | prior decisions | L5 / Historical with bridge / Kenji | historical decisions / no current L0 | history / conflicting rules | conflict register | no cadence |
| docs/website/audits/PHASE_0_ROUTE_SOURCE_AUDIT.md | route audit | L5 / Historical / Kenji | dated evidence / no current truth | legacy evidence / route state | G1 Route State | no cadence |
| docs/brand/VISUAL_DIRECTION.md | early visual direction | L5 / Historical / Kenji | historic reference / no current visual authority | restraint / dark-warm direction | Experience Bible + Visual Architecture | no cadence |
| docs/brand/ESSENCE_GEO_STRATEGY.md | GEO strategy | L3 / Active with Patch / Kenji | GEO structure / no L0 override | capacity/entity methods / title, FCP, ICF, indexing | C-02/C-07/C-10/C-11 | trigger + 180d |
| docs/brand/image-system/00_READ_ME_FIRST_IMAGE_SYSTEM.md | image entrypoint | L3 / Active with Patch / Kenji | workflow / no global model replacement | ethics/light-led / FLUX.1 historical phrase | C-12 | trigger + 180d |
| docs/brand/image-system/03_FLUX_PROMPT_BANK_KENJI_AND_ESSENCE.md | FLUX.1 portrait bank | L3 / Active with Patch / Kenji | portrait / no non-Kenji default | LoRA portrait knowledge / non-Kenji prompts | Image 08/09 + portrait follow-up | trigger + 180d |
| docs/brand/design-system/04_TYPOGRAPHY_SYSTEM_2026.md | typography proposal/evidence | L4 / Implementation Evidence / Kenji | evidence / no canonical authority | readability / font proposal authority | canonical typography | when used |
| .claude/rules/seo-aio-geo.md | machine SEO rule | L2 / Active with Patch / Kenji | pre-read / no positioning authority | discipline / AI-native title | governance + C-07 | trigger + 90d |
| docs/audit/AUDIT-REPO-2026-07-14.md | historical repo audit | L5 / Historical / Kenji | dated evidence / no current truth | audit trace / runtime claims | future audit | no cadence |
| docs/audit/CLEANUP-EXECUTION-2026-07-14.md | execution record | L5 / Historical / Kenji | execution trace / no current authority | traceability / state claims | future audit | no cadence |
| docs/product/ai-startup-noi-dung-cu.md | old AI Startup copy | L5 / Historical / Kenji | provenance / no current public copy | source trace / route truth | future rewrite | no cadence |
| docs/website/HANDOFF-trang-chu.md | homepage handoff | L5 / Historical / Kenji | handoff evidence / no current homepage truth | migration context / source dependencies | G1 Journey Map | no cadence |
| docs/website/LANG_90_TYPOGRAPHY_COMPOSITION_APPROVED_IMPLEMENTATION_SNAPSHOT.md | Lặng snapshot | L4 / Implementation Evidence / Kenji | implementation evidence / no typography authority | responsive evidence / global authority | canonical typography | when used |
| External: ESSENCE Web Studio folder | unapproved local sources | — / External Dependency Pending / Kenji | none / no authority | — / unapproved content | intake task after G0 | on approval |
| External: BAN-CHOT-v8-FINAL.md + BRIEF-dong-bo-v8-FINAL.md | homepage sources named in handoff | — / External Dependency Pending / Kenji | none / no authority | reference names / source absent | intake task after G0 | on approval |
| docs/website/current/ESSENCE_SITE_JOURNEY_MAP.md | current journey map | L2 / Planned / Kenji | future journey truth / not current truth | — / not created | G1 | on creation |
| docs/website/current/ROUTE_STATE_MATRIX.md | current route state | L2 / Planned / Kenji | future route truth / not current truth | — / not created | G1 | on creation |
| docs/website/current/OFFER_STATE_MATRIX.md | current offer state | L2 / Planned / Kenji | future offer truth / not current truth | — / not created | G1 | on creation |
| docs/website/current/INDEXING_POLICY.md | current indexing policy | L2 / Planned / Kenji | future indexing truth / not current truth | — / not created | G1 | on creation |

## Maintenance

Update a row whenever an authority-bearing document, decision, external dependency or replacement changes. This is intentionally not an inventory of every supporting file.
