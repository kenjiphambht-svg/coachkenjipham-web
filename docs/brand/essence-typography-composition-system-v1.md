# ESSENCE TYPOGRAPHY COMPOSITION SYSTEM
## 5 VOICES · 1 VISUAL GRAMMAR

**Phiên bản:** V1.1
**Authority:** L3 — Canonical Specialized System
**Status:** Active
**Owner:** Kenji Phạm
**Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc
**Last verified:** fe0739d6d88ba8c9b9a1a6bc9b467bc0f22f5dae
**Phạm vi:** Typography composition toàn bộ website Essence Coaching
**Implementation evidence đầu tiên:** Trang Lặng 90
**Mục tiêu:** Biến typography thành một hệ thống dẫn cảm xúc, dẫn mắt và tổ chức ý nghĩa — không chỉ là chọn font đẹp.
**Review trigger:** Khi thay đổi typography role, font production, Page Mode, Signal Composition hoặc nguyên tắc accessibility/readability.

## GOVERNANCE SCOPE

Tài liệu này quyết định:

- năm vai typography của Essence;
- hierarchy và scale relationship;
- logic emphasis;
- Signal Composition;
- nguyên tắc tiếng Việt;
- Type Lab;
- tiêu chuẩn đọc, khoảng trắng và QA typography.

Tài liệu này không tự quyết định:

- font-family production cụ thể cho toàn hệ;
- font loading hoặc implementation code;
- page-specific line break;
- component architecture;
- việc thêm font mới vào production.

Trang Lặng 90 là **L4 — Implementation Evidence** đã được duyệt. Nó chứng minh một cách triển khai thành công, nhưng không thay thế authority của tài liệu này.

---

# 1. TRIẾT LÝ CỐT LÕI

Typography của Essence không chỉ để đọc.

Nó phải đồng thời làm được bốn việc:

1. **Tạo thứ bậc rõ ràng** — người xem biết ngay đâu là câu quan trọng, đâu là phần giải thích, đâu là hành động.
2. **Dẫn nhịp cảm xúc** — chữ giúp người xem chậm lại, dừng lại, chuyển ý và tiếp tục.
3. **Tạo hình ảnh bằng câu chữ** — một câu có thể trở thành một composition thị giác, thay vì chỉ là một dòng văn bản.
4. **Giữ khả năng đọc lâu** — những đoạn dài phải nhẹ, rõ và không gây mỏi mắt.

> Typography của Essence không phô diễn font. Nó đạo diễn ý nghĩa.


---

# 1.1. FONT-FAMILY AUTHORITY VÀ APPROVAL PROTOCOL

Năm vai typography là grammar của hệ. Font-family là công cụ được chọn để thực hiện từng vai.

Không được suy ra rằng một font đang dùng ở một page sẽ tự động trở thành font canonical toàn website.

Một font-family mới chỉ được đưa vào production khi:

1. Có lý do sáng tạo rõ ràng gắn với Page Mode, Signal Moment hoặc một typography role cụ thể.
2. Kiểm tra đầy đủ tiếng Việt.
3. Có weight thực tế phù hợp.
4. Có true italic nếu vai đó cần italic.
5. Được kiểm tra performance và licensing.
6. Được dựng trong Type Lab bằng nội dung thật.
7. Được Kenji duyệt.
8. Sau khi duyệt, tài liệu canonical và Document Registry phải được cập nhật.

Không để page-specific experiment âm thầm trở thành global system.

---

# 2. HỆ 5 VAI

Toàn bộ hệ thống dùng năm vai typography chính:

1. Display Voice
2. Anchor Voice
3. Reading Voice
4. Accent Voice
5. Utility Voice

Signal Moment không phải là một vai riêng. Signal Moment là một composition cấp cao được tạo bằng cách phối nhiều vai trong cùng một khối.

---

# 3. DISPLAY VOICE

## Chức năng

Dùng cho Hero, câu tuyên ngôn, câu mở đầu lớn, từ hoặc cụm từ mang tính biểu tượng.

## Tính chất

- Có cá tính và độ tương phản.
- Có thể phối Roman và true italic.
- Có thể dùng hai kích thước trong cùng một câu.
- Line-height chặt hơn body.
- Thường có xuống dòng thủ công.

## Tần suất

Tối đa 1–2 lần trên mỗi trang.

## Quy tắc

Được phép:

- Roman + true italic.
- Hai kích thước trong cùng một câu.
- Tăng khoảng trắng giữa các tầng ý nghĩa.
- Xuống dòng theo ý nghĩa.

Không được:

- Dùng quá nhiều màu.
- Dùng text-shadow, outline.
- Dùng ba font trở lên.
- Dùng toàn câu italic hoặc uppercase.
- Dùng Display ở mọi section.

---

# 4. ANCHOR VOICE

## Chức năng

Dùng cho heading mở Scene, tiêu đề section, heading trong các khối thông tin.

## Tính chất

- Rõ.
- Vững.
- Dễ đọc.
- Không quá trình diễn.
- Chủ yếu Roman.

## Quy tắc

- Tối đa 2–3 Anchor mỗi trang có internal emphasis.
- Các heading còn lại giữ style ổn định.
- Không biến mọi heading thành quote.
- Không dùng italic toàn heading.

## Internal Emphasis

Chỉ nhấn một cụm khi câu có hai tầng ý nghĩa rõ. Có thể dùng true italic, tăng size 5–10% hoặc đổi weight nhẹ. Chỉ dùng một cách tại một thời điểm.

---

# 5. READING VOICE

## Chức năng

Dùng cho body copy, mô tả dài, FAQ, thông tin chi tiết và các đoạn cần đọc liên tục.

## Mục tiêu

Người đọc phải quên rằng họ đang đọc một font.

## Tiêu chuẩn cảm nhận

### Mobile

- 17–18px.
- Line-height khoảng 1.65–1.8.
- Không quá mảnh.

### Desktop

- 18–20px.
- Line-height khoảng 1.65–1.78.
- Chiều rộng dòng 55–70 ký tự.
- Max-width thường 640–680px.

## Quy tắc

Không dùng italic cho đoạn dài, không justify, không tracking âm mạnh, không dùng font display làm body.

---

# 6. ACCENT VOICE

## Chức năng

Dùng cho câu thì thầm, câu đổi giọng, lời nhấn ngắn, lời kết.

## Tính chất

- Thường dùng true italic.
- Lớn hơn body khoảng 10–30%.
- Có nhiều khoảng thở.
- Không dài.

## Tần suất

2–4 lần mỗi trang.

Không cạnh tranh với Hero hoặc Signal.

---

# 7. UTILITY VOICE

## Chức năng

Dùng cho menu, section label, metadata, button, thông tin phiên, footer, caption và trạng thái.

## Tính chất

- Chính xác.
- Gọn.
- Hiện đại.
- Dễ quét.
- Thường sans-serif.
- Có thể uppercase.
- Tracking có kiểm soát.

## Kích thước cảm nhận tối thiểu

- Mobile: 11–12px.
- Desktop: 12–13px.

Không dùng serif italic trong Utility.

---

# 8. SIGNAL COMPOSITION

Signal Composition là khoảnh khắc typography mạnh nhất của trang. Nó không phải một class.

## Cấu trúc ba tầng

### Tầng A — Nhận định

Anchor hoặc Reading Voice, Roman, nhỏ nhất trong composition.

### Tầng B — Chuyển hướng

Display hoặc Accent Voice, lớn nhất, có thể true italic, nhiều khoảng trắng.

### Tầng C — Nhận ra

Trở lại Anchor hoặc Reading Voice, kích thước trung gian, khép ý.

## Quy tắc

- Mỗi trang chỉ có một Signal Composition chính.
- Signal là cao trào typography mạnh nhất về ý nghĩa và composition. Nó không bắt buộc phải có kích thước chữ lớn hơn Hero.
- Không đặt CTA trong Signal.
- Không dùng màu để tạo cao trào.
- Khoảng trắng là một phần của composition.

---

# 9. PHỐI NHIỀU FONT HOẶC NHIỀU SIZE TRONG MỘT CÂU

Chỉ dùng khi câu có hai tầng ý nghĩa rõ, một điểm chuyển giọng, một cụm từ khóa ngắn hoặc một phần cần được nhớ.

## Thứ tự ưu tiên

1. Cùng family: Roman + true italic.
2. Cùng family: size khác nhau.
3. Cùng family: regular + medium.
4. Hai family đã được pairing trong hệ.
5. Uppercase cho một cụm rất ngắn.

Không dùng quá ba thủ pháp trong cùng một câu.

Không dùng nhiều màu, underline trang trí, outline, text-shadow, script font hoặc random size.

---

# 10. HIERARCHY TOÀN TRANG

Một trang chuẩn cần có:

- 1 Signal Composition.
- 1 Hero Display.
- 2–4 Accent Voice.
- 2–3 Anchor có internal emphasis.
- Các Anchor còn lại ổn định.
- Reading Voice giữ yên.
- Utility làm nền điều hướng.

> Không phải câu nào hay cũng cần được trình diễn.

---

# 11. SCALE TƯƠNG ĐỐI

| Vai | Quan hệ kích thước |
|---|---|
| Signal | lớn nhất |
| Hero | đứng thứ hai |
| Anchor | 45–65% Hero |
| Accent | 110–130% Body |
| Body | chuẩn đọc |
| Utility | nhỏ nhất nhưng vẫn rõ |

Mỗi Page Mode được phép điều chỉnh tỷ lệ này.

---

# 12. LINE-HEIGHT VÀ TRACKING

## Display
- Line-height khoảng 0.95–1.15.
- Có thể tracking âm nhẹ.

## Anchor
- Line-height khoảng 1.15–1.3.
- Tracking trung tính hoặc âm rất nhẹ.

## Body
- Line-height khoảng 1.65–1.8.
- Tracking gần 0.

## Accent
- Line-height khoảng 1.25–1.5.
- Tracking gần 0.

## Utility
- Line-height khoảng 1.3–1.5.
- Tracking dương nhẹ.

---

# 13. XUỐNG DÒNG TIẾNG VIỆT

Xuống dòng phải theo ý nghĩa.

Không để một từ cô độc ở dòng cuối, dấu câu đứng đầu dòng, cụm từ bị cắt làm mất nghĩa hoặc Hero bị ép nowrap gây overflow.

Desktop được khóa line-break có chủ đích. Mobile được phép thay line-break nếu vẫn giữ hierarchy và nhịp nghĩa.

---

# 14. DESKTOP VÀ MOBILE

Mobile không phải desktop thu nhỏ.

## Mobile

- Giảm tương phản size vừa đủ.
- Giữ hierarchy.
- Tăng khả năng đọc.
- Có thể thay line-break.
- Không giữ negative space quá lớn.
- Không cắt emphasis sai nghĩa.

## Desktop

- Khai thác khoảng trắng.
- Dùng scale mạnh hơn.
- Tạo composition rõ.
- Kiểm soát line length.

---

# 15. TYPOGRAPHY VÀ HÌNH ẢNH

Typography là nhân vật chính. Hình ảnh là sân khấu.

Khi chữ nằm trên ảnh:

- Ảnh phải có vùng yên.
- Contrast phải đủ.
- Không dùng shadow để cứu chữ.
- Không phủ gradient mạnh nếu có thể xử lý ảnh tốt hơn.
- Không đặt Signal Composition lên ảnh quá bận.

---

# 16. TYPOGRAPHY VÀ KHOẢNG TRẮNG

Khoảng trắng tạo nhịp dừng, độ sang, sự yên, hierarchy và khả năng thở.

Signal Composition cần khoảng trắng nhiều hơn body. Accent Voice cần khoảng trắng nhiều hơn paragraph thường. Utility cần khoảng cách nhỏ, rõ và đều.

---

# 17. NHỮNG LỖI CẤM

Không:

- Dùng font đẹp nhưng sai vai.
- Dùng serif cho mọi thứ.
- Dùng italic quá nhiều.
- Biến mọi heading thành quote.
- Body quá nhỏ.
- Utility quá nhỏ.
- Nhiều font trong cùng một câu không có lý do.
- Dùng scale giống nhau cho mọi section.
- Quá nhiều composition trên một trang.
- Căn giữa toàn bộ trang.
- Ép mobile giữ nguyên desktop.
- Synthetic italic.
- Font loading trùng lặp.
- Dùng weight không tồn tại.

---

# 18. TYPE LAB BẮT BUỘC

Trước khi áp dụng typography system mới cho một trang, phải dựng Type Lab bằng đúng nội dung thật.

Type Lab cần có:

1. Hero.
2. Signal Composition.
3. Anchor bình thường.
4. Anchor có internal emphasis.
5. Body dài ba đoạn.
6. Accent Voice.
7. Utility.
8. CTA.
9. Mobile preview.
10. Desktop preview.

Không dùng alphabet hoặc lorem ipsum để duyệt.

---

# 19. QUY TRÌNH CHO TRANG MỚI

1. Đọc nội dung và xác định 5 vai.
2. Khóa hierarchy.
3. Dựng Type Lab.
4. Duyệt desktop và mobile.
5. Áp dụng vào page thật.
6. QA full-page ở 25–33% zoom.
7. Kiểm tra font loading, true italic, overflow, line-break và body readability.
8. Chỉ sau khi page thật đạt mới đưa vào standard.

---

# 19.1. QUAN HỆ VỚI IMPLEMENTATION EVIDENCE

`LANG_90_TYPOGRAPHY_COMPOSITION_APPROVED_IMPLEMENTATION_SNAPSHOT.md` được phân loại là:

```text
L4 — Implementation Evidence
```

Snapshot đó được dùng để:

- kiểm chứng một implementation đã được duyệt;
- tham khảo responsive behavior;
- đối chiếu font loading, true italic, line-break và scale thực tế.

Snapshot không được dùng để:

- thay đổi năm vai typography;
- thay đổi triết lý composition;
- mở rộng một font page-specific thành global authority;
- ghi đè tài liệu canonical này.

---

# 20. SEMANTIC COMPONENTS ĐỀ XUẤT

```tsx
<EssenceDisplay />
<EssenceAnchor />
<EssenceBody />
<EssenceAccent />
<EssenceUtility />
<EssenceSignalComposition />
```

Không bắt buộc mọi trang dùng cùng một component cứng. Điều cần dùng chung là vai, logic, scale relationship, quy tắc emphasis và QA.

---

# 21. CHECKLIST DUYỆT

## Hero
- Có câu chuyện thị giác.
- Line-break đúng nghĩa.
- Không tranh Signal.

## Signal
- Mạnh nhất.
- Có chuyển giọng.
- Có khoảng trắng.
- Không giống Hero phóng to.

## Anchor
- Rõ.
- Ổn định.
- Không quá thơ.

## Body
- Dễ đọc.
- Đủ lớn.
- Không mảnh.
- Line length tốt.

## Accent
- Ít.
- Đúng chỗ.
- True italic.

## Utility
- Rõ.
- Nhất quán.
- Không quá nhỏ.

## Full page
- Hierarchy rõ khi zoom nhỏ.
- Không mọi section đều mạnh.
- Typography và hình ảnh không tranh nhau.
- Trang có nhịp thở.

---

# 22. CÂU CHỐT

> Display để được nhớ.
> Anchor để định hướng.
> Reading để hiểu.
> Accent để cảm.
> Utility để hành động.
>
> Signal là nơi năm vai cùng hội tụ thành một khoảnh khắc.
