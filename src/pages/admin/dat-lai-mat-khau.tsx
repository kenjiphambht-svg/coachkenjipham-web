import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import type { GetServerSideProps } from 'next';

import { isCanonicalFounderEmail, passwordPolicyError } from '@/lib/auth/founder-recovery';
import { createBrowserSupabase } from '@/lib/db/client';
import { isSupabaseConfigured } from '@/lib/db/env';

type ResetState = 'checking' | 'ready' | 'invalid' | 'done';

export default function ResetPasswordPage({ configured }: { configured: boolean }) {
  const [state, setState] = useState<ResetState>(configured ? 'checking' : 'invalid');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!configured) return;
    let mounted = true;
    let recoverySessionSeen = false;
    let unsubscribe: (() => void) | null = null;
    const verifyRecoverySession = async () => {
      try {
        const supabase = createBrowserSupabase();
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY' && session && isCanonicalFounderEmail(session.user.email)) {
            recoverySessionSeen = true;
            if (mounted) setState('ready');
          }
        });
        unsubscribe = () => subscription.unsubscribe();
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');
        const tokenHash = query.get('token_hash');
        const tokenType = query.get('type');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          recoverySessionSeen = true;
        } else if (tokenHash && tokenType === 'recovery') {
          const { error: otpError } = await supabase.auth.verifyOtp({ type: 'recovery', token_hash: tokenHash });
          if (otpError) throw otpError;
          recoverySessionSeen = true;
        }
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !data.session || !isCanonicalFounderEmail(data.session.user.email)) throw new Error('invalid');
        // Vercel access and every Supabase recovery parameter are removed before
        // this page can submit a password; they must not reach history/referrers.
        window.history.replaceState({}, document.title, '/admin/dat-lai-mat-khau');
        // Implicit recovery links emit PASSWORD_RECOVERY; PKCE links set the flag
        // immediately above. A normal signed-in session cannot open this form.
        window.setTimeout(() => {
          if (mounted && !recoverySessionSeen) setState('invalid');
        }, 100);
      } catch {
        if (mounted) setState('invalid');
      }
    };
    void verifyRecoverySession();
    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, [configured]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const policyError = passwordPolicyError(password, confirmation);
    if (policyError) {
      setError(policyError);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const response = await fetch('/api/admin/auth/dat-lai-mat-khau', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmation }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.ok) throw new Error('reset failed');
      await createBrowserSupabase().auth.signOut({ scope: 'local' });
      setPassword('');
      setConfirmation('');
      setState('done');
    } catch {
      setError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Hãy yêu cầu email mới.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title>Đặt mật khẩu mới · Quản trị Essence</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="referrer" content="no-referrer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-e26-ivory flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px] border border-e26-border bg-e26-white p-6">
          <h1 className="font-serif text-[26px] text-e26-text mb-3">Đặt mật khẩu mới</h1>
          {state === 'checking' && <p className="font-sans text-[14px]">Đang kiểm tra liên kết an toàn…</p>}
          {state === 'invalid' && (
            <div className="font-sans text-[14px] leading-[1.7]" role="alert">
              <p>Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Hãy yêu cầu email mới.</p>
              <Link href="/admin/quen-mat-khau" className="inline-block mt-5 underline underline-offset-4 hover:text-e26-gold-deep">Yêu cầu email mới</Link>
            </div>
          )}
          {state === 'done' && (
            <div className="font-sans text-[14px] leading-[1.7]" role="status">
              <p>Mật khẩu đã được cập nhật. Hãy đăng nhập lại và xác minh hai bước trước khi vào quản trị.</p>
              <Link href="/admin/dang-nhap" className="inline-block mt-5 underline underline-offset-4 hover:text-e26-gold-deep">Đăng nhập lại</Link>
            </div>
          )}
          {state === 'ready' && (
            <form onSubmit={submit} className="space-y-4">
              <p className="font-sans text-[14px] leading-[1.7] text-e26-text-2">
                Dùng ít nhất 12 ký tự, gồm chữ thường, chữ hoa và ít nhất một số.
              </p>
              <div>
                <label htmlFor="password" className="block font-sans text-[15px] mb-2">Mật khẩu mới</label>
                <input id="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full px-4 py-3 border border-e26-border bg-e26-white font-sans text-[15px] focus:outline-none focus:border-e26-gold-deep" required />
              </div>
              <div>
                <label htmlFor="confirmation" className="block font-sans text-[15px] mb-2">Nhập lại mật khẩu mới</label>
                <input id="confirmation" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="w-full px-4 py-3 border border-e26-border bg-e26-white font-sans text-[15px] focus:outline-none focus:border-e26-gold-deep" required />
              </div>
              {error && <p className="font-sans text-[13px] text-e26-gold-deep" role="alert">{error}</p>}
              <button type="submit" disabled={busy} className="w-full bg-e26-gold text-e26-black font-sans font-medium text-[13px] tracking-[0.08em] uppercase py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors disabled:opacity-60">
                {busy ? 'Đang cập nhật…' : 'Cập nhật mật khẩu'}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 'no-store');
  ctx.res.setHeader('Referrer-Policy', 'no-referrer');
  return { props: { configured: isSupabaseConfigured() } };
};
