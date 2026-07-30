# PLAYBOOK — Cách xưởng Essence vận hành

> **Governance status:** L2 — Active with Patch
> **Owner:** Kenji Phạm
> **Purpose:** Agent workflow and QA.
> **Decision scope:** Workflow, branch and QA discipline. **Non-decision scope:** L0 product, route, indexing and public-positioning decisions.
> **Precedence:** [Documentation Authority](docs/governance/ESSENCE_DOCUMENTATION_AUTHORITY.md) and [Conflict Register](docs/governance/CONFLICT_REGISTER.md) govern this file.
> **Still valid:** Scoped branches, QA and safety. **Outdated/superseded:** Old phase truth and any conflicting merge wording. G0 is a Draft PR and must not merge.
> **Last verified:** ead2eb7. **Review:** Founder Decision trigger or 90 days.

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
- **Merge policy (chốt 28/07/2026 — thay thế ngoại lệ hẹp 18/07/2026, áp dụng
  như nhau cho Claude Code VÀ Codex)**: sau khi build/lint pass và đã tự kiểm
  đầy đủ theo mục 4, agent được TỰ MERGE — không cần chờ Kenji duyệt bước
  merge, kể cả khi PR không còn "nhỏ và rõ ràng" (vd: viết lại nội dung/route
  trọn trang). Vẫn phải mở PR + phiếu báo cáo đầy đủ như thường lệ — chỉ khác
  bước bấm merge cuối cùng.
- **4 ngoại lệ vẫn bắt buộc Kenji tự duyệt + tự bấm merge — không đổi, không
  có ngoại lệ nào khác**:
  (a) PR đụng payment pages (`/thanh-toan-*`).
  (b) PR đụng dữ liệu trẻ em.
  (c) PR đổi cấu trúc/route lớn, hoặc đụng file dùng chung
      (Header/Footer/globals.css/tailwind.config).
  (d) Bất kỳ hành động khai báo trang với Google dưới mọi hình thức — submit
      Search Console, thêm route vào sitemap công khai, gỡ noindex, đổi
      robots.txt cho phép crawl. Nhóm (d) áp dụng bất kể PR thuộc loại nào,
      kể cả PR nhỏ.
  Các PR thuộc 1 trong 4 nhóm trên luôn để Draft, chờ Kenji xem và tự bấm
  merge — nêu rõ trong phiếu báo cáo đang thuộc nhóm nào nếu có.
- Lý do đổi: 18/07/2026 mới cho Claude Code tự merge PR nhỏ/rõ ràng; 28/07/2026
  Kenji xác nhận mở rộng — tự merge là mặc định cho MỌI agent sau khi tự kiểm
  đủ, chỉ cần hỏi trước khi có hành động khai báo Google (xem ghi chú tại
  `docs/website/master-plan/15_DECISION_LOG_AND_NEXT_ACTIONS.md` mục 1 và
  `docs/website/master-plan/11_CLAUDE_CODE_CODEX_AI_AGENT_SETUP.md`).

## 6. Quy tắc visual

- Light-led premium.
- Dark as silence.
- White / ivory / cream / black / gold.
- No brown.
- Keep Inter during beta. (Mọi thay đổi font sau beta cần một task riêng được Kenji duyệt trước.)

Nguồn: `docs/brand/design-system/FOUNDER_VISUAL_DECISION_SUMMARY.md`, `docs/brand/design-system/UPDATED_COLOR_AND_PAGE_RULES_FOR_CODEX.md`.

### Trước khi làm thiết kế / hình ảnh (đọc theo thứ tự)

Trước khi làm BẤT KỲ việc thiết kế/hình ảnh nào cho website (trang mới hay trang cũ), đọc theo thứ tự:

1. `docs/brand/ESSENCE_VISUAL_ARCHITECTURE.md` — quy trình thiết kế bắt buộc, Page Mode, Signal Moment phải chốt TRƯỚC khi viết bất kỳ prompt ảnh nào.
2. `docs/brand/ESSENCE_CREATIVE_GROWTH_COMPASS.md` — cách phân loại vấn đề (P0/P1/P2), Definition of Done, cách giải thích báo cáo cho Kenji.
3. `docs/brand/ESSENCE_GEO_STRATEGY.md` — ngân hàng câu hỏi + câu trả lời chuẩn cho SEO/GEO. Đọc TRƯỚC khi viết bất kỳ nội dung/meta/schema nào cho trang mới. Mọi số liệu sản phẩm và câu trả lời định vị phải lấy từ đây, không tự viết lại.
4. `docs/brand/image-system/08_ESSENCE_LIGHTSCAPE.md` + `docs/brand/image-system/09_PROMPT_MASTER_FLUX2_KLEIN_9B.md` — chuẩn tạo ảnh (ánh sáng là nhân vật chính, ít vật thể, cài đặt FLUX.2 klein 9B).
5. `docs/website/BAI-HOC-KY-THUAT.md` — bài học kỹ thuật từ lỗi thật.

Áp dụng như nhau cho Codex và Claude Code, mọi trang, mọi worktree.

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
