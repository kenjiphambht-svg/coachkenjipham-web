import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { useState } from 'react';

import { createAdminSupabase } from '@/lib/db/client';
import { hashPrivateLinkToken } from '@/lib/security/private-link';

interface Props { token: string; valid: boolean; alreadyReported: boolean }

export default function LangPaymentPage({ token, valid, alreadyReported }: Props) {
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState(alreadyReported ? 'Đã ghi nhận thông báo chuyển khoản.' : '');
  const [busy, setBusy] = useState(false);
  if (!valid) return <PrivateShell title="Link không còn hiệu lực"><p>Link này đã hết hạn hoặc đã được thu hồi. Hãy liên hệ trực tiếp với Kenji nếu cần hỗ trợ.</p></PrivateShell>;
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setStatus('');
    try {
      const res = await fetch('/api/lang-90/bao-da-chuyen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, reference }) });
      const body = await res.json();
      setStatus(res.ok && body.ok ? 'Đã ghi nhận. Kenji sẽ tự xác nhận tiền vào trước khi gửi link đặt lịch.' : body?.error?.message ?? 'Chưa gửi được. Thử lại giúp tôi nhé.');
    } catch { setStatus('Mất kết nối. Thử lại giúp tôi nhé.'); }
    setBusy(false);
  };
  return <PrivateShell title="Thông tin thanh toán riêng tư">
    <p>Thông tin tài khoản thanh toán đang <strong>Chờ Kenji kết nối</strong>. Chưa có khoản tiền nào được xác nhận tự động.</p>
    <p className="mt-3">Sau khi đã chuyển khoản theo hướng dẫn Kenji gửi riêng, bạn có thể báo lại tại đây. Đây chỉ là thông báo; Kenji sẽ kiểm tra tiền vào trước khi mở bước kế tiếp.</p>
    <form onSubmit={submit} className="mt-6 space-y-3">
      <label className="block text-sm">Mã tham chiếu (nếu có)<input value={reference} onChange={(e) => setReference(e.target.value)} maxLength={100} className="mt-1 block w-full border p-2" /></label>
      <button disabled={busy} className="border px-4 py-2 disabled:opacity-50">{busy ? 'Đang gửi…' : 'Tôi đã chuyển khoản'}</button>
      {status && <p role="status" className="text-sm">{status}</p>}
    </form>
  </PrivateShell>;
}

function PrivateShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <><Head><title>{title} · Essence</title><meta name="robots" content="noindex, nofollow" /></Head><main className="mx-auto max-w-xl px-5 py-16 font-sans text-e26-text"><h1 className="font-serif text-3xl mb-6">{title}</h1>{children}</main></>;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const token = typeof params?.token === 'string' ? params.token : '';
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return { props: { token: '', valid: false, alreadyReported: false } };
  const { data } = await createAdminSupabase().from('lang_payment_requests').select('expires_at, revoked_at, reported_transfer_at').eq('token_hash', hashPrivateLinkToken(token)).maybeSingle();
  const valid = Boolean(data && !data.revoked_at && new Date(data.expires_at).getTime() > Date.now());
  return { props: { token, valid, alreadyReported: valid && Boolean(data?.reported_transfer_at) } };
};
