# PLAYBOOK — Cách xưởng Essence vận hành

Giao thức làm việc cho Claude Code, Codex, ChatGPT và Kenji.
File này + `BACKLOG.md` là hệ điều hành của xưởng. Luật chi tiết hơn: `AGENTS.md`, `.claude/rules/`, `docs/website/master-plan/11_CLAUDE_CODE_CODEX_AI_AGENT_SETUP.md`.

## 1. Mỗi phiên Claude Code bắt đầu như sau

1. Check branch (`git branch --show-current`).
2. Check `git status`.
3. Read `BACKLOG.md`.
4. Read `PLAYBOOK.md`.
5. Read `docs/brand/BRAND_SYSTEM_INDEX.md`.
6. Read relevant docs for task.
7. Confirm scope before editing.

## 2. Quy tắc branch

- Never work directly on main.
- Each task gets its own branch.
- One PR = one scope.
- Draft PR first.

## 3. Quy tắc commit

- Clear commit message.
- No unrelated changes.
- No source change inside docs-only PR.

## 4. Quy tắc QA

Trước khi trình mọi PR:

- `git status --short`
- `git diff --check`
- `git diff --name-status`
- Run build only when task touches code and Kenji approves.

QA checklist đầy đủ theo loại task: `docs/website/master-plan/13_QA_CHECKLIST_10000_USD_WEBSITE.md`.

## 5. Quy tắc handoff

- Claude Code reports (phiếu 5 dòng: đã làm gì / tự kiểm gì / có sửa code không / rủi ro / cần Kenji xem chỗ nào).
- ChatGPT interprets for Kenji.
- Codex audits PR.
- Kenji decides merge. Không có ngoại lệ.

## 6. Quy tắc visual

- Light-led premium.
- Dark as silence.
- White / ivory / cream / black / gold.
- No brown.
- Keep Inter during beta. (Mọi thay đổi font sau beta cần một task riêng được Kenji duyệt trước.)

Nguồn: `docs/brand/design-system/FOUNDER_VISUAL_DECISION_SUMMARY.md`, `docs/brand/design-system/UPDATED_COLOR_AND_PAGE_RULES_FOR_CODEX.md`.

## 7. Quy tắc safety

- Child-safe language.
- No deterministic labels for children.
- No fake healing claims.
- No spiritual certainty.
- No privacy shortcuts.

Nguồn: `docs/brand/CHILD_LANGUAGE_RULES.md`, `docs/brand/SAFETY_BOUNDARIES.md`, `docs/website/master-plan/09_SECURITY_PRIVACY_AND_CHILD_DATA_POLICY.md`.
