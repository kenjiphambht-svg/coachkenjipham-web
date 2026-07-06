# 10_DESIGN_SYSTEM_MIGRATION_PLAN.md
Đường dẫn repo: docs/brand/design-system/10_DESIGN_SYSTEM_MIGRATION_PLAN.md
Mục tiêu: đưa design system 2026 vào repo hiện tại mà KHÔNG làm vỡ website đang chạy. Ẩn dụ: thay hệ điện cho ngôi nhà đang có người ở — đi từng phòng, ngắt cầu dao từng khu, không đập tường một lượt.

## 0. Trạng thái cần kiểm trước khi bắt đầu

- Repo main đang deploy bản nào; PR #2 homepage đang ở đâu (merge chưa/conflict gì).
- Local worktree của Claude Code sạch chưa (git status).
- CSS/Tailwind hiện tại: token đang là gì, hex trần ở đâu (audit).
- public/ hiện có asset gì, trùng/lỗi gì.
Chưa trả lời đủ 4 dòng này thì chưa mở phase 1.

## Phase 1 — Docs-only PR
Mục tiêu: đưa bộ design system 2026 (12 file) vào docs/brand/design-system/. Files sửa: chỉ docs/. Files cấm: mọi code, mọi public/. QA: build không đổi, diff chỉ docs. DoD: bộ tài liệu là một phần của repo, agent trích được đường dẫn.

## Phase 2 — Asset inventory PR
Mục tiêu: đưa logo/signature/favicon SẠCH vào public/brand/ theo file 07. Việc: chọn lọc từ archive zip; kiểm chiều nền từng bản bằng mắt (chụp đối chiếu); tạo bộ favicon nếu thiếu; .gitignore rác. Files cấm: component/page code. QA: file 07 checklist. DoD: kho asset chuẩn, một bản một nơi, 0 rác.
Dọn rác bắt buộc: __MACOSX, .DS_Store, file "Bản sao…", .design-canvas.state.json, _ds_bundle.js, tên file có dấu/khoảng trắng, asset trùng.

## Phase 3 — Token audit PR
Mục tiêu: so CSS/Tailwind hiện tại với token file 03–04; đưa token chuẩn vào file token/config; xuất bảng map cũ→mới. CHƯA áp vào trang (trang vẫn chạy giá trị cũ nếu cần alias tạm). Files cấm: page components. QA: build pass, bảng map đầy đủ, xác nhận font hiện trạng (DM Sans hay Inter đang thật sự được dùng) để Kenji chốt quyết định font ở file 11. DoD: token là nguồn sự thật duy nhất, sẵn sàng áp.

## Phase 4 — Homepage RE-LIGHT PR
Mục tiêu: chuyển homepage từ nền tối hiện trạng sang Light-led premium theo section color map (08 mục 1 + UPDATED_COLOR_AND_PAGE_RULES_FOR_CODEX.md): áp token, đổi nền từng section, sửa contrast, logo thật, slot ảnh Kenji, một nút vàng. Đây là đổi nền có kiểm soát — lớn hơn polish; vẫn một PR, bắt buộc ảnh so sánh trước/sau từng section. Files: homepage + component nó dùng. Files cấm: route khác, token file (đã chốt ở phase 3). QA: file 09 mục 5 + docs/website/04 mục 6. DoD: homepage đạt chuẩn 2026, preview được Kenji duyệt.

## Phase 5 — Hạt Mầm landing PR
Mục tiêu: build landing theo mode Hạt Mầm (08 mục 5, docs/website/05). QA thêm Child Safety. DoD: DoD của docs/website/05.

## Phase 6 — Private reading room visual PR
Mục tiêu: áp mode calm private (08 mục 9, file 06 mục 12) cho /an-pham/[slug]. QA: + test noindex (docs/website/09). DoD: phòng đọc dummy đạt chuẩn.

## Luật cấm toàn kế hoạch

- KHÔNG đưa toàn bộ zip vào repo — zip ở lại archive ngoài repo (kho riêng của Kenji).
- KHÔNG đưa HTML prototype vào production nếu chưa chuyển hóa thành component đúng token.
- KHÔNG copy colors_and_type.css cũ vào globals khi chưa qua audit phase 3.
- KHÔNG overwrite homepage hiện tại ngoài PR có preview.
- KHÔNG đưa Ebook/Ban-Sac-Hat-Mam-Shi.* vào repo cho tới khi Kenji xác nhận là dummy (nghi dữ liệu khách — luật docs/website/09).
- Mỗi phase một PR; phase sau chỉ mở khi phase trước merge.

## Definition of Done toàn kế hoạch
Sáu phase merge xong; website hiển thị bằng token 2026; không còn hex trần/asset rác; mọi thay đổi có preview đã được Kenji duyệt; website không một phút nào vỡ trong quá trình chuyển.
