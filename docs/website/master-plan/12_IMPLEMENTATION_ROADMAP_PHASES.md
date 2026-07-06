# 12_IMPLEMENTATION_ROADMAP_PHASES.md
Mục tiêu: chia toàn dự án thành 13 phase để không làm tất cả một lần.
Người đọc chính: Kenji (điều phối), mọi agent (biết mình đang ở phase nào).

Nguyên tắc ưu tiên xuyên suốt: KHÔNG build backend lớn trước khi có 10 khách Hạt Mầm thật; KHÔNG dashboard phức tạp khi Airtable đủ; KHÔNG tự động hóa sâu trước khi Kenji review 30–50 output đầu; KHÔNG redirect /kidbook khi chưa kiểm product/payment flow. Mỗi phase dưới đây ghi gọn: mục tiêu / vì sao / đụng gì / KHÔNG đụng gì / ai làm / nguồn đọc / task chính / điều kiện qua phase. QA: mọi phase chạy File 13 nhóm liên quan; prompt Codex: dùng format File 11 mục 5 + spec của phase.

## Phase 0 — Repo audit & AI OS foundation (tuần này)
Mục tiêu: biết chính xác repo đang có gì; đặt nền luật làm việc. Vì sao: sửa nhà phải xem móng trước. Đụng: docs/, AGENTS.md, BACKLOG/PLAYBOOK, branch protection, 2FA các tài khoản, audit route (File 02 prompt). KHÔNG đụng: mọi code trang. Ai: Claude Code (audit) + Kenji (bật 2FA, branch protection). Nguồn: 00, 02, 09, 11. Qua phase khi: bảng route thực tế có, luật agent hoạt động, 2FA bật đủ.
Rủi ro: audit kéo dài thành dọn dẹp — Phase 0 chỉ NHÌN, không sửa.

## Phase 1 — Homepage premium v1
Mục tiêu: homepage đạt spec File 04. Vì sao: mọi luồng content đổ về đây xác tín. Đụng: homepage + component của nó. KHÔNG đụng: /kidbook, route khác. Ai: Codex build, Claude Code QA chéo, Kenji duyệt copy + preview. Nguồn: 04, docs/strategy/01. Qua phase khi: checklist File 04 mục 6 pass, merge xong.
Rủi ro: sa lầy chỉnh thẩm mỹ vô hạn — tối đa 2 vòng duyệt, còn lại ghi backlog v2.

## Phase 2 — Core public pages
Mục tiêu: /ve-kenji, /ban-sac-cua-con, /dieu-essence-khong-hua, /chinh-sach-rieng-tu, /lien-he. Vì sao: đủ bộ xác tín trước khi mời beta công khai (khớp docs/strategy/04 tuần 3). Đụng: 5 route trên. KHÔNG đụng: payment, /kidbook. Nguồn: 03, 09. Qua phase khi: 5 trang online, Brand+Child Safety QA pass. Cần từ Kenji: ảnh chân dung thật (chụp trước phase này — xem File 15).

## Phase 3 — Hạt Mầm landing
Mục tiêu: landing theo File 05 (chưa cần payment tự động). Vì sao: cửa bán chính của quý. Đụng: /an-pham-ban-sac-hat-mam. Qua phase khi: DoD File 05 phần nội dung + form intake nối Airtable chạy case dummy.

## Phase 4 — Payment + intake MVP
Mục tiêu: flow đặt → VietQR theo mã đơn → xác nhận tay → intake đủ. Vì sao: khách beta trả tiền được một cách đàng hoàng. Đụng: trang xác nhận đơn (noindex), Airtable Order. KHÔNG đụng: cổng thanh toán tự động. Nguồn: 05 mục 6–7, 07. Qua phase khi: một đơn dummy đi trọn tiền→intake.

## Phase 5 — Private publication delivery
Mục tiêu: phòng đọc riêng theo File 06 mức MVP + nối với máy ấn phẩm (máy đặt file vào kho, web trỏ tới). Đụng: /an-pham/[slug] + test noindex. Qua phase khi: DoD File 06 pass với case dummy. Đây là phase khớp nối website ↔ máy ấn phẩm — hai xưởng phải thống nhất format bàn giao file trước khi code.

## Phase 6 — Email + CRM + follow-up
Mục tiêu: 9 sequence File 08 vận hành (tay + bán tự động), SPF/DKIM xong. Vì sao: mét cuối của trải nghiệm khách. Qua phase khi: khách dummy đi trọn S2→S6 không rơi spam.

## Phase 7 — Security/privacy hardening
Mục tiêu: chạy trọn checklist File 09 mục 6, nâng phòng đọc lên mức "Tốt hơn" nếu đã bán chính thức. Vì sao: trước khi mở rộng khối lượng khách. Qua phase khi: 100% checklist pass + phục hồi thử backup.

## Phase 8 — Ghi chép Essence / content engine
Mục tiêu: /goc-doc chạy, đăng theo pillar File 10, quy trình duyệt M7. Qua phase khi: 5 bài đầu online đúng chuẩn schema + giọng.

## Phase 9 — /ve-essence GEO/AIO credibility page
Mục tiêu: trang theo docs/strategy/02; gộp/hạ /ai-startup nếu hợp. Điều kiện vào phase: beta xong, có "điều chúng tôi học được" để trang có thịt thật. Qua phase khi: schema Organization validate, Kenji duyệt từng đoạn public-safe.

## Phase 10 — Admin/internal dashboard (chỉ nếu cần)
Điều kiện vào: Airtable view thật sự hết đủ (ghi rõ lý do bằng số liệu). Nếu không chứng minh được — bỏ phase này vĩnh viễn.

## Phase 11 — Scale sang Bản Sắc Khám Phá / Giao Mùa
Điều kiện vào (đủ cả 3): Hạt Mầm beta PASS (docs/strategy/03 mục 8) + máy đạt PASS ổn định + template pattern đã rút (Giai đoạn 2 tài liệu Agentic AI Company). Đụng: hub /ban-sac-cua-con (mở 2 thẻ), landing mới, máy nhân dòng.

## Phase 12 — Full automation / n8n / agentic workflow
Điều kiện vào: Kenji đã review 30–50 output; scorecard chỉ đích danh khâu lặp ổn định đáng tự động. Đây cũng là thời điểm xét lại OpenOPC (Giai đoạn 1–2 của kế hoạch riêng đã bàn).

## Trình tự thực tế theo lịch 60–90 ngày
Phase 0 → 1 → (2 // 3 song song được vì khác route) → 4 → 5 → 6 chạy sát nhịp beta (docs/strategy/03–04); Phase 7 chèn ngay sau khi có khách thật đầu tiên; 8–12 sau beta.

## Definition of Done toàn roadmap
Không phase nào bị nhảy cóc; mỗi lần qua phase có dòng ghi trong File 15; đến hết Phase 6, một khách thật đi trọn: thấy content → landing → đặt → trả tiền → intake → nhận phòng đọc → được follow-up.
