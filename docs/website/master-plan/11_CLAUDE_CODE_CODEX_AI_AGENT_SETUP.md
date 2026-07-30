# 11_CLAUDE_CODE_CODEX_AI_AGENT_SETUP.md
> **Governance status:** L2 — Active with Patch
> **Owner:** Kenji Phạm
> **Purpose:** Agent task workflow.
> **Decision scope:** Scoped task/QA conventions. **Non-decision scope:** L0 authority, current reading order or G0 merge decision.
> **Still valid:** Task-format and protected-scope rules. **Outdated/superseded:** Old default reading order.
> **Replacement:** [Reading Bundles](../../governance/READING_BUNDLES.md); G0 remains Draft and unmerged.
> **Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc
> **Last verified:** PR #110 head; finalize at merge
> **Review:** Founder Decision trigger or 90 days.
Mục tiêu: nhiều AI cùng làm một repo mà không giẫm chân nhau, không loạn, Kenji vẫn nắm quyền cuối.
Người đọc chính: mọi AI vào repo; Kenji để hiểu cách giao việc.

## 1. Bảng vai trò

| Vai | Nhiệm vụ | KHÔNG được |
|---|---|---|
| Kenji | Founder / Essence Keeper / quyết định cuối theo L0 Founder Decision | — |
| Claude (Chat, project chiến lược) | Chiến lược, spec, kế hoạch, QA nội dung | Viết code trực tiếp vào repo |
| ChatGPT | Strategy architect / QA chéo / viết prompt (khi Kenji dùng) | Quyết thay Kenji |
| Claude Code | Trợ lý repo local: audit, QA, sửa theo task, chạy build/lint | Tự merge khi không có L0/Founder Decision và task-specific approval |
| Codex | Agent triển khai trên GitHub theo task format | Sửa ngoài scope, tự viết copy, tự merge khi không có L0/Founder Decision và task-specific approval |
| GitHub | Source of truth của code + docs | — |
| Vercel | Preview + deploy sau merge | Auto-deploy lên production domain khi chưa merge |
| n8n/backend | Tầng automation (Phase sau) | Chạm dữ liệu trẻ em ngoài luật File 09 |

## 2. Luật làm việc (áp cho MỌI AI)

1. Một AI sửa source code tại một thời điểm — không hai agent cùng mở một vùng code. Cách thực thi: BACKLOG.md của repo ghi rõ task nào đang thuộc agent nào.
2. Mỗi task một branch (`feature/...`, `fix/...`); không commit thẳng main.
3. **Merge policy:** an agent does not self-merge by default. Merge requires the applicable L0/Founder Decision and task-specific approval; PR #110 remains Draft and must not merge in G0.
4. Không cài package mới nếu chưa được duyệt (ghi đề xuất vào phiếu, chờ).
5. Không sửa ngoài scope của task, kể cả "tiện tay sửa lỗi nhìn thấy" — ghi vào backlog thay vì sửa.
6. Không đụng payment/private route nếu task không yêu cầu rõ.
7. Mọi task kết thúc bằng phiếu trình duyệt 5 dòng (đã làm / tự kiểm / cần mắt Kenji / rủi ro / đề xuất).

## 3. Cấu trúc docs trong repo

```
AGENTS.md            ← luật chung mọi agent (bản rút của file này)
CLAUDE.md            ← luật riêng Claude Code (đã có + phần backlog/phiếu)
docs/website/        ← bộ 16 file này
docs/strategy/       ← 6 file market-proof
docs/backend/  docs/security/  docs/product/  docs/automation/  docs/workflow/
.claude/rules/       ← rule máy đọc (từ cấm, noindex test...)
.claude/skills/      ← skill tái dùng nếu có
```
Luật: tài liệu là một phần của repo — đổi quyết định thì đổi docs trong cùng PR.

## 4. Claude Code local setup (checklist từng bước)

1. Clone repo về folder xưởng (đã có). 2. `git checkout -b <branch-của-task>`. 3. Đọc theo thứ tự: Documentation Authority → Document Registry → Conflict Register → Reading Bundles → AGENTS.md → task-provided approved specification → BACKLOG.md → PLAYBOOK.md. Nếu Page Contract, policy hoặc spec không có exact path trong bundle thì đánh dấu Planned/Missing và yêu cầu task cung cấp, không suy diễn. 4. Làm trong scope. 5. Chạy `npm run build` + lint khi task cho phép; sửa đến sạch. 6. Đẩy branch, mở PR, trình phiếu; mọi merge tuân theo L0 và Founder Decision hiện hành. 7. Report format: phiếu 5 dòng + danh sách file đổi + lệnh đã chạy và kết quả.

## 5. Codex task format (bắt buộc mỗi task)

```
BRANCH: feature/<tên>
SCOPE: <một câu>
FILES ALLOWED: <đường dẫn/pattern>
FILES FORBIDDEN: mọi thứ còn lại, nêu rõ vùng nhạy cảm nếu gần scope
SOURCE DOCS: <file trong docs/ phải đọc trước>
IMPLEMENTATION: <các bước>
VERIFICATION: <checklist QA phải chạy, trích File 13>
REPORT: phiếu 5 dòng + preview link
```

## 6. PR → QA → Handoff workflow

1. Task khai báo trong BACKLOG.md (ai, branch, scope).
2. Agent làm → push branch → PR mở với mô tả theo phiếu 5 dòng → preview Vercel tự sinh.
3. QA: agent tự chạy checklist kỹ thuật (File 13 nhóm 8) → Claude Code có thể QA chéo PR của Codex (đọc diff, chạy build, soát từ cấm bằng script) → kết quả ghi vào PR.
4. QA PASS does not authorize merge by itself. Keep a PR Draft until the applicable L0/Founder Decision and task-specific approval authorize its next state; PR #110 remains Draft in G0.
5. Vercel auto-deploy sau merge (không đổi).
6. Handoff: agent cập nhật BACKLOG.md (Xong), ghi PLAYBOOK.md nếu có bài học, bàn giao ngữ cảnh cho task kế bằng chính hai file đó — không bàn giao bằng trí nhớ.

## 7. Template report cuối task

"1. Đã làm: … 2. Tự kiểm: build PASS/lint PASS/QA nhóm X PASS, còn Y chưa chắc. 3. Cần mắt Kenji: các điểm cần Founder Decision hoặc task-specific approval, kèm link preview đúng vị trí. 4. Rủi ro nếu duyệt sai: … 5. Đề xuất/trạng thái: Draft chờ authority/approval, hoặc trạng thái đã được Founder Decision cho phép."

## Checklist
- [ ] AGENTS.md tạo ở gốc repo (rút từ file này).
- [ ] BACKLOG.md có cột "agent phụ trách".
- [ ] Branch protection bật trên main (không push thẳng, PR bắt buộc).
- [ ] Script soát từ cấm đặt ở .claude/rules/ chạy được trong CI hoặc tay.

## Definition of Done
Hai agent (Codex + Claude Code) chạy hai task khác scope trong cùng tuần mà không đụng file của nhau, mọi merge đều có phiếu; duyệt của Kenji chỉ bắt buộc cho 4 nhóm ngoại lệ mục 2.3 (payment, dữ liệu trẻ em, cấu trúc/route lớn, khai báo Google).

## Rủi ro cần tránh
- Giao task bằng chat rời rạc không theo format — task không format thì không làm.
- Hai agent cùng sửa một vùng vì backlog không cập nhật — cập nhật backlog là một phần của task, không phải việc phụ.
