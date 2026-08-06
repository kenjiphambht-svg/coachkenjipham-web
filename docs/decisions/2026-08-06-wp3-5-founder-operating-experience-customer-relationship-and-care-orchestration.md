# WP3.5 — Founder Operating Experience, Customer Relationship & Journey Care Orchestration

**Ngày soạn:** 06/08/2026  
**Trạng thái:** **PROPOSAL — FOUNDER REVIEW**  
**Owner / Final authority:** Kenji Phạm  
**Execution lead:** ChatGPT — ESSENCE Web Studio  
**Authority sau khi được duyệt:** Task-specific Operating Contract, subordinate to L0–L2 authority  
**Repository baseline:** PR #136, head `63649b29d1c152e5e5f7fc2cb31575c3cc0e3c29`  
**Language/Method dependency:** Draft PR #137, head `e41530b272f17a2267c9260e91d1feef5bff7503`  
**Scope mode:** Documentation and operating architecture only  
**Không được phép bởi contract draft này:** runtime code, database migration, provider connection, production deployment, public activation, customer delivery, indexing, real customer data hoặc real child data.

---

## 1. Quyết định kiến trúc được đề xuất

WP3.5 không xây một CRM bán hàng, một pipeline ép mua hoặc một hệ thống “đọc vị” khách hàng.

WP3.5 xây **lớp điều hành dành cho Founder** trên nền WP1–WP3 để Kenji có thể nhìn toàn bộ mối quan hệ và hành trình mà không phải mở từng sản phẩm, từng bảng dữ liệu hoặc từng trạng thái kỹ thuật.

Màn hình điều hành phải trả lời được sáu câu hỏi:

1. **Hôm nay ai đang cần Kenji hiện diện?**
2. **Quyết định con người nào đang chờ Founder?**
3. **Lời hứa, thời hạn hoặc trải nghiệm nào có nguy cơ bị bỏ quên?**
4. **ESSENCE nên chăm sóc, chờ, phục hồi hay để người đó được yên?**
5. **Dữ liệu, consent, suppression và quyền truy cập có cho phép hành động đó không?**
6. **Bước tiếp theo nào giữ đúng tinh thần Next Best Care trước Next Best Offer?**

**Primary outcome:** giảm tải nhận thức cho Founder nhưng không giảm quyền quyết định của Founder.

---

## 2. Source reconciliation và hiện trạng đã kiểm tra

### 2.1. Nguồn điều khiển

| Nguồn | Quyền trả lời trong WP3.5 |
|---|---|
| `docs/governance/ESSENCE_DOCUMENTATION_AUTHORITY.md` | Authority hierarchy, conflict protocol và Founder Decision Protocol. |
| PR #137 / `FD-2026-08-06_ESSENCE_LANGUAGE_METHOD_AND_JOURNEY_RHYTHM.md` | Bản đồ canonical, Next Best Care, suppression, Human Decision Gate và ranh giới AI. |
| `docs/decisions/2026-08-04-wp3-launch-core-backend.md` | WP3 data/security/release foundation và các gate đang mở. |
| `docs/decisions/2026-08-04-wp1-admin-operating-experience.md` | Admin surfaces, AAL2 guard, current operator workflows và fail-closed boundaries. |
| `docs/decisions/2026-08-04-unified-product-portfolio-and-operating-console.md` | Portfolio states, immutable snapshots, approved workflow blocks và AI boundary. |
| `BACKLOG.md` | Task visibility only; không quyết định roadmap, route, offer hoặc activation. |
| WP3 source tại `63649b29...` | Implementation evidence cho identity, entitlement, payment, publication, support, release flags và current Admin UI. |

### 2.2. Findings

**CONFIRMED REPOSITORY FACT**

- Admin hiện được tổ chức chủ yếu theo sản phẩm và chức năng: Tổng quan, Lặng, Hạt Mầm, Launch Core, Thanh toán, Xuất bản, Xóa dữ liệu, Cài đặt và Liên hệ.
- Dashboard hiện tại đếm queue, capacity, payment report, publication/revision, deletion, overdue và release readiness.
- WP3 đã có nền `customer_identities`, `customer_identity_links`, `product_entitlements`, `entitlement_status_history`, `publication_versions`, `publication_reviews`, `revision_requests`, `support_requests`, `release_flags`, payment evidence/confirmation và audit.
- Một customer identity có thể được liên kết với Auth trong tương lai; random token không phải authorization.
- Release/provider/public flags vẫn bị khóa OFF; customer policies, customer route và provider delivery chưa được mở.
- Child data chỉ được đọc có chủ đích trong protected Hạt Mầm detail; list queries không JOIN hồ sơ trẻ mặc định.

**INFERENCE TỪ IMPLEMENTATION EVIDENCE**

- Hệ đã có các mảnh dữ liệu cần thiết để làm việc theo quan hệ, nhưng chưa có một **relationship-centered read model** cho Founder.
- Hệ chưa có unified `journey instance`, `care task`, `suppression`, `recovery case` hoặc một queue giải thích “vì sao việc này cần Kenji lúc này”.
- Current dashboard là operational count board tốt, nhưng chưa phải Founder Operating Experience hoàn chỉnh vì Founder vẫn phải tự nối customer, journey, care, deadline, support và history giữa nhiều màn hình.

**OPEN DOCUMENTATION QA — PR #137**

- `docs/brand/ESSENCE_EXPERIENCE_BIBLE_2026.md` tại head `e41530b2...` còn một relative link sai: `docs/decisions/...` cần thành `../decisions/...`.
- Đây là documentation defect cần sửa trước khi PR #137 được merge. Nó không cấp quyền sửa runtime và không làm thay đổi nội dung Founder Decision.

---

## 3. Operating principles không được phá vỡ

### 3.1. Một người, nhiều hành trình

Một người có một customer identity/relationship thống nhất và có thể có nhiều journey instance theo thời gian. Không tạo duplicate customer chỉ vì người đó:

- gửi hồ sơ Lặng;
- là phụ huynh mua Hạt Mầm;
- quay lại sau một thời gian;
- có nhiều entitlement;
- gửi support hoặc deletion request.

Một journey mới không được âm thầm thay đổi hoặc hợp nhất lịch sử journey cũ.

### 3.2. Trạng thái vận hành không phải bản sắc con người

Product state, payment state, care state và access state chỉ mô tả điều đang xảy ra trong hệ thống. Chúng không được biến thành:

- psychological profile;
- “nhịp type”;
- lead score;
- customer value score;
- identity prediction;
- hidden readiness score;
- child profile.

Bản đồ `LẶNG → AN ĐỊNH → NHẬN RA NHỊP RIÊNG → NHÌN RA BẢN SẮC → CHỌN MỘT NHỊP SỐNG CÓ THỂ GIỮ → AN THỊNH` là bản đồ định hướng cho trải nghiệm, **không phải database pipeline hoặc lifecycle enum**.

### 3.3. Next Best Care trước Next Best Offer

Hệ ưu tiên theo thứ tự:

1. safety/privacy;
2. broken promise và recovery;
3. Human Decision Gate;
4. support và access;
5. thời hạn/due care;
6. chờ hoặc giữ yên đúng lúc;
7. chỉ sau khi journey hiện tại được khép có phẩm giá mới xem xét một cánh cửa tiếp theo.

WP3.5 **không triển khai Next Best Offer engine**.

### 3.4. Silence là một hành động hợp lệ

“Không gửi gì lúc này” có thể là kết quả đúng khi:

- khách đã yêu cầu dừng;
- đang chờ khách phản hồi;
- có suppression đang hiệu lực;
- có support/recovery chưa đóng;
- journey đang ở giai đoạn cần khoảng nghỉ;
- chưa có consent phù hợp;
- bước tiếp theo chưa được Founder duyệt.

### 3.5. Product truth vẫn nằm ở product state machine

Journey/Care layer không được tự chuyển trạng thái Lặng hoặc Hạt Mầm. Nó chỉ:

- đọc state thật;
- phát hiện việc cần làm;
- tạo care task/proposal;
- đưa Founder về đúng product workspace để quyết định;
- ghi lại outcome đã xảy ra.

Database RPC/state machine hiện hành tiếp tục là transition authority.

---

## 4. Founder jobs-to-be-done

### 4.1. Khi mở Admin

Kenji cần thấy ngay:

- quyết định cần anh hôm nay;
- người đang chờ quá lâu;
- lời hứa hoặc deadline có nguy cơ vỡ;
- payment/publication/access/deletion cần Human Gate;
- điều hệ thống cố ý không làm vì suppression hoặc gate OFF;
- capacity và workload thật, không biến thành scarcity marketing.

### 4.2. Khi mở một mối quan hệ

Kenji cần hiểu trong một màn hình:

- đây là ai ở mức dữ liệu được phép;
- đã có những journey nào;
- journey nào đang mở;
- ESSENCE đang nợ điều gì;
- khách đang chờ điều gì;
- care/support/recovery nào còn mở;
- consent/suppression nào đang điều khiển;
- entitlement và access nào đang active/revoked/deleted;
- quyết định nào chỉ Founder được phép thực hiện.

### 4.3. Khi chuẩn bị hành động

Hệ phải cho Kenji thấy:

- current state;
- proposed action;
- lý do và evidence;
- side effects;
- điều gì không thay đổi;
- ai sẽ nhận hoặc bị ảnh hưởng;
- due date/cadence;
- suppression/consent check;
- bước có thể phục hồi nếu hành động thất bại.

---

## 5. Information architecture được đề xuất

### 5.1. Founder-first navigation

**Lớp điều hành chính**

1. **Hôm nay** — `/admin`
2. **Quan hệ** — proposed `/admin/quan-he`
3. **Hành trình** — proposed `/admin/hanh-trinh`
4. **Chăm sóc & Phục hồi** — proposed `/admin/cham-soc`

**Product/operation workspaces giữ nguyên vai trò chuyên môn**

- Lặng;
- Hạt Mầm;
- Thanh toán;
- Xuất bản;
- Xóa dữ liệu;
- Cài đặt;
- Launch Core / Hệ thống readiness.

WP3.5 không xóa current routes. Nó thêm lớp điều hướng và read model để Founder đi từ “điều cần chăm sóc” đến đúng workspace hiện có.

### 5.2. Recommendation

Không tạo một menu ngang dài thêm. Trên desktop, nhóm navigation thành:

- **Điều hành:** Hôm nay, Quan hệ, Hành trình, Chăm sóc;
- **Workspaces:** Lặng, Hạt Mầm, Thanh toán, Xuất bản, Xóa dữ liệu;
- **Hệ thống:** Cài đặt, Launch Core.

Mobile dùng menu có section rõ; không thu nhỏ nguyên desktop nav.

---

## 6. Page Contract — Hôm nay

### 6.1. Page role

Buồng lái ngắn gọn để Founder quyết định “cần hiện diện ở đâu trước”, không phải analytics dashboard.

### 6.2. Primary truth

**Không phải việc nào mới nhất cũng quan trọng nhất; ưu tiên theo care, risk, promise và Human Decision Gate.**

### 6.3. Thứ tự queue

1. **An toàn, quyền riêng tư và phục hồi khẩn cấp**
   - wrong recipient;
   - access leak suspicion;
   - deletion blocked;
   - sensitive-data handling issue;
   - support có risk.
2. **Quyết định chỉ Founder được làm**
   - Lặng fit/wait/decline;
   - payment confirmation;
   - publication approval/revoke;
   - entitlement grant/revoke;
   - recovery wording/exception.
3. **Lời hứa sắp đến hạn hoặc quá hạn**
   - response SLA;
   - payment confirmation SLA;
   - delivery/revision deadline;
   - follow-up due.
4. **Care task bình thường**
   - xác nhận đã nhận;
   - hỏi bổ sung;
   - hướng dẫn sử dụng;
   - support follow-up.
5. **Đang chờ / quiet by design**
   - chờ khách;
   - chờ provider nhưng gate OFF;
   - suppression active;
   - không cần hành động.

### 6.4. Task card bắt buộc có

- safe customer/relationship label;
- journey/product;
- current state bằng ngôn ngữ người;
- “Vì sao cần nhìn lúc này”;
- due/overdue;
- owner;
- proposed care;
- suppression/gate warning;
- link “Mở đủ ngữ cảnh”.

Không cho phép destructive/irreversible action trực tiếp từ dashboard card.

### 6.5. Không hiển thị

- revenue leaderboard;
- conversion funnel;
- lead score;
- lifetime value;
- “khách nóng/lạnh”;
- inferred psychology;
- raw intake hoặc child detail;
- provider secret/error payload.

---

## 7. Page Contract — Quan hệ / Customer 360

### 7.1. Vai trò

Một hồ sơ quan hệ thống nhất ở cấp người lớn/phụ huynh, không phải “hồ sơ tâm lý khách hàng”.

### 7.2. Header

- safe relationship/customer code;
- display name/contact chỉ khi current Admin permission cho phép;
- identity status: pending verification / active / suspended / deleted;
- last meaningful contact/event;
- open journeys;
- open care/recovery;
- active suppression;
- Founder owner.

### 7.3. Các vùng nội dung

1. **Tổng quan** — what is open, what is promised, what is waiting.
2. **Hành trình** — nhiều journey instance theo thời gian.
3. **Chăm sóc** — care tasks, support và recovery.
4. **Quyền truy cập** — entitlements, approved publication versions, revocation/expiry.
5. **Consent & Suppression** — purpose, version, granted/revoked, quiet windows.
6. **Audit** — safe event timeline.

### 7.4. Child-data boundary

Customer 360 của phụ huynh không hiển thị child profile, tên trẻ, ngày sinh, câu hỏi riêng hoặc publication content.

Nó chỉ có thể hiển thị:

- safe Hạt Mầm order code;
- package snapshot;
- operational state;
- due/revision state;
- consent status;
- link mở protected Hạt Mầm detail có chủ đích.

Không tạo customer identity riêng cho trẻ trong WP3.5.

### 7.5. Internal notes

Chỉ cho phép **safe operational note** có purpose rõ, retention rõ và không chứa:

- raw intake copy;
- diagnosis;
- inferred identity/rhythm;
- child detail;
- bank evidence;
- publication content;
- sales interpretation từ câu chuyện riêng.

---

## 8. Journey contract

### 8.1. Journey instance

Một journey instance là lớp tham chiếu thống nhất đến một product source record thật.

Ví dụ:

- journey Lặng tham chiếu `lang_applications.id`;
- journey Hạt Mầm tham chiếu `hatmam_orders.id`.

Journey instance không thay thế source record và không sở hữu product transition.

### 8.2. Thuộc tính tối thiểu

- `journey_code` — safe code;
- `customer_identity_id`;
- `subject` / `subject_id`;
- `product_code`;
- current product state được đồng bộ từ source;
- `opened_at`, `closed_at`;
- owner;
- latest meaningful event;
- next required Human Gate;
- current promise/due date;
- current suppression state;
- open care task count;
- open recovery case count.

### 8.3. Không lưu

- canonical 6-step map như stage enum;
- “current rhythm”;
- “true identity”;
- hidden need;
- psychological readiness;
- offer propensity;
- lead/customer score.

### 8.4. Journey timeline

Timeline chỉ ghi event thật, ví dụ:

- form received;
- Founder review started;
- more info requested;
- accepted/declined;
- payment requested/reported/confirmed;
- booking invitation ready;
- production started;
- publication review requested/approved/revoked;
- entitlement granted/revoked;
- support received/resolved;
- follow-up due/completed;
- deletion requested/completed.

Event payload phải allowlisted và không chứa raw sensitive content.

---

## 9. Care orchestration contract

### 9.1. Luồng chuẩn

```text
Source event/state
→ deterministic care rule
→ candidate care
→ consent + suppression + release-gate check
→ owner and due date
→ Founder review when required
→ approved action or deliberate silence
→ audit outcome
```

### 9.2. Care task types trong WP3.5

- acknowledge receipt;
- Founder review;
- request more information;
- payment evidence review;
- booking invitation preparation;
- production checkpoint;
- publication review;
- entitlement/access review;
- delivery readiness check;
- support response;
- revision follow-up;
- retention/deletion follow-up;
- post-experience follow-up;
- recovery action;
- deliberate silence.

### 9.3. Care task states

```text
proposed → ready → in_progress → waiting → completed
                         ↘ suppressed / cancelled / expired
```

- `proposed`: hệ thống hoặc AI tạo đề xuất, chưa phải action.
- `ready`: deterministic rules đã pass; action vẫn có thể cần Human Gate.
- `in_progress`: Founder/operator đang xử lý.
- `waiting`: chờ customer, provider hoặc một dependency thật.
- `suppressed`: không được hành động do consent/quiet/risk rule.
- `completed`: outcome đã xảy ra và có audit.

### 9.4. Next Best Care output contract

Mỗi đề xuất phải có:

- action rõ;
- why now;
- source facts/events;
- rule key và rule version;
- owner;
- due date;
- Human Gate required: yes/no;
- consent/suppression result;
- provider/release gate result;
- affected journey;
- recovery path nếu action thất bại.

Không dùng một điểm số tổng hợp để xếp hạng con người. Queue dùng priority bucket và due/risk facts.

---

## 10. Suppression và quiet-by-design

### 10.1. Suppression reasons tối thiểu

- customer requested pause/no contact;
- waiting for customer response;
- unresolved support;
- recovery case open;
- deletion/privacy request open;
- wrong-recipient suspicion;
- entitlement/access suspended;
- product/journey not eligible for next door;
- Founder-set quiet-until date;
- consent missing/revoked;
- release/provider gate OFF.

### 10.2. Quyền ưu tiên

Suppression chặn:

- promotional email;
- offer suggestion;
- automated follow-up không cần thiết;
- cross-sell/upsell;
- AI-generated outreach.

Suppression không được chặn nghĩa vụ cần thiết như:

- privacy/deletion response;
- transactional confirmation;
- security/access recovery;
- communication mà khách đã chủ động yêu cầu.

Hệ phải giải thích rõ vì sao một task bị suppressed và điều kiện nào mới mở lại.

---

## 11. Recovery contract

### 11.1. Recovery case được mở khi

- response SLA bị trễ;
- Founder/operational promise bị bỏ lỡ;
- payment evidence không khớp hoặc confirmation bị kẹt;
- booking invitation đủ điều kiện nhưng chưa được xử lý;
- production/delivery/revision quá hạn;
- publication approved nhưng entitlement/access chưa sẵn sàng;
- private access lỗi, wrong recipient hoặc revocation cần xử lý;
- deletion object-first bị fail-closed;
- support quá hạn hoặc lặp lại.

### 11.2. Recovery states

```text
detected → acknowledged → action_planned → waiting_external → resolved → closed
```

### 11.3. Recovery UX

Founder phải thấy:

- lời hứa nào đã hoặc sắp vỡ;
- impact thực tế;
- người chịu ảnh hưởng;
- điều hệ thống đã chặn an toàn;
- proposed recovery;
- message draft nếu có;
- owner và due;
- proof để đóng case.

AI không tự gửi lời xin lỗi, bồi thường, refund, offer hoặc ngoại lệ chính sách.

---

## 12. Human Decision Gates

| Gate | AI/hệ thống được làm | Chỉ Founder/human được làm |
|---|---|---|
| Lặng fit | Tóm tắt facts, chỉ ra thiếu dữ liệu | Accept, wait/more info, decline |
| Payment | Kiểm tra consistency và hiển thị mismatch | Xác nhận tiền đã nhận |
| Publication | Kiểm tra checklist/checksum/version | Approve, request revision, revoke |
| Entitlement | Kiểm tra approved version + identity | Grant/revoke access |
| Recovery | Phát hiện và draft phương án | Chọn wording, exception, compensation/policy outcome |
| Next door | Chứng minh journey đã khép, consent và suppression | Cho phép một cánh cửa tiếp theo |
| Release/provider | Hiển thị evidence và open gates | Kết nối/bật provider, activation, public release |
| Deletion | Preview impact và execution order | Approve destructive execution theo gate đã duyệt |

Mọi action ở bảng trên phải có confirmation screen riêng; không chạy từ quick button thiếu ngữ cảnh.

---

## 13. Proposed additive data contract — chỉ sau approval

### 13.1. Reuse, không duplicate

WP3.5 phải reuse:

- `customer_identities` và `customer_identity_links`;
- product source tables;
- `product_entitlements` và history;
- `support_requests`;
- `consents`;
- `audit_log`;
- operational settings/versioned snapshots;
- release flags.

### 13.2. Bảng mới tối thiểu được đề xuất

#### `journey_instances`

Unified reference đến product journey thật; không thay source state machine.

#### `journey_events`

Allowlisted safe events dùng cho timeline và orchestration.

#### `care_tasks`

Owner, due, task type, state, Human Gate, rule version và suppression result.

#### `care_task_history`

Bảo toàn mọi chuyển trạng thái và actor.

#### `care_suppressions`

Reason, scope, start/end, source consent/request, actor và release condition.

#### `recovery_cases`

Broken promise/risk, owner, state, impact summary, resolution evidence.

### 13.3. Không tạo trong WP3.5

- generic CRM contacts/leads pipeline;
- subscriber model;
- marketing automation;
- generic workflow-builder engine;
- recommendation/offer engine;
- scoring tables;
- rhythm/personality profiles;
- child identities;
- provider credentials/configuration;
- customer communication delivery table nếu provider chưa được duyệt.

### 13.4. Security baseline

- additive forward migrations only;
- RLS + deny-by-default;
- Admin select/write chỉ qua active Admin + AAL2 hoặc service-role RPC đúng scope;
- customer-facing policies vẫn không được mở;
- safe codes trong URL/log/audit;
- không raw email mới nếu current identity contract chỉ cho hash;
- không child name/content trong orchestration tables;
- event metadata allowlist;
- audit không chứa raw intake, bank evidence hoặc publication content.

---

## 14. AI operating contract

### 14.1. AI được phép

- tóm tắt timeline từ fact đã được phép;
- phát hiện overdue, stalled journey và broken promise;
- đề xuất care task có rule/evidence;
- draft internal checklist hoặc customer message theo template đã duyệt;
- so sánh setting/version trước–sau;
- giải thích vì sao task bị suppressed;
- tìm duplicate identity candidate để Founder review, không tự merge.

### 14.2. AI không được phép

- suy ra nhịp thật, bản sắc thật hoặc hidden need;
- tạo psychological/child/customer profile;
- score lead/customer/readiness;
- quyết định fit;
- xác nhận payment;
- duyệt publication hoặc entitlement;
- tự gửi email/message;
- tự tạo offer hoặc cross-sell từ private story;
- tự bỏ suppression;
- tự merge identity;
- tự sửa giá, capacity, policy hoặc retention;
- kết nối provider;
- bật release flag;
- merge/deploy/public/index.

### 14.3. AI output status

AI output luôn được ghi nhãn **PROPOSAL / DECISION SUPPORT**. Nó không được lưu như customer truth hoặc clinical/psychological fact.

---

## 15. Synthetic Founder UAT scenarios

| Scenario | Kết quả đúng |
|---|---|
| Lặng mới gửi và gần hết response SLA | Hôm nay hiển thị Founder review; không có offer suggestion. |
| Lặng payment evidence lệch amount/reference | Booking bị chặn; task payment review/recovery được tạo; không auto-confirm. |
| Lặng completed, follow-up đến hạn | Draft follow-up được đề xuất; Founder duyệt; không mặc định upsell. |
| Hạt Mầm quá delivery deadline | Recovery case mở bằng safe order code; không đưa child detail vào queue. |
| Publication approved nhưng entitlement chưa grant | Task Human Gate xuất hiện; private delivery vẫn fail-closed khi release flags OFF. |
| Một phụ huynh có journey Lặng và Hạt Mầm | Một relationship, hai journey instance; child data không nhập vào Customer 360. |
| Khách yêu cầu deletion | Suppression chặn offer/follow-up; deletion/recovery vẫn được ưu tiên. |
| Wrong-recipient support | Access bị review/suspend; recovery lên đầu queue; không gửi link mới tự động. |
| Founder đặt quiet-until | Hệ giải thích “để yên đến ngày…”; không tạo outreach task trong window. |
| Duplicate identity candidate | Hệ chỉ nêu candidate và evidence; Founder quyết định merge hoặc giữ riêng. |

Tất cả UAT dùng synthetic/staging fixtures. Không dùng dữ liệu khách thật hoặc dữ liệu trẻ thật.

---

## 16. Implementation sequence sau khi Founder duyệt contract

### WP3.5-A — Founder Review Experience

- UI/read model synthetic hoặc staging-safe;
- Hôm nay, Quan hệ, Hành trình, Chăm sóc & Phục hồi;
- không migration nếu read model hiện tại đủ để prototype;
- không write action mới;
- responsive 390 / 768 / 1440;
- AAL2, noindex, no-store, no-referrer.

### WP3.5-B — Additive orchestration foundation

- approved minimal migrations;
- journey events, care tasks, suppressions và recovery;
- deterministic rules + rule version;
- RLS, audit, synthetic fixtures/tests;
- mọi release/provider flag OFF.

### WP3.5-C — Founder action loop

- Human Gate screens;
- before/after/side-effect confirmation;
- task completion/history;
- recovery resolution;
- synthetic Founder UAT and independent QA.

Mỗi phần là Draft PR riêng hoặc một stacked PR có commit boundaries rõ. Không merge nếu chưa có approval task-specific.

---

## 17. Definition of Done cho WP3.5 implementation

WP3.5 chỉ được gọi là đạt khi:

- Founder đã phê duyệt Operating Contract này;
- UI ưu tiên care/risk/promise/Human Gate, không ưu tiên conversion;
- một identity có nhiều journey mà không duplicate;
- product state machine vẫn là transition authority;
- Customer 360 không chứa psychological profile hoặc child detail mặc định;
- Next Best Care có rule/evidence/suppression/owner/due;
- Next Best Offer không được triển khai;
- recovery và quiet-by-design hoạt động với synthetic evidence;
- mọi Human Gate vẫn bắt buộc;
- AAL2/RLS/deny-by-default pass;
- all provider/public/customer-delivery flags remain OFF;
- no real data used;
- no provider E2E claimed;
- noindex/no-store/no-referrer verified;
- TypeScript, unit/integration tests, build và scoped security tests pass;
- responsive/accessibility QA pass;
- không còn S0/S1;
- PR giữ Draft và chưa merge/deploy production.

---

## 18. Out of scope

- public Customer Home/Reading Room activation;
- customer Auth/magic link;
- Storage/PDF/Resend/Cal.com;
- production data;
- real email/message delivery;
- subscriber/CRM/lead capture;
- assessment 50.000 VND;
- membership;
- Khám Phá/Giao Mùa/other deferred offers;
- marketing automation;
- conversion analytics;
- lead scoring/LTV;
- Next Best Offer;
- generic workflow builder;
- automated financial confirmation;
- indexing, sitemap, robots, Search Console;
- merge hoặc production deploy.

---

## 19. Founder Decisions Needed

### FD-WP3.5-01 — Tên lớp quan hệ

**A. Quan hệ** — ấm, đúng tinh thần ESSENCE, không nghe như CRM.  
**B. Khách hàng** — rõ vận hành nhưng dễ kéo hệ về logic thương mại.

**Recommendation:** chọn **Quan hệ**; dùng “Customer 360” chỉ trong technical contract.

### FD-WP3.5-02 — Care và Recovery

**A. Một workspace “Chăm sóc & Phục hồi”** — ít menu, nhìn context liền nhau.  
**B. Hai workspace riêng** — rõ chuyên môn nhưng làm Admin phân mảnh hơn.

**Recommendation:** chọn **A** trong WP3.5; tách sau nếu volume thật chứng minh cần.

### FD-WP3.5-03 — Next Best Offer

**A. Không hiển thị trong WP3.5.**  
**B. Hiển thị disabled candidate sau journey closure.

**Recommendation:** chọn **A**. Chỉ thiết kế điều kiện governance cho “cánh cửa tiếp theo”, chưa tạo product recommendation UI.

### FD-WP3.5-04 — Safe internal notes

**A. Cho phép safe operational notes có purpose/retention.**  
**B. Không có notes; chỉ audit/state.

**Recommendation:** chọn **A** nhưng bắt buộc character limit, purpose, no child/raw intake/psychological inference và audit.

### FD-WP3.5-05 — Daily queue posture

**A. Hệ tự xếp theo priority bucket + due; Founder chọn trong nhóm.**  
**B. Founder tự sắp thủ công toàn bộ.

**Recommendation:** chọn **A**; không dùng customer score. Founder có thể pin/defer với reason.

---

## 20. Approval gate

Founder approval cho contract này chỉ cho phép bắt đầu **WP3.5-A Founder Review Experience** theo synthetic/staging-only scope.

Nó không tự cho phép:

- database migration;
- write action;
- provider;
- real data;
- public route;
- production deployment;
- activation;
- indexing;
- merge.

Mỗi bước sau cần Work Order, plan, evidence và approval riêng.
