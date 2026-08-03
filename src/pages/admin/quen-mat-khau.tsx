import Head from 'next/head';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import type { GetServerSideProps } from 'next';

import { RECOVERY_CONFIRMATION } from '@/lib/auth/founder-recovery';
import { isSupabaseConfigured } from '@/lib/db/env';

export default function ForgotPasswordPage({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await fetch('/api/admin/auth/quen-mat-khau', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setError('Chưa gửi được yêu cầu. Hãy thử lại sau giúp tôi nhé.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title>Quên mật khẩu · Quản trị Essence</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-e26-ivory flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[380px] border border-e26-border bg-e26-white p-6">
          <h1 className="font-serif text-[26px] text-e26-text mb-3">Đặt lại mật khẩu</h1>
          <p className="font-sans text-[14px] leading-[1.7] text-e26-text-2 mb-5">
            Nhập email quản trị để nhận liên kết đặt lại mật khẩu.
          </p>
          {!configured ? (
            <p className="font-sans text-[14px] text-e26-gold-deep" role="alert">
              Dịch vụ đăng nhập đang chưa sẵn sàng. Hãy thử lại sau.
            </p>
          ) : submitted ? (
            <div className="font-sans text-[14px] leading-[1.7]" role="status">
              <p>{RECOVERY_CONFIRMATION}</p>
              <Link href="/admin/dang-nhap" className="inline-block mt-5 underline underline-offset-4 hover:text-e26-gold-deep">
                Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block font-sans text-[15px] mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-3 border border-e26-border bg-e26-white font-sans text-[15px] focus:outline-none focus:border-e26-gold-deep"
                  required
                />
              </div>
              {error && <p className="font-sans text-[13px] text-e26-gold-deep" role="alert">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-e26-gold text-e26-black font-sans font-medium text-[13px] tracking-[0.08em] uppercase py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors disabled:opacity-60"
              >
                {busy ? 'Đang gửi…' : 'Gửi email đặt lại'}
              </button>
              <Link href="/admin/dang-nhap" className="block text-center font-sans text-[13px] underline underline-offset-4 hover:text-e26-gold-deep">
                Quay lại đăng nhập
              </Link>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: { configured: isSupabaseConfigured() },
});
