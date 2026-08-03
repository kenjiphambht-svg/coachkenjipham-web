/* eslint-disable @next/next/no-img-element -- Supabase trả QR SVG data URL, không phù hợp Next/Image. */
// ============================================================
// /admin/xac-minh-mfa — bước AAL2 bắt buộc trước khi mở quản trị.
// Không truy vấn hay hiển thị dữ liệu nghiệp vụ tại đây.
// ============================================================

import Head from 'next/head';
import { useEffect, useState, type FormEvent } from 'react';
import type { GetServerSideProps } from 'next';

import { ADMIN_LOGIN_PATH } from '@/lib/auth/admin-gate';
import { createBrowserSupabase, createServerSupabase } from '@/lib/db/client';
import { isSupabaseConfigured } from '@/lib/db/env';

type Screen = 'loading' | 'enroll' | 'challenge' | 'error';

export default function AdminMfaPage() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [factorId, setFactorId] = useState('');
  const [qr, setQr] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    const prepare = async () => {
      try {
        const supabase = createBrowserSupabase();
        const { data: assurance, error: assuranceError } =
          await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (assuranceError) throw assuranceError;
        if (assurance?.currentLevel === 'aal2') {
          window.location.assign('/admin');
          return;
        }

        const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) throw factorsError;
        const existingTotp = factors.totp.find((factor) => factor.status === 'verified');
        if (existingTotp) {
          if (!mounted) return;
          setFactorId(existingTotp.id);
          setScreen('challenge');
          return;
        }

        const { data: enrollment, error: enrollmentError } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
          friendlyName: 'Quản trị Essence',
        });
        if (enrollmentError) throw enrollmentError;
        if (!mounted) return;
        setFactorId(enrollment.id);
        setQr(enrollment.totp.qr_code);
        setScreen('enroll');
      } catch {
        if (!mounted) return;
        setError('Chưa chuẩn bị được xác minh hai bước. Thử lại hoặc đăng nhập lại giúp tôi nhé.');
        setScreen('error');
      }
    };

    void prepare();
    return () => {
      mounted = false;
    };
  }, []);

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    if (!factorId) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = createBrowserSupabase();
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: code.trim(),
      });
      if (verifyError) throw verifyError;
      window.location.assign('/admin');
    } catch {
      setError('Mã xác minh chưa đúng hoặc đã hết hạn. Thử lại với mã mới trong ứng dụng xác thực nhé.');
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title>Xác minh hai bước · Quản trị Essence</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-e26-ivory flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px] border border-e26-border bg-e26-white p-6">
          <h1 className="font-serif text-[26px] text-e26-text mb-3">Xác minh hai bước</h1>
          <p className="font-sans text-[14px] leading-[1.7] text-e26-text-2 mb-5">
            Khu vực quản trị chỉ mở sau khi đã xác minh bằng ứng dụng xác thực.
          </p>

          {screen === 'loading' && <p className="font-sans text-[14px]">Đang chuẩn bị…</p>}

          {screen === 'enroll' && (
            <>
              <p className="font-sans text-[14px] leading-[1.7] mb-4">
                Quét mã này bằng ứng dụng xác thực, rồi nhập mã 6 số ứng dụng vừa tạo.
              </p>
              {qr && <img src={qr} alt="Mã QR thiết lập xác minh hai bước" className="w-48 h-48 mx-auto mb-4" />}
              <p className="font-sans text-[12px] text-e26-text-2 mb-5">
                Chỉ quét QR trong phiên riêng tư này. Không chụp, sao chép hoặc gửi mã QR cho bất kỳ ai.
              </p>
            </>
          )}

          {(screen === 'enroll' || screen === 'challenge') && (
            <form onSubmit={verify} className="space-y-4">
              {screen === 'challenge' && (
                <p className="font-sans text-[14px] leading-[1.7]">
                  Nhập mã mới trong ứng dụng xác thực của bạn.
                </p>
              )}
              <div>
                <label htmlFor="mfa-code" className="block font-sans text-[14px] mb-2">
                  Mã xác minh
                </label>
                <input
                  id="mfa-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-e26-border bg-e26-white font-sans text-[18px] tracking-[0.25em] focus:outline-none focus:border-e26-gold-deep"
                  required
                />
              </div>
              {error && <p className="font-sans text-[13px] text-e26-gold-deep" role="alert">{error}</p>}
              <button
                type="submit"
                disabled={busy || code.length !== 6}
                className="w-full bg-e26-gold text-e26-black font-sans font-medium text-[13px] tracking-[0.08em] uppercase py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors disabled:opacity-60"
              >
                {busy ? 'Đang xác minh…' : 'Xác minh và vào quản trị'}
              </button>
            </form>
          )}

          {screen === 'error' && (
            <>
              <p className="font-sans text-[14px] text-e26-gold-deep mb-4" role="alert">{error}</p>
              <a href={ADMIN_LOGIN_PATH} className="font-sans text-[14px] underline underline-offset-4">
                Quay lại đăng nhập
              </a>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!isSupabaseConfigured()) {
    return { redirect: { destination: ADMIN_LOGIN_PATH, permanent: false } };
  }

  const db = createServerSupabase({ req: ctx.req, res: ctx.res });
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { redirect: { destination: ADMIN_LOGIN_PATH, permanent: false } };

  const { data: assurance } = await db.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.currentLevel === 'aal2') {
    return { redirect: { destination: '/admin', permanent: false } };
  }

  return { props: {} };
};
