// Section 7 — An Định → An Thịnh. Dark silence section thứ hai của trang
// (đúng 2 khối tối toàn trang: ④ và ⑦). Chữ ma "AN" mờ 5% phía sau, tĩnh,
// không animate — giữ theo quyết định của Kenji.
export default function AnDinhAnThinh() {
  return (
    <section className="relative bg-e26-black px-6 py-24 md:py-40 overflow-hidden">
      <span className="andinh-ghost-an absolute inset-0 flex items-center justify-center font-serif" aria-hidden="true">
        AN
      </span>
      <div className="relative max-w-[640px] mx-auto text-center">
        <p className="e26-reveal font-sans text-[17px] leading-[1.8] text-e26-text-dark-2">
          Rồi một ngày, bạn nhận ra mình thở khác.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.8] text-e26-text-dark-2 mt-6">
          Chỉ là tối đó, sau một quyết định lớn, bạn ngủ được. Bữa cơm nhà bớt căng. Con kể một
          chuyện dài về con kiến ngoài sân, kể mà chẳng có đầu có đuôi gì — lần này bạn nghe hết,
          rồi mới gọi con vào ăn cơm.
        </p>
        <p className="e26-reveal font-serif text-2xl text-e26-text-dark mt-10">
          Trạng thái đó có một cái tên: <span className="italic">An định.</span>
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.8] text-e26-text-dark-2 mt-10">
          Bên trong bớt căng. Có một khoảng trống nhỏ giữa chuyện xảy ra và điều mình làm tiếp
          theo.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.8] text-e26-text-dark-2 mt-6">
          An định không phải đích đến. Nó là nền đất.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.8] text-e26-text-dark-2 mt-6">
          Vì có một điều ít người nói ra: thành công đến khi bên trong chưa vững, thì chính nó
          thành gánh nặng. Được càng nhiều, sợ mất càng lớn. Và người ta vẫn gọi đó là thành
          công.
        </p>
        <p className="e26-reveal font-sans text-[17px] leading-[1.8] text-e26-text-dark-2 mt-6">
          Còn khi nền đủ vững, cái đến sau mới ở lại được, mà không phải căng người ra giữ.
        </p>
        <p className="e26-reveal font-serif text-2xl text-e26-text-dark mt-10">
          Trong Essence, chỗ đó có tên: <span className="italic">An Thịnh.</span>
        </p>
      </div>
    </section>
  );
}
