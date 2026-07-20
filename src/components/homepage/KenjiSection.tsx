import ImageSlot from "./ImageSlot";
import ComingLink from "./ComingLink";

// Section KENJI LÀ AI — sau khi ĐẢO MẠCH (19/07/2026) đứng ở vị trí ④, NGAY SAU
// Kiệt Tác (nền đen). Dựng theo hệ KHỐI-LỚP + phương án HAI ẢNH (A):
//   Lớp 1: KHỐI KEM ĐẬM (--essence-cream-deep-2026 #E9E6DC) chứa TOÀN BỘ chữ
//          — phân biệt với nền trắng section nhưng vẫn trong họ kem, sáng ~91%
//          nên KHÔNG đọc thành khối tối (toàn trang vẫn đúng 2 khối tối Kiệt Tác
//          + An Định + footer).
//   Ảnh CHÍNH (kenji-portrait, nhìn thẳng máy — chuyển từ hero cũ xuống): to,
//          CHỜM QUA CẠNH KHỐI (kỹ thuật B). MOBILE: trên, chờm cạnh trên khối.
//          DESKTOP: trái, chờm cạnh trái khối (-mr-16 ăn vào khối, khối pl-24
//          đẩy chữ né).
//   Ảnh PHỤ (kenji-pouring-tea, rót trà — trước là ảnh chính): NHỎ rõ rệt
//          (~55% cỡ ảnh chính), đặt THẤP trong khối, cùng khu vực thị giác với
//          câu trích "Tôi không sửa...". Một chính một phụ, chênh cỡ rõ —
//          không hai ảnh ngang cỡ. SỬA 20/07/2026: bỏ layout "đứng cạnh" (ảnh
//          + quote chung hàng) — quote lên 42px (Vai 2, brief V9) bị dồn dòng
//          trong cột hẹp. Nay ảnh trên, quote dưới, full-width mọi breakpoint.
// KHÔNG che chữ: khối pt lớn (mobile) / pl lớn (desktop) — đo thật
// getBoundingClientRect ở 375/595/767/768/1280px.
// SỬA 20/07/2026 (brief V9-FINAL) — nguồn chữ duy nhất: Google Doc
// "HOMEPAGE V9-FINAL". Đổi cấu trúc: heading "Tôi là Kenji Phạm." (H2 to)
// TRƯỚC ĐÂY giờ hạ thành nhãn nhỏ Vai 5 "TÔI LÀ KENJI PHẠM." — câu trích "Tôi
// không sửa..." lên thay làm neo thị giác chính của section (Vai 2, weight
// 500, italic theo đúng ngoại lệ ghi trong bảng 5 vai). Body đổi nguyên văn
// theo Doc. Dòng ICF + link "Hành trình và nền tảng của Kenji →" là Vai 5 —
// link dùng <ComingLink> (không href) theo luật "chưa mở" mới: KHÔNG còn
// nhãn "(sắp mở)". Body là Vai 3, ④ nằm trong nhóm tăng 1 nấc mobile (③④⑤).
export default function KenjiSection() {
  return (
    <section className="bg-e26-white px-6 py-16 md:py-28 relative overflow-visible">
      {/* SỬA 20/07/2026 (Light System) — thay bg-hero-light.webp (opacity
          0.05) bằng ảnh light-02 "Floating Light" (bg-light-kenji.webp).
          KHÔNG cần overlay/dò contrast: TOÀN BỘ chữ trong section nằm trong
          khối nền đặc bg-e26-cream-deep (div bên dưới, z-10) — ảnh chỉ lộ ra
          ở viền/khoảng trống ngoài khối (không có chữ nào đứng trực tiếp
          trên ảnh) nên hiện ảnh full luôn, không rủi ro contrast. z-auto
          (không set z-index) nên luôn nằm DƯỚI figure (z-20) và khối chữ
          (z-10) đã có sẵn — không cần bọc thêm gì. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/bg-light-kenji.webp)" }}
        aria-hidden="true"
      />
      <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row md:items-center">
        {/* --- Ảnh CHÍNH: chân dung nhìn thẳng, chờm mép khối --- */}
        <figure className="e26-reveal relative z-20 self-center w-[82%] max-w-[360px] md:self-auto md:w-[42%] md:max-w-none md:shrink-0 md:-mr-16">
          <ImageSlot
            ratio="4/5"
            src="/images/home/kenji-portrait.webp"
            alt="Kenji Phạm — chân dung"
          />
        </figure>

        {/* --- LỚP 1: khối kem đậm chứa toàn chữ ---
            MOBILE: -mt-28 kéo khối lên dưới ảnh (ảnh chờm cạnh trên), pt-32 để
            chữ né ảnh. DESKTOP: pl-24 đẩy chữ né phần ảnh chờm sang. --> */}
        <div className="relative z-10 w-full bg-e26-cream-deep -mt-28 px-7 pt-32 pb-10 md:mt-0 md:flex-1 md:pl-24 md:pr-12 md:py-16">
          <p className="e26-reveal font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2 mb-6">
            Tôi là Kenji Phạm.
          </p>
          <div className="e26-reveal space-y-5 font-sans text-[18px] leading-[1.9] text-e26-text-2 max-w-xl">
            <p>
              Tám năm qua, tôi ngồi cùng người lớn, lắng nghe những điều họ không nói được với
              ai. Và ngồi cùng ba mẹ, khi họ yêu con nhưng không biết bắt đầu từ đâu.
            </p>
            <p>Tôi không giúp ai đi nhanh hơn.</p>
            <p>
              Tôi chỉ giữ cho căn phòng đủ yên,
              <br />
              để họ nghe được chính mình.
            </p>
          </div>

          {/* SỬA 20/07/2026 (brief tăng Vai4 + bật link + header) — Việc D:
              quote 42px (Vai 2, brief V9) bị dồn dòng khi đứng cạnh ảnh trong
              cột hẹp (sm:flex-row cũ). Bỏ hẳn sm:flex-row — ảnh trên, quote
              dưới, full-width ở MỌI breakpoint để quote thở đúng tầm. */}
          <div className="mt-10 flex flex-col gap-6">
            <figure className="e26-reveal w-[52%] max-w-[230px] shrink-0">
              <ImageSlot
                ratio="4/5"
                src="/images/home/kenji-pouring-tea.webp"
                alt="Kenji Phạm rót trà"
              />
            </figure>
            <blockquote className="e26-reveal border-l border-e26-black pl-6">
              <p className="font-serif italic font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text max-w-lg">
                &quot;Tôi không sửa. Tôi tạo sự An định.&quot;
              </p>
            </blockquote>
          </div>

          <p className="e26-reveal font-sans text-xs font-medium tracking-[0.18em] uppercase text-e26-text-2 mt-8">
            Huấn luyện viên Tâm lý Chiều sâu · Thực hành theo tiêu chuẩn ICF
          </p>

          <p className="e26-reveal mt-6">
            <ComingLink href="/ve-kenji" className="font-sans text-[17px] underline decoration-e26-black underline-offset-4">
              Hành trình và nền tảng của Kenji →
            </ComingLink>
          </p>
        </div>
      </div>
    </section>
  );
}
