// Section 9b — Signature Ending (MỚI, brief V9-FINAL 20/07/2026). Một dòng
// serif italic, căn giữa, đứng trước Footer — cùng tinh thần lặng với ②b
// Signature Moment (bookend đầu/cuối trang). Nền ivory (nối tiếp ⑨ Một Góc
// Để Quay Lại, trước khi rơi vào khối đen Footer).
export default function SignatureEnding() {
  return (
    <section className="bg-e26-ivory px-6 py-16 md:py-20">
      <p className="e26-reveal font-serif italic font-normal text-[22px] md:text-[28px] leading-snug text-e26-text-2 text-center max-w-2xl mx-auto">
        Mỗi người đều có một nhịp sống.
        <br />
        Essence chỉ mong bạn không đánh mất nhịp của mình.
      </p>
    </section>
  );
}
