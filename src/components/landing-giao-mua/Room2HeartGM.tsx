// ============================================================
// PHÒNG 3 — NỖI LÒNG. Tái dùng layout Room2Heart.tsx (Hạt Mầm) — cùng
// pattern đã dùng cho Room2HeartKP.tsx (Khám Phá). Copy NGUYÊN VĂN.
// ============================================================
export default function Room2HeartGM() {
  return (
    <section className="bg-e26-ivory px-6 py-16 md:py-32">
      <div className="max-w-[620px] mx-auto">
        <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-12">
          Có những câu ba mẹ nuốt vào trong.
        </h2>

        <div className="space-y-7 mb-14">
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Con từng kể mọi thứ. Giờ hỏi gì cũng &ldquo;bình thường&rdquo;, &ldquo;không có gì
            đâu&rdquo;.
          </p>
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Hai cha con cãi nhau vì chuyện chọn ngành — và cả hai đều nghĩ mình đang bảo vệ
            tương lai của con.
          </p>
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Con có tình cảm đầu đời. Cấm thì sợ mất con, im thì sợ con vấp.
          </p>
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Cánh cửa phòng con đóng nhiều hơn mở. Mình đứng ngoài, tay giơ lên định gõ rồi lại
            thôi.
          </p>
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Có lúc mình nhìn con như nhìn một người lạ đang lớn lên trong nhà mình.
          </p>
        </div>

        <blockquote className="hm-reveal border-l border-e26-gold pl-6">
          <p className="font-serif italic text-xl md:text-2xl leading-[1.6] text-e26-text">
            Tuổi này con không cần thêm một người quản lý.
          </p>
          <p className="font-serif italic text-xl md:text-2xl leading-[1.6] text-e26-text mt-4">
            Con cần một người lớn dám tôn trọng con — mà không buông con.
          </p>
        </blockquote>
      </div>
    </section>
  );
}
