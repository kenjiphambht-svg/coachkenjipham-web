# AI Agent Instructions

> **Governance status:** L2 — Active with Patch
> **Owner:** Kenji Phạm
> **Purpose:** Default safeguards for agents.
> **Decision scope:** Task safety, scope and workflow. **Non-decision scope:** Founder Decisions, public positioning, route/indexing, product flow and image authority.
> **Precedence:** Read [Documentation Authority](docs/governance/ESSENCE_DOCUMENTATION_AUTHORITY.md), [Conflict Register](docs/governance/CONFLICT_REGISTER.md) and [Reading Bundles](docs/governance/READING_BUNDLES.md) first. L0 wins over every older statement below.
> **Still valid:** Scoped work, verification and protected-area rules. **Outdated/superseded:** Old public AI-native/astrology positioning is not canonical public copy.
> **Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc
> **Last verified:** PR #110 head; finalize at merge
> **Review:** Founder Decision trigger or 90 days.

This is the shared instruction file for Codex, Claude Code, and future AI coding agents working on coachkenjipham.com.

## Operating Rules

- Think before coding.
- Prefer simple, surgical changes.
- Work in small scoped tasks.
- Do not modify unrelated pages.
- Do not touch payment or private routes unless explicitly asked.
- Do not install new dependencies unless explicitly approved.
- Always inspect existing structure before editing.
- Always list changed files at the end.
- Always run available verification commands when possible.
- Merge policy: an agent does not self-merge by default. Merge requires the applicable L0/Founder Decision and the task-specific approval. PR #110 remains Draft and must not merge in G0.
- NGOẠI LỆ bắt buộc chờ duyệt trước (không đổi, không có ngoại lệ khác):
  (a) PR đụng payment pages; (b) PR đụng dữ liệu trẻ em; (c) PR đổi cấu
  trúc/route lớn hoặc file dùng chung (Header/Footer/globals.css/tailwind.config);
  (d) bất kỳ hành động khai báo trang với Google (submit Search Console, thêm
  route vào sitemap công khai, gỡ noindex, đổi robots.txt cho phép crawl).
- Không tự deploy ngoài luồng PR → merge → Vercel auto-deploy bình thường của repo.
- The 9 legacy color variables in `globals.css` (`--cream`, `--gold`, `--ink`, `--body-text`, `--cream-muted`, `--gold-brand`, `--gold-deep`, `--dark-section`, `--cream-light`) are used ONLY by `kidbook.tsx` and `ai-startup.tsx` (legacy routes). Do not use these variables for any new component or route — all new code must use the `--essence-*-2026` tokens only.
- Khi Kenji gõ "fable mode" hoặc việc đụng route sống/quyết định khó đảo ngược — đọc `.claude/skills/fable-mode/SKILL.md` trước khi làm.

## Trước khi làm thiết kế / hình ảnh (đọc theo thứ tự)

Trước khi làm BẤT KỲ việc thiết kế/hình ảnh nào cho website (trang mới hay trang cũ), đọc theo thứ tự:

1. `docs/brand/ESSENCE_VISUAL_ARCHITECTURE.md` — quy trình thiết kế bắt buộc, Page Mode, Signal Moment phải chốt TRƯỚC khi viết bất kỳ prompt ảnh nào.
2. `docs/brand/ESSENCE_CREATIVE_GROWTH_COMPASS.md` — cách phân loại vấn đề (P0/P1/P2), Definition of Done, cách giải thích báo cáo cho Kenji.
3. `docs/brand/ESSENCE_GEO_STRATEGY.md` — historical credential/method evidence and GEO reference. Không dùng tài liệu này làm canonical public positioning, title, offer data hay schema; các giá trị đó phải do L0 hoặc task-provided approved copy cung cấp.
4. `docs/brand/image-system/08_ESSENCE_LIGHTSCAPE.md` + `docs/brand/image-system/09_PROMPT_MASTER_FLUX2_KLEIN_9B.md` — chuẩn tạo ảnh (ánh sáng là nhân vật chính, ít vật thể, cài đặt FLUX.2 klein 9B).
5. `docs/website/BAI-HOC-KY-THUAT.md` — bài học kỹ thuật từ lỗi thật.

Áp dụng như nhau cho Codex và Claude Code, mọi trang, mọi worktree.

## Project Identity

Canonical public positioning: Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu, Essence Coach. Người sáng lập Essence Coaching System. Không được diễn giải, rút gọn, dịch thành positioning khác, hoặc suy ra danh xưng từ evidence lịch sử.

## Website Role

coachkenjipham.com is the official public website and brand hub for Kenji Phạm and Essence Coaching System.

The website should act as a clear routing hall, not a crowded service menu.

## Core Positioning

- Simple on the outside, deep on the inside.
- Website visitors should quickly understand where to go:
  1. For themselves
  2. For their child
  3. For understanding Kenji, Essence, and the AI system

## Preferred Language

Vietnamese first.

Historical terms such as AI-native, Personal Psychology Engine, Solo AI Company, and agentic workflow are not public positioning. Use them only when an L0 or task-provided approved specification explicitly supplies the required context.

## Avoid

- tâm hồn as main positioning
- chữa lành
- trị liệu
- cấp cứu tâm thức
- định mệnh
- tần số
- năng lượng vũ trụ
- manifest
- AI therapist
- diagnosis
- guaranteed transformation claims
