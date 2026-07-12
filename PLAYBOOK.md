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

## 8. Viện cớ hay gặp — và cách bác lại

Agent (và cả người) hay tự thuyết phục mình bỏ bước bằng những câu nghe rất hợp lý. Gặp mình đang nghĩ một trong các câu dưới đây = dừng lại, làm đúng luật. (Ý tưởng bảng này tham khảo agent-skills của Addy Osmani, MIT; viết lại theo luật của repo này.)

| Viện cớ | Vì sao sai | Làm đúng là gì |
|---|---|---|
| "Merge trước, soát từ cấm sau." | Child Safety fail = chặn merge vô điều kiện (File 13 mục 10 + nhóm 3). Từ cấm lọt lên production là sự cố niềm tin, không phải lỗi chính tả. | Quét từ cấm (`.claude/rules/`) TRƯỚC khi trình phiếu. Fail một mục nhóm 3 = không trình merge. |
| "Tiện tay sửa luôn chỗ này thấy lỗi." | Sửa ngoài scope làm PR phình, review sai trọng tâm, và có thể đụng vùng nhạy cảm (payment/child data) mà task không cho phép (File 11 luật 5). | Ghi vào BACKLOG.md hoặc phiếu báo cáo. Lỗi thấy được thì flag, không tự sửa. |
| "Route noindex thì push thẳng main cũng được, khỏi cần build kỹ." | Noindex chỉ giấu Google — trang vẫn deploy lên production thật, vỡ là vỡ trước mắt khách bấm link. Ngoại lệ push thẳng main (nếu Kenji cho) không bao giờ là ngoại lệ bỏ QA. | Vẫn bắt buộc: build + lint pass trước push, và curl xác nhận route sống + noindex có mặt SAU deploy. |
| "Test dummy sau, giờ merge trước." | DoD của từng file master-plan (File 05, 06...) yêu cầu case dummy đi trọn flow trước khi coi là xong. "Merge trước test sau" = ship thứ chưa ai đi thử. | Chạy đủ flow với case dummy, dán kết quả vào phiếu, rồi mới trình merge. |
| "Biến/token cũ chắc không ai dùng, xóa luôn cho sạch." | Đã có lần grep ra 300+ chỗ đang gọi 9 biến màu "cũ" — toàn bộ nằm ở route live đang bán hàng. Xóa mù = trang thật mất màu ngay. | Grep toàn repo trước khi xóa BẤT KỲ thứ gì. Có người dùng thì không xóa; ghi nhận và hỏi Kenji. |
| "Copy gần đúng là được, chỉnh vài chữ cho mượt hơn." | Copy public là giọng của Kenji và đã qua duyệt ngôn ngữ (từ cấm, child-safe). Một chữ "chỉnh cho hay" có thể thành lời hứa hoặc nhãn dán mà cả hệ đang tránh. | Copy đã duyệt = nguyên văn 100%. Muốn đổi chữ nào, đề xuất trong phiếu để Kenji quyết. |
| "Tên branch bị trùng thì reset/ghi đè cho nhanh." | Branch trùng tên có thể đang gắn PR mở chứa việc chưa merge. Force-push đè lên = mất việc thật, khó khôi phục. | Dừng lại kiểm tra branch/PR hiện có. Trùng thì hỏi Kenji hoặc dùng tên khác — không bao giờ ghi đè lịch sử PR đang mở. |
| "Không chụp được màn hình thì thôi, bỏ bước verify." | Bỏ verify im lặng = phiếu báo "xong" cho thứ chưa ai nhìn thấy. Tooling hỏng không phải lý do hạ chuẩn. | Verify bằng đường khác (inspect DOM, curl, prod server local) và GHI RÕ hạn chế trong phiếu để Kenji biết còn gì chưa kiểm bằng mắt. |
