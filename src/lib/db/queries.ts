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
  target_delivery_month?: string | null;
  submission_validated_at?: string | null;
  payment_confirmed_at?: string | null;
  delivery_due_at?: string | null;
  revision_deadline_at?: string | null;
  created_at: string;
}

export interface PaymentRow {
  id: string;
  subject: 'lang' | 'hatmam';
  subject_id: string;
  amount_vnd: number;
  status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  bank_ref: string | null;
  confirmed_at: string | null;
  created_at: string;
}

export interface PaymentRequestRow {
  id: string;
  application_id?: string;
  order_id?: string;
  expires_at: string;
  revoked_at: string | null;
  reported_transfer_at: string | null;
  report_reference: string | null;
  created_at: string;
}

export interface HatMamPaymentEvidenceRow {
  id: string;
  payment_request_id: string;
  evidence_kind: 'synthetic_receipt' | 'manual_receipt_metadata';
  receipt_file_name: string;
  receipt_sha256: string;
  reported_amount_vnd: number;
  transfer_reference: string;
  created_at: string;
}

export interface HatMamSyntheticPublicationRow {
  order_id: string;
  status: 'draft' | 'revision_requested' | 'approved' | 'revoked';
  metadata: Record<string, unknown>;
  checksum_sha256: string;
  revision_reason: string | null;
  updated_at: string;
  created_at: string;
}

export interface HatMamSyntheticDeletionRunRow {
  request_id: string;
  status: 'previewed' | 'confirmation_attempted' | 'fail_closed' | 'retry_ready';
  affected_records: string[];
  execution_order: string[];
  attempts: number;
  last_result: string;
  updated_at: string;
  created_at: string;
}

export interface PublicationRow {
  id: string;
  order_id: string;
  token_expires_at: string | null;
  delivered_at: string | null;
  created_at: string;
}

export interface PublicationAssetRow {
  publication_id: string;
  storage_bucket: string;
  storage_object_path: string;
  content_sha256: string;
  created_at: string;
}

export interface AuditRow {
  id: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  from_state: string | null;
  to_state: string | null;
  reason: string | null;
  created_at: string;
}

export interface ReleaseGateRow {
  public_activation_enabled: boolean;
  deletion_workflow_ready: boolean;
  private_storage_ready: boolean;
  updated_at: string;
}

export interface DeletionRequestRow {
  id: string;
  subject_type: 'hatmam_order' | 'hatmam_publication' | 'lang_lead';
  subject_id: string;
  reason_code: string;
  status: 'received' | 'identity_verified' | 'approved' | 'executing' | 'completed' | 'failed' | 'rejected';
  requested_at: string;
  identity_verified_at: string | null;
  approved_at: string | null;
  execution_attempts: number;
  execution_evidence: Record<string, unknown>;
  last_error_code: string | null;
  completed_at: string | null;
}

export interface RetentionRuleRow {
  subject_type: 'hatmam_raw_intake' | 'hatmam_private_publication' | 'lang_private_room';
  retention_months: number;
  early_deletion_available: boolean;
  updated_at: string;
}

export interface OperationalSettingsRow {
  id: string;
  version: number;
  values: unknown;
  active: boolean;
  created_by: string;
  created_at: string;
  activated_at: string | null;
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
    .select('id, order_code, status, package, parent_name, parent_contact, target_delivery_month, submission_validated_at, payment_confirmed_at, delivery_due_at, revision_deadline_at, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as HatMamOrderRow[];
}

export async function getHatMamOrder(db: SupabaseClient, id: string) {
  const { data, error } = await db
    .from('hatmam_orders')
    .select('id, order_code, status, package, parent_name, parent_contact, target_delivery_month, submission_validated_at, payment_confirmed_at, delivery_due_at, revision_deadline_at, created_at')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as HatMamOrderRow | null) ?? null;
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

export async function getHatMamPackageSnapshot(db: SupabaseClient, orderId: string) {
  const { data, error } = await db
    .from('hatmam_package_snapshots')
    .select('package_code, package_name, package_version, amount_vnd, delivery_business_days, revision_window_days, raw_intake_retention_months, publication_retention_months, created_at')
    .eq('order_id', orderId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getLatestConsent(db: SupabaseClient, subject: string, subjectId: string) {
  const { data, error } = await db
    .from('consents')
    .select('consent_type, consent_version, granted, granted_at, evidence, created_at')
    .eq('subject', subject)
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listPayments(db: SupabaseClient, status?: PaymentRow['status']) {
  let query = db
    .from('payments')
    .select('id, subject, subject_id, amount_vnd, status, bank_ref, confirmed_at, created_at')
    .order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as PaymentRow[];
}

export async function getPaymentsForSubject(db: SupabaseClient, subject: PaymentRow['subject'], subjectId: string) {
  const { data, error } = await db
    .from('payments')
    .select('id, subject, subject_id, amount_vnd, status, bank_ref, confirmed_at, created_at')
    .eq('subject', subject)
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PaymentRow[];
}

export async function listLangPaymentRequests(db: SupabaseClient) {
  const { data, error } = await db
    .from('lang_payment_requests')
    .select('id, application_id, expires_at, revoked_at, reported_transfer_at, report_reference, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PaymentRequestRow[];
}

export async function listHatMamPaymentRequests(db: SupabaseClient) {
  const { data, error } = await db
    .from('hatmam_payment_requests')
    .select('id, order_id, expires_at, revoked_at, reported_transfer_at, report_reference, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PaymentRequestRow[];
}

export async function getHatMamPaymentRequestForOrder(db: SupabaseClient, orderId: string) {
  const { data, error } = await db
    .from('hatmam_payment_requests')
    .select('id, order_id, expires_at, revoked_at, reported_transfer_at, report_reference, created_at')
    .eq('order_id', orderId)
    .maybeSingle();
  if (error) throw error;
  return (data as PaymentRequestRow | null) ?? null;
}

export async function listHatMamPaymentEvidence(db: SupabaseClient) {
  const { data, error } = await db
    .from('hatmam_payment_evidence')
    .select('id, payment_request_id, evidence_kind, receipt_file_name, receipt_sha256, reported_amount_vnd, transfer_reference, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as HatMamPaymentEvidenceRow[];
}

export async function getHatMamPaymentEvidenceForOrder(db: SupabaseClient, orderId: string) {
  const { data: requests, error: requestError } = await db
    .from('hatmam_payment_requests')
    .select('id')
    .eq('order_id', orderId);
  if (requestError) throw requestError;
  const ids = (requests ?? []).map((row) => row.id as string);
  if (ids.length === 0) return [] as HatMamPaymentEvidenceRow[];
  const { data, error } = await db
    .from('hatmam_payment_evidence')
    .select('id, payment_request_id, evidence_kind, receipt_file_name, receipt_sha256, reported_amount_vnd, transfer_reference, created_at')
    .in('payment_request_id', ids)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as HatMamPaymentEvidenceRow[];
}

export async function getPublicationForOrder(db: SupabaseClient, orderId: string) {
  const { data, error } = await db
    .from('publications')
    .select('id, order_id, token_expires_at, delivered_at, created_at')
    .eq('order_id', orderId)
    .maybeSingle();
  if (error) throw error;
  return (data as PublicationRow | null) ?? null;
}

export async function listPublications(db: SupabaseClient) {
  const { data, error } = await db
    .from('publications')
    .select('id, order_id, token_expires_at, delivered_at, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PublicationRow[];
}

export async function listHatMamSyntheticPublications(db: SupabaseClient) {
  const { data, error } = await db
    .from('hatmam_synthetic_publications')
    .select('order_id, status, metadata, checksum_sha256, revision_reason, updated_at, created_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as HatMamSyntheticPublicationRow[];
}

export async function getHatMamSyntheticPublication(db: SupabaseClient, orderId: string) {
  const { data, error } = await db
    .from('hatmam_synthetic_publications')
    .select('order_id, status, metadata, checksum_sha256, revision_reason, updated_at, created_at')
    .eq('order_id', orderId)
    .maybeSingle();
  if (error) throw error;
  return (data as HatMamSyntheticPublicationRow | null) ?? null;
}

export async function getPublicationAsset(db: SupabaseClient, publicationId: string) {
  const { data, error } = await db
    .from('hatmam_publication_assets')
    .select('publication_id, storage_bucket, storage_object_path, content_sha256, created_at')
    .eq('publication_id', publicationId)
    .maybeSingle();
  if (error) throw error;
  return (data as PublicationAssetRow | null) ?? null;
}

export async function listAuditRows(db: SupabaseClient, entityType: string, entityId: string) {
  const { data, error } = await db
    .from('audit_log')
    .select('id, actor, action, entity_type, entity_id, from_state, to_state, reason, created_at')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as AuditRow[];
}

export async function getReleaseGates(db: SupabaseClient) {
  const { data, error } = await db
    .from('hatmam_release_gates')
    .select('public_activation_enabled, deletion_workflow_ready, private_storage_ready, updated_at')
    .eq('id', true)
    .maybeSingle();
  if (error) throw error;
  return (data as ReleaseGateRow | null) ?? null;
}

export async function listDeletionRequests(db: SupabaseClient) {
  const { data, error } = await db
    .from('data_deletion_requests')
    .select('id, subject_type, subject_id, reason_code, status, requested_at, identity_verified_at, approved_at, execution_attempts, execution_evidence, last_error_code, completed_at')
    .order('requested_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as DeletionRequestRow[];
}

export async function listHatMamSyntheticDeletionRuns(db: SupabaseClient) {
  const { data, error } = await db
    .from('hatmam_synthetic_deletion_runs')
    .select('request_id, status, affected_records, execution_order, attempts, last_result, updated_at, created_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as HatMamSyntheticDeletionRunRow[];
}

export async function listRetentionRules(db: SupabaseClient) {
  const { data, error } = await db
    .from('data_retention_rules')
    .select('subject_type, retention_months, early_deletion_available, updated_at')
    .order('subject_type');
  if (error) throw error;
  return (data ?? []) as RetentionRuleRow[];
}

export async function listOperationalSettings(db: SupabaseClient) {
  const { data, error } = await db
    .from('operational_settings_versions')
    .select('id, version, values, active, created_by, created_at, activated_at')
    .order('version', { ascending: false });
  if (error) throw error;
  return (data ?? []) as OperationalSettingsRow[];
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
