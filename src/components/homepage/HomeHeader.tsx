import Link from "next/link";

// Header tối giản — light-led, rất mảnh, không sticky, không shadow, không gold flood.
// Header này được TÁI SỬ DỤNG trên nhiều trang (không chỉ /trang-chu-v2) trong giai đoạn
// dựng khung site-wide — vì vậy "Essence"/"Bản Sắc Hạt Mầm"/"Ghi chép" dùng ĐƯỜNG DẪN
// TUYỆT ĐỐI kèm hash (/trang-chu-v2#essence) thay vì "#essence" trần: nếu chỉ dùng hash
// trần, khi header render ở trang khác (vd /phuong-phap), trình duyệt sẽ tìm id đó ngay
// trên trang hiện tại (không có) thay vì điều hướng về /trang-chu-v2 — đúng kiểu lỗi
// "trỏ nhầm route" đã từng gặp với CTA /kidbook.
export default function HomeHeader() {
  return (
    <header className="bg-e26-ivory border-b border-e26-border px-6">
      <div className="max-w-[1120px] mx-auto flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
        <Link href="/trang-chu-v2" aria-label="Về trang chủ">
          <img
            src="/brand/logo/essence-wordmark-inline-2026.svg"
            alt="Essence Coaching — Kenji Phạm"
            className="h-7 w-auto"
          />
        </Link>
        <nav aria-label="Điều hướng trang" className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <Link
            href="/trang-chu-v2#essence"
            className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300"
          >
            Essence
          </Link>
          <Link
            href="/trang-chu-v2#hat-mam"
            className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300"
          >
            Bản Sắc Hạt Mầm
          </Link>
          <Link
            href="/ve-kenji"
            className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300"
          >
            Về Kenji
          </Link>
          <Link
            href="/phuong-phap"
            className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300"
          >
            Phương pháp
          </Link>
          <Link
            href="/trang-chu-v2#ghi-chep"
            className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300"
          >
            Ghi chép
          </Link>
          <Link
            href="/lien-he"
            className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300"
          >
            Liên hệ
          </Link>
        </nav>
      </div>
    </header>
  );
}
