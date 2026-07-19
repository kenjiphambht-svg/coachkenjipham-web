import ImageSlot from "./ImageSlot";

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
//          (~55% cỡ ảnh chính), đặt THẤP trong khối, ĐỨNG CẠNH câu trích "Tôi
//          không sửa..." — ảnh và câu trích cùng khu vực thị giác. Một chính
//          một phụ, chênh cỡ rõ — không hai ảnh ngang cỡ.
// Câu trích + dòng ICF giữ NGUYÊN chữ. KHÔNG che chữ: khối pt lớn (mobile) /
// pl lớn (desktop) — đo thật getBoundingClientRect ở 375/595/767/768/1280px.
export default function KenjiSection() {
  return (
    <section className="bg-e26-white px-6 py-16 md:py-28 relative overflow-visible">
      {/* VIỆC 3 (19/07/2026) — vật liệu nền dùng chung "vệt nắng" (bg-hero-light),
          opacity rất thấp trên nền trắng gốc của section — cùng kỹ thuật đã
          dùng ở KietTac (ảnh mờ trên màu nền, không đổi token). z-auto (không
          set z-index) nên luôn nằm DƯỚI figure (z-20) và khối chữ (z-10) đã
          có sẵn — không cần bọc thêm gì. */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.05]"
        style={{ backgroundImage: "url(/images/home/bg-hero-light.webp)" }}
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
          <h2 className="e26-reveal font-serif font-normal text-[28px] md:text-[40px] text-e26-text mb-8">
            Tôi là Kenji Phạm.
          </h2>
          <div className="e26-reveal space-y-5 font-sans text-[17px] leading-[1.65] text-e26-text-2 max-w-xl">
            <p>
              Tám năm nay, việc của tôi là ngồi nghe. Ngồi cùng người lớn — nghe những điều họ
              không nói được với ai khác. Ngồi cùng ba mẹ — nghe họ lo cho con mà chưa biết lo
              đúng chỗ nào.
            </p>
            <p>
              Người tìm đến tôi thường không thiếu phương pháp. Chỉ là tới nơi rồi, cái mệt
              vẫn còn nguyên đó. Có người ký xong hợp đồng lớn nhất đời mình, ra xe ngồi, tay
              cầm vô lăng, rồi không biết phải về đâu.
            </p>
            <p>Chỗ tôi ngồi xuống không phải chỗ bàn cách đi nhanh hơn.</p>
            <p>
              Phần lớn thời gian, tôi không nói gì nhiều. Tôi rót trà. Giữ căn phòng đủ yên, để
              người đối diện nghe được chính mình.
            </p>
          </div>

          {/* Ảnh PHỤ (rót trà, nhỏ ~55%) ĐỨNG CẠNH câu trích — cùng khu vực thị
              giác. MOBILE: ảnh trên, quote dưới (flex-col). SM+: cạnh nhau. */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <figure className="e26-reveal w-[52%] max-w-[230px] shrink-0">
              <ImageSlot
                ratio="4/5"
                src="/images/home/kenji-pouring-tea.webp"
                alt="Kenji Phạm rót trà"
              />
            </figure>
            <blockquote className="e26-reveal border-l border-e26-black pl-6">
              <p className="font-serif italic text-2xl leading-snug text-e26-text max-w-lg">
                &quot;Tôi không sửa. Tôi tạo sự An định.&quot;
              </p>
            </blockquote>
          </div>

          <p className="e26-reveal font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mt-8">
            Huấn luyện viên Tâm lý Chiều sâu · Thực hành theo tiêu chuẩn ICF
          </p>
        </div>
      </div>
    </section>
  );
}
