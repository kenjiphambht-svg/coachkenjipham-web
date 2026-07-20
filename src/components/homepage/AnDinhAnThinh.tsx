// Section 7 — An Định → An Thịnh. Dark silence section thứ hai của trang
// (đúng 2 khối tối toàn trang: ④ và ⑦).
// SỬA 20/07/2026 — dàn lại thành 4 NHỊP theo brief "Phân cấp chữ + nội dung
// ⑥⑦ + 2 link nội bộ" (nguồn: Google Doc bản mới, thay wording cũ):
//   Nhịp 1 thì thầm (Vai 4, nhỏ, kể chuyện) → Nhịp 2 neo "An định" (Vai 1/2,
//   nhấn cỡ giữa câu) → Nhịp 3 giọng kể (Vai 3, thân bài) → Nhịp 4 neo cuối
//   "An Thịnh" (Vai 1, TO NHẤT section, tô gold #E0C068 — ĐIỂM VÀNG THỨ 3
//   toàn trang, Kenji đã duyệt, đúng 3 điểm/trang tối đa theo AGENTS.md).
// Thêm nhãn cửa phòng (Vai 5) + câu neo tiêu đề (Vai 2) mới đầu section —
// KHÔNG có trước đây. Chữ ma "AN" góc trái trên GIỮ NGUYÊN (quyết định cũ).
// KHÔNG đụng lớp nền bg-wall-dark (để dành PR ảnh nền riêng).
export default function AnDinhAnThinh() {
  return (
    <section className="relative bg-e26-black px-6 py-24 md:py-40 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.13]"
        style={{ backgroundImage: "url(/images/home/bg-wall-dark.webp)" }}
        aria-hidden="true"
      />
      <span className="andinh-ghost-an absolute top-6 left-6 md:top-10 md:left-10 font-serif" aria-hidden="true">
        AN
      </span>
      <div className="relative max-w-[640px] mx-auto text-center">
        <p className="e26-reveal font-sans text-xs tracking-[0.14em] uppercase text-e26-text-dark-2 mb-4">
          An định → An Thịnh
        </p>
        <p className="e26-reveal font-serif font-normal text-[26px] md:text-[34px] leading-snug text-e26-text-dark mb-12">
          Thì ra thành công không cần đánh đổi bình an.
        </p>

        {/* Nhịp 1 — thì thầm (Vai 4: serif italic, nhỏ hơn body, kể chuyện) */}
        <p className="e26-reveal font-serif italic text-[15px] md:text-base leading-[1.8] text-e26-text-dark-2">
          Rồi một ngày, bạn nhận ra mình thở khác.
        </p>
        <p className="e26-reveal font-serif italic text-[15px] md:text-base leading-[1.8] text-e26-text-dark-2 mt-4">
          Chỉ là tối đó, sau một quyết định lớn, bạn vẫn ngủ được ngon giấc. Bữa cơm nhà tự
          nhiên bớt căng. Con chạy vào kể một chuyện dài ngoằng về con kiến ngoài sân, kể chẳng
          có đầu có đuôi gì — nhưng lần này bạn không ngắt lời. Bạn thong thả nghe cho hết, mỉm
          cười, rồi mới gọi con đi rửa tay ăn cơm.
        </p>

        {/* Nhịp 2 — NEO 1: "An định" nhấn cỡ giữa câu (Vai 1/2) */}
        <p className="e26-reveal font-serif text-xl md:text-2xl text-e26-text-dark mt-12">
          Trạng thái đó có một cái tên:{" "}
          <span className="text-[32px] md:text-[44px] leading-none">An định.</span>
        </p>

        {/* Nhịp 3 — giọng kể (Vai 3: sans, thân bài) */}
        <p className="e26-reveal font-sans text-[17px] leading-[1.8] text-e26-text-dark-2 mt-12">
          Đó là khi bạn có được một khoảng trống nhỏ xíu giữa chuyện vừa xảy ra, và điều mình
          sắp làm tiếp theo.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.8] text-e26-text-dark-2 mt-6">
          An định không phải là đích đến. Nó là một nền đất.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.8] text-e26-text-dark-2 mt-6">
          Vì có một sự thật mà người lớn ít kể cho nhau nghe: thành công mà đến khi bên trong
          chưa vững, thì chính nó lại hóa thành gánh nặng. Tay ôm vào càng nhiều, trong lòng
          càng nơm nớp sợ rớt. Và người ta vẫn quen gọi sự nơm nớp đó là thành công.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.8] text-e26-text-dark-2 mt-6">
          Còn khi nền đất đã đủ vững, mọi trái ngọt đến sau sẽ tự nhiên mọc rễ và ở lại. Bạn
          không còn phải gồng người ra giữ, cũng chẳng cần mệt mỏi chứng minh thêm điều gì.
        </p>

        {/* Nhịp 4 — NEO CUỐI: nhấn-giữa-câu như Nhịp 2, "An Thịnh" TO NHẤT
            section + gold #E0C068 (điểm vàng thứ 3 toàn trang), thở rộng
            trên/dưới để câu đứng một mình như đích đến. */}
        <p className="e26-reveal font-serif text-xl md:text-2xl text-e26-text-dark mt-16 md:mt-24 mb-16 md:mb-20">
          Trong Essence, một đời sống như thế có tên là:{" "}
          <span className="text-e26-gold text-[34px] md:text-[52px] leading-none">An Thịnh.</span>
        </p>
      </div>
    </section>
  );
}
