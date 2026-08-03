import Head from 'next/head';
import type { GetServerSideProps } from 'next';

import { createAdminSupabase } from '@/lib/db/client';
import { hashPrivateLinkToken } from '@/lib/security/private-link';

export default function BookingPage({ valid }: { valid: boolean }) {
  const title = valid ? 'Chọn lịch riêng' : 'Link không còn hiệu lực';
  return <><Head><title>{title} · Essence</title><meta name="robots" content="noindex, nofollow" /></Head><main className="mx-auto max-w-xl px-5 py-16 font-sans text-e26-text"><h1 className="font-serif text-3xl mb-6">{title}</h1>{valid ? <><p>Không gian đặt lịch riêng đang <strong>Chờ Kenji kết nối</strong>.</p><p className="mt-3">Khi lịch riêng sẵn sàng, bạn sẽ thấy các khung giờ ở đây. Không có lịch nào được đặt hoặc xác nhận ở bước này.</p></> : <p>Link này đã hết hạn, đã được dùng hoặc đã được thu hồi. Hãy liên hệ trực tiếp với Kenji để nhận link mới nếu cần.</p>}</main></>;
}

export const getServerSideProps: GetServerSideProps<{ valid: boolean }> = async ({ params }) => {
  const token = typeof params?.token === 'string' ? params.token : '';
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return { props: { valid: false } };
  const { data } = await createAdminSupabase().from('lang_applications').select('booking_token_expires_at, booking_token_used_at').eq('booking_token_hash', hashPrivateLinkToken(token)).maybeSingle();
  return { props: { valid: Boolean(data && !data.booking_token_used_at && data.booking_token_expires_at && new Date(data.booking_token_expires_at).getTime() > Date.now()) } };
};
