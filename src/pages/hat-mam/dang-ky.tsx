import Head from 'next/head';
import { FormEvent, useState } from 'react';

const INITIAL = {
  package_code: 'HM-01', parent_name: '', parent_contact: '', child_name: '', birth_date: '', birth_time: '',
  birth_time_known: false, birth_place: '', family_context: '', parent_question: '',
  consent_version: 'hatmam-parent-intake-v1', consent: false, company: '',
};

export default function HatMamParentIntakePage() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (key: keyof typeof INITIAL, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setStatus(null);
    try {
      const response = await fetch('/api/hat-mam/dang-ky', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID().replaceAll('-', '') },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      setStatus(result.ok ? 'Đã ghi nhận. Kenji sẽ gửi hướng dẫn riêng ở bước tiếp theo.' : result.error?.message ?? 'Chưa thể gửi lúc này.');
    } catch { setStatus('Chưa thể gửi lúc này.'); }
    finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-e26-ivory px-6 py-16 text-e26-text">
    <Head><meta name="robots" content="noindex,nofollow,noarchive" /><title>Thông tin riêng tư cho Hạt Mầm</title></Head>
    <div className="mx-auto max-w-xl">
      <p className="font-sans text-xs tracking-[0.12em] uppercase text-e26-gold-deep">Hạt Mầm · thông tin riêng tư</p>
      <h1 className="mt-4 font-serif text-4xl">Một vài điều đủ để Kenji bắt đầu đọc.</h1>
      <p className="mt-5 font-sans leading-7 text-e26-text-2">Chỉ dùng để soạn ấn phẩm cho con, không công khai, không dùng huấn luyện AI. Không gửi ảnh, địa chỉ, thông tin y tế hay thông tin gia đình chi tiết qua form này.</p>
      <p className="mt-4 rounded border border-e26-gold/40 p-4 font-sans text-sm">Luồng này hiện chưa mở nhận dữ liệu thật. Form là lớp native đã chuẩn bị sẵn; public activation chỉ mở sau khi Storage riêng và workflow xoá dữ liệu được kiểm chứng.</p>
      <form onSubmit={submit} className="mt-8 space-y-5 font-sans" noValidate>
        <label className="block">Gói<select value={form.package_code} onChange={(e) => set('package_code', e.target.value)} className="mt-1 w-full border bg-white p-3"><option value="HM-01">HM-01 · Ấn phẩm</option><option value="HM-02">HM-02 · Ấn phẩm và trò chuyện</option></select></label>
        <label className="block">Tên ba mẹ<input required value={form.parent_name} onChange={(e) => set('parent_name', e.target.value)} className="mt-1 w-full border bg-white p-3" autoComplete="name" /></label>
        <label className="block">Email hoặc Zalo để liên hệ<input required value={form.parent_contact} onChange={(e) => set('parent_contact', e.target.value)} className="mt-1 w-full border bg-white p-3" autoComplete="email" /></label>
        <label className="block">Biệt danh gọi bé (nếu muốn)<input value={form.child_name} onChange={(e) => set('child_name', e.target.value)} className="mt-1 w-full border bg-white p-3" /></label>
        <label className="block">Ngày sinh của bé<input required type="date" value={form.birth_date} onChange={(e) => set('birth_date', e.target.value)} className="mt-1 w-full border bg-white p-3" /></label>
        <label className="flex gap-2"><input type="checkbox" checked={form.birth_time_known} onChange={(e) => set('birth_time_known', e.target.checked)} /> Tôi nhớ giờ sinh</label>
        {form.birth_time_known && <label className="block">Giờ sinh<input type="time" value={form.birth_time} onChange={(e) => set('birth_time', e.target.value)} className="mt-1 w-full border bg-white p-3" /></label>}
        <label className="block">Nơi sinh (nếu muốn)<input value={form.birth_place} onChange={(e) => set('birth_place', e.target.value)} className="mt-1 w-full border bg-white p-3" /></label>
        <label className="block">Một nét nhịp sinh hoạt hoặc bối cảnh ba mẹ muốn chia sẻ (tuỳ chọn)<textarea value={form.family_context} onChange={(e) => set('family_context', e.target.value)} className="mt-1 min-h-24 w-full border bg-white p-3" /></label>
        <label className="block">Điều ba mẹ đang muốn hiểu về con<textarea required value={form.parent_question} onChange={(e) => set('parent_question', e.target.value)} className="mt-1 min-h-28 w-full border bg-white p-3" /></label>
        <label className="hidden" aria-hidden="true">Company<input tabIndex={-1} value={form.company} onChange={(e) => set('company', e.target.value)} /></label>
        <label className="flex gap-2 text-sm"><input required type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} /> Tôi đồng ý để Essence dùng các thông tin tối thiểu trên chỉ nhằm soạn ấn phẩm riêng cho con.</label>
        <button disabled className="border border-e26-text px-6 py-3 opacity-60" type="submit">{busy ? 'Đang gửi…' : 'Chưa mở nhận thông tin'}</button>
        {status && <p role="status" className="text-sm">{status}</p>}
      </form>
    </div>
  </main>;
}
