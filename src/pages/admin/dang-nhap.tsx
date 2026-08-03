// ============================================================
// /admin/dang-nhap — trang admin DUY NHẤT xem được khi chưa đăng nhập.
// Không hiển thị bất kỳ dữ liệu nghiệp vụ nào.
// ============================================================

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, type FormEvent } from 'react';
import type { GetServerSideProps } from 'next';

import { createBrowserSupabase } from '@/lib/db/client';
import { isSupabaseConfigured } from '@/lib/db/env';
import { ADMIN_MFA_PATH } from '@/lib/auth/admin-gate';

export default function AdminLoginPage({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const supabase = createBrowserSupabase();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        // Không nói rõ sai email hay sai mật khẩu — tránh dò tài khoản.
        setError('Email hoặc mật khẩu chưa đúng.');
        setBusy(false);
        return;
      }
      const { data: assurance, error: assuranceError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assuranceError) throw assuranceError;
      router.replace(assurance?.currentLevel === 'aal2' ? '/admin' : ADMIN_MFA_PATH);
    } catch {
      setError('Chưa đăng nhập được. Thử lại sau giúp tôi nhé.');
      setBusy(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 border border-e26-border bg-e26-white font-sans text-[15px] focus:outline-none focus:border-e26-gold-deep transition-colors';

  return (
    <>
      <Head>
        <title>Đăng nhập · Quản trị Essence</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-e26-ivory flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[380px]">
          <h1 className="font-serif text-[26px] text-e26-text mb-6">Quản trị Essence</h1>

          {!configured ? (
            <div className="border border-e26-border bg-e26-white p-5 font-sans text-[14px] leading-[1.7] text-e26-text">
              <p className="font-medium mb-2">Chưa cấu hình kết nối cơ sở dữ liệu.</p>
              <p className="text-e26-text-2">
                Thiếu biến môi trường <code>NEXT_PUBLIC_SUPABASE_URL</code> hoặc{' '}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. Xem file{' '}
                <code>.env.example</code> ở gốc dự án để biết cần đặt những gì.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block font-sans text-[15px] mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block font-sans text-[15px] mb-2">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              {error && (
                <p className="font-sans text-[13px] text-e26-gold-deep" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-e26-gold text-e26-black font-sans font-medium text-[13px] tracking-[0.08em] uppercase py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300 disabled:opacity-60"
              >
                {busy ? 'Đang vào…' : 'Đăng nhập'}
              </button>
              <div className="flex items-center justify-between gap-4 font-sans text-[13px]">
                <Link href="/admin/quen-mat-khau" className="underline underline-offset-4 hover:text-e26-gold-deep">Quên mật khẩu?</Link>
                <span className="text-right text-e26-text-2">Chưa thiết lập tài khoản? Kiểm tra email mời từ Supabase.</span>
              </div>
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
