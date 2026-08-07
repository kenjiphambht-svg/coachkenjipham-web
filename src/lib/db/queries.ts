// ============================================================
// Truy vấn dùng cho màn hình admin.
//
// LUẬT CỦA FILE NÀY:
//   Không hàm nào ở đây JOIN sang hatmam_child_profiles. Muốn đọc dữ liệu
//   trẻ em phải gọi riêng getChildProfile() với lý do nghiệp vụ rõ ràng.
//   Đây là yêu cầu "không JOIN mặc định" của work order B0.
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';

import { toMonthKey } from '@/lib/domain/capacity';
import {
  LANG_DEFAULT_MONTHLY_SLOTS,
  LANG_SLOT_HOLDING_STATUSES,
  type HatMamStatus,
  type LangStatus,
} from '@/lib/domain/states';

export interface LangApplicationRow {
  id: string;
  order_code: string;
  status: LangStatus;
  applicant_name: string;
  applicant_contact: string;
  target_session_month: string | null;
  q1_situation: string;
  q2_level: string;
  q3_prior_help: string;
  q4_want: string;
  q5_openness: string;
  q6_extra: string | null;
  decline_reason: string | null;
  decided_at: string | null;
  scheduled_at: string | null;
  created_at: string;
}

export interface HatMamOrderRow {
  id: string;
  order_code: string;
  status: HatMamStatus;
  package: string;
  parent_name: string;
  parent_contact: string;
  created_at: string;
}

export interface ContactMessageRow {
  id: string;
  name: string;
  contact: string;
  message: string;
  is_handled: boolean;
  created_at: string;
}

const LANG_LIST_COLUMNS =
  'id, order_code, status, applicant_name, applicant_contact, target_session_month, created_at';

export async function listLangApplications(
  db: SupabaseClient,
  filter?: { status?: LangStatus }
) {
  let query = db
    .from('lang_applications')
    .select(LANG_LIST_COLUMNS)
    .order('created_at', { ascending: false });

  if (filter?.status) query = query.eq('status', filter.status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Pick<
    LangApplicationRow,
    'id' | 'order_code' | 'status' | 'applicant_name' | 'applicant_contact' | 'target_session_month' | 'created_at'
  >[];
}

export async function getLangApplication(db: SupabaseClient, id: string) {
  const { data, error } = await db
    .from('lang_applications')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as LangApplicationRow | null) ?? null;
}

export async function listHatMamOrders(db: SupabaseClient) {
  // CỐ Ý chỉ chọn cột của đơn. Không chạm hatmam_child_profiles.
  const { data, error } = await db
    .from('hatmam_orders')
    .select('id, order_code, status, package, parent_name, parent_contact, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as HatMamOrderRow[];
}

export async function listContactMessages(db: SupabaseClient) {
  const { data, error } = await db
    .from('contact_messages')
    .select('id, name, contact, message, is_handled, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ContactMessageRow[];
}

/**
 * Đọc hồ sơ trẻ em. Hàm RIÊNG, không nằm trong bất kỳ truy vấn danh sách nào.
 * Gọi hàm này nghĩa là đang cố ý mở dữ liệu nhạy cảm nhất của hệ.
 */
export async function getChildProfile(db: SupabaseClient, orderId: string) {
  const { data, error } = await db
    .from('hatmam_child_profiles')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Đếm suất Lặng đã dùng của một tháng.
 * Đếm theo target_session_month (tháng DIỄN RA phiên), không theo created_at.
 */
export async function countLangSlotsUsed(db: SupabaseClient, month: Date | string) {
  const monthKey = toMonthKey(month);
  const { count, error } = await db
    .from('lang_applications')
    .select('id', { count: 'exact', head: true })
    .eq('target_session_month', monthKey)
    .in('status', LANG_SLOT_HOLDING_STATUSES as unknown as string[]);
  if (error) throw error;
  return { monthKey, usedSlots: count ?? 0 };
}

export async function getMonthlyLimit(db: SupabaseClient, month: Date | string) {
  const monthKey = toMonthKey(month);
  const { data, error } = await db
    .from('lang_capacity')
    .select('max_slots')
    .eq('month', monthKey)
    .maybeSingle();
  if (error) throw error;
  return (data?.max_slots as number | undefined) ?? LANG_DEFAULT_MONTHLY_SLOTS;
}

export async function getLangStatusCounts(db: SupabaseClient) {
  const { data, error } = await db.from('lang_applications').select('status');
  if (error) throw error;
  const counts: Partial<Record<LangStatus, number>> = {};
  for (const row of (data ?? []) as { status: LangStatus }[]) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

export async function getHatMamStatusCounts(db: SupabaseClient) {
  const { data, error } = await db.from('hatmam_orders').select('status');
  if (error) throw error;
  const counts: Partial<Record<HatMamStatus, number>> = {};
  for (const row of (data ?? []) as { status: HatMamStatus }[]) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

export async function countUnhandledMessages(db: SupabaseClient) {
  const { count, error } = await db
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('is_handled', false);
  if (error) throw error;
  return count ?? 0;
}
