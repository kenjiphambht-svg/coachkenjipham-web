# WP3.5 — Founder Correction: Next Best Care & Next Best Offer

**Ngày ghi nhận:** 06/08/2026  
**Trạng thái:** **FOUNDER DIRECTION — đưa vào WP3.5 Contract Review**  
**Owner / Final authority:** Kenji Phạm  
**Phạm vi:** WP3.5 Founder Operating Experience, Customer Relationship & Journey Care Orchestration  
**Baseline:** Draft PR #138 stacked on Draft PR #137  
**Scope guard:** Documentation only. Không sửa runtime, database, migration, provider, production, public activation hoặc dùng dữ liệu khách thật.

---

## 1. Founder correction

ESSENCE không được dùng sự mong manh, dữ liệu riêng tư hoặc áp lực để bán hàng. Tuy nhiên, ESSENCE cũng không được né tránh việc giới thiệu một cánh cửa phù hợp đến mức khách hàng không biết bước tiếp theo và doanh nghiệp không thể duy trì nguồn doanh thu lành mạnh.

Vì vậy, wording đúng cho WP3.5 là:

> **Next Best Care đứng trước và tạo điều kiện cho Next Best Offer.**

Care không thay thế kinh doanh. Offer không được đi trước care.

Mục tiêu của hệ là giúp Founder biết:

- khi nào cần tiếp tục chăm sóc;
- khi nào cần phục hồi một trải nghiệm chưa trọn;
- khi nào nên chờ hoặc để khách được yên;
- và khi nào đã phù hợp để mở một cánh cửa tiếp theo một cách rõ ràng, tinh tế và có consent.

---

## 2. Điều chỉnh đối với WP3.5 Operating Contract

Tài liệu này **supersedes** mọi câu trong WP3.5 Operating Contract có thể được hiểu là:

- không được hiển thị Next Best Offer cho Founder;
- WP3.5 tuyệt đối không được hỗ trợ nhận ra cơ hội offer;
- chỉ care mà không có khả năng mở bước kinh doanh tiếp theo.

Wording thay thế:

> **WP3.5 không xây automated sales recommendation engine. WP3.5 được phép đề xuất cho Founder một “Cánh cửa tiếp theo có thể phù hợp”, nhưng chỉ sau khi care, consent, suppression, journey closure và Human Decision Gate đã được kiểm tra. Khách hàng không nhìn thấy đề xuất cho đến khi Founder chủ động duyệt cách mời phù hợp.**

---

## 3. Ba lớp phân biệt bắt buộc

### 3.1. Next Best Care

Là điều ESSENCE nên làm trước để giữ đúng lời hứa và phẩm giá của mối quan hệ, ví dụ:

- xác nhận đã nhận;
- hỏi bổ sung;
- giải quyết support;
- phục hồi trải nghiệm bị chậm hoặc sai;
- bảo vệ privacy;
- hoàn tất delivery;
- follow-up đúng cam kết;
- hoặc deliberate silence.

### 3.2. Offer Eligibility

Là kiểm tra vận hành xem **có được phép cân nhắc mở một cánh cửa tiếp theo hay chưa**.

Đây không phải lead score, readiness score, psychological inference hoặc customer value score.

### 3.3. Founder-approved invitation

Là lời mời thật sự đến khách hàng sau khi Founder xem đủ bối cảnh và phê duyệt:

- offer nào;
- vì sao phù hợp;
- thời điểm;
- wording;
- kênh gửi;
- quyền bỏ qua;
- và điều gì vẫn được giữ nguyên nếu khách không chọn.

Hệ thống không tự gửi lời mời trong WP3.5.

---

## 4. Điều kiện đủ để hệ được phép đề xuất một cánh cửa tiếp theo

Một offer proposal chỉ được tạo cho Founder khi **tất cả** điều kiện sau đúng:

1. Journey hoặc service promise hiện tại đã hoàn thành đủ giá trị, hoặc đang ở một milestone được contract cho phép mở bước kế tiếp.
2. Không có support, complaint, wrong-recipient, privacy, deletion hoặc recovery case chưa đóng.
3. Không có lời hứa giao hàng, follow-up hoặc quyền truy cập đang quá hạn/chưa hoàn tất.
4. Không có suppression đang hiệu lực.
5. Có consent phù hợp với loại liên hệ dự kiến.
6. Offer đang ở product state cho phép Founder cân nhắc; không phải HOLD, Legacy, chưa có contract hoặc chưa được phép mở.
7. Offer thực sự liên quan đến nhu cầu khách đã **chủ động thể hiện** hoặc lựa chọn rõ ràng; không dựa trên suy đoán tâm lý.
8. Không dùng dữ liệu trẻ em, câu chuyện tổn thương, crisis signal hoặc nội dung riêng tư làm sales trigger.
9. Founder có đủ thông tin để xem fit/non-fit, capacity, price, policy, delivery và giới hạn.
10. Lời mời có quyền từ chối rõ và không làm thay đổi support, entitlement hoặc sự tôn trọng dành cho khách.

Thiếu một điều kiện thì proposal phải ở trạng thái **BLOCKED** hoặc **CARE FIRST**, không phải offer-ready.

---

## 5. Hard blockers — tuyệt đối không offer

WP3.5 không được đề xuất hoặc gửi offer khi:

- có safety/privacy risk;
- khách đang trong crisis hoặc biểu hiện cần support ngoài phạm vi ESSENCE;
- có complaint/recovery chưa đóng;
- khách yêu cầu dừng, không liên hệ hoặc không nhận giới thiệu;
- consent không cho phép;
- payment/delivery/access đang có lỗi;
- deletion request đang mở;
- khách đang chờ ESSENCE thực hiện một lời hứa;
- offer chưa có approved contract, pricing, delivery, provider hoặc activation authority;
- offer dựa trên child data hoặc suy diễn từ dữ liệu trẻ;
- proposal chỉ xuất phát từ mục tiêu doanh thu mà không có fit evidence.

---

## 6. UI contract cho Founder

### 6.1. Không dùng tên “Next Best Offer” làm nhãn chính

Để giữ ngôn ngữ con người và tinh thần ESSENCE, UI đề xuất dùng:

- **Cánh cửa tiếp theo**;
- **Có thể phù hợp tiếp**;
- hoặc **Bước tiếp theo để Founder cân nhắc**.

Tên kỹ thuật nội bộ có thể là `offer_proposal`, nhưng không hiển thị cho khách.

### 6.2. Proposal card bắt buộc hiển thị

- cánh cửa/offer được cân nhắc;
- evidence khách đã chủ động thể hiện;
- journey hiện tại đã hoàn tất ở đâu;
- care/support/recovery status;
- consent và suppression result;
- product state/capacity;
- lý do có thể phù hợp;
- lý do có thể không phù hợp;
- wording draft nếu được phép;
- kênh và thời điểm đề xuất;
- điều gì không thay đổi nếu khách từ chối;
- nút **Duyệt lời mời**, **Chỉnh wording**, **Để sau**, **Không phù hợp**, **Tiếp tục care**.

### 6.3. Không được làm

- không nút gửi nhanh từ dashboard;
- không auto-send;
- không bulk campaign;
- không countdown/scarcity giả;
- không gắn nhãn “hot lead”;
- không xếp hạng khách theo giá trị;
- không dùng doanh thu dự kiến làm priority cao hơn safety/care.

---

## 7. Deterministic proposal states

WP3.5 có thể dùng các trạng thái vận hành sau cho proposal, nhưng không biến chúng thành profile khách:

- `not_evaluated` — chưa cần xem;
- `care_first` — phải hoàn tất care trước;
- `blocked` — bị chặn bởi consent, suppression, risk, product state hoặc open recovery;
- `eligible_for_founder_review` — đủ điều kiện để Founder cân nhắc;
- `founder_deferred` — Founder chọn để sau;
- `founder_declined` — Founder xác định không phù hợp;
- `invitation_approved` — wording/kênh/thời điểm đã được Founder duyệt;
- `invitation_sent` — chỉ dùng trong phase/provider được duyệt sau này;
- `customer_declined` — khách không chọn;
- `customer_interested` — khách chủ động muốn tìm hiểu tiếp;
- `closed` — khép proposal, không tiếp tục tác động.

Trong WP3.5, `invitation_sent` vẫn là future state; provider và gửi thật chưa được mở.

---

## 8. Priority relationship

Daily Founder queue giữ thứ tự:

1. safety/privacy;
2. broken promise/recovery;
3. Human Decision Gate;
4. support/access;
5. due care/follow-up;
6. deliberate silence/wait;
7. **Founder review cho cánh cửa tiếp theo đủ điều kiện**.

Offer proposal không được vượt lên trên care chỉ vì giá trị thương mại cao hơn.

Tuy nhiên, proposal đủ điều kiện không được bị giấu hoặc bỏ quên. Hệ phải đặt nó vào một queue riêng, có due date hợp lý và giải thích rõ để Founder chủ động kinh doanh mà không đánh mất tinh thần ESSENCE.

---

## 9. Synthetic UAT bổ sung

### Scenario A — Care first

Hạt Mầm đã giao nhưng khách đang báo không mở được Reading Room.

**Expected:** support/access task đứng trước; offer proposal bị `care_first`.

### Scenario B — Recovery blocker

Lặng đã hoàn tất nhưng follow-up đã trễ so với cam kết.

**Expected:** recovery task được tạo; không đề xuất offer đến khi recovery đóng.

### Scenario C — Eligible invitation

Khách hoàn tất Lặng, đã nhận follow-up, không có support/recovery, chủ động hỏi về một hình thức đồng hành sâu hơn và consent cho phép liên hệ.

**Expected:** proposal `eligible_for_founder_review`; Founder thấy fit/non-fit, capacity và wording draft; không auto-send.

### Scenario D — Customer says no

Founder gửi lời mời hợp lệ trong một phase tương lai; khách từ chối.

**Expected:** ghi `customer_declined`, không làm mất support/entitlement, không tạo follow-up pressure.

### Scenario E — Child-data prohibition

Phụ huynh chia sẻ câu chuyện nhạy cảm về con trong Hạt Mầm nhưng không chủ động hỏi offer khác.

**Expected:** không tạo offer proposal; child/private data không được dùng làm trigger.

### Scenario F — Product not ready

Khách hỏi một offer đang HOLD hoặc thiếu approved contract.

**Expected:** ghi nhu cầu khách chủ động bày tỏ ở mức safe note; proposal `blocked`; không hứa availability hoặc timeline.

### Scenario G — Healthy revenue continuity

Nhiều journey đã khép đúng nhưng Founder chưa xem các cánh cửa đủ điều kiện trong thời gian dài.

**Expected:** queue nhắc Founder review opportunity theo due date; không tự tăng urgency, không gửi khách và không biến thành sales score.

---

## 10. Acceptance correction cho WP3.5 Contract

WP3.5 Contract chỉ được xem là aligned với Founder direction khi:

- khẳng định rõ ESSENCE vẫn chủ động kinh doanh và giới thiệu offer phù hợp;
- Next Best Care đứng trước, không xóa Next Best Offer;
- có eligibility rules và hard blockers;
- Founder duyệt mọi invitation;
- khách luôn có quyền không chọn;
- không dùng child data, crisis, private story hoặc psychological inference để bán;
- không có automated offer sending trong WP3.5;
- queue không bỏ quên các opportunity lành mạnh;
- doanh thu liên tục được xem là nhu cầu vận hành hợp pháp nhưng không thắng safety, privacy và care.

---

## 11. Founder Decision wording đề xuất để hợp nhất vào contract

> **FOUNDER CORRECTION — ESSENCE không né tránh việc giới thiệu sản phẩm hoặc cánh cửa tiếp theo phù hợp. Next Best Care đứng trước và tạo điều kiện cho Next Best Offer: care, support, recovery, privacy, consent và suppression phải được kiểm tra trước; khi journey hiện tại đã trao đủ giá trị và khách chủ động thể hiện nhu cầu phù hợp, hệ thống có thể đề xuất cho Founder một cánh cửa tiếp theo. Đây không phải lead scoring, psychological profiling hoặc automated sales engine. AI/hệ thống chỉ nêu evidence, điều kiện fit/non-fit và draft wording; Founder quyết định offer, thời điểm, kênh và lời mời. Không dùng dữ liệu trẻ em, crisis, câu chuyện tổn thương hoặc private data làm sales trigger. Khách có quyền bỏ qua mà không mất support, entitlement hoặc sự tôn trọng.**

---

## 12. Impact lên năm Founder Decisions của PR #138

Decision số 3 được sửa thành:

> **WP3.5 có lớp “Cánh cửa tiếp theo” dành cho Founder review, nhưng không có automated Next Best Offer engine hoặc auto-send.**

Bốn decision còn lại chưa thay đổi:

1. Tên lớp: `Quan hệ` hay `Khách hàng`.
2. Gộp hay tách Chăm sóc & Phục hồi.
3. **Đã correction như trên.**
4. Safe operational notes.
5. Deterministic daily queue, không customer score.

**— HẾT CORRECTION —**
