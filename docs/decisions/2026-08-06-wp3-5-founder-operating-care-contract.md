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
7. khi journey hiện tại đã trao đủ giá trị và đủ điều kiện, mở một **cánh cửa tiếp theo để Founder cân nhắc**.

WP3.5 **không xây automated sales recommendation engine**. Tuy nhiên, WP3.5 được phép đề xuất cho Founder một cánh cửa tiếp theo có thể phù hợp, sau khi care, consent, suppression, journey closure và Human Decision Gate đã được kiểm tra.

Khách hàng không nhìn thấy proposal cho đến khi Founder chủ động duyệt offer, wording, thời điểm và kênh mời.

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
- capacity và workload thật, không biến thành scarcity marketing;
- các cánh cửa tiếp theo đã đủ điều kiện nhưng chưa được Founder xem.

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
- quyết định nào chỉ Founder được phép thực hiện;
- có cánh cửa tiếp theo nào đủ điều kiện để cân nhắc hay chưa.

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
6. **Cánh cửa tiếp theo đủ điều kiện để Founder review**
   - journey hiện tại đã trao đủ giá trị;
   - không còn care/recovery blocker;
   - consent/suppression hợp lệ;
   - offer có approved state, contract và capacity phù hợp.

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

Một hồ sơ quan hệ thống nhất ở cấp người lớn/phụ huynh, không phải “hồ sơ tâm lý”.

### 7.2. Hiển thị mặc định

- safe identity label và verified/unverified status;
- active/past journey summary;
- open care/support/recovery;
- consent/suppression;
- entitlement/access state;
- latest permitted event;
- promises/due dates;
- Human Decision đang chờ;
- cánh cửa tiếp theo ở trạng thái `care_first`, `blocked`, `eligible_for_founder_review`, `founder_deferred` hoặc `closed`.

### 7.3. Child-data boundary

Customer 360 không hiển thị child profile mặc định. Hạt Mầm chỉ hiển thị:

- order code;
- package;
- journey state;
- due date;
- consent status;
- support/recovery state.

Muốn mở child profile phải đi vào protected Hạt Mầm detail bằng hành động có chủ đích.

---

## 8. Page Contract — Hành trình

### 8.1. Journey instance

Mỗi journey instance phải gắn với:

- customer identity;
- product code;
- canonical subject/order/application;
- current product state;
- started/closed timestamps;
- owner;
- latest event;
- open care/recovery count;
- customer-safe next state;
- internal operational next step.

### 8.2. Không tạo lifecycle funnel chung

Lặng và Hạt Mầm có journey riêng. Không ép chúng vào chung một funnel acquisition → conversion → upsell.

Journey layer có thể nhóm theo trạng thái vận hành:

- cần Founder đọc;
- chờ khách;
- chờ payment;
- đang thực hiện;
- chờ approval;
- đang phục hồi;
- đã khép;
- deliberate silence.

---

## 9. Page Contract — Chăm sóc & Phục hồi

### 9.1. Care task

Care task là một việc cần làm để giữ lời hứa, support, privacy, access hoặc nhịp follow-up.

Care task không được dùng làm marketing task trá hình.

### 9.2. Recovery case

Recovery được mở khi có:

- broken promise;
- overdue delivery/follow-up;
- access problem;
- wrong recipient;
- payment mismatch;
- publication/revision issue;
- deletion blocked;
- provider failure trong phase sau.

Recovery phải có owner, severity, customer impact, containment, next action, due date và closure evidence.

### 9.3. Offer blocking

Open recovery, complaint, support hoặc privacy issue tự động đặt offer proposal vào `care_first` hoặc `blocked`.

Không được offer để “bù” cho trải nghiệm đang hỏng.

---

## 10. Cánh cửa tiếp theo — Founder Review Contract

### 10.1. Wording điều khiển

> **Next Best Care đứng trước và tạo điều kiện cho Next Best Offer.**

Care không thay thế kinh doanh. Offer không được đi trước care.

WP3.5 không auto-recommend cho khách và không auto-send. Hệ chỉ tạo proposal để Founder review.

### 10.2. Điều kiện đủ

Một proposal chỉ được tạo khi tất cả điều kiện đúng:

1. Journey/service promise hiện tại đã hoàn thành đủ giá trị hoặc đạt milestone được phép.
2. Không có support, complaint, privacy, deletion hoặc recovery chưa đóng.
3. Không có lời hứa giao hàng/follow-up/access đang quá hạn hoặc chưa hoàn tất.
4. Không có suppression đang hiệu lực.
5. Có consent phù hợp với loại liên hệ.
6. Offer có product state, contract, pricing, delivery và capacity cho phép cân nhắc.
7. Nhu cầu liên quan đã được khách chủ động thể hiện hoặc lựa chọn rõ.
8. Không dùng child data, crisis signal, câu chuyện tổn thương hoặc private content làm trigger.
9. Founder thấy đủ fit/non-fit và giới hạn.
10. Khách có quyền bỏ qua mà không mất support, entitlement hoặc sự tôn trọng.

### 10.3. Hard blockers

Không proposal/offer khi:

- safety/privacy risk;
- crisis hoặc cần support ngoài phạm vi;
- complaint/recovery chưa đóng;
- khách yêu cầu dừng/không liên hệ;
- consent không cho phép;
- payment/delivery/access đang lỗi;
- deletion request đang mở;
- ESSENCE còn nợ một lời hứa;
- offer HOLD/Legacy/thiếu contract/thiếu activation authority;
- proposal dựa trên child/private data hoặc suy diễn tâm lý;
- lý do duy nhất là mục tiêu doanh thu.

### 10.4. Proposal card

Founder phải thấy:

- offer/cánh cửa;
- evidence khách chủ động thể hiện;
- journey closure/milestone;
- care/support/recovery status;
- consent/suppression result;
- product state/capacity;
- fit và non-fit;
- wording draft;
- kênh/thời điểm;
- điều gì không thay đổi nếu khách từ chối;
- actions: **Duyệt lời mời**, **Chỉnh wording**, **Để sau**, **Không phù hợp**, **Tiếp tục care**.

Không có nút gửi nhanh trực tiếp từ dashboard trong WP3.5.

### 10.5. Proposal states

- `not_evaluated`
- `care_first`
- `blocked`
- `eligible_for_founder_review`
- `founder_deferred`
- `founder_declined`
- `invitation_approved`
- `invitation_sent` — future provider phase only
- `customer_declined`
- `customer_interested`
- `closed`

Đây là operational states, không phải profile hoặc score.

---

## 11. Data contract tối thiểu được đề xuất

Chỉ sau approval, additive contract có thể gồm:

- `journey_instances`
- `journey_events`
- `care_tasks`
- `care_task_history`
- `care_suppressions`
- `recovery_cases`
- `offer_proposals`
- `offer_proposal_history`

Không tạo generic CRM, subscriber pipeline, marketing automation, customer score, psychological profile hoặc child identity model trong WP3.5.

Product states, payment, publication, entitlement và support tables hiện tại tiếp tục là canonical facts.

---

## 12. AI boundary

AI được phép:

- tóm tắt facts có nguồn;
- phát hiện care task hoặc deadline bị bỏ quên;
- đề xuất priority bucket;
- draft care/recovery wording;
- kiểm tra consent/suppression/product-state blockers;
- draft một cánh cửa tiếp theo cho Founder khi đủ điều kiện;
- nêu fit/non-fit và evidence.

AI không được phép:

- suy ra nhu cầu ẩn;
- suy ra “nhịp thật” hoặc “bản sắc thật”;
- tạo lead/customer/readiness score;
- dùng child/private data làm sales trigger;
- tự quyết định fit;
- tự duyệt offer;
- auto-send;
- tự đổi product state, giá, consent hoặc suppression;
- tự xác nhận payment, publication, entitlement hoặc deletion.

---

## 13. Synthetic Founder UAT

### Scenario 1 — Care first

Hạt Mầm đã giao nhưng khách không mở được Reading Room.

**Expected:** support đứng trước; proposal `care_first`.

### Scenario 2 — Recovery blocker

Lặng đã hoàn tất nhưng follow-up trễ.

**Expected:** recovery task; không proposal đến khi recovery đóng.

### Scenario 3 — Eligible invitation

Khách hoàn tất Lặng, đã nhận follow-up, không có support/recovery, chủ động hỏi về đồng hành sâu hơn và consent cho phép.

**Expected:** proposal `eligible_for_founder_review`; Founder thấy fit/non-fit, capacity và wording; không auto-send.

### Scenario 4 — Customer says no

Khách từ chối lời mời trong future provider phase.

**Expected:** `customer_declined`; không mất support/entitlement; không pressure follow-up.

### Scenario 5 — Child-data prohibition

Phụ huynh chia sẻ nội dung nhạy cảm về con nhưng không hỏi offer khác.

**Expected:** không proposal; child/private data không là trigger.

### Scenario 6 — Product not ready

Khách hỏi offer HOLD hoặc thiếu approved contract.

**Expected:** safe note ở mức nhu cầu khách chủ động; proposal `blocked`; không hứa availability/timeline.

### Scenario 7 — Healthy revenue continuity

Nhiều journey khép đúng nhưng Founder chưa review các cánh cửa đủ điều kiện.

**Expected:** queue nhắc Founder review theo due date hợp lý; không artificial urgency, không auto-send, không score.

---

## 14. Implementation sequence sau approval

### WP3.5-A — Synthetic Founder Review Experience

- read-only/synthetic UI;
- Hôm nay, Quan hệ, Hành trình, Chăm sóc;
- proposal cards synthetic;
- không migration;
- không write action;
- không real data/provider.

### WP3.5-B — Additive staging read model

Chỉ sau Work Order riêng:

- additive migrations;
- synthetic/staging data;
- AAL2/RLS;
- deterministic queue;
- care/suppression/recovery/proposal records;
- no provider/public activation.

### WP3.5-C — Audited Founder actions

Chỉ sau review riêng:

- create/update care task;
- suppression;
- recovery handling;
- Founder proposal decision;
- audit/history;
- vẫn không auto-send nếu provider chưa được duyệt.

---

## 15. Founder Decisions Needed

1. **Tên lớp:** `Quan hệ` hay `Khách hàng`.  
   Recommendation: **Quan hệ**.

2. **Chăm sóc & Phục hồi:** gộp hay tách.  
   Recommendation: **gộp trong WP3.5**.

3. **Cánh cửa tiếp theo:** có trong WP3.5 hay không.  
   **Founder direction đã ghi nhận:** Có lớp đề xuất dành cho Founder review; không automated sales engine và không auto-send.

4. **Safe operational notes:** có cho phép không.  
   Recommendation: có, với purpose, content boundary và retention chặt.

5. **Daily queue:** deterministic priority bucket + due/risk hay Founder sắp hoàn toàn.  
   Recommendation: deterministic bucket + facts; không customer score.

---

## 16. Acceptance criteria

Contract đạt khi:

- một người có thể có nhiều journey;
- product state machine vẫn là transition authority;
- Next Best Care đứng trước và tạo điều kiện cho Next Best Offer;
- system không né kinh doanh và không bỏ quên opportunity lành mạnh;
- Founder duyệt mọi invitation;
- không auto-send trong WP3.5;
- không lead/customer/readiness score;
- child/private/crisis data không là sales trigger;
- consent/suppression/recovery chặn đúng;
- customer refusal không làm mất support/entitlement;
- synthetic UAT rõ;
- không runtime/migration/provider/real data trước Work Order riêng.

**— HẾT CONTRACT —**
