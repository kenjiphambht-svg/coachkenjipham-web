import { useState, type FormEvent } from 'react';
import type { GetServerSideProps } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import {
  Card,
  OperationalNotice,
  ReadinessBadge,
  ScrollTable,
  Td,
  Th,
  adminPrimaryButton,
  formatDate,
} from '@/components/admin/ui';
import { withAdmin } from '@/lib/auth/require-admin';
import {
  getActiveSettings,
  type AdminOperationalSettings,
  type OperationalSettingsVersionRow,
} from '@/lib/admin/settings';
import { formatCurrencyVnd } from '@/lib/admin/operational';
import { listOperationalSettings, type OperationalSettingsRow } from '@/lib/db/queries';

interface Props {
  adminEmail: string;
  current: AdminOperationalSettings;
  history: OperationalSettingsVersionRow[];
}

const inputClass = 'w-full px-3 py-2.5 border border-e26-border bg-e26-white font-sans text-[14px] focus:outline-none focus:border-e26-gold-deep';
const labelClass = 'block font-sans text-[13px] text-e26-text-2 mb-1';

const number = (form: FormData, key: string) => Number(form.get(key));

export default function AdminSettings({ adminEmail, current, history }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true); setError(null); setSuccess(null);
    const form = new FormData(event.currentTarget);
    const values: AdminOperationalSettings = {
      lang: {
        priceVnd: number(form, 'lang.priceVnd'),
        capacityMonth: number(form, 'lang.capacityMonth'),
        responseSlaMinutes: number(form, 'lang.responseSlaMinutes'),
        paymentConfirmationSlaMinutes: number(form, 'lang.paymentConfirmationSlaMinutes'),
        sessionDurationMinutes: number(form, 'lang.sessionDurationMinutes'),
        publicLocationLabel: String(form.get('lang.publicLocationLabel') ?? ''),
        bookingDefaults: {
          tuesday0930: form.get('booking.tuesday0930') === 'on',
          thursday1430: form.get('booking.thursday1430') === 'on',
          postSessionBufferMinutes: number(form, 'booking.postSessionBufferMinutes'),
          minNoticeHours: number(form, 'booking.minNoticeHours'),
          bookingHorizonDays: number(form, 'booking.bookingHorizonDays'),
          rescheduleDeadlineHours: number(form, 'booking.rescheduleDeadlineHours'),
          maxBookingsPerWeek: number(form, 'booking.maxBookingsPerWeek'),
          hardMonthlyCapacity: number(form, 'booking.hardMonthlyCapacity'),
        },
      },
      hatmam: {
        hm01Name: String(form.get('hatmam.hm01Name') ?? ''),
        hm01LaunchPriceVnd: number(form, 'hatmam.hm01LaunchPriceVnd'),
        hm01ReferencePriceVnd: number(form, 'hatmam.hm01ReferencePriceVnd'),
        hm02Name: String(form.get('hatmam.hm02Name') ?? ''),
        hm02LaunchPriceVnd: number(form, 'hatmam.hm02LaunchPriceVnd'),
        hm02ReferencePriceVnd: number(form, 'hatmam.hm02ReferencePriceVnd'),
        capacityMonth: number(form, 'hatmam.capacityMonth'),
        deliveryBusinessDays: number(form, 'hatmam.deliveryBusinessDays'),
        revisionWindowDays: number(form, 'hatmam.revisionWindowDays'),
        rawIntakeRetentionMonths: number(form, 'hatmam.rawIntakeRetentionMonths'),
        publicationRetentionMonths: number(form, 'hatmam.publicationRetentionMonths'),
        publicActivationEnabled: false,
      },
      integrations: {
        privateStorageReady: false,
        deletionWorkflowReady: false,
        resendReadiness: 'off',
        calcomReadiness: 'off',
      },
    };
    try {
      const response = await fetch('/api/admin/cai-dat/luu-phien-ban', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ values }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        setError(body?.error?.message ?? 'Chưa lưu được phiên bản mới.');
        return;
      }
      setSuccess(`Đã tạo phiên bản ${body?.data?.settings_version ?? 'mới'} với hiệu lực ngay.`);
      window.setTimeout(() => window.location.reload(), 700);
    } catch {
      setError('Mất kết nối. Hãy thử lại.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell title="Cài đặt vận hành" adminEmail={adminEmail}>
      <OperationalNotice title="Mỗi lần lưu tạo một version mới">
        Trang này đã qua AAL2. Version cũ không bị sửa; order snapshot vẫn giữ nguyên. Public activation, Storage, deletion, Resend và Cal.com bị khóa OFF trong staging.
      </OperationalNotice>

      <form onSubmit={save} className="space-y-5 mt-6">
        <div className="grid lg:grid-cols-2 gap-5">
          <Card title="Lặng">
            <div className="grid sm:grid-cols-2 gap-4">
              <label><span className={labelClass}>Giá (VND)</span><input className={inputClass} type="number" name="lang.priceVnd" min="0" defaultValue={current.lang.priceVnd} required /></label>
              <label><span className={labelClass}>Capacity / tháng</span><input className={inputClass} type="number" name="lang.capacityMonth" min="0" defaultValue={current.lang.capacityMonth} required /></label>
              <label><span className={labelClass}>SLA phản hồi (phút)</span><input className={inputClass} type="number" name="lang.responseSlaMinutes" min="1" defaultValue={current.lang.responseSlaMinutes} required /></label>
              <label><span className={labelClass}>SLA xác nhận tiền (phút)</span><input className={inputClass} type="number" name="lang.paymentConfirmationSlaMinutes" min="1" defaultValue={current.lang.paymentConfirmationSlaMinutes} required /></label>
              <label><span className={labelClass}>Thời lượng phiên (phút)</span><input className={inputClass} type="number" name="lang.sessionDurationMinutes" min="1" defaultValue={current.lang.sessionDurationMinutes} required /></label>
              <label><span className={labelClass}>Địa điểm công khai</span><input className={inputClass} name="lang.publicLocationLabel" defaultValue={current.lang.publicLocationLabel} required /></label>
            </div>
            <div className="border-t border-e26-border mt-5 pt-4">
              <p className="font-sans text-[14px] font-medium mb-3">Booking working defaults</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="font-sans text-[14px] flex items-center gap-2"><input type="checkbox" name="booking.tuesday0930" defaultChecked={current.lang.bookingDefaults.tuesday0930} /> Thứ Ba · 09:30</label>
                <label className="font-sans text-[14px] flex items-center gap-2"><input type="checkbox" name="booking.thursday1430" defaultChecked={current.lang.bookingDefaults.thursday1430} /> Thứ Năm · 14:30</label>
                <label><span className={labelClass}>Buffer sau phiên (phút)</span><input className={inputClass} type="number" name="booking.postSessionBufferMinutes" min="0" defaultValue={current.lang.bookingDefaults.postSessionBufferMinutes} /></label>
                <label><span className={labelClass}>Notice tối thiểu (giờ)</span><input className={inputClass} type="number" name="booking.minNoticeHours" min="0" defaultValue={current.lang.bookingDefaults.minNoticeHours} /></label>
                <label><span className={labelClass}>Horizon (ngày)</span><input className={inputClass} type="number" name="booking.bookingHorizonDays" min="1" defaultValue={current.lang.bookingDefaults.bookingHorizonDays} /></label>
                <label><span className={labelClass}>Reschedule deadline (giờ)</span><input className={inputClass} type="number" name="booking.rescheduleDeadlineHours" min="0" defaultValue={current.lang.bookingDefaults.rescheduleDeadlineHours} /></label>
                <label><span className={labelClass}>Tối đa booking / tuần</span><input className={inputClass} type="number" name="booking.maxBookingsPerWeek" min="1" defaultValue={current.lang.bookingDefaults.maxBookingsPerWeek} /></label>
                <label><span className={labelClass}>Hard capacity / tháng</span><input className={inputClass} type="number" name="booking.hardMonthlyCapacity" min="1" defaultValue={current.lang.bookingDefaults.hardMonthlyCapacity} /></label>
              </div>
            </div>
          </Card>

          <Card title="Hạt Mầm">
            <div className="grid sm:grid-cols-2 gap-4">
              <label><span className={labelClass}>Tên HM-01</span><input className={inputClass} name="hatmam.hm01Name" defaultValue={current.hatmam.hm01Name} required /></label>
              <label><span className={labelClass}>Tên HM-02</span><input className={inputClass} name="hatmam.hm02Name" defaultValue={current.hatmam.hm02Name} required /></label>
              <label><span className={labelClass}>Giá launch HM-01</span><input className={inputClass} type="number" name="hatmam.hm01LaunchPriceVnd" min="0" defaultValue={current.hatmam.hm01LaunchPriceVnd} required /></label>
              <label><span className={labelClass}>Giá reference HM-01</span><input className={inputClass} type="number" name="hatmam.hm01ReferencePriceVnd" min="0" defaultValue={current.hatmam.hm01ReferencePriceVnd} required /></label>
              <label><span className={labelClass}>Giá launch HM-02</span><input className={inputClass} type="number" name="hatmam.hm02LaunchPriceVnd" min="0" defaultValue={current.hatmam.hm02LaunchPriceVnd} required /></label>
              <label><span className={labelClass}>Giá reference HM-02</span><input className={inputClass} type="number" name="hatmam.hm02ReferencePriceVnd" min="0" defaultValue={current.hatmam.hm02ReferencePriceVnd} required /></label>
              <label><span className={labelClass}>Capacity / tháng</span><input className={inputClass} type="number" name="hatmam.capacityMonth" min="0" defaultValue={current.hatmam.capacityMonth} required /></label>
              <label><span className={labelClass}>Giao trong (ngày làm việc)</span><input className={inputClass} type="number" name="hatmam.deliveryBusinessDays" min="1" defaultValue={current.hatmam.deliveryBusinessDays} required /></label>
              <label><span className={labelClass}>Revision window (ngày)</span><input className={inputClass} type="number" name="hatmam.revisionWindowDays" min="0" defaultValue={current.hatmam.revisionWindowDays} required /></label>
              <label><span className={labelClass}>Raw intake retention (tháng)</span><input className={inputClass} type="number" name="hatmam.rawIntakeRetentionMonths" min="1" defaultValue={current.hatmam.rawIntakeRetentionMonths} required /></label>
              <label><span className={labelClass}>Publication retention (tháng)</span><input className={inputClass} type="number" name="hatmam.publicationRetentionMonths" min="1" defaultValue={current.hatmam.publicationRetentionMonths} required /></label>
            </div>
          </Card>
        </div>

        <Card title="Release & provider gates (khóa trong staging)">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 font-sans text-[14px]">
            <div><p className="text-e26-text-2 mb-1">Public activation</p><ReadinessBadge ready={false}>OFF</ReadinessBadge></div>
            <div><p className="text-e26-text-2 mb-1">Private Storage</p><ReadinessBadge ready={false}>OFF</ReadinessBadge></div>
            <div><p className="text-e26-text-2 mb-1">Deletion workflow</p><ReadinessBadge ready={false}>OFF</ReadinessBadge></div>
            <div><p className="text-e26-text-2 mb-1">Resend</p><ReadinessBadge ready={false}>OFF</ReadinessBadge></div>
            <div><p className="text-e26-text-2 mb-1">Cal.com</p><ReadinessBadge ready={false}>OFF</ReadinessBadge></div>
          </div>
        </Card>

        {error && <p className="font-sans text-[14px] text-e26-gold-deep" role="alert">{error}</p>}
        {success && <p className="font-sans text-[14px] text-[#2d5b35]" role="status">{success}</p>}
        <button className={adminPrimaryButton} type="submit" disabled={busy}>{busy ? 'Đang tạo phiên bản…' : 'Lưu phiên bản mới'}</button>
      </form>

      <Card title="Lịch sử phiên bản" >
        <ScrollTable>
          <thead><tr><Th>Version</Th><Th>Hiệu lực</Th><Th>Người tạo</Th><Th>Tóm tắt</Th></tr></thead>
          <tbody>
            {history.map((version) => {
              const values = getActiveSettings([version]).values;
              return <tr key={version.id}><Td>{version.version}{version.active ? ' · active' : ''}</Td><Td>{formatDate(version.activated_at ?? version.created_at)}</Td><Td>{version.created_by}</Td><Td>Lặng {formatCurrencyVnd(values.lang.priceVnd)} · HM-01 {formatCurrencyVnd(values.hatmam.hm01LaunchPriceVnd)} · HM-02 {formatCurrencyVnd(values.hatmam.hm02LaunchPriceVnd)}</Td></tr>;
            })}
          </tbody>
        </ScrollTable>
      </Card>
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = withAdmin(async (_ctx, { db, adminEmail }) => {
  const rows = await listOperationalSettings(db);
  const typedRows = rows as OperationalSettingsRow[];
  const { values } = getActiveSettings(typedRows);
  return { props: { adminEmail, current: values, history: typedRows } };
});
