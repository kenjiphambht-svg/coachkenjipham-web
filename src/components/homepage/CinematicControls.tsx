import { useCinematicMode } from "./useCinematicMode";

// 2 nút điều khiển chế độ điện ảnh (CHỈ hiện trên mobile, không reduced-motion):
// - Nút chuyển chế độ: góc trên-phải (góc dưới-phải đã có nút Zalo toàn site),
//   label ngắn, không che nội dung.
// - Nút mũi tên: cố định đáy giữa màn hình — "cuối mỗi cảnh" theo nghĩa luôn ở
//   mép dưới cảnh đang xem; tự ẩn ở cảnh cuối. Một nút duy nhất thay vì chèn
//   nút vào từng section (ít xâm lấn DOM, desktop không đổi).
export default function CinematicControls() {
  const { available, active, atEnd, toggle, goNext } = useCinematicMode();

  if (!available) return null;

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="fixed top-3 right-3 z-40 bg-e26-ivory/90 border border-e26-border text-e26-text-2 font-sans text-xs px-3 py-1.5 backdrop-blur-sm"
      >
        {active ? "Xem toàn trang" : "Xem theo cảnh"}
      </button>

      {active && !atEnd && (
        <button
          type="button"
          onClick={goNext}
          aria-label="Sang cảnh tiếp theo"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-11 h-11 rounded-full bg-e26-ivory/90 border border-e26-border text-e26-text-2 flex items-center justify-center backdrop-blur-sm"
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 7l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </>
  );
}
