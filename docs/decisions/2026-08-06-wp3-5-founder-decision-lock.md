# WP3.5 — Founder Decision Lock

**Ngày chốt:** 06/08/2026  
**Authority:** Founder Decision for WP3.5 Operating Contract  
**Founder:** Kenji Phạm  
**Trạng thái:** APPROVED DIRECTION — documentation lock only  
**Phạm vi:** WP3.5 Founder Operating Experience, Customer Relationship, Journey Care Orchestration và lớp Cánh cửa tiếp theo  
**Không cấp quyền:** runtime code, migration, provider connection, real customer/child data, production deployment, public activation, indexing hoặc merge.

---

## 1. Tên lớp quản lý

Founder chọn tên chính thức:

> **Quan hệ**

Không dùng **Khách hàng** làm nhãn chính của lớp điều hành vì WP3.5 quản lý toàn bộ quan hệ giữa một người và ESSENCE qua nhiều journey, không chỉ trạng thái mua hàng.

Route đề xuất cho implementation sau approval:

```text
/admin/quan-he
```

---

## 2. Workspace Chăm sóc & Phục hồi

Founder chọn:

> **Gộp Chăm sóc & Phục hồi trong cùng một workspace ở WP3.5.**

Tên hiển thị:

> **Chăm sóc & Phục hồi**

Route đề xuất:

```text
/admin/cham-soc
```

Lý do vận hành: care bình thường và recovery đều là các dạng ESSENCE cần hiện diện trước một lời hứa, support need hoặc trải nghiệm bị đứt. Tách thành hai workspace ở giai đoạn đầu sẽ làm Founder phải chuyển màn hình và dễ bỏ sót ngữ cảnh.

Chỉ xem xét tách ở phase sau khi dữ liệu vận hành thật chứng minh volume, ownership hoặc SLA khác nhau rõ ràng.

---

## 3. Safe operational notes

Founder cho phép:

> **Ghi chú nội bộ có kiểm soát.**

### 3.1. Mục đích được phép

Ghi chú chỉ được dùng để:

- giải thích một quyết định vận hành;
- ghi lại điều cần nhớ cho lần chăm sóc kế tiếp;
- ghi evidence ngắn gọn cho deadline, support hoặc recovery;
- ghi lý do Founder duyệt, hoãn, từ chối hoặc giữ yên;
- giữ continuity giữa các lần xử lý.

### 3.2. Nội dung được phép

- fact đã được xác nhận;
- nguồn fact hoặc event liên quan;
- quyết định đã xảy ra;
- lời hứa hoặc việc cần theo dõi;
- safe summary tối thiểu;
- next review date hoặc due date;
- owner chịu trách nhiệm.

### 3.3. Nội dung bị cấm

Không được ghi:

- raw intake hoặc nguyên văn câu chuyện riêng khi không cần thiết;
- dữ liệu trẻ em, tên trẻ, ngày sinh, nơi sinh hoặc chi tiết gia đình;
- chẩn đoán, suy diễn tâm lý hoặc gắn nhãn;
- “nhịp thật”, “bản sắc thật”, hidden need hoặc personality type;
- bank credential, receipt image content, token, secret hoặc provider payload;
- phán xét như “khách khó”, “khách không tiềm năng”, “khách nóng/lạnh”;
- sales pressure rationale dựa trên tổn thương, khủng hoảng hoặc sự mong manh.

### 3.4. Data contract tối thiểu

Safe operational note phải có:

- `purpose_code`;
- `subject_type` và safe subject reference;
- `note_text` với giới hạn độ dài;
- `created_by`;
- `created_at`;
- `review_or_expiry_at` khi phù hợp;
- audit history;
- visibility boundary.

Không tạo một trường ghi chú tự do không giới hạn và không retention.

---

## 4. Daily priority queue

Founder chọn:

> **Deterministic priority bucket + dữ kiện deadline/risk. Tuyệt đối không dùng customer score.**

### 4.1. Thứ tự priority bucket

1. **An toàn, quyền riêng tư và recovery khẩn cấp**
2. **Human Decision Gate đang chờ Founder**
3. **Lời hứa, SLA hoặc deadline sắp đến hạn/quá hạn**
4. **Support và care task đang mở**
5. **Waiting / quiet by design / suppression active**
6. **Cánh cửa tiếp theo đủ điều kiện để Founder review**

### 4.2. Dữ kiện được phép dùng để xếp queue

- due date và overdue duration;
- severity của access/privacy/deletion/recovery issue;
- Human Decision Gate type;
- current product/journey state;
- support status;
- consent và suppression state;
- release/provider gate;
- owner và workload/capacity;
- lời hứa đã ghi nhận;
- thời gian khách đã chờ.

### 4.3. Dữ kiện bị cấm

Không được tạo hoặc dùng:

- lead score;
- customer value score;
- conversion probability;
- purchase propensity;
- psychological readiness score;
- inferred income/value;
- child profile;
- “nhịp score”;
- hidden ranking dựa trên cảm xúc hoặc câu chuyện riêng.

Queue phải giải thích được bằng ngôn ngữ rõ:

> **Việc này đứng ở đây vì điều gì đang đến hạn, có rủi ro nào, và ai đang chờ quyết định nào.**

Không được chỉ hiển thị một con số hoặc màu mà Founder không thể truy nguyên.

---

## 5. Next Best Care và Cánh cửa tiếp theo

Founder đã chốt trước đó và quyết định này tái xác nhận:

> **Next Best Care đứng trước và tạo điều kiện cho Next Best Offer.**

WP3.5 có lớp **Cánh cửa tiếp theo** dành cho Founder review, nhưng:

- không automated sales engine;
- không auto-send;
- không offer khi care/recovery/support còn mở;
- không dùng child data, crisis, private story hoặc psychological inference làm trigger;
- chỉ cân nhắc offer có approved state, contract, capacity và fit rõ;
- Founder duyệt wording, thời điểm và kênh;
- khách có quyền bỏ qua mà không mất support, entitlement hoặc sự tôn trọng.

Healthy opportunity không bị giấu hoặc bỏ quên, nhưng luôn đứng sau care, risk, promise và Human Decision Gate trong daily queue.

---

## 6. WP3.5 information architecture đã khóa

### Founder operating layer

1. **Hôm nay** — `/admin`
2. **Quan hệ** — `/admin/quan-he`
3. **Hành trình** — `/admin/hanh-trinh`
4. **Chăm sóc & Phục hồi** — `/admin/cham-soc`

### Product and system workspaces giữ nguyên

- Lặng;
- Hạt Mầm;
- Thanh toán;
- Xuất bản;
- Xóa dữ liệu;
- Cài đặt;
- Launch Core / readiness.

WP3.5 không xóa hoặc thay product state machine. Founder operating layer là relationship-centered read/orchestration layer dẫn về đúng workspace chuyên môn.

---

## 7. Trạng thái contract sau quyết định này

Bốn Founder Decisions được xem là **CLOSED**:

1. Tên lớp: **Quan hệ**.
2. Workspace: **gộp Chăm sóc & Phục hồi**.
3. Safe operational notes: **cho phép có kiểm soát**.
4. Daily queue: **deterministic priority bucket + deadline/risk facts; không customer score**.

Next Best Offer correction cũng được xem là **CLOSED DIRECTION**:

- có lớp Cánh cửa tiếp theo;
- care trước offer;
- Founder review;
- không auto-send hoặc sales scoring.

WP3.5 Operating Contract đủ điều kiện để chuyển sang **contract consistency review và chuẩn bị WP3.5-A Work Order**. Việc này chưa tự động cấp quyền implementation.

---

## 8. Bước tiếp theo được phép

Được phép:

1. Cập nhật và khóa wording của WP3.5 documentation.
2. Review consistency giữa contract, correction và Founder Decision Lock.
3. Sửa documentation QA dependency của PR #137.
4. Soạn WP3.5-A Synthetic Founder Review Experience Work Order.
5. Đưa Work Order cho Founder phê duyệt trước code.

Chưa được phép:

- viết runtime hoặc migration;
- tạo route thật;
- dùng Supabase CLI;
- nối provider;
- dùng dữ liệu khách/trẻ thật;
- merge;
- deploy production;
- public activation hoặc indexing.

**— HẾT FOUNDER DECISION LOCK —**
