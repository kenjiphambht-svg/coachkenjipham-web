import Head from 'next/head';

/** Generic private booking surface reserved for a verified future order token.
 * It intentionally fails closed until the protected issuance route exists. */
export default function PrivateCalendarRoute() {
  return <><Head><title>Đặt lịch riêng · Essence</title><meta name="robots" content="noindex, nofollow, noarchive" /></Head><main className="mx-auto max-w-xl px-5 py-16 font-sans text-e26-text"><h1 className="font-serif text-3xl">Link đặt lịch riêng</h1><p className="mt-5">Link này chưa sẵn sàng hoặc đã không còn hiệu lực. Essence không mở đường dẫn Cal.com trực tiếp cho khách.</p><p className="mt-3">Khi kết nối được xác minh, lịch sẽ chỉ hiển thị ngay trong không gian riêng này.</p></main></>;
}
