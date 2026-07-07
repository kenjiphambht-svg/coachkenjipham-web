// ============================================================
// PHÒNG 2 — NỖI LÒNG CỦA BA MẸ (Section 3)
// Nền ivory, chữ #1A1A1A. Mỗi câu hỏi một khối, giãn 28–32px, max-width 620px.
// Đoạn "Có những đêm con ngủ rồi…" tách pull-quote Cormorant italic gạch vàng trái.
// Copy nguyên văn docs/product/landing-hat-mam-v3-copy.md.
// ============================================================
export default function Room2Heart() {
  return (
    <section className="bg-e26-ivory px-6 py-16 md:py-32">
      <div className="max-w-[620px] mx-auto">
        <h2 className="hm-reveal font-serif font-normal text-[28px] md:text-[38px] leading-tight text-e26-text mb-6">
          Có những câu hỏi không nằm trong sách nuôi con
        </h2>
        <p className="hm-reveal font-sans text-[17px] leading-[1.65] text-e26-text-2 mb-12">
          Có những điều ba mẹ tự hỏi,
          <br />
          mà chẳng cuốn cẩm nang nào trả lời thay được.
        </p>

        <div className="space-y-7 mb-14">
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Sao con cứ quấy khóc mà mình không hiểu lý do?
          </p>
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Nuôi theo đúng sách dạy,
            <br />
            sao con vẫn không như mình nghĩ?
          </p>
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Con bướng bỉnh — là con đang hư,
            <br />
            hay đó là một cá tính đang học cách lên tiếng?
          </p>
          <p className="hm-reveal font-serif text-xl md:text-2xl leading-snug text-e26-text">
            Làm sao biết con có hạt mầm tài năng gì từ sớm?
          </p>
        </div>

        {/* Pull-quote: "Có những đêm con ngủ rồi…" */}
        <blockquote className="hm-reveal border-l border-e26-gold pl-6 mb-14">
          <p className="font-serif italic text-xl md:text-2xl leading-[1.6] text-e26-text">
            Và có những đêm con ngủ rồi,
            <br />
            ba mẹ vẫn còn thức.
          </p>
          <p className="font-serif italic text-lg leading-[1.6] text-e26-text-2 mt-6">
            Không phải vì chưa xong việc.
          </p>
          <p className="font-serif italic text-lg leading-[1.6] text-e26-text-2 mt-4">
            Mà vì trong lòng còn vướng một câu:
          </p>
          <p className="font-serif italic text-xl md:text-2xl leading-[1.6] text-e26-text mt-6">
            &ldquo;Hồi nãy mình nói vậy với con&hellip;
            <br />
            có nặng quá không?&rdquo;
          </p>
        </blockquote>

        <div className="hm-reveal font-sans text-[17px] leading-[1.75] text-e26-text-2 space-y-5">
          <p className="text-e26-text">
            Bản Sắc Hạt Mầm không làm ba mẹ trở thành người hoàn hảo.
          </p>
          <p>
            Nó chỉ thắp thêm một ánh đèn nhỏ —
            <br />
            để lần sau, khi con khóc, con bướng, con im lặng,
            <br />
            mình không đáp lại từ mệt mỏi,
            <br />
            mà đáp lại từ sự hiểu.
          </p>
        </div>
      </div>
    </section>
  );
}
