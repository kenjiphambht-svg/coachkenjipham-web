// ============================================================
// Cờ trạng thái ấn phẩm "Bản Sắc Giao Mùa" (/an-pham-ban-sac-giao-mua).
// Cùng cơ chế/shape với src/config/khamPhaLaunch.ts (tái dùng pattern,
// không viết lại từ đầu) — giá trị riêng vì đây là sản phẩm khác.
//
// 'preview'  — chưa mở bán. Khối giá hiện "Giá công bố khi mở cửa";
//              mọi CTA gói là nút VIỀN "Ghi danh sớm" dẫn tới form thu
//              email (không đổi layout khi chuyển trạng thái).
// 'live'     — đã mở bán. Hiện giá + link form đặt thật từ PRICING bên
//              dưới; CTA gói đổi thành nút vàng như Hạt Mầm.
//
// KHÔNG tự đổi 'preview' → 'live' khi chưa đủ 6 điều kiện trong
// docs/product/LAUNCH_CHECKLIST_GIAO_MUA.md — kể cả khi Kenji yêu cầu
// nhanh trong lúc hứng. Đọc file đó trước khi đổi giá trị dưới đây.
// ============================================================

export type LineStatus = "preview" | "live";

export const LINE_STATUS: LineStatus = "preview";

export const GIAO_MUA_PRICING = {
  goi1: {
    name: "Gói 1 — Món Quà Thấu Hiểu",
    // Điền giá thật khi chuyển 'live', ví dụ: "2.500.000đ"
    priceDisplay: "",
    // Điền link form đặt thật khi chuyển 'live' (Tally hoặc tương đương)
    formUrl: "",
  },
  goi2: {
    name: "Gói 2 — Trò Chuyện Cùng Kenji",
    priceDisplay: "",
    formUrl: "",
  },
};
