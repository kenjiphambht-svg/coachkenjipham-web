# ESSENCE — TÓM TẮT NGỮ CẢNH TRANG CHỦ (tính đến 19/07/2026)

Dùng để: (1) mở chat Web Studio mới, dán nguyên văn để tiếp tục không mất mạch.
(2) lưu vào repo `docs/website/HANDOFF-trang-chu.md` để Claude Code đọc trước
mỗi task, tránh lặp lại lỗi đã biết.

---

## BỐI CẢNH DỰ ÁN

Kenji Phạm — huấn luyện viên Tâm lý Chiều sâu, thương hiệu Essence Coaching.
Website coachkenjipham.com, repo `coachkenjipham-web` (Next.js, Vercel).
Đang xây trang chủ tại route `/trang-chu-v2` (noindex, chưa migrate lên `/`).

Vai trò: "Web Studio" (Claude trong claude.ai) = viết nội dung, đặc tả UX,
viết brief cho Claude Code. "Claude Code" (trong repo) = người thực thi code,
tuân theo `PLAYBOOK.md`/`BACKLOG.md`/`AGENTS.md` của repo. Kenji là người quyết
cuối, duyệt bằng mắt, và hiện đã cho phép Claude Code tự merge với PR THUẦN
HIỂN THỊ (đổi ảnh, màu, bố cục — không đụng route/logic/payment/dữ liệu trẻ em).

## NGUỒN SỰ THẬT — CHỈ MỘT, KHÔNG ĐƯỢC LỆCH

1. **Google Doc "TRANG CHỦ — Homepage v8"** (Kenji tự chỉnh) = gốc CHO CHỮ.
2. **`BAN-CHOT-v8-FINAL.md`** trên Drive (folder `01 Trang Chủ/01-noi-dung/`) =
   bản hợp nhất chữ (copy nguyên văn từ Google Doc) + ghi chú UX/nền/vàng.
   ĐÂY LÀ FILE DUY NHẤT gửi kèm brief cho Claude Code.

**BÀI HỌC ĐAU (đừng lặp lại):** Web Studio từng gõ lại nội dung theo trí nhớ
thay vì copy nguyên văn từ Google Doc → tạo ra bản sai, vô tình đẩy lên web
thật, rồi lại đoán nhầm "web đúng file sai" ở lượt sau — gây rối 3 vòng liền.
QUY TẮC TỪ NAY: mọi lần cập nhật `BAN-CHOT`, PHẢI fetch Google Doc và copy
nguyên văn. Mọi lần Kenji báo "web sai", PHẢI mở ảnh chụp thật đối chiếu từng
câu trước khi kết luận, không suy đoán.

## BỘ LUẬT THƯƠNG HIỆU (đã khoá, không đổi)

- 10 từ cấm: chữa lành, trị liệu, định mệnh, tần số, năng lượng vũ trụ,
  manifest, AI therapist, đổi đời, sứ mệnh linh hồn, tâm hồn.
- Màu: cream `#F1EFE8` / black `#1A1A1A` / gold `#E0C068`. Cấm nâu/sepia/xám.
- Tối đa 3 điểm vàng/trang (hiện tại trang chủ chỉ dùng 2 — đã bỏ nút vàng ⑨).
- Đúng 2 khối tối/trang chủ (③ Kiệt Tác, ⑦ An Định) + footer.
- AI: Kenji "phân tích và VIẾT" ấn phẩm — KHÔNG BAO GIỜ hạ thành "đọc/duyệt/
  rà soát/cẩn trọng". Đây là ranh giới tuyệt đối, đã bị vi phạm 1 lần, đã sửa.
- Chữ "gồng": dùng được khi đứng về phía HIỂU người đọc, không phải phía PHÁN.
- Luật "sắp mở": trang chưa có → chữ mờ trạng thái "(sắp mở)", KHÔNG dùng thẻ
  `<a>` thật (tránh soft 404 hại SEO).
- Câu kết mọi section: KHÔNG ra lệnh cho người đọc, chỉ mô tả trạng thái +
  trao quyền tự chọn.
- ICF: chỉ ghi "thực hành theo tiêu chuẩn ICF", không ghi cấp bằng/năm.
- Landing bán hàng (khác trang chủ): hình + khối phải sắp theo mạch KỂ CHUYỆN
  (mỗi khối = một cảnh, khối tối = nút thắt) — áp dụng khi làm Hạt Mầm/Lặng 90'.

## CẤU TRÚC TRANG CHỦ HIỆN TẠI (đã đảo, theo Essence Experience Bible)

Mạch cảm xúc: gọi cảm xúc (②) → KHOẢNG LẶNG (③, không phải gặp Kenji ngay) →
Kenji xuất hiện NHƯ CÂU TRẢ LỜI (④) → chọn cửa (⑤) → thấy nếp nhà (⑥) →
đích đến (⑦) → họ không hứa (⑧) → mời bước vào (⑨).

```
①Header ②Hero(kem) ③KIỆT TÁC(đen,H1) ④Kenji(kem) ⑤Hai Cửa(kem)
⑥Essence(kem) ⑦An Định(đen) →cầu ảnh→ ⑧Không hứa(kem) ⑨Ghi chép(kem) ⑩Footer(đen)
```

Toàn văn chữ mới nhất + ghi chú UX từng section: xem `BAN-CHOT-v8-FINAL.md`.

## ẢNH — 8 tấm, hầu hết đã chạy xong

kenji-portrait, kenji-pouring-tea, kenji-hero-window, kitchen-morning,
child-door-dusk, window-first-light (+mobile), bg-wall-dark, bg-hero-open,
bg-hero-light. Quy trình thả ảnh: Kenji chạy FLUX → lưu gốc Drive
`02-hinh-anh` → thả file vào `public/images/home/` qua chat Claude Code →
convert/gắn slot.

## TRẠNG THÁI NGAY LÚC DỪNG (19/07/2026)

Vừa gửi Claude Code: `BRIEF-dong-bo-v8-FINAL.md` + `BAN-CHOT-v8-FINAL.md`.
Brief này bắt Claude Code: (1) đối chiếu TOÀN BỘ ②→⑨ với FINAL, sửa mọi chỗ
lệch (đã phát hiện web đang chạy bản chữ CŨ HƠN bản chốt ở nhiều chỗ: ④ còn
câu "bản đồ biểu tượng" chưa bỏ, ⑤ thiếu chữ "mình" trong "để mình tồn tại",
⑥ sai hẳn bản — đang là bản cụt thay vì bản "nếp nhà"); (2) header thu gọn
padding; (3) nền mờ ⑥⑧⑨ (đã báo "đã thêm" 3 lần mà ảnh vẫn phẳng — lần này
bắt buộc chụp zoom chứng minh); (4) ⑨ bỏ khung + bố cục 2 CỬA song song
(Góc Đọc / Ebook) + câu kết mới; (5) ảnh OG mới có ảnh Kenji (đã dựng 1 lần,
nhưng thiếu ảnh người — cần làm đẹp hơn), giữ "by Kenji Phạm" trong mô tả.

**CHƯA NHẬN BÁO CÁO KẾT QUẢ BRIEF NÀY** — đây là việc cần làm tiếp khi mở chat mới.

## CÒN TREO (chưa làm, ghi nhớ)

- Câu "Tâm lý chiều sâu, những tấm bản đồ biểu tượng..." → dời sang `/ve-kenji`
  khi làm trang đó (chưa bắt đầu).
- Ebook "Bắt Đầu Từ Đâu?" đọc online: CHƯA có nội dung sách thật, đang "sắp mở".
  Khi có nội dung → cần dựng trang đọc, đổi từ "sắp mở" thành link sống.
- `/lien-he` cần mục "Hợp tác & đầu tư" (đã thêm ở PR trước, xác nhận còn đó).
- Sau khi trang chủ đóng hoàn toàn: chạy 10 câu Final Test (Experience Bible
  Ch.18) làm cổng QA cuối, rồi mới migrate `/trang-chu-v2` → `/` thật (bước
  này cần Kenji duyệt tường minh riêng, không tự động).
- Header/Footer dùng chung ~10 trang khác (ve-kenji, phuong-phap, lien-he,
  chinh-sach-rieng-tu, ban-sac-cua-ban, ban-sac-cua-con...) — các trang đó
  hiện là khung tạm, sẽ xây lại lần lượt SAU khi trang chủ xong, dùng lại
  header/footer đã chốt ở trang chủ (không cần dựng lại).
- Chưa dedupe thẻ `og:image` trùng (bug kiến trúc `_document.tsx` vs page
  `<SEO>` — đã giảm thiểu, chưa sửa triệt để, không gấp).

## QUY TRÌNH LÀM VIỆC (giữ nguyên)

B1 đọc tiến độ → B2 giao 3 lớp (nội dung/hình/UX) → B3 Kenji duyệt → B4 viết
brief Claude Code → B5 cập nhật trạng thái → B6 sang trang kế. Với trang chủ,
đang ở vòng lặp tinh chỉnh cuối trước khi đóng hẳn.

Prompt ngắn Kenji dùng khi thả ảnh mới (không cần viết dài):
```
Có ảnh mới trong public/images/home: [tên file].
Đổi tên/convert đúng chuẩn, gắn vào đúng SWAP SLOT, chụp ảnh QA,
build+lint pass thì merge luôn (thuần đổi ảnh, không đụng logic/route/payment).
```
