// ============================================================
// PHÒNG 3 — NỖI LÒNG. Tái dùng layout Room2Heart.tsx (Hạt Mầm): mỗi câu
// hỏi một khối serif, giãn theo space-y-7, pull-quote gạch vàng trái.
// Copy NGUYÊN VĂN theo task — không thêm câu dẫn nào ngoài tiêu đề đã cho.
// ============================================================
export default function Room2HeartKP() {
  return (
    <section className="bg-e26-ivory px-6 py-16 md:py-32">
      <div className="max-w-[620px] mx-auto">
        <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-12">
          Có những câu ba mẹ chỉ hỏi trong đầu.
        </h2>

        <div className="space-y-7 mb-14">
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Sao ở nhà con líu lo cả ngày, mà cô giáo lại bảo con rụt rè?
          </p>
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Hôm con bị điểm kém, mình đã lỡ nói một câu — và thấy mắt con cụp xuống.
          </p>
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Con mê vẽ, mê bóng, mê những thứ &ldquo;không thi được điểm nào&rdquo;. Nên nắn hay
            nên theo?
          </p>
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Con bắt đầu có bạn thân, có bí mật. Mình mừng, mà cũng chống chếnh.
          </p>
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Mình có đang so con với &ldquo;con nhà người ta&rdquo; — bằng chính cái cách ngày xưa
            mình từng bị so?
          </p>
        </div>

        <blockquote className="hm-reveal border-l border-e26-gold pl-6">
          <p className="font-serif italic text-xl md:text-2xl leading-[1.6] text-e26-text">
            Con ở tuổi này không cần thêm một người chấm điểm.
          </p>
          <p className="font-serif italic text-xl md:text-2xl leading-[1.6] text-e26-text mt-4">
            Con cần một người nhìn thấy cách con đang học làm người.
          </p>
        </blockquote>
      </div>
    </section>
  );
}
