// Header tối giản — light-led, rất mảnh, không sticky, không shadow, không gold flood.
// Các trang đích (Essence/Ghi chép/Liên hệ) chưa có route riêng → dùng anchor nội bộ,
// sẽ đổi sang route thật khi từng trang mở (không link mạnh tới route chưa tồn tại).
export default function HomeHeader() {
  return (
    <header className="bg-e26-ivory border-b border-e26-border px-6">
      <div className="max-w-[1120px] mx-auto flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
        <img
          src="/brand/logo/essence-wordmark-inline-2026.svg"
          alt="Essence Coaching — Kenji Phạm"
          className="h-7 w-auto"
        />
        <nav aria-label="Điều hướng trang" className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <a
            href="#essence"
            className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300"
          >
            Essence
          </a>
          <a
            href="#hat-mam"
            className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300"
          >
            Bản Sắc Hạt Mầm
          </a>
          <a
            href="#ghi-chep"
            className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300"
          >
            Ghi chép
          </a>
          <a
            href="#lien-he"
            className="font-sans text-sm text-e26-text-2 hover:text-e26-gold-deep transition-colors duration-300"
          >
            Liên hệ
          </a>
        </nav>
      </div>
    </header>
  );
}
