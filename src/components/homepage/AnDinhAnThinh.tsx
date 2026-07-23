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
      {/* SỬA 22/07/2026 (brief thay nền ⑦, Việc C) — thay andinh-vuon-toi.webp
          (hiên villa BAN NGÀY, cần overlay đen 82-96% để giả ban đêm) bằng
          an-dinh-toi.webp: ảnh Kenji thả THẬT SỰ chụp/dựng BAN ĐÊM (lối đi lát
          đá dưới trăng dẫn vào villa trắng, cây thông silhouette, mặt trăng ló
          sau tán lá — EXIF gốc: title "villa tối - 1", tác giả Kenji Phạm,
          tạo 2026-07-22). Đổi tên file theo quy tắc mục 5 sổ tay (khắc phục
          luôn lỗi gõ dấu "an-ding-tôi.png" → "an-dinh-toi.png/.webp"). Convert
          webp q90 (65KB) — đã zoom 2x vùng trời/trăng (gradient mượt nhất,
          rủi ro banding cao nhất): không banding.
          Ý NGHĨA KHÁC HẲN ảnh cũ: ảnh mới đã TỐI SẴN (không cần overlay giả
          đêm) — chỉ cần đủ overlay để chữ đọc được, ảnh vẫn giữ được chiều sâu
          thật của cảnh đêm thay vì lớp đen phẳng đè lên ảnh ngày.
          ĐO LẠI overlay TỪ ĐẦU (không giữ 82-96% cũ — ảnh khác bản chất, số cũ
          vô nghĩa): worst-case ĐÚNG CHIỀU cho chữ sáng/nền tối (pixel SÁNG
          nhất, mục 7) — hầu hết chữ đã dư dả ngay cả không overlay (9-16 ở
          nhiều dòng) vì cảnh vốn tối. Điểm nghẽn thật: "câu mở" (Rồi một
          ngày…, cần ≥4.5) và neo gold "An Thịnh." (cần ≥3, chữ lớn Vai 1) —
          cả 2 đều rơi đúng vùng trời/tán lá sáng nhất. Desktop: câu mở đạt 4.5
          ở 28%; mobile (đo riêng, phóng đại khác — mục 1): câu mở đạt 4.5 ở
          36%. Chọn 38% CHUNG cho cả 2 breakpoint (câu mở desktop 5.9, mobile
          4.9 — dư biên cả hai; gold "An Thịnh" 5+ ở cả hai, dư rất nhiều so
          với ngưỡng 3). KHÔNG cần gradient đậm dần về đáy như ảnh cũ: đáy ⑦ ở
          38% flat composite ra ~(14,19,23), ImageBridge (⑧) ngay sau đã đo lại
          mép trên ~(15,15,13) — 2 mốc lệch chỉ ~1-10 đơn vị/kênh, không cần
          gradient riêng để hoà (khác hẳn ảnh cũ vốn cần gradient 82%→96% vì
          ảnh ngày ở 82% vẫn còn sáng ~54/255, hở seam thật với ⑧).
          VỊ TRÍ (background-position): đã dò 5 mốc ngang (20/35/50/65/80%) ở
          mobile (khung dọc hẹp, cover chỉ hiện 1 dải giữa ảnh theo chiều
          rộng) — mốc mặc định 50% (center) đã cho bố cục cân đối nhất (trăng
          + tán cây phía trên, villa + lối đi phía dưới, đọc được trọn vẹn
          "về nhà ban đêm") — GIỮ bg-center, không cần dò lệch vì không có vấn
          đề gì cần sửa (khác case bg-wall-dark cũ vốn near-invisible ở
          center). Chữ ma "AN" (opacity 0.09, thuần trang trí — không cần đạt
          WCAG) đã xem lại bằng mắt: vẫn nhận ra hình dạng/vị trí trên nền
          mới.
          SỬA 22/07/2026 (brief làm tối ⑦ trung tính, Việc B) — Kenji xem thật
          thấy kết quả "vẫn sáng và ám xanh" dù overlay đen 38% đã đo contrast
          đạt. NGUYÊN NHÂN ĐO ĐƯỢC (không đoán): overlay ĐEN thuần là phép
          nhân (composite = raw×(1-alpha)) — phép nhân KHÔNG đổi TỈ LỆ giữa
          các kênh màu, chỉ thu nhỏ biên độ. Quét lưới 25 điểm mẫu trên ảnh
          gốc: vùng trời/trăng có B-R tới +34/255 (RGB thật 77,98,111 tại 1
          điểm) — tăng overlay lên bao nhiêu, tỉ lệ B/R vẫn giữ nguyên, chỉ có
          giá trị tuyệt đối nhỏ lại (ở 38%: B-R còn 21 — vẫn đủ để mắt đọc ra
          "xanh", đúng phản ánh của Kenji, KHÔNG phải lỗi biến màu hay đo sai
          contrast). Tính thử: để tự riêng overlay đen kéo B-R xuống <5 cần
          overlay ≥85% — sẽ xoá sạch toàn bộ chi tiết cảnh đêm (ngược mục tiêu
          giữ villa/lối đi "le lói nhận ra" đã chốt ở Việc C).
          GIẢI PHÁP: filter `saturate(0.3)` áp lên layer ẢNH (trước khi
          overlay đen chồng lên) — kỹ thuật cùng họ với filter khử-cam đã
          dùng ở HomeHero.tsx, nhưng ở đây là khử-XANH bằng giảm bão hoà thay
          vì hue-rotate (ảnh đêm không có "tông cam sai" để xoay, chỉ có
          chênh lệch bão hoà giữa vùng trời xanh và phần còn lại trung tính —
          giảm bão hoà đều là đúng công cụ). Đã tính bằng công thức ma trận
          saturate() chuẩn W3C rồi đo lại qua canvas thật (không chỉ tính
          tay): saturate(0.3) + overlay 38% đưa B-R lớn nhất (25 điểm mẫu lưới
          canvas thật) xuống còn 6/255 — coi là trung tính (dưới ngưỡng nhận
          biết bằng mắt ở độ sáng thấp này).
          NHÂN TIỆN LÀM TỐI HƠN theo đúng tên brief ("làm tối ⑦ AN ĐỊNH hơn"):
          tăng overlay 38%→50% (vẫn giữ saturate(0.3) — max B-R không đổi
          nhiều theo overlay vì tỉ lệ giữ nguyên, đo lại được 5-6/255 ở mọi
          mức 38-55%, xem báo cáo). Contrast đo lại ở 50% (canvas thật, cả 2
          breakpoint): câu mở desktop 7.27/mobile 6.55, gold "An Thịnh"
          desktop 6.61/mobile 6.61 — dư dả hơn hẳn mức 38% cũ, KHÔNG đụng span
          gold nên vẫn đúng 1/3 điểm vàng. Seam đáy ⑦ đo lại ở 50%: (13,15,16)
          so với đỉnh ImageBridge (15,15,13) — vẫn khớp tốt, thậm chí sát hơn
          mức 38% cũ. Ảnh so sánh trước/sau (sharp render tại đúng tỉ lệ
          cover): sky/trăng rõ ràng bớt ám xanh, tổng thể tối/tĩnh hơn — xem
          báo cáo PR. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/home/an-dinh-toi.webp)", filter: "saturate(0.3)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--essence-black-2026)_50%,transparent)]"
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

        {/* Câu kết khối — không nút, Vai 3. SỬA 20/07/2026 (brief sửa lặp
            từ): "Có những cánh cửa..." → "Không phải cánh cửa nào..." —
            Kenji đã duyệt, sẽ đồng bộ vào Doc V9-FINAL sau. */}
        <p className="e26-reveal font-sans font-normal text-[18px] leading-[1.9] text-e26-text-dark-2 mt-16 md:mt-20">
          Không phải cánh cửa nào cũng cần mở ngay.
          <br />
          Chỉ cần bạn biết chúng luôn ở đó.
        </p>
      </div>
    </section>
  );
}
