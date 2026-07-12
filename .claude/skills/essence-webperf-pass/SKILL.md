# Essence Webperf Pass

Use this skill when measuring or reviewing page performance (Core Web Vitals, Lighthouse) — required before Kenji approves any new page.

## Read First

- `AGENTS.md`
- `docs/brand/BRAND_SYSTEM_INDEX.md` (brand/system entry point)
- `docs/website/master-plan/04_HOMEPAGE_10000_USD_SPEC.md` (mục 4 — hiệu năng là yêu cầu visual)
- `docs/website/master-plan/13_QA_CHECKLIST_10000_USD_WEBSITE.md` (nhóm 6)

## Ngưỡng pass/fail (đo mobile, không ước lượng bằng mắt)

| Chỉ số | Pass | Fail |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | ≥ 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 | ≥ 0.1 |
| INP (Interaction to Next Paint) | < 200ms | ≥ 200ms |
| Lighthouse Performance (mobile) | ≥ 90 | < 90 |
| Lighthouse Accessibility | ≥ 90 | < 90 |

Fail bất kỳ ô nào = ghi rõ trong phiếu, không im lặng trình duyệt. "Nhanh là một phần của sang" — trang đẹp mà ì trên 4G là fail Visual QA.

## Cách đo (không cài package mới)

1. Build production local: `npm run build && npm run start` (KHÔNG đo trên `npm run dev` — dev mode luôn chậm hơn thật).
2. Mở Chrome có sẵn → DevTools (F12) → tab **Lighthouse** → chọn Mode: Navigation, Device: **Mobile**, categories Performance + Accessibility → Analyze.
3. Với trang đã deploy (route noindex trên domain thật): dùng PageSpeed Insights (pagespeed.web.dev) dán URL — cho cả số liệu lab lẫn field nếu có.
4. Chạy 2–3 lần lấy số ổn định; tab ẩn danh để tránh extension làm nhiễu.

## Khi nào bắt buộc chạy

- Trước MỖI lần trình Kenji duyệt một trang mới hoặc trang rebuild.
- Sau khi thêm ảnh thật vào slot chờ (ảnh là nguồn LCP/CLS phổ biến nhất).
- Không bắt buộc cho PR docs-only.

## Cách đọc kết quả — 3 chỗ hay hỏng

- **LCP cao:** thường do ảnh hero — kiểm ảnh đã nén (WebP/AVIF), đúng kích thước hiển thị, không lazy-load ảnh trên màn đầu.
- **CLS cao:** ảnh/khối thiếu kích thước khai báo trước — mọi `<Image>` phải có width/height hoặc `fill` trong container có aspect cố định (các ImageSlot/MockupSlot đã làm đúng kiểu này).
- **INP cao:** JS chặn tương tác — kiểm hiệu ứng reveal có chạy quá dày, script bên thứ ba.

## Guardrails

- Đo bằng công cụ, dán số vào phiếu — không ghi "cảm giác nhanh".
- Không cài package/lib đo mới (Lighthouse trong Chrome là đủ).
- Không "tối ưu" bằng cách xóa hiệu ứng/nội dung đã duyệt — fail thì báo, Kenji quyết đánh đổi.
- Không đụng route live ngoài scope khi sửa hiệu năng.
