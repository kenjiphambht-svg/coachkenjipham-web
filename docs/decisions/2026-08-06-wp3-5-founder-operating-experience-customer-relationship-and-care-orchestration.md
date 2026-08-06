# WP3.5 — Founder Operating Experience, Customer Relationship & Care Orchestration

**Ngày:** 06/08/2026  
**Trạng thái:** FOUNDER DECISIONS LOCKED — documentation only  
**Owner:** Kenji Phạm  

## Locked Founder decisions

1. Lớp quản lý chính thức dùng tên **Quan hệ**.
2. **Chăm sóc & Phục hồi** được gộp trong cùng một workspace ở WP3.5.
3. Safe operational notes được phép, nhưng phải có purpose, giới hạn nội dung, retention, audit và visibility boundary.
4. Daily queue dùng **deterministic priority bucket + deadline/risk facts**; tuyệt đối không customer score.
5. **Next Best Care đứng trước và tạo điều kiện cho Next Best Offer**; có lớp Cánh cửa tiếp theo cho Founder review, không auto-send hoặc sales scoring.

## Information architecture

- Hôm nay — `/admin`
- Quan hệ — `/admin/quan-he`
- Hành trình — `/admin/hanh-trinh`
- Chăm sóc & Phục hồi — `/admin/cham-soc`

Product workspaces Lặng, Hạt Mầm, Thanh toán, Xuất bản, Xóa dữ liệu, Cài đặt và Launch Core tiếp tục giữ transition authority và operational specialization.

## Daily priority order

1. Safety, privacy và recovery khẩn cấp.
2. Human Decision Gate.
3. Promise/SLA/deadline sắp đến hạn hoặc quá hạn.
4. Support và care task đang mở.
5. Waiting, quiet by design hoặc suppression active.
6. Cánh cửa tiếp theo đủ điều kiện để Founder review.

Queue phải giải thích được vì sao một item xuất hiện ở vị trí đó bằng deadline, risk, current state, owner, consent, suppression và Human Decision Gate. Không dùng lead score, customer score, conversion probability, psychological readiness, inferred value hoặc child profile.

## Safe operational note boundary

Được phép ghi fact, decision, promise, safe summary, owner, due date và next review date.

Không được ghi raw intake không cần thiết, child data, diagnosis, psychological inference, hidden need, bank secret, token, provider payload hoặc nhãn phán xét khách hàng.

## Source of full decision detail

Đọc cùng:

- `2026-08-06-wp3-5-founder-operating-care-contract.md`
- `2026-08-06-wp3-5-founder-decision-lock.md`
- `2026-08-06-wp3-5-next-best-care-and-offer-correction.md`

## Next allowed step

WP3.5 đủ điều kiện để:

- consistency review;
- đóng documentation dependency của PR #137;
- soạn WP3.5-A Synthetic Founder Review Experience Work Order.

Chưa được phép viết runtime, migration, route, provider integration, dùng real data, merge hoặc deploy production.
