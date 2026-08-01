// Section 7 — An Định → An Thịnh. Dark silence section thứ hai của trang
// (đúng 2 khối tối toàn trang: ④ và ⑦).
// SỬA 20/07/2026 (brief V9-FINAL) — nguồn chữ duy nhất: Google Doc "HOMEPAGE
// V9-FINAL". THAY HẲN cấu trúc PR trước (nhãn "An định → An Thịnh" + câu neo
// tiêu đề "Thì ra thành công không cần đánh đổi bình an." là suy diễn riêng
// của PR trước, KHÔNG có trong Doc — Doc thắng, đã bỏ). Cấu trúc đúng theo
// Doc, một khối hai nhịp:
//   Nhịp 1 (AN ĐỊNH): câu mở → thì thầm (con kiến, Vai 4) → body (Vai 3) →
//     neo "Essence gọi đó là: An định." (nhấn giữa câu, "An định" ~Vai 1,
//     KHÔNG gold) → cầu "An định không phải đích đến..." (dòng nhỏ, Vai 4).
//   Nhịp 2 (AN THỊNH): body (Vai 3) → neo cuối "Essence gọi đó là: An
//     Thịnh." (nhấn giữa câu, "An Thịnh" TO NHẤT section + gold #E0C068 —
//     ĐIỂM VÀNG THỨ 3 toàn trang, Kenji đã duyệt) → câu kết khối, không nút.
// Chữ ma "AN" góc trái trên GIỮ NGUYÊN (quyết định cũ).
// SỬA 21/07/2026 (brief dọn cuối trang chủ, Việc C) — toàn bộ đoạn Vai 3/Vai
// 4 trong section này (mở đầu, thì thầm, 2 đoạn thân AN ĐỊNH/AN THỊNH, cầu,
// câu kết) thiếu font-normal nên kế thừa nhầm body{font-weight:300} di sản
// (xem globals.css) thay vì 400 — đã thêm font-normal rõ ràng cho tất cả.
// 2 dòng neo "An định."/"An Thịnh." đã có font-medium sẵn, không đổi.
// SỬA 21/07/2026 (brief tinh gọn câu chữ) — thì thầm viết lại ngắn hơn; bỏ
// dấu ":" ở 2 dòng neo "Essence gọi đó là An định."/"An Thịnh." (chỉ bỏ dấu
// câu, KHÔNG đụng span nhấn to+màu theo sau); "Nó là một nền đất." → "Nó là
// nền đất."; câu kết thêm "bạn" ("Chỉ cần bạn biết..."). LƯU Ý (fable mode —
// đối chiếu thực tế trước khi sửa): đoạn "Nhịp giữa" brief mô tả CŨ là "Đó
// là khi bạn có được một khoảng trống nhỏ xíu..." nhưng file THỰC TẾ đã là
// "Không phải vì cuộc sống dễ hơn..." từ một brief trước — chỉ khác đúng 1
// cụm "mình làm" so với MỚI brief muốn ("bạn chọn làm"), đã sửa đúng cụm đó,
// không áp nhầm toàn bộ CŨ giả định của brief đè lên bản đã đúng sẵn.
// SỬA 22/07/2026 (brief thay nền ⑦ + tăng cỡ chữ nghiêng, Việc D) — 2 đoạn
// "thì thầm"/"cầu" (Vai 4, font-serif italic) tăng từ 17px/18px lên 21px/23px
// (+25%, đúng tỉ lệ brief yêu cầu) cho dễ đọc hơn trên nền ảnh mới tối hơn ở
// vùng chữ. Đã xem lại cả 2 breakpoint: không vỡ dòng xấu (line-height 1.7
// vẫn đủ giãn, đoạn dài nhất "Tối đó, sau một quyết định lớn..." vẫn ngắt
// dòng tự nhiên trong max-w-[640px], không tràn/không rối).
export default function AnDinhAnThinh() {
  return (
    <section className="relative bg-e26-black px-6 py-24 md:py-40 overflow-hidden">
      {/* SỬA 25/07/2026 (brief "Essence Lightscape" v04) — thay hẳn
          an-dinh-toi.webp (villa đêm thật, cần saturate(0)+sepia(0.12) khử ám
          xanh + overlay đen 78% mới đủ tối/trung tính — xem BAI-HOC-KY-THUAT.md
          mục 11 nếu cần bối cảnh lịch sử) bằng an-dinh-v4.webp: ảnh FLUX.2
          [klein] 9B MỚI — nền tối/đêm gần như trọn khung, một dải ánh trăng
          dịu, không villa/lối đi/cây thông silhouette như bản cũ. 1728×960.
          Banding: quét plateau midtone ngang/dọc toàn ảnh — dài nhất 12px,
          không đáng kể (vùng trời/trăng là nơi rủi ro banding cao nhất theo
          brief, đã kiểm riêng).
          MÀU SẮC: quét lưới toàn khung hiển thị (cả 2 breakpoint) không thấy
          ám xanh (B-R tối đa ~6-9/255 ở vùng tối, trung tính) — ảnh mới không
          có vấn đề như ảnh cũ, KHÔNG cần saturate/sepia khử màu nữa. Bỏ hẳn
          filter, chỉ còn overlay đen (giống cách section ④ KietTac.tsx đang
          làm — không filter, chỉ gradient/overlay đen).
          OVERLAY: đo lại từ đầu qua canvas live (brightest pixel dưới từng
          dòng chữ, cả 2 breakpoint) — ảnh đã tối sẵn theo đúng thiết kế nên
          hầu hết dòng đạt 4.5:1/3:1 (neo lớn) ngay cả ở 0% overlay; điểm cần
          overlay nhất là 2 đoạn thân AN THỊNH (đạt 4.5 từ ~13.5% desktop).
          Chọn 20% CHUNG cho cả 2 breakpoint (dư biên desktop tối thiểu 4.88,
          mobile tối thiểu 6.10 — mobile dư nhiều hơn vì crop cover ở đó rơi
          vào vùng tối hơn của ảnh). Thấp hơn hẳn 78% cũ vì bản chất ảnh khác
          hẳn — không còn villa/lối đi cần "le lói nhận ra" nên không cần giữ
          overlay vừa đủ để lộ chi tiết, chỉ cần đủ WCAG.
          VỊ TRÍ: giữ bg-cover bg-center — ảnh không có chi tiết cụ thể cần
          canh giữa như villa/lối đi bản cũ, bố cục đối xứng tự nhiên đã ổn ở
          center. Chữ ma "AN" (opacity 0.09) vẫn nhận ra hình dạng trên nền
          mới. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/an-dinh-v4.webp)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-black-2026)_20%,transparent)]"
        aria-hidden="true"
      />
      <span className="andinh-ghost-an absolute top-6 left-6 md:top-10 md:left-10 font-serif" aria-hidden="true">
        AN
      </span>
      <div className="relative max-w-[640px] mx-auto text-center">
        {/* Nhịp 1 — AN ĐỊNH: câu mở (Vai 3) */}
        <p className="e26-reveal font-sans font-normal text-[18px] leading-[1.9] text-e26-text-dark-2">
          Rồi một ngày,
          <br />
          bạn nhận ra mình thở khác.
        </p>

        {/* Thì thầm — Vai 4: serif italic nhỏ, opacity ~0.75 (dùng token phụ
            text-dark-2 sẵn có thay vì opacity rời để không xung đột với
            transition opacity của .e26-reveal). */}
        <p className="e26-reveal font-serif italic font-normal text-[21px] md:text-[23px] leading-[1.7] text-e26-text-dark-2 mt-8">
          Tối đó, sau một quyết định lớn, bạn vẫn ngủ được. Bữa cơm nhà bớt căng. Con chạy vào
          kể một câu chuyện dài về con kiến ngoài sân. Lần này, bạn nghe hết, mỉm cười. Rồi mới
          gọi con đi ăn cơm.
        </p>

        {/* Body — Vai 3 */}
        <p className="e26-reveal font-sans font-normal text-[18px] leading-[1.9] text-e26-text-dark-2 mt-10">
          Không phải vì cuộc sống dễ hơn.
          <br />
          Mà vì giữa điều xảy ra
          <br />
          và điều bạn chọn làm tiếp theo,
          <br />
          đã có một khoảng lặng.
        </p>

        {/* Neo — "An Định" nhấn giữa câu: lead Vai 2, "An Định" ~Vai 1.
            SỬA 21/07/2026 (brief Việc B) — viết hoa cả 2 chữ "An Định" cho
            nhất quán với neo cuối "An Thịnh" (đang viết hoa cả 2). CHỈ đổi
            chữ cái, GIỮ NGUYÊN kỹ thuật nhấn-giữa-câu (span cỡ lớn riêng). */}
        <p className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text-dark mt-10">
          Essence gọi đó là{" "}
          <span className="text-[40px] md:text-[64px] leading-[1.15]">An Định.</span>
        </p>

        {/* Cầu — dòng nhỏ, Vai 4 */}
        <p className="e26-reveal font-serif italic font-normal text-[21px] md:text-[23px] leading-[1.7] text-e26-text-dark-2 mt-8">
          An Định không phải đích đến. Nó là nền đất.
        </p>

        {/* Nhịp 2 — AN THỊNH: body Vai 3 */}
        <p className="e26-reveal font-sans font-normal text-[18px] leading-[1.9] text-e26-text-dark-2 mt-16">
          Thành công,
          <br />
          khi bên trong chưa vững,
          <br />
          rất dễ trở thành gánh nặng.
        </p>
        <p className="e26-reveal font-sans font-normal text-[18px] leading-[1.9] text-e26-text-dark-2 mt-6">
          Khi nền đủ vững,
          <br />
          điều đến sau
          <br />
          mới ở lại.
        </p>

        {/* Neo cuối — "An Thịnh" TO NHẤT section + gold #E0C068 (điểm vàng
            thứ 3 toàn trang), thở rộng trên/dưới để câu đứng một mình như
            đích đến. */}
        <p className="e26-reveal font-serif font-medium text-[30px] md:text-[42px] leading-[1.25] text-e26-text-dark mt-16 md:mt-24">
          Essence gọi đó là{" "}
          <span className="text-e26-gold text-[48px] md:text-[72px] leading-[1.1]">
            An Thịnh.
          </span>
        </p>

      </div>
    </section>
  );
}
