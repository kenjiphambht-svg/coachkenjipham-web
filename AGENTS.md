# AI Agent Instructions

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
- Do not merge or deploy automatically.
- The human owner must review before merge.
- The 9 legacy color variables in `globals.css` (`--cream`, `--gold`, `--ink`, `--body-text`, `--cream-muted`, `--gold-brand`, `--gold-deep`, `--dark-section`, `--cream-light`) are used ONLY by `kidbook.tsx` and `ai-startup.tsx` (legacy routes). Do not use these variables for any new component or route — all new code must use the `--essence-*-2026` tokens only.
- Khi Kenji gõ "fable mode" hoặc việc đụng route sống/quyết định khó đảo ngược — đọc `.claude/skills/fable-mode/SKILL.md` trước khi làm.

## Trước khi làm thiết kế / hình ảnh (đọc theo thứ tự)

Trước khi làm BẤT KỲ việc thiết kế/hình ảnh nào cho website (trang mới hay trang cũ), đọc theo thứ tự:

1. `docs/brand/ESSENCE_VISUAL_ARCHITECTURE.md` — quy trình thiết kế bắt buộc, Page Mode, Signal Moment phải chốt TRƯỚC khi viết bất kỳ prompt ảnh nào.
2. `docs/brand/ESSENCE_CREATIVE_GROWTH_COMPASS.md` — cách phân loại vấn đề (P0/P1/P2), Definition of Done, cách giải thích báo cáo cho Kenji.
3. `docs/brand/ESSENCE_GEO_STRATEGY.md` — ngân hàng câu hỏi + câu trả lời chuẩn cho SEO/GEO. Đọc TRƯỚC khi viết bất kỳ nội dung/meta/schema nào cho trang mới. Mọi số liệu sản phẩm và câu trả lời định vị phải lấy từ đây, không tự viết lại.
4. `docs/brand/image-system/08_ESSENCE_LIGHTSCAPE.md` + `docs/brand/image-system/09_PROMPT_MASTER_FLUX2_KLEIN_9B.md` — chuẩn tạo ảnh (ánh sáng là nhân vật chính, ít vật thể, cài đặt FLUX.2 klein 9B).
5. `docs/website/BAI-HOC-KY-THUAT.md` — bài học kỹ thuật từ lỗi thật.

Áp dụng như nhau cho Codex và Claude Code, mọi trang, mọi worktree.

## Project Identity

Kenji Phạm is an Essence Coach and founder of Essence Coaching System - an AI-native identity coaching system combining coaching, depth psychology, symbolic psychological astrology, and agentic AI workflows.

Kenji Phạm là Essence Coach và founder Essence Coaching System - hệ khai vấn bản sắc AI-native kết hợp coaching, tâm lý chiều sâu, chiêm tinh tâm lý theo hướng biểu tượng và AI agentic workflow.

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

English terms may be used when strategically useful:

- AI-native
- Personal Psychology Engine
- Solo AI Company
- agentic workflow

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

