import ImageSlot from "./ImageSlot";

// Section 3 — Kenji là ai. Nền white, editorial 2 cột: ảnh 5/12 trái, chữ 7/12 phải.
// Ảnh 2 (rót trà, ratio 4/5) tràn NGƯỢC LÊN ranh giới ②→③ bằng margin âm phía trên —
// ảnh 1 ở Hero tràn xuống từ cột phải.
// LƯU Ý: cột chữ (col-span-7, cột 6-12) và ảnh Hero (col-span-5, cột 8-12) CHIA SẺ
// cột 8-12 theo lưới 12 cột — không phải "khác cột ngang" như ghi chú cũ (sai, đã
// sửa). Vì vậy KHÔNG dựa vào việc lệch cột để tránh chồng chữ; thay vào đó tăng
// pt (32px→96px desktop) để chữ bắt đầu thấp hơn, cộng với thu hẹp mức tràn của
// ảnh Hero (xem HomeHero.tsx) — đã đo thật bằng getBoundingClientRect ở cả
// mobile (375-595px) và desktop (1280px), không còn chồng lên "Tôi là Kenji Phạm.".
export default function KenjiSection() {
  return (
    <section className="bg-e26-white px-6 pt-12 pb-16 md:pt-24 md:pb-32 relative overflow-visible">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* --- Ảnh 2 — rót trà, tràn lên ranh giới (swap slot 4:5) --- */}
          <figure className="e26-reveal md:col-span-5 relative z-10 -mt-16 md:-mt-28">
            {/* SWAP SLOT: /images/home/kenji-pouring-tea.webp khi có ảnh web-ready */}
            <ImageSlot ratio="4/5" />
            <figcaption className="font-sans text-sm text-e26-text-2 pt-3 pb-3 border-b border-e26-border">
              Sài Gòn · 2026
            </figcaption>
          </figure>

          {/* --- Nội dung 7/12 --- */}
          <div className="e26-reveal md:col-span-7">
            <h2 className="font-serif font-normal text-[28px] md:text-[40px] text-e26-text mb-8">
              Tôi là Kenji Phạm.
            </h2>
            <div className="space-y-5 font-sans text-[17px] leading-[1.65] text-e26-text-2 max-w-xl">
              <p>
                Tâm lý chiều sâu, những tấm bản đồ biểu tượng — tôi mang chúng theo từ rất lâu,
                trước cả khi tôi ngồi xuống làm nghề này.
              </p>
              <p>
                Tám năm nay, tôi ngồi cùng người lớn — nghe họ kể về công việc, về gia đình, về
                những thứ họ không nói được với ai khác. Và ngồi cùng ba mẹ — nghe họ lo cho con
                mà không biết lo đúng chỗ nào.
              </p>
              <p>
                Người tìm đến tôi thường không thiếu phương pháp. Họ đã học đủ cách để đi tới
                đích. Chỉ là tới nơi rồi, cái mệt vẫn còn nguyên đó. Có người ký xong hợp đồng
                lớn nhất đời mình, ra xe ngồi, tay cầm vô lăng, rồi không biết phải về đâu.
              </p>
              <p>Nên chỗ tôi ngồi xuống không phải chỗ bàn cách đi nhanh hơn.</p>
              <p>
                Phần lớn thời gian, tôi không nói gì nhiều. Tôi rót trà. Rồi giữ cho căn phòng đủ
                yên, để người ngồi đối diện nghe được chính mình.
              </p>
            </div>
            <blockquote className="border-l border-e26-gold pl-6 mt-8">
              <p className="font-serif italic text-2xl leading-snug text-e26-text max-w-lg">
                &quot;Tôi không sửa. Tôi tạo sự An định.&quot;
              </p>
            </blockquote>
            <p className="font-sans text-sm tracking-[0.08em] uppercase text-e26-text-2 mt-6">
              Huấn luyện viên Tâm lý Chiều sâu · Thực hành theo tiêu chuẩn ICF
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
