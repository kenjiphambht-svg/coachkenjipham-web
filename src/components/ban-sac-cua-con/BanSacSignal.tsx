import { BanSacAnchor, BanSacBody } from "./BanSacTypography";

export default function BanSacSignal() {
  return (
    <div className="relative isolate overflow-hidden bg-e26-black px-6 py-24 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90 [background:radial-gradient(ellipse_62%_70%_at_76%_32%,rgba(241,239,232,0.1),transparent_64%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(115deg,transparent_0,rgba(255,255,255,0.8)_48%,transparent_49%)]"
      />
      <div className="relative mx-auto max-w-[1120px]">
        <div className="max-w-[860px]">
          <BanSacAnchor as="h2" className="text-e26-text-dark md:text-[40px]">
            Khi con lớn lên
          </BanSacAnchor>
          <div aria-hidden="true" className="mt-10 h-px w-14 bg-e26-gold md:mt-14" />
          <p className="mt-10 max-w-[840px] font-serif text-[46px] font-normal italic leading-[0.98] tracking-[-0.02em] text-e26-text-dark [text-wrap:balance] md:mt-14 md:text-[80px]">
            Mỗi chặng tuổi, con cần được thương bằng một cách khác
          </p>
          <div className="mt-14 space-y-7 md:mt-20">
            <BanSacBody className="text-e26-text-dark">Khi con còn nhỏ, ba mẹ thường đứng rất gần. Mình giúp con ăn, ngủ, thay quần áo, dỗ dành và giữ cho căn nhà có một nhịp đủ an toàn.</BanSacBody>
            <BanSacBody className="text-e26-text-dark">Khi con bắt đầu đi học, khoảng cách ấy dần thay đổi. Con có thêm bạn bè, thầy cô, những điều muốn giữ riêng và những câu hỏi không còn chạy về hỏi ba mẹ đầu tiên.</BanSacBody>
            <BanSacBody className="text-e26-text-dark">Đến tuổi chuyển mùa, có hôm con vẫn cần một cái ôm. Có hôm lại chỉ muốn đóng cửa phòng và được yên. Điều khó nhất không phải là thương con ít đi. Điều khó là biết tình thương của mình nên xuất hiện theo cách nào.</BanSacBody>
            <BanSacBody className="text-e26-text-dark">Có những cách từng rất đúng khi con lên năm, đến tuổi mười lăm lại dễ làm con thấy mình chưa được tin tưởng. Có những câu hỏi ba mẹ nghĩ là quan tâm, nhưng con lại nghe thành sự kiểm soát. Cũng có những lúc mình lùi quá xa vì sợ làm phiền, trong khi con vẫn đang âm thầm chờ một người hỏi đúng câu.</BanSacBody>
            <BanSacBody className="text-e26-text-dark">Bản Sắc Của Con không quyết định thay ba mẹ lúc nào nên tiến, lúc nào nên lùi. Nó chỉ giúp mình nhận ra rõ hơn: ở chặng tuổi này, con đang cần được gần theo cách nào.</BanSacBody>
          </div>
        </div>
      </div>
    </div>
  );
}
