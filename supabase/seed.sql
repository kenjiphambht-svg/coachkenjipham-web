-- ============================================================
-- DỮ LIỆU GIẢ cho môi trường thử (essence-staging).
--
-- MỌI dòng dưới đây phải NHÌN LÀ BIẾT GIẢ NGAY:
--   · tên luôn có chữ "Test"
--   · email luôn @example.com (tên miền dành riêng cho ví dụ, RFC 2606)
--   · số điện thoại dùng dải 0900000xxx không có thật
-- TUYỆT ĐỐI không dùng dữ liệu của người thật ở đây.
--
-- Chạy SAU 0001_init.sql. Chạy lại được nhiều lần (xoá sạch rồi chèn lại).
-- ============================================================

begin;

-- Dọn sạch trước, để chạy lại không bị trùng mã đơn.
delete from audit_log;
delete from consents;
delete from publications;
delete from payments;
delete from hatmam_child_profiles;
delete from hatmam_orders;
delete from lang_applications;
delete from lang_capacity;
delete from contact_messages;

-- ---------- Giới hạn suất: tháng này để mặc định, tháng sau Kenji hạ còn 3 ----------
insert into lang_capacity (month, max_slots, note) values
  (date_trunc('month', now() + interval '1 month')::date, 3, 'Tháng sau Kenji đi vắng nửa đầu tháng — GIẢ LẬP');

-- ---------- 5 hồ sơ Lặng ở 5 trạng thái khác nhau ----------
insert into lang_applications
  (order_code, status, q1_situation, q2_level, q3_prior_help, q4_want, q5_openness, q6_extra,
   applicant_name, applicant_contact, target_session_month, decided_at, decline_reason)
values
  -- 1. Mới gửi, chưa ai đọc
  ('LANG90-TEST01', 'submitted',
   'Đây là dữ liệu thử. Tôi đang thấy mọi thứ rối và không biết bắt đầu từ đâu.',
   'A', 'A', 'Muốn nhìn rõ hơn mình đang đứng ở đâu.', 'A', null,
   'Nguyễn Văn Test Một', 'test01@example.com',
   null, null, null),

  -- 2. Đang đọc
  ('LANG90-TEST02', 'under_review',
   'Đây là dữ liệu thử. Công việc và gia đình đang kéo về hai phía.',
   'B', 'C', 'Một hướng đi rõ ràng hơn cho sáu tháng tới.', 'B', 'Tôi hơi ngại nói chuyện qua video.',
   'Trần Thị Test Hai', 'test02@example.com',
   null, null, null),

  -- 3. Đã nhận, chưa phát link thanh toán (chưa chiếm suất)
  ('LANG90-TEST03', 'accepted',
   'Đây là dữ liệu thử. Tôi vừa nghỉ việc và chưa biết bước tiếp theo.',
   'A', 'A', 'Bớt hoang mang, có một việc cụ thể để làm.', 'A', null,
   'Lê Văn Test Ba', 'test03@example.com',
   date_trunc('month', now())::date, now() - interval '2 days', null),

  -- 4. Chờ thanh toán — ĐANG CHIẾM 1 suất của tháng này
  ('LANG90-TEST04', 'awaiting_payment',
   'Đây là dữ liệu thử. Mối quan hệ mười năm vừa kết thúc.',
   'B', 'B', 'Hiểu vì sao mình cứ lặp lại một kiểu quan hệ.', 'A', null,
   'Phạm Thị Test Bốn', '0900000004',
   date_trunc('month', now())::date, now() - interval '3 days', null),

  -- 5. Đã từ chối, kèm lý do
  ('LANG90-TEST05', 'declined',
   'Đây là dữ liệu thử. Tôi muốn có người nghe mình nói mỗi tuần.',
   'D', 'B', 'Một người lắng nghe đều đặn.', 'C', null,
   'Hoàng Văn Test Năm', 'test05@example.com',
   null, now() - interval '5 days',
   'DỮ LIỆU THỬ — điều bạn đang cần gần với trị liệu dài hạn hơn là một phiên Lặng.');

-- ---------- 3 đơn Hạt Mầm ----------
insert into hatmam_orders (order_code, status, package, parent_name, parent_contact) values
  ('HATMAM-TEST01', 'submitted',     'goi-1', 'Ngô Thị Test Sáu',   'test06@example.com'),
  ('HATMAM-TEST02', 'paid',          'goi-2', 'Đỗ Văn Test Bảy',    '0900000007'),
  ('HATMAM-TEST03', 'in_production', 'goi-1', 'Bùi Thị Test Tám',   'test08@example.com');

-- ---------- 2 hồ sơ trẻ em GIẢ, nối vào 2 đơn đã trả tiền ----------
insert into hatmam_child_profiles
  (order_id, child_name, birth_date, birth_time, birth_time_known, birth_place, family_context)
select id, 'Bé Test A', date '2021-03-15', time '09:30', true, 'Thành phố Thử Nghiệm',
       'DỮ LIỆU THỬ — bé hay để ý chi tiết nhỏ, cần thời gian làm quen chỗ lạ.'
from hatmam_orders where order_code = 'HATMAM-TEST02';

insert into hatmam_child_profiles
  (order_id, child_name, birth_date, birth_time, birth_time_known, birth_place, family_context)
select id, 'Bé Test B', date '2023-08-01', null, false, 'Thành phố Thử Nghiệm',
       'DỮ LIỆU THỬ — ba mẹ không nhớ chính xác giờ sinh.'
from hatmam_orders where order_code = 'HATMAM-TEST03';

-- ---------- Thanh toán ----------
insert into payments (subject, subject_id, amount_vnd, status, bank_ref, confirmed_at)
select 'hatmam', id, 3500000, 'confirmed', 'GIA-LAP-REF-002', now() - interval '4 days'
from hatmam_orders where order_code = 'HATMAM-TEST02';

insert into payments (subject, subject_id, amount_vnd, status, bank_ref, confirmed_at)
select 'lang', id, 10000000, 'pending', null, null
from lang_applications where order_code = 'LANG90-TEST04';

-- ---------- Đồng ý ----------
insert into consents (subject, subject_id, consent_type, granted, granted_at)
select 'lang', id, 'pham_vi_coaching', true, created_at
from lang_applications where order_code in ('LANG90-TEST03', 'LANG90-TEST04');

-- ---------- Tin nhắn liên hệ ----------
insert into contact_messages (name, contact, message, is_handled) values
  ('Vũ Thị Test Chín', 'test09@example.com',
   'DỮ LIỆU THỬ — cho hỏi ấn phẩm Hạt Mầm có làm cho bé 8 tuổi không ạ?', false),
  ('Đặng Văn Test Mười', '0900000010',
   'DỮ LIỆU THỬ — tôi muốn hỏi thêm về phiên Lặng trước khi đăng ký.', false),
  ('Mai Thị Test Mười Một', 'test11@example.com',
   'DỮ LIỆU THỬ — đã nhận được ấn phẩm rồi, cảm ơn anh.', true);

-- ---------- Vài dòng audit ----------
insert into audit_log (actor, action, entity_type, entity_id, from_state, to_state, reason)
select 'human:seed (DỮ LIỆU THỬ)', 'lang.submitted->under_review', 'lang_application', id,
       'submitted', 'under_review', null
from lang_applications where order_code = 'LANG90-TEST02';

insert into audit_log (actor, action, entity_type, entity_id, from_state, to_state, reason)
select 'human:seed (DỮ LIỆU THỬ)', 'lang.under_review->accepted', 'lang_application', id,
       'under_review', 'accepted', null
from lang_applications where order_code = 'LANG90-TEST03';

insert into audit_log (actor, action, entity_type, entity_id, from_state, to_state, reason)
select 'human:seed (DỮ LIỆU THỬ)', 'lang.accepted->awaiting_payment', 'lang_application', id,
       'accepted', 'awaiting_payment', null
from lang_applications where order_code = 'LANG90-TEST04';

insert into audit_log (actor, action, entity_type, entity_id, from_state, to_state, reason)
select 'system:seed (DỮ LIỆU THỬ)', 'hatmam.awaiting_payment->paid', 'hatmam_order', id,
       'awaiting_payment', 'paid', 'Tín hiệu ngân hàng giả lập'
from hatmam_orders where order_code = 'HATMAM-TEST02';

commit;
