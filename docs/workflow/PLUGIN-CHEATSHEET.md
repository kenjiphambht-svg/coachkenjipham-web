# Thực đơn bỏ túi — 3 plugin knowledge-work (design, productivity, small-business)

Cài ở tầng người dùng (không thuộc repo này), cấu hình Essence nằm ở
`~/.claude/CLAUDE.md` trên máy Kenji — nạp tự động vào mọi phiên Claude Code.

## Cách gọi

- Gõ **"/"** để mở thực đơn lệnh, chọn theo tên (vd. `design:design-critique`).
- Hoặc nói tự nhiên bằng tiếng Việt/tiếng Anh — Claude tự chọn kỹ năng phù hợp,
  không cần nhớ tên lệnh.

## Tình huống Essence → lệnh nên dùng

| Tình huống | Gọi gì |
|---|---|
| Sửa xong 1 trang web, soi trước khi Kenji duyệt | `design:design-critique` + `design:accessibility-review` |
| Viết xong bài Ghi Chép / email khách, soát giọng + từ cấm | `design:ux-copy` (dán đoạn văn, nhắc "kiểm giọng thương hiệu Essence") |
| Sáng thứ Hai, nhìn tổng quan tuần | `small-business:monday-brief` ("Monday brief", "tuần này thế nào") |
| Chiều thứ Sáu, tổng kết tuần | `small-business:friday-brief` ("Friday recap", "tuần này ra sao") |
| Muốn Claude nhớ việc cần làm | `productivity:task-management` (nói thẳng việc cần làm, Claude tự thêm vào TASKS.md) |
| Muốn Claude nhớ người/thuật ngữ/dự án mới | `productivity:memory-management` (nói "nhớ giúp anh: X là Y") |
| Bắt đầu dùng productivity lần đầu (tạo TASKS.md, dashboard) | `productivity:start` |
| Kiểm tra dòng tiền / margin (nếu có kết nối QuickBooks) | `small-business:cash-flow-snapshot`, `small-business:margin-analyzer` |
| Soát hợp đồng trước khi ký | `small-business:contract-review` |

## Ghi chú cuối

Các skill tự kích hoạt khi Claude thấy liên quan đến ngữ cảnh câu hỏi — không
bắt buộc phải gõ đúng tên lệnh. Cứ nói việc cần làm bằng lời tự nhiên.

Luật ưu tiên: khi hướng dẫn trong plugin mâu thuẫn với `AGENTS.md` /
`PLAYBOOK.md` / danh sách từ cấm của Essence, luật Essence luôn thắng — xem
chi tiết trong `~/.claude/CLAUDE.md`.
