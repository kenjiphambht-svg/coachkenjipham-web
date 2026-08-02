// ============================================================
// Test RLS — work order B0 mục 7, ca 4:
// "truy cập hatmam_child_profiles không quyền → bị chặn"
//
// ĐÂY LÀ TEST DUY NHẤT CẦN CƠ SỞ DỮ LIỆU THẬT.
// RLS do Postgres thực thi, không mô phỏng được bằng test đơn vị.
//
// Cách chạy:
//   1. Đã chạy supabase/migrations/0001_init.sql và supabase/seed.sql
//   2. Đặt hai biến môi trường (lấy từ Supabase Dashboard):
//        NEXT_PUBLIC_SUPABASE_URL
//        NEXT_PUBLIC_SUPABASE_ANON_KEY
//   3. npm run test
//
// Không có biến → test tự SKIP kèm lời nhắc, KHÔNG báo pass giả.
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const hasDb = Boolean(url && anonKey);

// describe.skipIf: không có CSDL thì bỏ qua, và vitest in rõ là đã bỏ qua —
// khác hẳn với việc lặng lẽ báo pass.
describe.skipIf(!hasDb)('ca 4 — RLS chặn đọc hồ sơ trẻ em khi không có quyền', () => {
  const anon = () => createClient(url as string, anonKey as string);

  it('khách chưa đăng nhập KHÔNG đọc được hatmam_child_profiles', async () => {
    const { data, error } = await anon().from('hatmam_child_profiles').select('*');

    // Hai kết quả đều là "bị chặn" hợp lệ, tuỳ cấu hình Postgres trả về:
    //  · error  → bị từ chối thẳng
    //  · [] rỗng → RLS lọc sạch, không lộ dòng nào
    // Điều KHÔNG được phép xảy ra: trả về dữ liệu thật.
    if (error) {
      expect(error).toBeTruthy();
    } else {
      expect(data).toEqual([]);
    }
  });

  it('khách chưa đăng nhập KHÔNG ghi được vào hatmam_child_profiles', async () => {
    const { error } = await anon()
      .from('hatmam_child_profiles')
      .insert({ order_id: '00000000-0000-0000-0000-000000000000', child_name: 'Bé Test Chèn Lậu' });
    expect(error).toBeTruthy();
  });

  it.each([
    'lang_applications',
    'hatmam_orders',
    'contact_messages',
    'payments',
    'audit_log',
    'admin_users',
    'consents',
    'publications',
  ])('khách chưa đăng nhập KHÔNG đọc được bảng %s', async (table) => {
    const { data, error } = await anon().from(table).select('*');
    if (error) {
      expect(error).toBeTruthy();
    } else {
      expect(data).toEqual([]);
    }
  });
});

describe.skipIf(hasDb)('ca 4 — bỏ qua vì chưa có kết nối cơ sở dữ liệu', () => {
  it('nhắc cách chạy test RLS', () => {
    console.warn(
      '\n⚠️  Test RLS (ca 4) CHƯA CHẠY — thiếu NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.\n' +
        '   Đây KHÔNG phải là pass. Xem hướng dẫn ở đầu tests/rls-child-profiles.test.ts.\n'
    );
    expect(hasDb).toBe(false);
  });
});
