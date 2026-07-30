# 11_CLAUDE_CODE_CODEX_AI_AGENT_SETUP.md
> **Governance status:** L2 — Active with Patch
> **Owner:** Kenji Phạm
> **Purpose:** Agent task workflow.
> **Decision scope:** Scoped task/QA conventions. **Non-decision scope:** L0 authority, current reading order or G0 merge decision.
> **Still valid:** Task-format and protected-scope rules. **Outdated/superseded:** Old default reading order.
> **Replacement:** [Reading Bundles](../../governance/READING_BUNDLES.md); G0 remains Draft and unmerged.
> **Last verified:** ead2eb7. **Review:** Founder Decision trigger or 90 days.
Mục tiêu: nhiều AI cùng làm một repo mà không giẫm chân nhau, không loạn, Kenji vẫn nắm quyền cuối.
Người đọc chính: mọi AI vào repo; Kenji để hiểu cách giao việc.

## 1. Bảng vai trò

| Vai | Nhiệm vụ | KHÔNG được |
|---|---|---|
| Kenji | Founder / Essence Keeper / quyết định cuối cho 4 nhóm ngoại lệ merge (mục 2.3) | — |
| Claude (Chat, project chiến lược) | Chiến lược, spec, kế hoạch, QA nội dung | Viết code trực tiếp vào repo |
| ChatGPT | Strategy architect / QA chéo / viết prompt (khi Kenji dùng) | Quyết thay Kenji |
| Claude Code | Trợ lý repo local: audit, QA, sửa theo task, chạy build/lint, tự merge sau khi tự kiểm đủ (mục 2.3) | Tự merge 1 trong 4 nhóm ngoại lệ mục 2.3 mà chưa hỏi |
| Codex | Agent triển khai trên GitHub theo task format, tự merge sau khi tự kiểm đủ (mục 2.3) | Sửa ngoài scope, tự viết copy, tự merge 1 trong 4 nhóm ngoại lệ mục 2.3 mà chưa hỏi |
| GitHub | Source of truth của code + docs | — |
| Vercel | Preview + deploy sau merge | Auto-deploy lên production domain khi chưa merge |
| n8n/backend | Tầng automation (Phase sau) | Chạm dữ liệu trẻ em ngoài luật File 09 |

## 2. Luật làm việc (áp cho MỌI AI)

1. Một AI sửa source code tại một thời điểm — không hai agent cùng mở một vùng code. Cách thực thi: BACKLOG.md của repo ghi rõ task nào đang thuộc agent nào.
2. Mỗi task một branch (`feature/...`, `fix/...`); không commit thẳng main.
3. **Merge policy (chốt 28/07/2026, xem PLAYBOOK.md mục 5 cho bản đầy đủ)**:
   sau khi tự kiểm đủ theo checklist QA (File 13 nhóm 8 / PLAYBOOK.md mục 4)
   và đã mở PR + phiếu báo cáo, agent TỰ MERGE — không cần chờ Kenji duyệt
   bước merge. Chỉ 4 nhóm sau vẫn bắt buộc Kenji tự duyệt + tự bấm merge,
   PR luôn để Draft: (a) payment pages; (b) dữ liệu trẻ em; (c) đổi cấu
   trúc/route lớn hoặc file dùng chung (Header/Footer/globals.css/
   tailwind.config); (d) bất kỳ hành động khai báo trang với Google (submit
   Search Console, thêm vào sitemap công khai, gỡ noindex, đổi robots.txt).
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

1. Clone repo về folder xưởng (đã có). 2. `git checkout -b <branch-của-task>`. 3. Đọc theo thứ tự: AGENTS.md → CLAUDE.md → file spec của task → BACKLOG.md → PLAYBOOK.md. 4. Làm trong scope. 5. Chạy `npm run build` + lint; sửa đến sạch. 6. Đẩy branch, mở PR, trình phiếu; nếu KHÔNG thuộc 4 nhóm ngoại lệ mục 2.3 thì tự merge, ngược lại để Draft chờ Kenji. 7. Report format: phiếu 5 dòng + danh sách file đổi + lệnh đã chạy và kết quả.

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
4. Không thuộc 4 nhóm ngoại lệ mục 2.3 → agent tự merge ngay sau khi QA PASS, không chờ Kenji xem preview trước. Thuộc 1 trong 4 nhóm → PR để Draft, Kenji xem preview trong khung duyệt lô rồi tự bấm merge; hoặc trả lại với ghi chú.
5. Vercel auto-deploy sau merge (không đổi).
6. Handoff: agent cập nhật BACKLOG.md (Xong), ghi PLAYBOOK.md nếu có bài học, bàn giao ngữ cảnh cho task kế bằng chính hai file đó — không bàn giao bằng trí nhớ.

## 7. Template report cuối task

"1. Đã làm: … 2. Tự kiểm: build PASS/lint PASS/QA nhóm X PASS, còn Y chưa chắc. 3. Cần mắt Kenji: (≤3 điểm — chỉ bắt buộc nếu PR thuộc 1 trong 4 nhóm ngoại lệ mục 2.3, kèm link preview đúng vị trí). 4. Rủi ro nếu duyệt sai: … 5. Đề xuất/trạng thái: đã tự merge / còn ở Draft chờ Kenji vì thuộc nhóm Z."

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
