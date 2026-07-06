# PROMPT_FOR_CODEX_DOCS_ONLY_PR.md
Cách dùng: dán nguyên khối dưới cho Codex/Claude Code sau khi Kenji đã đặt folder v1.1 này vào repo local (hoặc đính kèm nội dung). Task DOCS-ONLY.

---

BRANCH: docs/design-system-2026-v1-1

SCOPE: đưa nguyên bộ ESSENCE DESIGN SYSTEM 2026 v1.1 (14 file Markdown) vào docs/brand/design-system/. Bộ này đã nhất quán sẵn (light-led premium, dark as silence, no brown) — KHÔNG chỉnh sửa nội dung, chỉ đặt file đúng chỗ.

FILES ALLOWED:
- docs/brand/design-system/** (tạo mới/ghi đè 14 file)
- .claude/rules/color-direction-banned-words.md (tạo mới: "warm brown", "brown gradient", "sepia", "mocha", "earthy brown", "chocolate", "coffee tone", "amber-heavy")

FILES FORBIDDEN: mọi source code, mọi route, public/, package.json, cấu hình build.

VERIFICATION:
- Diff chỉ chạm files allowed; git status sạch ngoài docs và .claude/rules.
- Đủ 14 file, tên đúng.
- Grep docs/brand/design-system/: không còn cụm "Dark premium" như mode toàn trang (chỉ được xuất hiện trong ngữ cảnh lịch sử/audit).
- Build không đổi (npm run build pass).

REPORT: phiếu 5 dòng. KHÔNG MERGE — chờ Kenji duyệt.
