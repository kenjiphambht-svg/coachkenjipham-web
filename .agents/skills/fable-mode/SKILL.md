# Fable Mode

Use this skill when Kenji types "fable mode" in a request, OR when a task touches a live route (`/kidbook`, `/ai-startup`, payment pages) or a hard-to-reverse merge/deploy decision — in those two cases, propose enabling fable mode instead of turning it on silently. Do NOT use for small/obvious edits (fix one line of text, change one link) — it slows down trivial work for no reason.

## Read First

- `AGENTS.md`
- `PLAYBOOK.md`

## Vì sao skill này tồn tại

Việc đụng route sống hoặc quyết định khó đảo ngược cần một kỷ luật tư duy chặt hơn mức bình thường — không phải vì luật thường của repo (`AGENTS.md`, `PLAYBOOK.md`) không đủ, mà vì những việc này không tha thứ cho một câu kết luận vội. Fable mode là một lớp kỷ luật BỔ SUNG, không thay thế luật thường.

## 5 bước bắt buộc khi fable mode được kích hoạt

### 1. Khoanh vùng trước khi làm

Viết ra rõ ràng: "xong việc này nghĩa là gì" — trước khi chạm vào bất kỳ file nào. Tách bạch hai loại thông tin ngay từ đầu và không trộn lẫn khi báo cáo:

- **Đã kiểm chứng thật** — đọc file, chạy lệnh, thấy tận mắt.
- **Đang giả định** — nhớ từ lần trước, đoán theo pattern quen, suy ra từ tên file/tên biến.

### 2. Bằng chứng trước khi suy luận

Trước khi kết luận điều gì về code/file/trạng thái repo, phải thực sự mở file hoặc chạy lệnh kiểm tra. Không suy diễn từ trí nhớ, không tin tên file/tên biến "nghe có vẻ đúng" — nghe hợp lý không phải là bằng chứng.

### 3. Tự phản biện

Sau khi có phương án, chủ động tự hỏi trước khi triển khai:

- Phương án này có lỗ hổng gì mà mình đang bỏ qua?
- Có chỗ nào đang giả định là đúng mà chưa kiểm chứng?

Ghi lại câu trả lời — không chỉ nghĩ trong đầu rồi bỏ qua.

### 4. Xác minh bằng mắt

`build pass` / `không lỗi` **KHÔNG** được coi là bằng chứng đã đúng — đó chỉ là bằng chứng đã COMPILE. Phải xác minh bằng cách xem trực tiếp kết quả thật: đọc output, xem trang deploy thật, `curl` route thật. Đúng thói quen đã áp dụng trong các lần deploy gần đây của repo này (build pass rồi vẫn curl domain thật để xác nhận route sống, noindex có mặt, logo hiển thị đúng).

### 5. Báo cáo minh bạch

Trong phiếu báo cáo cuối, tách rõ 2 mục riêng biệt:

- **Đã xác minh thật** (kèm cách xác minh — đọc file nào, chạy lệnh gì, curl URL nào).
- **Đang giả định / chưa kiểm chứng được**.

Không được gộp chung hai mục này để nghe có vẻ chắc chắn hơn thực tế.

## Kích hoạt

Fable mode **không tự động chạy cho mọi việc**. Chỉ bật khi:

- **(a)** Kenji gõ cụm "fable mode" trong yêu cầu, HOẶC
- **(b)** việc đụng vào route đang sống (`/kidbook`, `/ai-startup`, thanh toán) hoặc quyết định merge/deploy khó đảo ngược — trong trường hợp này, **gợi ý** Kenji có muốn bật fable mode không, không tự ý bật.

**Không dùng cho việc nhỏ/rõ ràng** (sửa 1 dòng chữ, đổi 1 link) — làm chậm vô ích, đi ngược tinh thần "thông minh không phức tạp".

## Guardrails

- Không thay thế luật thường (`AGENTS.md`, `PLAYBOOK.md`) — fable mode CỘNG THÊM, không xóa bớt bước nào đã có.
- Không dùng làm cớ trì hoãn việc rõ ràng — nếu việc nhỏ/an toàn, không cần bật.
- Không tự bật im lặng khi rơi vào trường hợp (b) — luôn hỏi Kenji trước.
- Tự phản biện ở bước 3 phải viết ra thành chữ, không phải "đã nghĩ qua trong đầu".
