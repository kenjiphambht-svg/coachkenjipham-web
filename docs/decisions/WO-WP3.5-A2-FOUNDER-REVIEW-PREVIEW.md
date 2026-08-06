# WO-WP3.5-A2-2026-08-06

## WP3.5-A2 — FOUNDER REVIEW PREVIEW & SYNTHETIC OPERATING UNIVERSE

**Status:** LOCKED — READY FOR FOUNDER APPROVAL  
**Owner:** Kenji Phạm — Founder  
**Architect / Independent Reviewer:** ChatGPT  
**Implementation Operator:** Antigravity  
**Date:** 06/08/2026  
**Parent work:** WP3.5 — Founder Operating Experience, Customer Relationship & Journey Care Orchestration  
**Parent PR:** Draft PR #139 — `feat/wp3-5-a-synthetic-founder-review`

---

## 1. MODE

**MODE 5 — Engineering Implementation**, sau khi Founder duyệt Work Order này.

Antigravity phải inspect source thật trước khi code, chỉ sửa approved scope, chạy tests, tạo Preview evidence và Draft PR. Không merge, không Production deploy, không mở provider hoặc dữ liệu thật.

---

## 2. OBJECTIVE

Tạo một **Founder Review Preview độc lập với hệ thống Admin thật**, để Kenji có thể mở một Vercel Preview và trải nghiệm WP3.5-A như một ngày điều hành ESSENCE thật, nhưng:

- không cần đăng nhập ứng dụng;
- không dùng Supabase;
- không cần tài khoản, password hoặc MFA;
- không gọi database hoặc provider;
- không gửi hoặc lưu hành động;
- không dùng dữ liệu khách hàng hoặc trẻ em thật;
- không ảnh hưởng `/admin/*`, Production hoặc website public.

Bản Preview phải có một **Synthetic Operating Universe** đủ lớn, nhất quán giữa các màn hình và đủ nhiều trạng thái để Founder kiểm tra:

1. Dashboard có giúp biết việc nào phải nhìn trước không;
2. một con người có được nối đúng qua nhiều hành trình không;
3. Now / Next / Owner / Due / Blocked / Valid Actions có rõ không;
4. Care và Recovery có thật sự đứng trước Offer không;
5. Silence có được thể hiện như một hành động hợp lệ không;
6. “Cánh cửa tiếp theo” có hữu ích mà không biến thành automation bán hàng không;
7. giao diện có chịu được ngày yên, ngày bình thường, ngày cao điểm và ngày phục hồi không.

---

## 3. FINAL OUTCOME

Task chỉ hoàn thành khi Kenji nhận được **một link Vercel Preview không yêu cầu Supabase login** và có thể:

```text
Mở Founder Review Preview
→ chuyển giữa 4 khu vực
→ chọn một ngày mô phỏng
→ lọc và mở việc trong Hôm nay
→ đi tới đúng Quan hệ
→ xem đúng Hành trình liên quan
→ xem đúng Care / Recovery case
→ xem trạng thái Cánh cửa tiếp theo
→ thử các action mô phỏng
→ reset toàn bộ phiên
```

Trong suốt trải nghiệm:

- mọi record là synthetic;
- cùng một ID phải nhất quán giữa mọi màn hình;
- không có network write;
- không có Supabase request;
- không có provider call;
- reload làm mất mọi thay đổi mô phỏng;
- banner luôn nói rõ “Không gửi — Không lưu — Dữ liệu mô phỏng”.

---

## 4. CURRENT STATE / PROBLEM

### 4.1. Current state

- Draft PR #139 đã có synthetic WP3.5-A concept tại các route `/admin/*`.
- Các route Admin hiện dùng authentication contract và không phù hợp cho vòng visual/experience review không đăng nhập.
- Current synthetic fixtures mới đủ để chứng minh concept, chưa đủ để Founder trải nghiệm như một hệ thống vận hành thật.
- Vercel Preview đã build được Next.js.

### 4.2. Problem

Luồng hiện tại trộn hai mục tiêu khác nhau:

1. review trải nghiệm điều hành;
2. kiểm tra Operational Staging có authentication thật.

Founder đã quyết định tách hai mục tiêu. Vòng này chỉ giải quyết mục tiêu số 1.

### 4.3. Security incident boundary

Một service-role key đã từng xuất hiện trong log của task trước. Đây là security debt phải xử lý trước Operational Staging hoặc Production connection.

Trong Work Order này:

- không truy cập Supabase;
- không kiểm tra key;
- không rotate key;
- không dùng key;
- không để sự cố đó chặn visual Founder Review;
- ghi nó vào Known Risks và giữ như **S0 gate trước Operational Staging / Production**, không phải blocker của Preview synthetic này.

---

## 5. SOURCES TO READ

Antigravity phải đọc trước khi lập Technical Plan:

### Repository governance và current truth

1. `AGENTS.md`
2. `PLAYBOOK.md`
3. `BACKLOG.md`
4. các tài liệu current backend/admin/WP3.5 trong repository
5. Work Order của PR #139
6. source của branch base được giao

### Founder / Product decisions

1. `ESSENCE_FOUNDER_DECISION_RHYTHM_CARE_AND_WP3_5_v1.0`
2. `ESSENCE_CARE_OS_CUSTOMER_RELATIONSHIP_AND_JOURNEY_CARE_SYSTEM_v1.0`
3. WS-04 — Master Prompts, Modes & Work Orders
4. WS-05 — Delivery System: Audit to Release

### Existing implementation to inspect

1. `src/lib/wp3-5/synthetic.ts`
2. `src/lib/wp3-5/synthetic.test.ts`
3. `src/components/admin/wp3-5/FounderPreview.tsx`
4. `src/components/admin/AdminShell.tsx`
5. `src/pages/admin/wp3-5-a.tsx`
6. `src/pages/admin/quan-he.tsx`
7. `src/pages/admin/hanh-trinh.tsx`
8. `src/pages/admin/cham-soc.tsx`
9. `vercel.json`
10. `package.json`
11. current test setup

Repository source và Founder Decision thắng mọi assumption trong prompt này. Nếu có conflict, không tự hòa giải; tạo Conflict Record và dừng phần liên quan.

---

## 6. REPOSITORY / BRANCH / COMMIT

Repository:

```text
kenjiphambht-svg/coachkenjipham-web
```

Base branch:

```text
feat/wp3-5-a-synthetic-founder-review
```

Expected base head at time of Work Order:

```text
35e41faea667eb91e0a4a9112d92008cc8bdabf3
```

Implementation branch to create:

```text
feat/wp3-5-a2-founder-review-preview
```

Rules:

- fetch and verify actual base SHA before branching;
- if base head moved, report actual SHA and compare before continuing;
- do not rewrite PR #139 history;
- no rebase or force-push;
- create a new Draft PR stacked on PR #139 branch;
- do not merge any PR.

Suggested Draft PR title:

```text
feat(wp3.5-a2): add preview-only Founder review universe
```

---

## 7. FOUNDER DECISIONS — LOCKED

1. Founder phải review trải nghiệm trước khi kết nối Auth, database, email, password recovery, MFA hoặc provider.
2. Founder Review không dùng Supabase login.
3. Các route `/admin/*` hiện hữu giữ nguyên authentication; không mở khóa, không bypass, không sửa contract.
4. Tạo namespace riêng `/founder-review/*`.
5. Preview dùng synthetic data duy nhất và không persistence.
6. Care Before Offer.
7. Silence là một valid action.
8. Một con người — một Relationship Record — nhiều Journey Instance có thể có.
9. Không customer score, lead score, conversion probability hoặc psychological profile.
10. Câu chuyện riêng và dữ liệu trẻ em không được dùng làm sales signal.
11. Next Door chỉ là Founder proposal, không auto-send và không auto-approve.
12. Founder Review chỉ tồn tại trên Draft branch + Vercel Preview; không Production deploy và không public/indexing.
13. Sau Founder review mới khóa Operating Contract rồi mới sang Operational Staging.

---

## 8. EXPERIENCE CONTRACT — LOCKED

### 8.1. Review routes

```text
/founder-review/wp3-5-a
/founder-review/quan-he
/founder-review/hanh-trinh
/founder-review/cham-soc
```

Landing link cho Founder:

```text
/founder-review/wp3-5-a
```

### 8.2. Route isolation

Review route không được import hoặc gọi:

```text
withAdmin
requireAdmin
admin-gate
Supabase browser client
Supabase server client
Supabase admin client
/admin APIs
provider SDKs
payment APIs
email APIs
calendar APIs
```

### 8.3. Preview gate

Dùng server-side non-secret flag:

```text
FOUNDER_REVIEW_ENABLED=1
```

Rules:

- flag chỉ đặt ở Development và Vercel Preview;
- không đặt Production;
- khi flag khác `1`, mọi `/founder-review/*` trả `404` bằng server-side guard;
- branch không được merge trong Work Order này;
- mọi review page có `noindex, nofollow`;
- dùng Vercel Deployment Protection hoặc share link để giới hạn bản nháp ở tầng Preview, không tạo application auth.

### 8.4. Review shell

Tạo `FounderReviewShell` riêng, không tái sử dụng Admin navigation thật.

Navigation chỉ có:

```text
Hôm nay
Quan hệ
Hành trình
Chăm sóc & Phục hồi
```

Header phải có:

- “Founder Review Preview”;
- scenario preset hiện tại;
- nút Reset phiên;
- trạng thái “Synthetic / No send / No save”.

Không hiển thị link sang:

- Admin thật;
- Thanh toán;
- Xuất bản thật;
- Xóa dữ liệu;
- Settings thật;
- Launch Core thật.

### 8.5. Persistent review banner

Tất cả review pages phải luôn hiển thị:

> **Founder Review Preview — Dữ liệu mô phỏng. Mọi thay đổi chỉ tồn tại trong phiên xem hiện tại, không gửi, không lưu và không kết nối hệ thống thật.**

### 8.6. Cross-screen navigation

Từ một Today item, Founder phải đi được tới đúng relationship và đúng context.

Allowed synthetic query parameters:

```text
?scenario=quiet|normal|peak|recovery
?relationship=SYN-001
?journey=JRN-001
?care=CARE-001
```

Rules:

- chỉ chứa synthetic IDs;
- không chứa dữ liệu nhạy cảm;
- không dùng cookie hoặc localStorage;
- scenario phải được giữ qua các link bằng query string hoặc một cơ chế local-only tương đương;
- refresh được phép reset các interaction tạm, nhưng scenario trong URL có thể tiếp tục được giữ.

---

## 9. SYNTHETIC OPERATING UNIVERSE — LOCKED

### 9.1. Minimum dataset

| Entity | Minimum |
|---|---:|
| Relationships | 16 |
| Journey Instances | 24 |
| Today Queue Items | 18 |
| Care / Support / Recovery Cases | 14 |
| Promises / Deadlines | 10 |
| Next Door Proposals | 6 |
| Timeline Events | 40 |
| Scenario Presets | 4 |

Có thể tạo nhiều hơn nếu cần để đảm bảo consistency, nhưng không được tạo dữ liệu rác chỉ để đạt số lượng.

### 9.2. Required domain concepts

Synthetic universe phải tách rõ:

```text
Relationship
Journey Instance
Order / Payment Truth
Publication / Entitlement Truth
Consent
Suppression
Promise / Deadline
Care Task
Support / Recovery Case
Timeline Event
Founder Gate
Next Door Proposal
Today Queue Item
```

Tên TypeScript có thể khác, nhưng domain meaning không được nhập nhằng.

### 9.3. ID contract

Dùng ID deterministic, human-readable:

```text
SYN-001 … SYN-016
JRN-001 …
CARE-001 …
PROM-001 …
DOOR-001 …
EVT-001 …
Q-001 …
```

Mọi foreign key phải trỏ đến record tồn tại.

### 9.4. No-sensitive-data contract

Không được chứa:

- tên đầy đủ của người thật;
- email, phone, địa chỉ thật;
- tên hoặc ngày sinh trẻ em;
- trường học;
- chẩn đoán;
- psychological notes;
- crisis details;
- raw private story;
- payment evidence thật;
- token hoặc secret.

Tên hiển thị có thể dùng tên gọi phổ biến một từ kèm synthetic ID, ví dụ:

```text
An · SYN-001
Bình · SYN-002
Quan hệ phụ huynh · SYN-009
```

Nếu record liên quan Hạt Mầm, chỉ dùng operational facts tối thiểu về người lớn; không mô tả trẻ em như một hồ sơ tâm lý.

---

## 10. 16 RELATIONSHIP SCENARIOS — LOCKED

| ID | Display | Journey truth | Current operating truth | Primary review purpose |
|---|---|---|---|---|
| SYN-001 | An | Lặng — Under Review | Chờ Founder quyết định fit / wait / decline; phản hồi dự kiến ngày mai | Human Decision Gate |
| SYN-002 | Bình | Lặng — Completed | Follow-up đã hứa quá hạn; khách đã nhắc lại; recovery nhẹ đang mở | Promise + Recovery before Offer |
| SYN-003 | Chi | Lặng — Closed; Hạt Mầm — Delivered; Reading Room — Active | Không truy cập được Reading Room; support đang mở | Access Care; Offer Blocked |
| SYN-004 | Dung | Hạt Mầm — Delivered; Reading Room — Suspended | Nghi ngờ gửi nhầm người nhận; suppression toàn bộ outbound | Safety / Containment |
| SYN-005 | Giang | Lặng — Waiting | Khách yêu cầu 30 ngày không liên hệ | Deliberate Silence / Suppression |
| SYN-006 | Hà | Lặng — Closed | Đã nhận đủ giá trị, support đóng, consent phù hợp | Eligible Next Door — Founder Review only |
| SYN-007 | Khánh | Lặng — Closed; Hạt Mầm — Delivered | Consent cho liên hệ tiếp theo chưa rõ | Consent Blocker |
| SYN-008 | Lan | Lặng — Active; Hạt Mầm — Active | Hai journey có việc chồng nhau; Founder cần chọn journey chính để chăm sóc | Multi-journey Relationship |
| SYN-009 | Minh | Hạt Mầm — Intake | Thiếu một operational fact tối thiểu; cần hỏi lại mà không thu thập quá mức | Privacy / Data Minimization |
| SYN-010 | Ngọc | Hạt Mầm — Publication Ready | Bản nháp sẵn sàng nhưng chờ Founder approval; promise giao đến hạn hôm nay | Founder Gate + Promise |
| SYN-011 | Phúc | Lặng — Payment Reported | Khách đã báo thanh toán nhưng chưa được xác nhận; booking chưa hợp lệ | State Truth / Blocked Action |
| SYN-012 | Quỳnh | Lặng — Session Completed | Closing note chưa hoàn tất; journey chưa được khép | Closing Contract |
| SYN-013 | Sơn | Hạt Mầm — Delivered; Reading Room — Recovery | Entitlement bất ngờ không hoạt động; recovery đang mở | Recovery Queue / Offer Blocked |
| SYN-014 | Thảo | Hạt Mầm — Delivered Yesterday | Khách vừa nhận sản phẩm; hệ thống đề xuất im lặng 7 ngày | Post-delivery Silence |
| SYN-015 | Uyên | Lặng — Closed; Hạt Mầm — Closed | Outcome được khách tự ghi nhận; chưa có testimonial/public consent; có thể review cánh cửa tiếp theo riêng | Proof Consent + Next Door Boundary |
| SYN-016 | Vân | Lặng — Closed; Reading Room — Closed | Recovery đã đóng; Founder từng chọn “chờ”; đến ngày review lại | Deliberate Wait / Next Door Re-review |

Implementation có thể bổ sung operational details, nhưng không được đổi mục đích cốt lõi của từng scenario.

---

## 11. JOURNEY MATRIX — LOCKED

Tạo tối thiểu 24 Journey Instances, phân bố đủ các trạng thái:

```text
Intake submitted
Under review
Waiting for Founder
Waiting for customer
Payment reported
Payment confirmed
Booking eligible
Active
Publication ready
Delivered
Access active
Support open
Recovery open
Deliberate silence
Completed
Closed
```

Mỗi Journey Instance phải có:

```text
id
relationshipId
product / journey type
stage
Now
Next
Owner
Due
Blocked
Valid Actions
entry condition summary
exit condition summary
latest milestone
```

Mỗi journey state phải nói đúng sự thật. Ví dụ:

- Payment reported ≠ payment confirmed;
- Delivered ≠ entitlement active;
- Draft ready ≠ Founder approved;
- Link exists ≠ access granted.

---

## 12. TODAY QUEUE — LOCKED

Tạo đúng 18 Today Queue Items, 3 item cho mỗi bucket:

### Bucket 1 — Safety & Recovery

1. SYN-004 — nghi ngờ gửi nhầm người nhận;
2. SYN-013 — entitlement/access failure đang recovery;
3. SYN-002 — missed promise đã tạo customer concern.

### Bucket 2 — Founder Gate

1. SYN-001 — fit / wait / decline;
2. SYN-008 — chọn journey chính;
3. SYN-010 — approve publication.

### Bucket 3 — Promise & Deadline

1. SYN-002 — follow-up quá hạn;
2. SYN-011 — xác minh payment report;
3. SYN-012 — hoàn tất closing note.

### Bucket 4 — Care & Support

1. SYN-003 — Reading Room access;
2. SYN-009 — hỏi lại operational fact tối thiểu;
3. SYN-007 — làm rõ consent trước liên hệ tiếp.

### Bucket 5 — Waiting & Deliberate Silence

1. SYN-005 — requested quiet;
2. SYN-014 — post-delivery pause;
3. SYN-016 — Founder chose wait.

### Bucket 6 — Next Door Review

1. SYN-006 — eligible proposal;
2. SYN-015 — next door review tách khỏi testimonial consent;
3. SYN-016 — scheduled re-review after deliberate wait.

Mỗi Today item bắt buộc có:

```text
What happened
Why now
Risk / deadline fact
Owner
Relationship
Journey
Next Best Care
Offer blocked: yes/no + reason
Founder decision required: yes/no
Valid simulated actions
```

Không dùng điểm số để sắp xếp. Thứ tự deterministic dựa trên bucket priority + due/risk facts.

---

## 13. CARE / SUPPORT / RECOVERY — LOCKED

Tạo tối thiểu 14 case gồm cả open và closed examples.

Mỗi case phải có:

```text
id
relationshipId
journeyId
type: care | support | recovery | access | promise
status
impact
containment
next action
owner
due
close condition
offerBlocked
suppression effect
timeline events
```

Rules:

- Safety và recovery luôn đứng trước offer;
- open support/recovery chặn Next Door;
- suppression thắng offer;
- một case chỉ được đóng khi close condition đạt;
- closed case vẫn xuất hiện trong timeline, không biến mất khỏi lịch sử.

---

## 14. PROMISES & DEADLINES — LOCKED

Tạo tối thiểu 10 promises/deadlines, gồm:

- overdue;
- due today;
- due tomorrow;
- upcoming preparation;
- completed on time;
- missed then recovered.

Mỗi promise có:

```text
id
relationshipId
journeyId
promise text
due date/status
owner
source event
current truth
care consequence if missed
```

Không dùng promise như conversion trigger.

---

## 15. NEXT DOOR PROPOSALS — LOCKED

Tạo đúng 6 proposal states:

1. **Eligible** — SYN-006;
2. **Blocked by recovery** — SYN-003 hoặc SYN-013;
3. **Blocked by promise** — SYN-002;
4. **Blocked by consent** — SYN-007;
5. **Blocked by suppression** — SYN-005;
6. **Founder chose wait / re-review** — SYN-016.

Mỗi proposal phải hiển thị:

```text
proposed door
why it may fit
value already received
current journey closed: yes/no
consent
suppression
open care/recovery
promise blocker
exclusions
Next Best Care first
Founder-only simulated decision
```

Allowed simulated decisions:

```text
Đồng ý xem tiếp
Giữ lại
Chưa phù hợp
```

Không có nút gửi cho khách. Không có auto-send. Không có persisted approval.

---

## 16. TIMELINE — LOCKED

Tạo tối thiểu 40 timeline events, đủ các loại:

```text
intake received
Founder review requested
customer reply
payment reported
payment confirmed
booking eligible
session completed
publication approved
product delivered
entitlement granted
access failed
support opened
containment applied
recovery closed
consent updated
suppression applied
promise created
promise completed
promise missed
follow-up completed
next door reviewed
Founder chose wait
```

Timeline phải:

- chronological;
- link đúng relationship và journey;
- tách internal operational event với customer-facing event;
- không chứa raw private story;
- cho phép filter local-only theo event type.

---

## 17. SCENARIO PRESETS — LOCKED

### 17.1. Quiet Day

Khoảng 4 items:

- 1 Founder Gate;
- 1 Promise;
- 1 Deliberate Silence;
- 1 Next Door Review.

### 17.2. Normal Day — Default

Khoảng 9–10 items, đại diện đủ 6 buckets.

### 17.3. Peak Day

Toàn bộ 18 items.

### 17.4. Recovery Day

Khoảng 10–12 items, ưu tiên:

- safety;
- complaint/recovery;
- missed promise;
- access issue;
- support open;
- offer blocked.

Rules:

- preset deterministic;
- không random;
- cùng preset luôn tạo cùng order;
- scenario có thể truyền qua query string;
- reset trở về Normal Day.

---

## 18. LOCAL-ONLY INTERACTIONS — LOCKED

Founder có thể mô phỏng:

- đổi scenario;
- lọc bucket;
- lọc journey state;
- mở/đóng detail drawer;
- đi tới đúng relationship/journey/care context;
- đánh dấu “Đã xem”;
- chọn “Giữ lại”;
- chọn Founder decision giả;
- nhập safe note tạm;
- reset phiên.

Rules:

- React local state only;
- không localStorage;
- không IndexedDB;
- không cookie nghiệp vụ;
- không API write;
- không fetch mutation;
- không provider call;
- reload mất toàn bộ simulated changes;
- mọi action area phải có nhãn `Mô phỏng — Không lưu — Không gửi`.

---

## 19. PAGE CONTRACTS — LOCKED

### 19.1. `/founder-review/wp3-5-a`

Phải trả lời trong 10 giây:

1. Việc nào cần nhìn trước?
2. Vì sao nó ở đây?
3. Việc nào bị quá hạn hoặc bị chặn?
4. Việc nào cần Founder quyết định?
5. Việc nào đúng nhất là không làm gì?
6. Cánh cửa tiếp theo nào đủ hoặc chưa đủ điều kiện?

Required UI:

- scenario switcher;
- six bucket summary;
- ordered Today queue;
- reason/explanation;
- filters;
- selected item detail;
- cross-links;
- next door review section.

### 19.2. `/founder-review/quan-he`

Required UI:

- relationship list;
- search/filter synthetic records;
- selected Relationship 360;
- Now / Next / Owner / Due / Blocked;
- journeys;
- order/payment/publication/entitlement truth summary;
- consent/suppression;
- open care/recovery;
- promises;
- safe operational notes;
- timeline;
- next door state.

Không có psychological profile hoặc customer value score.

### 19.3. `/founder-review/hanh-trinh`

Required UI:

- journey list/table/cards;
- filters:
  - Đang mở;
  - Chờ Founder;
  - Chờ khách;
  - Đang chăm sóc;
  - Đang phục hồi;
  - Đang im lặng;
  - Đã khép;
- Now / Next / Owner / Due / Blocked;
- current truth;
- valid actions;
- stage contract summary;
- cross-link relationship and care.

### 19.4. `/founder-review/cham-soc`

Required UI:

- Care Queue;
- Support / Recovery Queue;
- filters by status/type/offer blocked;
- impact;
- containment;
- next action;
- owner;
- due;
- close condition;
- relationship/journey links;
- Next Door eligibility impact;
- closed-case history.

Care and Recovery must visually precede commercial proposal areas.

---

## 20. RESPONSIVE / ACCESSIBILITY — LOCKED

Minimum QA viewports:

```text
375 × 812
768 × 1024
1440 × 900
```

Required:

- no horizontal overflow except intentional data table container;
- keyboard-operable filters and controls;
- visible focus state;
- semantic headings;
- labels for scenario and filters;
- drawers/dialogs have correct focus behavior;
- tables have headers;
- state not communicated by color alone;
- touch targets usable on mobile;
- long Vietnamese copy does not overflow.

No visual redesign outside existing ESSENCE Admin design language unless necessary for the review shell.

---

## 21. FILES / MODULES — EXPECTED

Suggested new files:

```text
src/lib/wp3-5/review-universe.ts
src/lib/wp3-5/review-selectors.ts
src/lib/wp3-5/review-guard.ts
src/lib/wp3-5/review-universe.test.ts

src/components/founder-review/FounderReviewShell.tsx
src/components/founder-review/ReviewBanner.tsx
src/components/founder-review/ScenarioSwitcher.tsx
src/components/founder-review/ReviewControls.tsx
src/components/founder-review/TodayReview.tsx
src/components/founder-review/RelationshipReview.tsx
src/components/founder-review/JourneyReview.tsx
src/components/founder-review/CareReview.tsx

src/pages/founder-review/wp3-5-a.tsx
src/pages/founder-review/quan-he.tsx
src/pages/founder-review/hanh-trinh.tsx
src/pages/founder-review/cham-soc.tsx
```

Exact filenames are OPEN if Antigravity proposes a cleaner structure without changing the locked contract.

Do not modify authentication files.

Avoid changing existing Admin pages. Shared pure helpers may be extracted only if:

- behavior of `/admin/*` remains unchanged;
- tests prove no regression;
- rationale is reported before implementation.

Default recommendation: build review-specific components to minimize Admin regression.

---

## 22. IN SCOPE

1. Inspect current branch and report Technical Plan.
2. Create new stacked implementation branch.
3. Create preview-only route guard.
4. Build Synthetic Operating Universe.
5. Build four Founder Review routes.
6. Build review-only navigation shell.
7. Add local-only interactions.
8. Add deterministic scenario presets.
9. Add cross-screen synthetic links.
10. Add data-integrity and governance tests.
11. Run build/test.
12. Run responsive/manual QA.
13. Deploy Vercel Preview only.
14. Create Draft PR.
15. Provide raw evidence and Founder Review link.

---

## 23. OUT OF SCOPE

- Supabase access or configuration;
- Auth, password, MFA, recovery email;
- service-role or key rotation;
- database migration;
- real staging data;
- real customer/child data;
- email, calendar, banking, payment or storage provider;
- persistent write;
- Admin auth weakening;
- changes to `/admin/*` security contract;
- production deployment;
- domain binding;
- public activation;
- indexing;
- merge;
- mark PR Ready for Review;
- customer score;
- psychological profiling;
- automatic offer/upsell;
- AI suitability decision;
- full enterprise CRM;
- unrelated cleanup.

---

## 24. DELIVERABLES

1. Technical Plan before coding.
2. New branch `feat/wp3-5-a2-founder-review-preview`.
3. Synthetic Operating Universe meeting minimum counts.
4. Four review routes.
5. Preview-only guard.
6. Review shell and persistent banner.
7. Four scenario presets.
8. Local-only simulated interactions.
9. Data integrity tests.
10. Governance/static dependency tests.
11. Build and test evidence.
12. Responsive QA evidence.
13. Vercel Preview deployment.
14. Draft PR stacked on PR #139.
15. One concise final report with FACT / INFERENCE / BLOCKER / PROPOSAL.

---

## 25. TESTS — REQUIRED

Automated tests must prove at minimum:

1. every Journey references an existing Relationship;
2. every Care case references valid Relationship and Journey;
3. every Promise references valid context;
4. every Today item has owner, reason and valid action;
5. deterministic bucket order;
6. Safety/Recovery precedes Next Door;
7. open support/recovery blocks Next Door;
8. missing consent blocks proposal;
9. suppression blocks proposal;
10. deliberate silence is a valid state/action;
11. eligible Next Door requires closed current journey + no blocker + consent fit;
12. no forbidden fields:
   - `score`;
   - `leadScore`;
   - `probability`;
   - `conversionScore`;
   - psychological profile fields;
13. no child-sensitive fixture fields;
14. all 16 required scenario IDs exist;
15. all four presets are deterministic;
16. cross-screen IDs are consistent;
17. review modules do not import Supabase/auth/provider code;
18. feature flag off returns notFound behavior;
19. no network write helper is referenced;
20. existing test suite still passes.

If exact route guard cannot be unit-tested directly, add a pure guard function and test it.

---

## 26. MANUAL QA — REQUIRED

### Functional

- all navigation links work;
- query context works;
- reset works;
- local simulated state does not persist after reload;
- no request to Supabase domains;
- no POST/PUT/PATCH/DELETE request;
- no provider request;
- no `/admin/*` link from review shell.

### Truth

- same relationship facts match across all pages;
- care blocker and next-door state agree;
- promise/deadline state agrees;
- consent/suppression agree;
- Journey stage agrees with Today reason.

### Preview guard

- flag on: routes render;
- flag off: routes return 404;
- `noindex, nofollow` present;
- Vercel Preview only;
- no Production deployment.

### Responsive

- 375×812;
- 768×1024;
- 1440×900.

---

## 27. RISKS / HIGH-RISK ZONES

### S0 — Stop immediately

- any real customer/child data;
- any Supabase/service-role access;
- any secret printed;
- any Production deploy;
- any auth weakening;
- any persistent write/provider call;
- any Preview route publicly activated/indexed on main domain.

### S1 — Must fix before Founder link

- inconsistent synthetic facts across screens;
- support/recovery not blocking offer;
- scenario routes require app login;
- route works when feature flag is off;
- broken navigation or main review flow;
- Next Door auto-sends or appears as an automated sales decision.

### S2 — Fix or report before Founder review

- responsive problem;
- filter/state confusion;
- accessibility issue;
- overloaded Peak Day without scanability;
- unclear Now/Next/Owner/Due/Blocked.

### S3 — Polish

- minor spacing;
- small wording consistency;
- non-blocking visual refinement.

---

## 28. ROLLBACK

Because this is a new stacked branch and Preview-only route set, rollback is:

1. stop/delete Vercel Preview deployment;
2. close Draft PR without merge;
3. delete branch if Founder rejects direction;
4. no change to PR #139, `/admin/*`, database or Production.

No migration rollback is needed because migrations are forbidden.

---

## 29. LOCKED VS OPEN

### LOCKED — Antigravity may not change

- four route paths;
- no application login;
- no Supabase or provider dependency;
- preview-only flag;
- noindex;
- 16 required relationship scenarios;
- minimum entity counts;
- six Today buckets;
- four scenario presets;
- no persistence;
- no customer scoring/profiling;
- Care Before Offer;
- Silence valid;
- Next Door Founder-only;
- no merge/production.

### OPEN — Antigravity may choose and report

- exact component filenames;
- card vs table implementation where Page Contract allows;
- query string helpers vs review context architecture;
- exact responsive grid;
- exact low-level TypeScript types;
- exact test file split;
- minor synthetic wording that preserves scenario truth;
- whether detail opens inline, drawer or panel, provided accessibility is correct.

---

## 30. APPROVAL GATES

### Gate A — Founder approves this Work Order

No implementation before approval.

### Gate B — Technical Plan review

Antigravity reports:

- actual base SHA;
- files to add/change;
- component/data architecture;
- dependency map;
- test plan;
- risks;
- rollback.

May proceed to code only if plan stays within locked scope.

### Gate C — Independent PR review

ChatGPT reviews:

- GitHub diff;
- data consistency;
- no Supabase/auth dependency;
- feature flag;
- tests;
- route isolation;
- Vercel evidence.

### Gate D — Founder Experience Review

Kenji reviews Preview and returns:

```text
APPROVED
APPROVED WITH CORRECTIONS
NOT APPROVED
```

No Operational Staging work begins before this gate.

---

## 31. DEFINITION OF DONE

Task is `READY FOR FOUNDER REVIEW` only when all are true:

```text
[ ] New stacked branch and Draft PR exist
[ ] PR #139 remains Draft and unmerged
[ ] Four /founder-review/* routes exist
[ ] No app login is required
[ ] /admin/* auth behavior is unchanged
[ ] Feature flag ON renders review routes
[ ] Feature flag OFF returns 404
[ ] noindex, nofollow are present
[ ] 16 Relationships exist
[ ] 24+ Journeys exist
[ ] 18 Today items exist
[ ] 14+ Care/Support/Recovery cases exist
[ ] 10+ Promises/Deadlines exist
[ ] 6 Next Door proposal states exist
[ ] 40+ Timeline events exist
[ ] Four deterministic scenario presets exist
[ ] Cross-screen facts are consistent
[ ] Local-only interactions work
[ ] Reload clears simulated actions
[ ] No Supabase request
[ ] No provider request
[ ] No network write
[ ] No localStorage/IndexedDB business state
[ ] No customer score/profiling
[ ] No child-sensitive data
[ ] Care/Recovery blocks Offer where required
[ ] Silence is represented as valid
[ ] Tests pass
[ ] Build passes
[ ] Responsive QA passes or limitations are reported
[ ] Vercel Preview is READY
[ ] No Production deployment
[ ] Founder receives one working Preview/share link
```

Build pass alone is not Done.

---

## 32. REPORTING FORMAT

Antigravity must return one report only:

# WP3.5-A2 FOUNDER REVIEW PREVIEW REPORT

## A. Executive status

Choose one:

```text
BLOCKED
FAILED
READY FOR ARCHITECT REVIEW
READY FOR FOUNDER REVIEW
```

## B. FACTS

Each fact includes evidence source.

## C. INFERENCES

Anything not directly verified.

## D. BLOCKERS

Evidence + required decision.

## E. PROPOSALS

Not implemented without approval.

## F. Repository

```text
Base branch
Verified base SHA
Implementation branch
Final SHA
Draft PR
Changed files
Working tree
```

## G. Dataset evidence

```text
Relationship count
Journey count
Today item count
Care/recovery count
Promise count
Next door count
Timeline event count
Preset count
```

## H. Test/build

Exact totals and warnings.

## I. Dependency safety

```text
Supabase imports: none / findings
Auth imports: none / findings
Provider imports: none / findings
Network writes: none / findings
Persistence: none / findings
```

## J. Route validation

For all four routes:

```text
Flag ON status
Flag OFF status
Title
noindex
Rendered surface
```

## K. Responsive QA

375 / 768 / 1440 results.

## L. Vercel evidence

```text
Deployment ID
Commit SHA
Preview URL
Share URL if protection enabled
Environment
State
```

## M. Safety

Explicitly confirm:

```text
No merge
No Production deploy
No Supabase access
No secret handling
No real data
No provider
No persistent write
No auth weakening
```

## N. Known limitations

## O. Next human action

Only one clear action.

Do not repeat the report. Do not claim READY based only on build or HTTP 200.

---

## 33. FOUNDER REVIEW ORDER

Recommended order for Kenji:

1. Hôm nay — Normal Day;
2. Hôm nay — Peak Day;
3. Hôm nay — Recovery Day;
4. Quan hệ — SYN-003, SYN-008, SYN-015;
5. Hành trình — filter Chờ Founder / Recovery / Closed;
6. Chăm sóc & Phục hồi — open blockers;
7. Cánh cửa tiếp theo — eligible và blocked examples;
8. Hôm nay — Quiet Day;
9. Reset phiên.

Founder should be able to judge:

- clarity;
- scanability;
- emotional/operating tone;
- correct priority;
- useful detail;
- data density;
- whether it feels like ESSENCE rather than a generic CRM.

---

## 34. DEFINITION OF READY FOR NEXT STEP

Operational Staging may be proposed only after:

1. Founder approves or approves with corrections;
2. corrections are closed;
3. Founder Operating Contract is documented;
4. no open S0/S1 Preview defect;
5. a separate Work Order is approved for Security Review → Auth → Storage → Email → Provider staging.

This Work Order does not authorize that next step.

---

# END OF LOCKED WORK ORDER
