# WORK ORDER — WP3.5-A Synthetic Founder Review Experience

**Work Order ID:** WO-WP3.5-A-2026-08-06  
**Status:** **PROPOSAL — FOUNDER APPROVAL REQUIRED**  
**Founder / Final authority:** Kenji Phạm  
**Execution lead:** ChatGPT — ESSENCE Web Studio  
**Implementation agents:** Codex and/or Claude Code only after this Work Order is approved  
**Target repository:** `kenjiphambht-svg/coachkenjipham-web`  
**Proposed base:** approved WP3.5 documentation stack after PR #137 dependency is corrected  
**Mode:** Synthetic Founder Review Experience  
**Release posture:** Private preview only; no production activation.

---

## 1. Purpose

Build a read-only, synthetic Founder Operating Experience so Kenji can review the information architecture, decision rhythm, care prioritization and commercial subtlety of WP3.5 before any database, real-data or provider implementation.

WP3.5-A must answer:

1. Khi mở Admin, Kenji có biết ngay điều gì cần sự hiện diện của mình không?
2. Kenji có nhìn được một **Quan hệ** xuyên nhiều hành trình mà không biến con người thành profile hay score không?
3. Care, recovery, deadline, suppression và Human Decision Gate có được ưu tiên đúng không?
4. **Cánh cửa tiếp theo** có đủ tinh tế để không né kinh doanh nhưng không đi trước care không?
5. UI có giảm tải nhận thức thay vì tạo thêm một CRM nặng nề không?

---

## 2. Authority and source order

Implementation phải đọc theo thứ tự:

1. L0 Founder Decisions và Documentation Authority.
2. Founder Decision `FD-2026-08-06_ESSENCE_LANGUAGE_METHOD_AND_JOURNEY_RHYTHM.md`.
3. WP3.5 Founder Decision Lock.
4. WP3.5 Operating Contract.
5. WP3.5 Contract Consistency Review.
6. WP1–WP3 approved decision documents.
7. Current repository implementation evidence.
8. BACKLOG chỉ để task visibility, không làm authority cho route, offer hoặc product truth.

Nếu có xung đột cùng cấp hoặc source không đủ rõ, dừng và đưa Founder Decision Request. Không tự suy diễn.

---

## 3. Founder Decisions already locked

Không mở lại trong implementation:

- Tên lớp: **Quan hệ**.
- Workspace: **Chăm sóc & Phục hồi** gộp.
- Safe operational notes: được phép có kiểm soát.
- Queue: deterministic priority bucket + deadline/risk facts; tuyệt đối không customer score.
- Commercial principle: **Next Best Care đứng trước và tạo điều kiện cho Next Best Offer**.
- Cánh cửa tiếp theo dành cho Founder review; không auto-send.

---

## 4. In scope

### 4.1. Synthetic routes/surfaces

Implement private admin preview cho bốn surface:

1. **Hôm nay** — `/admin`
2. **Quan hệ** — `/admin/quan-he`
3. **Hành trình** — `/admin/hanh-trinh`
4. **Chăm sóc & Phục hồi** — `/admin/cham-soc`

Route exact có thể điều chỉnh theo current router convention, nhưng nhãn và information architecture không được đổi nếu chưa có Founder approval.

### 4.2. Read-only synthetic experience

- Dữ liệu fixture cục bộ, synthetic, không giống dữ liệu khách thật.
- Không fetch Supabase cho WP3.5-A data.
- Không mutation, RPC, API write hoặc provider call.
- Không nút hành động có side effect.
- Mọi nút quyết định chỉ mở review state, explanation panel hoặc disabled future-action notice.

### 4.3. Founder-first navigation

Nhóm navigation:

- **Điều hành:** Hôm nay, Quan hệ, Hành trình, Chăm sóc.
- **Workspaces:** giữ các surface Lặng, Hạt Mầm, Thanh toán, Xuất bản, Xóa dữ liệu hiện hành.
- **Hệ thống:** Cài đặt và Launch Core/readiness.

Không xóa current routes. Không làm vỡ deep link hiện có.

---

## 5. Page contracts

## 5.1. Hôm nay

### Page role

Buồng lái để Founder biết cần hiện diện ở đâu trước; không phải analytics dashboard.

### Queue order

1. An toàn, quyền riêng tư và recovery khẩn cấp.
2. Human Decision Gate chờ Founder.
3. Lời hứa, SLA hoặc deadline sắp đến hạn/quá hạn.
4. Support và care task mở.
5. Waiting / quiet by design / suppression active.
6. Cánh cửa tiếp theo đủ điều kiện để Founder review.

### Required card fields

- safe relationship label;
- journey/product;
- current state bằng ngôn ngữ người;
- “Vì sao cần nhìn lúc này”;
- due/overdue facts;
- owner;
- proposed care;
- consent/suppression/gate warning;
- link mở đủ ngữ cảnh.

### Prohibited

- revenue leaderboard;
- funnel conversion;
- lead score;
- customer value score;
- khách nóng/lạnh;
- inferred psychology;
- child detail;
- raw intake;
- destructive action trực tiếp trên card.

## 5.2. Quan hệ

### Page role

Relationship-centered view ở cấp người lớn/phụ huynh; không phải hồ sơ tâm lý.

### List

- safe identity label;
- verified/unverified state;
- active/past journey count;
- open care/recovery;
- latest permitted event;
- due/overdue fact;
- suppression/consent indicator;
- next Founder decision.

### Detail drawer/page

- relationship summary;
- journeys timeline;
- promises/due dates;
- care/support/recovery;
- entitlement/access summary;
- consent/suppression;
- Human Decision Gate;
- Cánh cửa tiếp theo state;
- safe operational notes examples.

Child data không hiển thị mặc định. Hạt Mầm chỉ hiện safe order/journey facts và link có chủ đích về protected detail.

## 5.3. Hành trình

### Page role

Giúp Founder nhìn các journey instance theo trạng thái vận hành mà không ép Lặng và Hạt Mầm vào một sales funnel chung.

### Operational groups

- cần Founder đọc;
- chờ khách;
- chờ payment;
- đang thực hiện;
- chờ approval;
- đang phục hồi;
- đã khép;
- deliberate silence.

Mỗi journey card phải chỉ rõ product state là canonical fact và Founder Operating layer chỉ đọc/điều phối.

## 5.4. Chăm sóc & Phục hồi

### Page role

Một workspace thống nhất cho care task và recovery case.

### Views

- cần làm hôm nay;
- quá hạn;
- đang phục hồi;
- đang chờ;
- suppressed/quiet;
- đã khép.

### Recovery card

- issue type;
- customer impact an toàn;
- severity có định nghĩa;
- containment;
- owner;
- due date;
- next action;
- closure evidence placeholder.

Không dùng recovery để tạo urgency bán hàng hoặc offer bù cho trải nghiệm đang hỏng.

---

## 6. Cánh cửa tiếp theo — synthetic contract

WP3.5-A phải có synthetic proposal cards để review UX, nhưng không gửi và không ghi dữ liệu.

### Required states

- `not_evaluated`
- `care_first`
- `blocked`
- `eligible_for_founder_review`
- `founder_deferred`
- `founder_declined`
- `invitation_approved` — UI review only
- `customer_declined` — synthetic history only
- `customer_interested` — synthetic history only
- `closed`

### Founder proposal card must show

- cánh cửa/offer;
- evidence khách đã chủ động thể hiện;
- journey closure hoặc milestone;
- care/support/recovery status;
- consent/suppression result;
- product state/capacity;
- fit và non-fit;
- wording draft;
- timing/channel proposal;
- điều không thay đổi nếu khách từ chối.

### Review-only controls

- Duyệt lời mời;
- Chỉnh wording;
- Để sau;
- Không phù hợp;
- Tiếp tục care.

Các control chỉ thay đổi local preview state hoặc mở modal minh họa; reload phải trả fixture về trạng thái gốc. Không persistence.

---

## 7. Synthetic scenarios bắt buộc

Tối thiểu tám scenarios:

1. **Privacy/recovery urgent:** wrong-recipient suspicion; đứng đầu queue.
2. **Founder decision:** Lặng fit/wait/decline chờ Kenji.
3. **Broken promise:** follow-up quá hạn; recovery trước offer.
4. **Access support:** Hạt Mầm đã giao nhưng Reading Room chưa truy cập được; `care_first`.
5. **Eligible invitation:** journey hoàn tất, khách chủ động hỏi bước tiếp theo, consent hợp lệ; Founder review, không auto-send.
6. **Customer decline:** support/entitlement không thay đổi; không pressure follow-up.
7. **Product blocked:** offer HOLD hoặc thiếu contract/capacity; proposal `blocked`.
8. **Quiet by design:** suppression active hoặc đang chờ khách; UI giải thích vì sao không làm gì.

Fixtures không chứa dữ liệu trẻ, địa chỉ, số điện thoại, email thật, receipt, nội dung intake nhạy cảm hoặc câu chuyện giống người thật.

---

## 8. Safe operational notes — UI review only

WP3.5-A hiển thị ví dụ ghi chú nội bộ có kiểm soát để Founder review form và boundaries.

### Allowed fields

- purpose code;
- safe subject reference;
- short note text;
- owner;
- created date;
- review/expiry date khi phù hợp;
- visibility boundary.

### Required UI guardrail

Hiển thị rõ nội dung cấm:

- child data;
- raw private story;
- diagnosis/psychological inference;
- customer labels;
- secrets/tokens/payment credentials;
- sales rationale dựa trên tổn thương.

Không lưu note trong WP3.5-A.

---

## 9. Technical boundaries

### Required

- Dùng existing stack, components và admin guard conventions.
- AAL2/protected admin behavior không được yếu đi.
- `noindex`/private admin posture giữ nguyên.
- Dữ liệu fixtures tách rõ khỏi production data layer.
- TypeScript types rõ cho synthetic read models.
- Deterministic queue ordering không dùng weighted customer score.
- Mọi priority item phải có explainable `why_now` facts.
- Responsive ở 375×812, 768×1024 và 1440×900.
- Keyboard navigation, visible focus, semantic headings, usable contrast.
- Không horizontal overflow.

### Prohibited

- database migration;
- Supabase schema/RLS/RPC change;
- real customer query;
- provider integration;
- email/calendar/payment/publication send;
- real entitlement mutation;
- deletion action;
- release flag activation;
- analytics/tracking mới;
- public route/indexing;
- production deployment;
- generic CRM/workflow builder;
- scoring, profiling hoặc hidden ranking.

---

## 10. Proposed implementation structure

Implementation agent phải audit current repo trước và có thể điều chỉnh file paths theo conventions thật. Proposal ban đầu:

- `src/components/admin/founder-operating/*`
- `src/lib/founder-operating/types.ts`
- `src/lib/founder-operating/fixtures.ts`
- `src/lib/founder-operating/priority.ts`
- `src/pages/admin/quan-he/*`
- `src/pages/admin/hanh-trinh/*`
- `src/pages/admin/cham-soc/*`
- targeted updates to `src/pages/admin/index.tsx`
- targeted updates to `src/components/admin/AdminShell.tsx`

Không tạo parallel design system. Tái sử dụng components/tokens hiện hành trước khi thêm component mới.

---

## 11. Testing and QA

### Automated

- typecheck;
- lint;
- existing relevant test suite;
- unit tests cho deterministic queue order;
- unit tests cho offer blockers;
- unit tests cho suppression/quiet behavior;
- fixture validation: không có prohibited personal/child fields.

### Manual

- route access and AAL2 behavior;
- all four surfaces;
- all eight scenarios;
- desktop/tablet/mobile viewports;
- keyboard-only flow;
- empty/loading/error-style synthetic states where relevant;
- no destructive or persistent action;
- no real network/provider calls;
- copy/terminology consistency: Quan hệ, Chăm sóc & Phục hồi, Cánh cửa tiếp theo.

### Safety QA

- child data absent from default views;
- no customer score or proxy score;
- no offer while support/recovery/privacy/deletion blocker is open;
- no auto-send;
- no promise of unavailable product;
- every queue position is explainable.

---

## 12. Evidence of Done

Draft PR phải có:

1. Scope summary và explicit out-of-scope.
2. File list và architecture explanation.
3. Screenshots/previews cho bốn surfaces ở desktop và mobile.
4. Scenario matrix với expected/actual result.
5. Automated test results.
6. Accessibility and responsive QA evidence.
7. Network/data evidence chứng minh không real-data/provider call.
8. Open issues, S0/S1/S2 classification.
9. Confirmation: no migration, no production deploy, no merge.
10. Founder Review Guide gồm các câu hỏi quyết định, không chỉ ảnh chụp.

---

## 13. Definition of Done

WP3.5-A đạt khi:

- Founder có thể review đầy đủ bốn surfaces bằng synthetic data;
- Hôm nay ưu tiên đúng care/risk/promise/Human Gate;
- Quan hệ nối được nhiều journey mà không profiling;
- Chăm sóc & Phục hồi tạo một operating rhythm rõ;
- Cánh cửa tiếp theo nhìn thấy được nhưng đứng sau care và cần Founder review;
- không customer score hoặc sales pressure;
- child/private data boundaries hiển thị đúng;
- current product workspaces và state machines không bị thay thế;
- AAL2/private/noindex posture không yếu đi;
- tests và viewport QA pass;
- không S0/S1 mở;
- Draft PR sẵn sàng cho Founder UAT;
- chưa merge và chưa production deploy.

---

## 14. Stop conditions

Dừng ngay và báo Founder nếu:

- cần migration hoặc real data để hoàn thiện UI;
- current repo contradicts locked contract;
- route/navigation change có thể phá public/admin flow;
- child data xuất hiện trong list/default view;
- implementation cần customer scoring hoặc inference để xếp queue;
- offer eligibility không thể giải thích bằng facts;
- AAL2/noindex/private posture bị ảnh hưởng;
- scope lan sang WP3.5-B/C, providers hoặc production.

---

## 15. Execution sequence after approval

1. Audit current repo at approved base and publish implementation plan.
2. Create a new implementation branch; do not code on documentation branch.
3. Implement types, fixtures and deterministic priority logic.
4. Implement Hôm nay.
5. Implement Quan hệ.
6. Implement Hành trình.
7. Implement Chăm sóc & Phục hồi.
8. Add synthetic Cánh cửa tiếp theo review states.
9. Run automated/manual/safety QA.
10. Open Draft PR with Evidence of Done.
11. Founder UAT.
12. No merge until separate Founder approval.

---

## 16. Approval requested

Founder approval of this Work Order authorizes only:

- WP3.5-A read-only synthetic implementation;
- creation of an implementation branch;
- Draft PR and private preview for Founder UAT;
- tests and documentation within this scope.

Approval does **not** authorize:

- WP3.5-B/C;
- database or RLS changes;
- provider connections;
- real customer/child data;
- sending communications;
- public activation/indexing;
- production deployment;
- merge.

### Founder approval wording

> **APPROVE WO-WP3.5-A-2026-08-06**

Hoặc ghi rõ correction cần thay đổi trước khi approval.

**— HẾT WORK ORDER —**