import ImageSlot from "./ImageSlot";

// Section 3 — Kenji là ai, dựng theo hệ KHỐI-LỚP (18/07/2026).
//   Lớp 1: KHỐI KEM ĐẬM (--essence-cream-deep-2026 #E9E6DC) chứa TOÀN BỘ chữ
//          — phân biệt được với nền trắng section nhưng vẫn trong họ kem, sáng
//          ~91% nên KHÔNG đọc thành khối tối thứ ba (toàn trang vẫn đúng 2 khối
//          tối ④ ⑦ + footer).
//   Lớp 2: ảnh rót trà CHỜM QUA CẠNH KHỐI (kỹ thuật B — phá khung tạo chiều sâu).
//          MOBILE: ảnh ở trên, chờm qua cạnh TRÊN của khối (một phần ngoài khối,
//          đè lên nền trắng). DESKTOP: ảnh bên trái, chờm qua cạnh trái của khối
//          theo chiều ngang (-mr-16 ăn vào khối, khối pl-24 đẩy chữ né).
// Câu trích "Tôi không sửa..." nằm TRONG khối, gần cuối, giữ nguyên chữ.
// KHÔNG che chữ: khối có pt lớn (mobile) / pl lớn (desktop) để chữ luôn né ảnh
// — đã đo thật bằng getBoundingClientRect ở 375/595/767/768/1280px.
export default function KenjiSection() {
  return (
    <section className="bg-e26-white px-6 py-16 md:py-28 relative overflow-visible">
      <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row md:items-center">
        {/* --- LỚP 2: ảnh rót trà, chờm mép khối --- */}
        <figure className="e26-reveal relative z-20 self-center w-[82%] max-w-[360px] md:self-auto md:w-[42%] md:max-w-none md:shrink-0 md:-mr-16">
          <ImageSlot
            ratio="4/5"
            src="/images/home/kenji-pouring-tea.webp"
            alt="Kenji Phạm rót trà"
          />
        </figure>

        {/* --- LỚP 1: khối kem đậm chứa toàn chữ ---
            MOBILE: -mt-12 kéo khối lên dưới ảnh (ảnh chờm cạnh trên), pt-20 để
            chữ né ảnh. DESKTOP: pl-24 đẩy chữ né phần ảnh chờm sang. --> */}
        <div className="relative z-10 w-full bg-e26-cream-deep -mt-28 px-7 pt-32 pb-10 md:mt-0 md:flex-1 md:pl-24 md:pr-12 md:py-16">
          <h2 className="e26-reveal font-serif font-normal text-[28px] md:text-[40px] text-e26-text mb-8">
            Tôi là Kenji Phạm.
          </h2>
          <div className="e26-reveal space-y-5 font-sans text-[17px] leading-[1.65] text-e26-text-2 max-w-xl">
            <p>
              Tâm lý chiều sâu, những tấm bản đồ biểu tượng — tôi mang chúng theo từ rất lâu,
              trước cả khi tôi làm nghề này.
            </p>
            <p>
              Tám năm nay, tôi ngồi cùng người lớn — nghe họ kể về công việc, về gia đình, về
              những thứ họ không nói được với ai khác. Và ngồi cùng ba mẹ — nghe họ lo cho con
              mà không biết lo đúng chỗ nào.
            </p>
            <p>
              Người tìm đến tôi thường không thiếu phương pháp. Chỉ là tới nơi rồi, cái mệt
              vẫn còn nguyên đó. Có người ký xong hợp đồng lớn nhất đời mình, ra xe ngồi, tay
              cầm vô lăng, rồi không biết phải về đâu.
            </p>
            <p>Nên chỗ tôi ngồi xuống không phải chỗ bàn cách đi nhanh hơn.</p>
            <p>
              Phần lớn thời gian, tôi không nói gì nhiều. Tôi rót trà. Rồi giữ cho căn phòng đủ
              yên, để người ngồi đối diện nghe được chính mình.
            </p>
          </div>
          <blockquote className="e26-reveal border-l border-e26-black pl-6 mt-8">
            <p className="font-serif italic text-2xl leading-snug text-e26-text max-w-lg">
              &quot;Tôi không sửa. Tôi tạo sự An định.&quot;
            </p>
          </blockquote>
          <p className="e26-reveal font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mt-6">
            Huấn luyện viên Tâm lý Chiều sâu · Thực hành theo tiêu chuẩn ICF
          </p>
        </div>
      </div>
    </section>
  );
}
