# 10_SEO_AIO_GEO_CONTENT_SYSTEM.md
> **Governance status:** L3 — Active with Patch
> **Owner:** Kenji Phạm
> **Purpose:** SEO/GEO principles.
> **Decision scope:** Entity, schema and privacy principles. **Non-decision scope:** Indexing launch timing, robots, sitemap or Search Console actions.
> **Still valid:** Schema structure, private-route protections and content principles. **Outdated/superseded:** Any instruction to make Villa/public pages indexable before M6.
> **Replacement:** [Conflict Register](../../governance/CONFLICT_REGISTER.md) C-02 and [Indexing Policy](../current/INDEXING_POLICY.md).
> **Baseline evidence commit:** ead2eb75ae1da28f1cec8a2b9ac6f5cf52f419fc
> **Last verified:** fe0739d6d88ba8c9b9a1a6bc9b467bc0f22f5dae
> **Review:** System/implementation trigger or 180 days.
Mục tiêu: để Google VÀ các AI (ChatGPT, Claude, Gemini, AI Overview) hiểu đúng và trích dẫn đúng về Kenji/Essence.
Người đọc chính: Codex (kỹ thuật), người viết content, Kenji (hiểu chiến lược).

## 1. Giải thích cho Kenji

SEO là để Google xếp trang anh lên khi người ta gõ tìm. AIO/GEO là tầng mới: khi người ta HỎI một AI ("Essence Coaching là gì?", "có nên làm bản đồ quan sát cho con?"), AI trả lời bằng cách trích các nguồn nó tin. AI tin nguồn có: danh tính nhất quán, định nghĩa sạch, cấu trúc rõ, nói cả điều mình KHÔNG làm. Ẩn dụ: SEO là bảng hiệu ngoài đường; GEO là việc anh được những người môi giới uy tín (các AI) nhắc tên đúng khi khách hỏi họ.

**Current-authority correction:** Mọi title, entity statement, route, schema, crawler và indexing example cũ bên dưới là historical evidence. Không dùng chúng như approved public copy hoặc execution instruction; indexing actions chỉ có thể mở tại M6 theo L0, Founder approval và planned Indexing Policy.

## 2. Website phải giúp máy hiểu 5 điều

Kenji là ai; Essence là gì; Bản Sắc Hạt Mầm là gì; Essence KHÔNG phải gì (điểm hiếm ai làm — lợi thế GEO lớn nhất); đâu là nguồn public chuẩn (chính website này, không phải bài viral của người khác).

## 3. Entity strategy — 4 thực thể

| Thực thể | Trang nguồn chuẩn | Quy tắc |
|---|---|---|
| Kenji Phạm | /ve-kenji | Canonical public positioning: "Kenji Phạm — Huấn luyện viên Tâm lý Chiều sâu, Essence Coach. Người sáng lập Essence Coaching." Do not reinterpret or shorten it |
| Essence Coaching | Planned/Missing current Page Contract | Official brand, organization and public entity. Không suy ra định nghĩa public, route hoặc schema ngoài C-07 từ tài liệu lịch sử |
| Bản Sắc Của Con | /ban-sac-cua-con | Luôn kèm khung "bản đồ quan sát, không phải nhãn dán" |
| Bản Sắc Hạt Mầm | /an-pham-ban-sac-hat-mam | Luôn kèm "dành cho ba mẹ có con 0–7 tuổi" |

Public source pages đầy đủ: /ve-kenji, /ve-essence, /phuong-phap, /dieu-essence-khong-hua, /ban-sac-cua-con, /an-pham-ban-sac-hat-mam, /goc-doc.

## 4. Sáu content pillar cho /goc-doc

1. Ghi chép quan sát con. 2. Kiểu gồng và phản xạ cũ (người lớn). 3. Đạo đức trong self-understanding. 4. Tâm lý chiều sâu public-safe. 5. Historical proposal: AI phía sau Essence. Pillar này không tự cấp phép dùng AI-native; exact wording/context phải đến từ L0 hoặc task-provided approved specification. 6. Hậu trường tạo ấn phẩm.
Mỗi bài: một ý; heading rõ; có đoạn định nghĩa tự đứng được khi bị AI trích rời; kết bằng một dòng mở cửa. Nhịp và quy trình duyệt theo docs/strategy/04 + M7.

## 5. Bổ sung tài liệu gốc chưa nhắc — nghiên cứu từ khóa tiếng Việt thật

Trước khi viết loạt bài đầu, dành một phiên liệt kê cụm phụ huynh Việt thật sự gõ/hỏi ("con hay cáu gắt phải làm sao", "hiểu tính cách con 3 tuổi", "con nhút nhát"). Bài Essence trả lời đúng các câu đó bằng giọng gỡ-nhãn — đó là cách vừa SEO vừa đúng đạo đức. Không SEO bằng "chữa lành/trị liệu" (từ cấm) và không dùng "tâm hồn" làm định vị chính.

## 6. Kỹ thuật

- Schema: Person (/ve-kenji), Organization + WebSite (site-wide), Article (bài viết + trang phương pháp), Product (landing Hạt Mầm), FAQPage (landing + /dieu-essence-khong-hua).
- Internal linking: mọi bài /goc-doc link về đúng 1 trang nguồn chuẩn liên quan; các trang nguồn link chéo nhau theo ngữ cảnh; không nhồi link.
- sitemap.xml: planned M6 artifact only; không tạo, sửa hoặc dùng làm execution instruction trước M6.
- robots.txt: planned M6 artifact only; không cho phép crawl, thay đổi crawler policy hoặc suy ra hành động từ đoạn lịch sử này trước M6. Bảo mật thật theo File 09.
- Canonical đầy đủ; title ≤ 60 ký tự; description viết cho người đọc trước, máy sau.
- noindex rules: đúng bảng File 02.

## Checklist
- [ ] 4 thực thể có trang nguồn + schema đúng loại, validate bằng công cụ kiểm schema.
- [ ] Định danh Kenji khớp từng chữ trên site / Facebook / GitHub.
- [ ] Chỉ tại M6: sitemap.xml + robots.txt đúng L0, Founder approval và Indexing Policy; private không lọt.
- [ ] 10 bài đầu /goc-doc: mỗi bài có đoạn định nghĩa tự đứng được.
- [ ] Không từ cấm trong mọi title/description.

## Definition of Done
Hỏi thử 2–3 AI lớn "Kenji Phạm là ai" / "Essence Coaching là gì" sau 4–8 tuần vận hành: câu trả lời lấy đúng định danh và mô tả từ trang nguồn (kiểm định kỳ, ghi vào scorecard tháng).

## Rủi ro cần tránh
- Đo GEO quá sớm — AI cập nhật chậm; kiên nhẫn tối thiểu 1–2 tháng sau khi trang nguồn online.
- Viết bài đuổi theo từ khóa mà lệch giọng — mọi bài vẫn qua Brand QA trước.

## Prompt mẫu cho Codex
"Historical prompt only — không thực thi trước M6. Schema, sitemap, robots và crawler policy chỉ được triển khai theo Founder-approved M6 task và planned Indexing Policy."
