# Brand System Index — Essence Coaching 2026

> **Governance status:** L2 — Active with Patch
> **Owner:** Kenji Phạm
> **Purpose:** Brand-document entrypoint.
> **Decision scope:** Reading index. **Non-decision scope:** Authority hierarchy or completeness of all current systems.
> **Precedence:** Read [Documentation Authority](../governance/ESSENCE_DOCUMENTATION_AUTHORITY.md) and [Reading Bundles](../governance/READING_BUNDLES.md) first.
> **Still valid:** Document inventory and bounded visual decisions. **Outdated/superseded:** “Three standard systems,” old organization suffixes and any collection-level claim to outrank governance.
> **Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc
> **Last verified:** G1.1 PR head; finalize at merge.
> **Review:** Founder Decision trigger or 90 days.

Trang mục lục cho các bộ tài liệu hỗ trợ của Essence Coaching. Đây là inventory dưới Reading Bundles, không phải hierarchy hay default reading order độc lập.

## 1. Website Master Plan

Vị trí: [`docs/website/master-plan/`](../website/master-plan/)

Bản đồ tổng của website coachkenjipham.com: định vị, sitemap và route policy, page briefs, spec homepage, funnel Bản Sắc Hạt Mầm, hệ thống ấn phẩm riêng tư, kiến trúc backend/CRM/payment, email nurture, bảo mật và dữ liệu trẻ em, SEO/AIO/GEO, setup AI agent, roadmap triển khai, QA checklist, glossary và decision log.

Authority hiện hành: đọc Universal + Current website truth trong [`READING_BUNDLES.md`](../governance/READING_BUNDLES.md). `00_READ_ME_FIRST_WEBSITE_MASTER_PLAN.md` và các file không được Registry ghi Active là historical collection evidence; không dùng để mở scope hoặc thay L0/L2 current truth.

## 2. Design System v1.1

Vị trí: [`docs/brand/design-system/`](design-system/)

Luật màu, font, layout, component cho toàn bộ website: brand identity và voice 2026, color tokens, typography, layout/spacing/grid, UI component rules, logo và asset policy, hướng dẫn áp dụng theo trang, handoff cho Codex/Claude Code, migration plan và decision log.

Entrypoint hỗ trợ: [`00_READ_ME_FIRST_DESIGN_SYSTEM.md`](design-system/00_READ_ME_FIRST_DESIGN_SYSTEM.md). Toàn bộ collection này subordinate dưới Experience Bible, Visual Architecture, canonical typography system, C-07 và Reading Bundles; decision log trong collection không thể tạo hierarchy cạnh tranh.

## 3. Image System v1.1

Vị trí: [`docs/brand/image-system/`](image-system/)

Luật ảnh cho Essence Coaching: chiến lược asset ảnh, style guide chân dung AI của Kenji, prompt bank cho Flux/LoRA, QA checklist ảnh, workflow sản xuất ảnh, handoff cho Claude Code/Codex và template inventory.

Entrypoint hỗ trợ: [`00_READ_ME_FIRST_IMAGE_SYSTEM.md`](image-system/00_READ_ME_FIRST_IMAGE_SYSTEM.md). Các file 01–09 subordinate dưới entrypoint, C-12 và Reading Bundles.

## Founder Visual Decision

- Light-led premium: nền sáng dẫn dắt, cảm giác cao cấp.
- Dark as silence: màu tối chỉ dùng như khoảng lặng, không phải nền chủ đạo.
- Bảng màu: white / ivory / cream / black / gold.
- No brown: không dùng tông nâu.

Chi tiết: [`FOUNDER_VISUAL_DECISION_SUMMARY.md`](design-system/FOUNDER_VISUAL_DECISION_SUMMARY.md)

## Font Decision cho Beta

- Giữ Inter trong beta.
- Không đổi sang DM Sans trong Phase 0.
- Mọi thay đổi font sau beta cần một task riêng được Kenji duyệt trước. (Any future font change after beta requires a separate Kenji-approved task.)

## Ghi chú phạm vi

PR này chỉ thêm tài liệu Markdown vào `docs/`. Không sửa source code, không sửa homepage, không sửa `/kidbook`, `/ai-startup`, payment pages, `package.json`, config, và không thêm ảnh vào `public/`.
