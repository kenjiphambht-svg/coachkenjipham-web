import Image from "next/image";

// Ảnh trang trí (alt rỗng, aria-hidden) — phủ lớp cream ~90% lên trên để chữ
// hero giữ nguyên độ tương phản đọc được (không đổi màu chữ hiện tại).
//
// SỬA 21/07/2026 (brief ghép nền hero villa) — thay bg-light-hero.webp
// (ảnh Light trừu tượng) bằng hero-hien-vuon.webp — ảnh villa hiên vòm nhìn
// ra vườn thật Kenji cung cấp. ĐÃ LẬT NGANG (scaleX ngược khi convert qua
// sharp .flop(), không lật bằng CSS) so với file gốc hero-hien-vuon.png:
// ảnh gốc sáng từ bên PHẢI (bóng đổ trái) + vườn mở bên TRÁI — lật xong
// sáng từ bên TRÁI (bóng đổ phải, khớp hướng sáng ảnh Kenji cutout hiện có)
// + vườn mở dời sang bên PHẢI (đúng vị trí Kenji ngồi trong Hero). Convert
// webp quality 90 (100KB, đã so 90/95/98/100 — không thấy banding ở vùng
// trần/tường phẳng nhất kể cả q90, chọn q90 nhẹ nhất mà vẫn sạch, dưới
// ngưỡng 300-500KB gợi ý vì ảnh này không cần nặng vậy mới giữ được nét).
// TRIẾT LÝ MỚI (khác hẳn ảnh Light trừu tượng cũ): villa phải RÕ, thấy ánh
// sáng thật — overlay TỐI THIỂU, không che mờ nặng như overlay 70% cũ. Xem
// ghi chú tại div overlay bên dưới cho % thật đã đo.
// SỬA 22/07/2026 (brief ghép Kenji vào nền Hero mới) — thay hero-hien-vuon
// bằng hero-hien-vuon1: villa NGOÀI TRỜI (vườn hồ nước/rêu TRÁI, tường trắng
// + vòm GIỮA x≈620-780/1672, hiên gỗ mái che + bàn thấp PHẢI, nắng vàng chéo
// từ trái). Convert webp q92 (314KB) — đã so PNG gốc vs webp phóng to 2x tại
// vùng trời gradient mịn (rủi ro banding cao nhất): không banding. Đo màu
// thật: trắng dưới nắng (140,131,111) R-B=+29 — tông vàng ấm là ĐẶC TRƯNG
// THẬT của ảnh, không phải cast lỗi → KHÔNG áp filter khử-cam như ảnh cũ
// (saturate50/brightness107 là thuốc kê riêng cho ảnh cũ, đã gỡ). Ảnh này
// KHÔNG lật (khác ảnh cũ phải .flop()): bố cục gốc đã đúng chiều cần —
// chỗ ngồi (hiên gỗ) bên phải, vườn bên trái.
const HERO_BG_SRC: string | undefined = "/images/home/hero-hien-vuon1.webp";

// SỬA 21/07/2026 (brief thay ảnh cutout) — ảnh cũ kenji-hero-window.webp có
// NỀN PHÒNG riêng, phải bọc khung chữ nhật (aspect-[4/5] + object-cover +
// overflow-hidden + shadow + ring) để 2 nền (nền ảnh + nền Hero) không đá
// nhau lộ liễu → vẫn là "dán ghép". Kenji thả ảnh CUTOUT nền trong suốt thật
// (kenji-hero-cutout.png, đã kiểm alpha channel thật: 68.7% trong suốt hoàn
// toàn, 28.9% đặc, 2.3% viền anti-alias — không phải nền đen/trắng giả).
// SỬA 22/07/2026 (brief thay ảnh Kenji chân đầy đủ, Việc A) — Kenji GHI ĐÈ
// đúng file kenji-hero-cutout.png bằng ảnh MỚI: chân ghế + chân người ĐẦY ĐỦ
// (không còn cắt cụt). Đã đo alpha bbox thật của ảnh mới (1792×2304 gốc,
// bbox 335,300→1518,2176): biên dưới bbox có 128px (5.6%) trong suốt HOÀN
// TOÀN — khác hẳn ảnh cũ (0px, nội dung chạm thẳng mép dưới). Soi cột alpha
// tại mũi giày (x=1400): 255→247→193→79→10→0 mượt trong ~8px — mũi giày tự
// thon nhỏ rồi tan vào trong suốt, KHÔNG phải bị hộp chữ nhật cắt cụt giữa
// chừng. Crop khít theo bbox +6px đệm (tránh cắt sát viền AA) → 1195×1888
// (tỉ lệ 0.633 — khác hẳn 720×844/0.853 của ảnh cũ, ảnh mới THON HƠN nhiều
// theo chiều dọc). Convert webp q92, alphaQuality 100 — soi viền tóc + tay
// cầm cốc phóng to 4x: mượt, không viền đen/trắng sót — 116KB.
// SỬA 22/07/2026 (brief thay cutout mới + lật hướng nhìn, Bước 0-3) — Kenji
// GHI ĐÈ LẦN NỮA đúng file này bằng ảnh MỚI HẲN: dáng ngồi khác (bắt chéo
// chân, ghế bành có tay vịn), nét cao hơn rõ rệt (2800×3600 gốc, so với
// 1792×2304 bản trước — ~1.56x theo chiều dài cạnh). Đã kiểm: alpha thật
// (77.9% trong suốt, 21.1% đặc, 1.05% viền AA — không phải nền giả), viền
// tóc + tay áo phóng to 3x mượt, không lởm chởm. Crop bbox+8px đệm →
// 2122×2806 (tỉ lệ 0.756, khác hẳn 1195×1888/0.633 bản trước — ảnh mới RỘNG
// HƠN theo tỉ lệ, không thon dài bằng). Convert webp q95 (nâng từ q92 —
// brief yêu cầu ưu tiên nét, ảnh gốc cũng nét hơn nên xứng đáng mức nén cao
// hơn) — so ảnh gốc PNG vs webp phóng to 3x tại vùng tóc: không phân biệt
// được sai khác, không mất chi tiết vải/tóc — 313KB (hợp lý cho ảnh priority
// LCP ở độ phân giải này, Next/Image vẫn tạo srcset nhỏ hơn cho màn hình
// thường). HƯỚNG NHÌN: ảnh gốc (chưa lật) mặt quay sang TRÁI (đã xem trực
// tiếp, không đoán) — cùng hướng với ảnh cũ trước khi lật ở PR#49. Khung
// vòm-vườn (đo lại tại 1440px sau PR#54: villa dịch object-position 85%)
// vẫn nằm bên PHẢI cột Kenji (đã đo: cột Kenji track kết thúc x≈518, khung
// vòm bắt đầu x≈420 — chồng vào nửa phải cột Kenji rồi lấn tiếp ra ngoài) →
// scaleX(-1) HIỆN CÓ vẫn đúng hướng cần, GIỮ NGUYÊN (không lật mù theo suy
// đoán — đã xác nhận bằng ảnh chụp thật sau khi gắn ảnh mới: Kenji nhìn
// sang phải, đúng phía khung vườn). MÀU DA: đo RGB thật vùng trán (R=197.5
// G=166.3 B=153.0, R-B=44.5) và má (R=195.5 G=159.4 B=148.0, R-B=47.5) —
// so với ảnh chân dung đối chứng đã dùng ổn định trên site (kenji-portrait
// .webp, R-B đo được 74.5-77.2, ẤM HƠN NHIỀU) thì ảnh cutout mới còn TRUNG
// TÍNH HƠN, không lệch hồng/cam như brief lo ngại → KHÔNG áp filter da (đã
// đo, đạt, không cần chỉnh — đúng tinh thần "không filter phòng hờ không
// cần thiết" brief yêu cầu).
const HERO_IMAGE_SRC: string | null = "/images/home/kenji-hero-cutout.webp";

// SỬA 20/07/2026 (brief V9-FINAL) — chữ + cỡ giữ NGUYÊN (brief xác nhận "đã
// đúng"), chỉ sửa ngắt dòng thơ ở body cho khớp từng dòng trong Google Doc
// V9-FINAL (trước đây 2 câu ngắn bị gộp chung 1 dòng ở 2 đoạn).
// Section 2 — Hero: trạng thái con người, dựng theo hệ KHỐI-LỚP.
// Nền CREAM (không phải ivory — luật #2). Chữ lớn nhất mắt nhìn thấy nhưng
// KHÔNG phải heading (H1 duy nhất ở section Kiệt Tác) — dùng <p>, không <h1>.
//   Lớp 1 (dưới): ảnh bg-hero-open phủ TRỌN section + lớp cream ~90% → chữ
//                 nổi trên nền nắng (kỹ thuật A), không đứng trên nền trơn.
//   Lớp 2: khối chữ hero (trái ~40%, cột 2/5).
//   Lớp 3 (trên): ảnh Kenji (phải ~60%, cột 3/5). CHỜM XUỐNG ranh giới ②→③ —
//                 mà ③ (sau khi đảo mạch 19/07) là Kiệt Tác NỀN ĐEN.
//   Lớp 4 (MỚI 21/07/2026, brief "Kenji hoà vào đen + vệt sơn sáng"): vùng tối
//                 mở rộng sau hàng lưới — xem ghi chú đầy đủ tại khối JSX bên
//                 dưới grid row.
//
// SỬA 21/07/2026 (brief Kenji hoà vào đen) — BỐI CẢNH: ảnh cutout
// kenji-hero-cutout.webp bị crop khít bbox alpha thật (PR#44) nên đáy ảnh
// (chân ghế) là MỘT HÀNG PIXEL ĐẶC 100%, không có gì để "tan" — dù nền phía
// sau có tối đến đâu, mép dưới ảnh vẫn là đường cắt cứng vì bản thân ảnh
// KHÔNG có alpha giảm dần ở đáy (đã kiểm bbox alpha lúc convert: bottom
// margin = 0px, tức nội dung chạm đúng mép dưới, không dư biên trong suốt).
// Ảnh chụp thật xác nhận: mảnh đệm ghế màu sáng + gấu quần cắt ngang lộ rõ,
// dù đã ở trong dải gradient-đen cũ (h-64, đã che ~83% tối). Overlay/gradient
// phía sau không giải quyết được vì nó nằm SAU ảnh (z-10) trong stacking —
// chỉ che được NỀN xung quanh người, không che được RÌA của ảnh.
// FIX ĐÚNG CHỖ: thêm mask-image (CSS mask, không phải overlay) NGAY TRÊN ảnh
// Kenji — mờ dần alpha của chính ảnh từ ~68% chiều cao xuống 0 ở đáy, để rìa
// ảnh tự tan biến (không còn "đường cắt" vì không còn rìa cứng nào để lộ).
// Kèm 1 vệt bóng elip mờ (radial-gradient blur) đặt dưới ghế để mắt đọc
// "bóng đổ" thay vì thấy ảnh biến mất đột ngột — mẹo kinh điển ghép cutout.
// SỬA 21/07/2026 (Việc C, phần 2 — nguyên nhân thật của "dải sáng dọc"):
// overflow-visible → overflow-x-clip trên <section>. Đo thật bằng scrollWidth:
// trang bị TRÀN NGANG 790px > viewport 768px do 2 phần tử trang trí absolute
// thò qua mép phải — bóng elip dưới ghế (w-[135%], thò ~22px) và vệt sơn
// (calc(100%+140px), thò ~6px) — khiến trang CUỘN NGANG được (đo thấy
// scrollX=11 thật), mọi thứ xô trái để lộ dải nền sáng dọc mép phải. Lỗi này
// CÓ TỪ PR#45/#46, không phải do -mx-6 mới. overflow-x-clip cắt đúng trục
// ngang (không tạo scrollbar/scrollable overflow), trục dọc vẫn visible —
// bleed dọc của Kenji (-mb) và đuôi vệt sơn (bottom -70px xuống ③) không bị
// ảnh hưởng, đã xác nhận lại bằng ảnh chụp thật.
export default function HomeHero() {
  return (
    <section className="bg-e26-cream px-6 pt-24 md:pt-[120px] relative overflow-x-clip">
      {/* LỚP 1 — ảnh nền phủ trọn section (inset-0), cream ~90% giữ tương phản
          chữ. Đã đo thật ở PR trước: chữ hero vẫn đọc rõ trên nền này. */}
      {/* SỬA BUG PHÁT HIỆN 19/07/2026 (nằm ngay trong file này, sửa kèm để
          Việc 1/2 hoạt động đúng): overlay từng viết "bg-e26-cream/90" —
          KHÔNG BAO GIỜ thực sự render (đã đo computed style: backgroundColor
          = rgba(0,0,0,0), hoàn toàn trong suốt) vì token màu định nghĩa bằng
          chuỗi hex thô (var(--essence-*-2026)) khiến Tailwind không generate
          được modifier "/opacity". Đổi sang color-mix() — kỹ thuật đã kiểm
          chứng hoạt động (dùng cho màu chữ body bên dưới). Chữ hero trước giờ
          vẫn đọc được là NHỜ ảnh gốc bg-hero-light vốn đã rất sáng, không phải
          nhờ overlay này. NGOÀI SCOPE hôm nay (không sửa): ImageBridge (⑦→⑧)
          dùng đúng pattern lỗi này ở 2 chỗ — đã flag riêng trong báo cáo. */}
      {/* SỬA 22/07/2026 (brief làm sạch dứt điểm vùng đáy Hero) — BỎ cap
          max-w-[1440px] trên layer nền, quay về full-bleed inset-0. LỊCH SỬ
          VÌ SAO CÓ CAP: PR#54 cap nền theo 1440 để object-position không trôi
          so với khối chữ ở viewport rộng (đo thật hồi đó: 85% đạt ở 1440
          nhưng khung vòm chồng chữ ~76px ở 1920). TÁC DỤNG PHỤ KHÔNG LƯỜNG:
          viewport >1440 hở 2 DẢI CREAM DỌC 2 bên (đo thật 22/07: 240px mỗi
          bên ở 1920) — chính là lỗi "2 dải trắng" Kenji thấy. Đây KHÔNG phải
          lỗi tràn ngang cũ tái phát (PR#47 overflow-x — nguyên nhân khác
          hẳn), mà là hệ quả mới của chính PR#54, lọt lưới vì hồi đó chỉ
          nghiệm thu độ né-chữ của khung vòm, không rà 2 mép màn hình.
          SỬA TẬN GỐC: nền full-bleed trở lại (hết dải trắng ở MỌI bề rộng) +
          xử lý bài toán trôi bằng SCALE THEO BẬC viewport thay vì cap khung:
          ảnh gốc 1920px rộng, object-cover fit theo chiều CAO nên bề rộng vẽ
          được chỉ ~2000px — toán học không cho phép vừa phủ kín viewport
          >~1660 vừa giữ khung vòm né cột chữ nếu chỉ pan (đã giải bất đẳng
          thức bằng số đo thật: hết dư địa pan ở ~1578px). Zoom nhẹ theo bậc
          (origin-right để khung vòm + vườn dịch TRÁI khi phóng, rời xa cột
          chữ ở giữa-phải) là cách duy nhất không cần ảnh mới. Các bậc đã
          kiểm bằng số + ảnh thật: ≥1560 scale 1.10, ≥1800 scale 1.25, ≥2200
          scale 1.4 — tại mỗi bậc mép phải khung vòm cách mép trái cột chữ
          ≥45px. Dưới 1560: giữ nguyên pan 85% (dư địa còn đủ, đo tại 1536:
          lề 14px). */}
      {HERO_BG_SRC && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* SỬA 22/07/2026 (Việc B) — md:object-[85%_50%]: đo thật khung
              vòm-cây (canvas color-scan, phát hiện vùng có green-dominance
              trong dải tối của ảnh, xem BAI-HOC-KY-THUAT.md nếu cần bối cảnh
              phương pháp) nằm ở x≈610–800 tại 1440 với crop mặc định 50%
              center — chồng thẳng vào khối chữ (bắt đầu x≈624). Dò
              65%→78%→85%: 85% đẩy khung vòm về x≈420–576, dưới điểm bắt đầu
              khối chữ 48px (đo lại bằng canvas sau khi đổi, không giả định).
              Kenji (ảnh cutout riêng, không thuộc layer này) không bị ảnh
              hưởng vị trí — chỉ phần VILLA đứng sau anh dịch theo, đã xem ảnh
              thật xác nhận vẫn đọc được là "tựa cột" (không đổi cột nào anh
              dựa vào).
              CHỈ áp dụng từ md: (nơi có bố cục 2 cột cạnh nhau — brief mô tả
              rõ "khung cửa sổ bên phải" là ngôn ngữ bố cục desktop). Dưới
              md: (mobile, xếp dọc, chữ trước ảnh sau) GIỮ nguyên crop mặc
              định — đã đo bằng mắt: ở khung hình mobile (390px), ảnh nền bị
              phóng đại rất mạnh theo TRỤC DỌC (chiều cao Hero mobile cao hơn
              nhiều lần bề ngang) nên gần như luôn hiện một phần khung vòm
              trong dải dọc của khối chữ dù dò object-position ở bất kỳ điểm
              nào (đã thử 8 mốc 55%→80%, mốc nào cũng còn vệt xanh trong dải
              chữ — không có điểm nào "sạch" như ở desktop). Đây là TÌNH
              TRẠNG CÓ SẴN (đã kiểm: crop mặc định 50% cũ cũng vậy, không phải
              lỗi phát sinh từ đổi này) — không phải vấn đề "dịch chữ" có thể
              giải quyết được ở bố cục xếp dọc, cần Kenji quyết định hướng
              khác (vd tăng overlay riêng cho mobile) nếu muốn xử lý tiếp. */}
          {/* SỬA 22/07/2026 (brief sửa màu ảnh nền, Việc C) — filter
              saturate(50%) brightness(107%): đo màu thật 4 vùng tường/trần
              phẳng trên ảnh gốc (canvas, kênh R/G/B) — vùng tường sáng nhất
              (đại diện rõ nhất) cho R=189.8 G=173.8 B=148 (R-B=41.8, ngả cam
              rõ). Đã thử hue-rotate kèm theo (-30deg) giảm R-B mạnh hơn
              (còn 21) nhưng xem ảnh thật thì cây xanh phía sau bị ngả
              hồng/nhạt màu (hue-rotate xoay TẤT CẢ màu, không riêng vùng cam)
              — vi phạm đúng điều brief cấm ("không làm ảnh xám/mất sức
              sống"). Đổi sang saturate-only (không hue-rotate): giảm bão hoà
              đều làm giảm khoảng cách R-B tự nhiên (không đổi tông màu như
              hue-rotate) mà cây vẫn xanh thật (đã xem ảnh, không chỉ tin số).
              saturate(50%)+brightness(107%) đưa vùng tường sáng nhất về
              R=194.8 G=186.6 B=172.5 (R-B=22.4, giảm 46% so với gốc) — đọc là
              "trắng ấm" chứ không còn "vàng cam". Chỉ áp lên layer NỀN
              (Image này), KHÔNG áp lên layer ảnh Kenji (Image riêng, xem bên
              dưới grid) — da/tóc Kenji giữ nguyên màu gốc, đã xem ảnh thật
              xác nhận không bị ám lạnh. Contrast đo lại sau khi đổi filter
              (canvas, WCAG, cùng phương pháp cũ): 7.66–10.87 trên mọi dòng —
              còn CAO HƠN trước (nền sáng thêm 7% từ brightness). */}
          {/* SỬA 22/07/2026 (brief nền mới) — BỎ cả object-[85%] lẫn các bậc
              zoom min-[1560/1800/2200] (đều là nghiệm cho BÀI TOÁN CŨ: khung
              vòm ảnh cũ né cột chữ bên phải). Bố cục mới: chữ TRÁI / Kenji
              PHẢI, không còn ràng buộc né-vòm → crop center 50% mặc định là
              đủ (đã đo: tại 1440, cột chữ trái rơi vào vùng vườn/tường orig
              x≈257-682, cột Kenji phải rơi đúng khoang hiên gỗ orig
              x≈1008-1374; tại 1920 pan range chỉ còn 91px nên gần như thấy
              trọn ảnh; ≥2000 cover chuyển fit-theo-rộng, luôn phủ kín — hết
              lớp lang breakpoint đặc biệt, không còn nguy cơ dải trắng vì
              cover không bao giờ hở). BỎ filter khử-cam (xem HERO_BG_SRC). */}
          <Image src={HERO_BG_SRC} alt="" fill className="object-cover" priority />
          {/* SỬA 21/07/2026 (brief ghép nền hero villa) — TRIẾT LÝ MỚI: villa
              RÕ, overlay tối thiểu (khác hẳn ảnh Light trừu tượng cũ cần phủ
              70-88%). Đo contrast thật (canvas, WCAG, sample toàn bộ dòng
              chữ qua Range.getClientRects — không đoán): với màu chữ CŨ
              (color-mix đen 65%, xem ghi chú tại khối chữ) trần contrast rất
              thấp trên nền villa (ảnh có chi tiết/độ tương phản thật, không
              trơn như ảnh Light cũ) — quét 25%→50% chỉ tăng dần 3.55→4.09,
              không đạt 4.5 dù tăng overlay nhiều, ĐÚNG NGUYÊN NHÂN không nằm
              ở overlay mà ở chữ bán trong suốt. Đổi màu chữ body sang đặc
              text-e26-text (giống màu headline, bỏ color-mix 65% cũ — xem
              ghi chú tại khối chữ) → contrast nhảy lên 6.51 ngay ở 15%, 6.89
              ở 20%. Chọn 20% — thấp, villa vẫn rõ, dư dả so với 4.5 (dư ra
              để an toàn qua các breakpoint/crop khác nhau, không sát ngưỡng).
              SỬA 21/07/2026 (brief sửa hướng nhìn + mờ nền, Việc B) — Kenji
              xem thật thấy chữ chưa nổi đủ trên nền nhiều chi tiết → tăng
              20% lên 40% (+20 điểm % đúng brief). Contrast chỉ tăng khi
              overlay tăng — đã đo lại tại đúng vị trí chữ ở 40%, xem số đo
              trong báo cáo PR. Villa vẫn nhận ra được bằng mắt (ảnh thật). */}
          {/* SỬA 22/07/2026 (brief nền mới) — overlay từ PHẲNG cream 40% đổi
              thành GRADIENT NGANG: đậm bên TRÁI (nơi khối chữ mới đứng, nền
              vườn có vùng bóng râm tối ~(58,62,62) — đã tính: cần veil ≥~47%
              để chữ đen 4.5:1 trên điểm tối nhất, chọn 62% cho dư biên; giữ
              62% suốt 0-38% bề ngang = trọn cột chữ tại 1440) rồi nhạt dần
              về PHẢI (16% từ 72%) để hiên gỗ + nắng vàng — linh hồn của ảnh
              mới — hiện rõ sau lưng Kenji thay vì bị màn kem đè phẳng. Số %
              đo lại bằng canvas WCAG sau khi áp (xem báo cáo PR). */}
          {/* Mobile (<md): chữ trải GẦN HẾT bề ngang nên gradient ngang không
              bảo vệ nổi mép phải (đo thật 390px: worst 2.54 tại vùng cây bên
              phải) → dùng lớp PHẲNG 62% riêng cho mobile, gradient chỉ bật
              từ md trở lên (nơi chữ gói trong ~38% bên trái). */}
          <div className="absolute inset-0 md:hidden bg-[color-mix(in_srgb,var(--essence-cream-2026)_62%,transparent)]" />
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in srgb, var(--essence-cream-2026) 62%, transparent) 0%, color-mix(in srgb, var(--essence-cream-2026) 62%, transparent) 38%, color-mix(in srgb, var(--essence-cream-2026) 38%, transparent) 55%, color-mix(in srgb, var(--essence-cream-2026) 16%, transparent) 72%, color-mix(in srgb, var(--essence-cream-2026) 16%, transparent) 100%)",
            }}
          />
        </div>
      )}
      {/* SỬA 21/07/2026 — dải gradient tan-đen CŨ (h-40/h-64, chỉ che phần nền
          quanh người) đã BỎ, gộp vào khối LỚP 4 (dark zone) rộng hơn nhiều ở
          dưới grid row — xem ghi chú đầy đủ tại đó. Lý do gộp: dải cũ quá
          ngắn để vừa che nền VÀ chứa câu Signature Moment; tách thành 1 khối
          liền mạch dễ kiểm soát điểm nối hơn là 2 lớp gradient chồng nhau. */}
      <div className="relative z-10 max-w-[1440px] mx-auto">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-end">
          {/* LỚP 2 — khối chữ (cột 7/12 ≈ 58%). Headline là HÌNH ẢNH: serif rất
              lớn (72/56/42), tương phản mạnh với body nhỏ. leading 1.18 để dấu
              tiếng Việt dòng dưới không chạm chữ dòng trên. Ngắt 2 dòng cố ý
              (md+) theo brief.
              LƯU Ý (19/07): brief muốn chữ 40% / ảnh 60%, nhưng đo thật ở 72px
              dòng 1 "Lâu rồi, chưa ai hỏi" cần 622px — cột 40% (≤576px kể cả
              container 1440) KHÔNG chứa nổi → headline vỡ 4 dòng. Ưu tiên QA#4
              (≥72px + ngắt 2 dòng đúng chỗ) nên nới cột chữ lên 58% (712px), ảnh
              còn 42% (504px) — vẫn lớn, vẫn chờm sang nền đen.
              SỬA 21/07/2026 (brief đảo bố cục) — Kenji ngồi ép sát mép PHẢI
              khung hình trông gượng ép. Đảo 2 cột bằng md:order (KHÔNG viết
              lại nội dung/lật ảnh — chỉ đổi vị trí hiển thị): cột chữ này
              order-2 (hiện bên phải), cột ảnh order-1 (hiện bên trái). Chỉ
              áp ở md: — mobile vẫn xếp dọc đúng thứ tự DOM gốc (chữ trước,
              ảnh sau), không đổi. */}
          {/* SỬA 22/07/2026 (brief nền mới) — BỎ md:order-2/order-1 của cặp
              cột (thêm từ PR#51 khi Kenji cần đứng TRÁI cạnh cột vòm ảnh cũ):
              ảnh mới có chỗ ngồi thật (hiên gỗ) bên PHẢI nên trả 2 cột về
              đúng thứ tự DOM — chữ trái, Kenji phải. Mobile không đổi (vẫn
              xếp dọc chữ trước ảnh sau như cũ). */}
          <div className="md:col-span-7 md:pb-24">
            <p className="e26-reveal font-serif font-normal text-[42px] md:text-[56px] lg:text-[72px] leading-[1.18] text-e26-text max-w-[680px]">
              Lâu rồi, chưa ai hỏi
              <br className="hidden md:block" /> bạn đang thế nào.
            </p>
            {/* Body: sans WEIGHT 400 (không 300 — luật khoá, chữ Việt có dấu nét
                300 vỡ). Headline→body 48px (mt-12).
                SỬA 21/07/2026 (brief ghép nền hero villa) — màu đen token
                @65% (color-mix) CŨ được hiệu chỉnh cho ảnh Light trơn màu cũ,
                không đạt 4.5:1 trên nền villa mới dù tăng overlay (xem ghi
                chú tại lớp overlay). Đổi sang text-e26-text (đặc, cùng màu
                headline) — đã đo lại đạt 6.89:1 ở overlay 20%, dư dả. */}
            <div className="e26-reveal mt-12 space-y-6 font-sans font-normal text-[18px] md:text-[20px] lg:text-[22px] leading-[1.8] max-w-[540px] text-e26-text">
              <p>
                Bạn vẫn đi làm.
                <br />
                Mọi thứ vẫn ổn.
              </p>
              <p>
                Chỉ là đã lâu rồi,
                <br />
                bạn chưa thật sự ngồi xuống với chính mình.
              </p>
              <p>Ở đây, không ai hối thúc bạn phải khá hơn.</p>
              <p>
                Chỉ có một khoảng lặng,
                <br />
                để bạn nghe lại chính mình.
              </p>
            </div>
          </div>

          {/* LỚP 3 — ảnh Kenji cutout (cột 3/5 ≈ 60%). SỬA 21/07/2026 (brief
              thay ảnh cutout, Phương án A) — BỎ HẲN khung ảnh chữ nhật cũ:
              không còn overflow-hidden (không cắt vuông người), không còn
              shadow-[...] (không đổ bóng tấm ảnh), không còn ring-1
              ring-white/10 (không viền), không còn aspect-[4/5]+object-cover
              (ép khung vuông). Ảnh cutout đã crop khít bbox alpha thật
              (720×844 — xem ghi chú tại HERO_IMAGE_SRC) nên chỉ cần hiển thị
              đúng width/height gốc (w-full h-auto) là người hiện nguyên hình
              dạng, không mép chữ nhật nào để lộ "dán ghép". items-end (grid
              cha) tự canh đáy — chân/ghế "ngồi" ngay trên đường nền. -mb âm
              GIỮ NGUYÊN để chân ghế chờm vào khối LỚP 4 (dark zone) bên dưới.
              SỬA 21/07/2026 (brief Kenji hoà vào đen) — THÊM 2 THỨ:
              (1) bóng elip mềm (radial-gradient + blur) đặt SAU ảnh trong
                  DOM (nên vẽ trước, nằm dưới), mô phỏng bóng đổ dưới ghế;
              (2) mask-image trên chính ảnh — mờ dần alpha từ 66% chiều cao
                  xuống 0 ở 94% (đáy ảnh hoàn toàn trong suốt ở 6% cuối). Đây
                  là chỗ SỬA THẬT của vấn đề "cắt phựt": ảnh cutout vốn không
                  có alpha giảm dần ở đáy (đã kiểm khi convert — bbox alpha
                  chạm đúng mép dưới, 0px biên trong suốt), nên overlay/gradient
                  phía SAU ảnh không thể che được RÌA của chính ảnh — phải làm
                  mờ chính ảnh. Điểm cắt 66% nằm dưới toàn bộ mặt+thân trên
                  (đầu~0-18%, thân trên+tay~18-65% theo tỉ lệ ảnh đã crop) nên
                  mặt/thân trên KHÔNG bị ảnh hưởng (ràng buộc b) — chỉ vùng
                  ghế/chân (65-100%) mờ dần (ràng buộc a). WebkitMaskImage kèm
                  theo cho Safari.
                  SỬA 21/07/2026 (brief đảo bố cục) — cột này thêm md:order-1
                  (hiện bên trái, xem ghi chú cột chữ). Bỏ md:ml-auto cũ (từng
                  ép Kenji hết cỡ sang mép PHẢI của cột — khi cột còn nằm bên
                  phải grid, mép đó trùng luôn mép NGOÀI của cả khung Hero,
                  gây cảm giác "ép sát mép" brief phản ánh). Đổi md:w-full →
                  md:w-[82%] (thay vì mx-auto trên full-width, vốn không tạo
                  khoảng thở vì ảnh đã chiếm hết cột) để ảnh CÓ khoảng thở
                  thật ở cả 2 bên trong lòng cột — đã xác nhận bằng ảnh chụp
                  thật: Kenji đứng cạnh 1 cột vòm villa (điểm tựa thị giác),
                  không chạm mép nào. Bóng elip + mask-image không cần sửa vì
                  đều định vị THEO khối bọc này (left-1/2 riêng, gradient dọc
                  riêng), tự động đi theo — đã xác nhận lại bằng ảnh chụp,
                  không chỉ suy diễn từ code. */}
          {/* SỬA 22/07/2026 (brief nền mới) — md:w-[82%] → md:w-[60%]: đo trên
              ảnh chụp thật ở 82%, Kenji ngồi "lọt trong khoang hiên" nhưng cao
              gần kín trần khoang (~85% chiều cao khoang, trong khi người ngồi
              ~1.3m dưới trần ~3m chỉ nên ~45%) → tỉ lệ tố cáo dán ghép. Thu
              còn 60% + dịch nhẹ sang phải (md:mr-[4%]) cho anh ngồi sâu vào
              khoang hiên gần bàn thấp, khớp phối cảnh sàn gỗ. items-end +
              -mb giữ nguyên nên đáy ảnh vẫn neo đúng cao độ cũ — chân vẫn
              chìm trong vùng đen PR#57 (không hồi quy). */}
          <div className="e26-reveal md:col-span-5 relative z-10 w-[70%] max-w-[340px] mx-auto md:ml-auto md:mr-[9%] md:w-[60%] md:max-w-none -mb-16 md:-mb-24">
            {/* SỬA 22/07/2026 (brief làm sạch dứt điểm vùng đáy Hero) — XOÁ
                HẲN 3 LỚP BÓNG RỜI RẠC từng nằm ở đây: (1) bệ bóng elip lớn
                (PR#45, blur 18px, che đường cắt của ẢNH CŨ vốn bị cắt cụt —
                ảnh mới có chân đầy đủ nên hết lý do tồn tại), (2)+(3) hai
                contact shadow theo %-toạ-độ từng chân ghế (PR#56 — vá đúng
                triệu chứng nhưng sai tầng: nền sau chân đã nằm trong vùng
                gradient LỚP 4, bóng phải "đấu" với gradient nên mãi không đủ
                thuyết phục). GIẢI PHÁP MỚI: không đỡ chân bằng bóng nữa mà
                cho toàn bộ điểm tiếp đất CHÌM HẲN vào vùng tối — LỚP 4 đổi
                sang px-stops đạt đen đặc ở đúng cao độ mọi chân ghế/giày
                (xem ghi chú tại LỚP 4). Vùng đáy Hero từ 6 lớp (bệ bóng +
                2 contact shadow + mask ảnh + gradient + vệt sơn) còn 3 lớp
                (mask ảnh + gradient + vệt sơn). */}
            {/* SỬA 21/07/2026 (brief sửa hướng nhìn) — từng LẬT NGANG ảnh
                Kenji (scaleX(-1)) để nhìn ra vòm/vườn bên phải của ẢNH CŨ.
                SỬA 22/07/2026 (brief nền mới) — BỎ LẬT: Kenji giờ ngồi bên
                PHẢI (hiên gỗ), vườn/hồ nước ở bên TRÁI ảnh mới → ảnh gốc
                (mặt quay trái, đã kiểm trực tiếp từ PR trước) tự đúng hướng
                nhìn, không cần lật nữa. Phía SÁNG trên người sau khi bỏ lật:
                nguồn sáng ảnh mới đến từ TRÁI, mặt Kenji quay trái = phía
                sáng của ảnh gốc (chụp sáng từ phía mặt) — đỡ lệch hơn phương
                án giữ lật; tiền lệ PR#50: Kenji chấp nhận sáng người/nền
                không khớp tuyệt đối, ưu tiên đúng hướng nhìn.
                ÁM ẤM THEO NỀN MỚI (filter dưới): đo thật — áo Kenji trắng
                LẠNH (246,249,253 / R-B=-7) giữa cảnh mà trắng dưới nắng ám
                vàng R-B=+29 → đây là "tell" dán ghép rõ nhất về màu. sepia
                nhẹ + hạ sáng nhẹ kéo trắng áo về cùng họ ấm với cảnh; mức %
                dò bằng mắt qua ảnh chụp (so áo cạnh gỗ nắng), không chỉ
                theo số. */}
            {HERO_IMAGE_SRC ? (
              <Image
                src={HERO_IMAGE_SRC}
                alt="Kenji Phạm cầm ly trà, nhìn ra khu vườn"
                width={2122}
                height={2806}
                sizes="(max-width: 768px) 70vw, 32vw"
                className="relative w-full h-auto object-contain"
                style={{
                  filter: "sepia(0.18) saturate(1.04) brightness(0.97)",
                  maskImage: "linear-gradient(to bottom, black 0%, black 88%, transparent 99%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 88%, transparent 99%)",
                }}
                priority
              />
            ) : (
              <div className="w-full aspect-[2122/2806] bg-e26-cream-deep" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>

      {/* LỚP 4 (brief "Kenji hoà vào đen + vệt sơn sáng", SỬA TIẾP 21/07/2026
          "thu gọn vệt sơn + lan xuống ③ + hiệu ứng cuộn") — khối tối mở rộng
          thay cho dải gradient h-64 cũ. Gồm việc gộp lại:
          (A) tiếp tục nền TAN từ cream/ảnh sáng (Lớp 1, vẫn phủ full section)
              sang ĐEN ĐẶC — đủ cao để vừa che chân ghế Kenji (đã mờ qua mask
              ở Lớp 3) vừa còn dư mảng đen thật cho vệt sơn sáng "nổi" lên.
          (B) câu Signature Moment trên 1 vệt sáng dạng nhát cọ.
          SỬA 21/07/2026 (brief thu gọn) — bản trước vệt sáng rộng gần hết
          section (896px, khối bọc max-w-4xl) → đọc như MỘT TẤM NỀN, không
          phải nhát cọ. Đo thật dòng chữ dài nhất (Range.getClientRects(),
          không đoán): 609px. THU HẸP: bỏ khối bọc max-w-4xl rời, dùng 1 khối
          "inline-block" duy nhất bọc SÁT chữ (không max-width riêng ở khối
          bọc — để trình duyệt tự shrink-to-fit theo đúng bề rộng <p> đã bị
          giới hạn max-w-[640px], tức ~609px thật + 31px đệm, KHÔNG đổi cách
          ngắt 2 dòng đã có vì 640>609). Vệt sáng giờ neo THEO khối bọc này
          (không theo section) qua w-[calc(100%+~140px)] — luôn ôm sát chữ dù
          responsive. Đã đo lại sau khi thu hẹp: xem contrast tại <p> bên dưới.
          Không z-index trên khối nền tối: mặc định nằm DƯỚI khối grid-row
          phía trên (z-10 tường minh) trong cùng stacking context của section
          — Kenji (đã bleed xuống qua -mb âm) luôn đè lên đúng phần trên của
          khối này.
          SỬA 21/07/2026 (brief đảo bố cục, Việc 5) — QUYẾT ĐỊNH: GIỮ vệt sơn
          + câu Signature Moment CĂN GIỮA MÀN HÌNH (text-center trên khối LỚP
          4 full-bleed), KHÔNG dịch theo vị trí mới của Kenji (giờ ở bên
          trái). Lý do: (a) LỚP 4 vốn đã là 1 khối full-bleed riêng, không
          nằm trong 2 cột grid phía trên nên không có ràng buộc kỹ thuật nào
          buộc phải theo Kenji; (b) xác nhận bằng ảnh chụp thật — căn giữa
          đọc cân đối rõ hơn hẳn so với hình dung dịch trái theo Kenji (sẽ
          lệch hẳn về 1 phía, mất cảm giác "khoảnh khắc chung" của câu văn);
          (c) đúng tinh thần brief tự gợi ý: đây là khoảnh khắc CHUNG, không
          thuộc riêng vị trí người ngồi. */}
      {/* SỬA 21/07/2026 (brief sửa hướng nhìn..., Việc C) — thêm -mx-6: khối
          này là con trực tiếp của section (px-6) nên trước đây bị bó hẹp
          thiếu 24px mỗi bên → nền villa lộ thành 2 DẢI SÁNG DỌC ở 2 mép màn
          hình. -mx-6 bù đúng phần padding của section cho lớp gradient tràn
          sát mép viewport; px-6 giữ nguyên trên chính khối này nên chữ bên
          trong không đổi vị trí. Đã kiểm cả desktop lẫn mobile bằng ảnh thật.
          SỬA 21/07/2026 (Việc D) — kéo điểm đen đặc của gradient từ 50% lên
          sớm hơn hẳn (đen đặc từ 30%, thêm chặng 65% đen ở 15%) để vùng NGAY
          PHÍA TRÊN vệt sơn (giữa chỗ Kenji chìm và câu chữ) tối rõ rệt —
          PR#46 che chưa đủ theo Kenji xem thật. Vệt sơn sáng bên dưới vẫn
          nổi tương phản trên nền tối mới (xác nhận bằng ảnh chụp thật). */}
      {/* SỬA 21/07/2026 (brief hợp nhất vùng tối, Việc A) — NGUYÊN NHÂN THẬT
          của "vệt sáng ngang qua chân ghế": đo geometry thật — ảnh Kenji mờ
          dần (mask) từ y≈953 (đặc) tới y≈1024 (trong suốt hẳn), NHƯNG gradient
          nền cũ chỉ đạt đen đặc ở y≈1048 → tồn tại 1 "cửa sổ sáng" ~953-1048
          nơi Kenji đã tan mà nền CHƯA đen, để lộ sàn villa sáng (overlay chỉ
          40%) thành vệt ngang quanh chân ghế; bệ bóng elip nhỏ (974-1014) chỉ
          che được một phần. HỢP NHẤT: kéo khối tối này LÊN CAO hơn (-mt-16,
          bù pt +64px để Signature Moment/③ giữ nguyên vị trí) cho ramp
          transparent→đen DÀI & MƯỢT hơn, và đạt gần-đặc ĐÚNG chỗ Kenji tan
          (≈1024) nên không còn cửa sổ sáng. text cột phải kết ở y≈847, cách
          mép trên khối tối mới (~879) 32px + gradient transparent ở đỉnh nên
          KHÔNG chạm/tối chữ (đã đo + xác nhận ảnh thật). Bệ bóng elip GIỮ lại
          làm điểm nhấn bóng đổ dưới ghế (đã thử bỏ — thiếu grounding), nhưng
          giờ nằm TRONG vùng đã đen nên không tạo mảng rời. Stop % tính theo
          chiều cao khối mới (~413px), tinh chỉnh qua ảnh chụp thật từng nấc. */}
      {/* SỬA 22/07/2026 (brief làm sạch dứt điểm vùng đáy Hero) — gradient đổi
          từ %-stops sang PX-STOPS, vì lý do đo được: chân ghế/giày neo theo
          KHOẢNG CÁCH PX cố định tính từ mép trên khối này (ảnh bleed -mb-24 +
          khối -mt-16 → đáy ảnh luôn = mép trên + 160px ở md, +128px mobile),
          trong khi %-stops lại co giãn theo CHIỀU CAO KHỐI (thay đổi khi chỉnh
          pt/pb hoặc giữa desktop/mobile) — hai hệ quy chiếu lệch nhau chính là
          lý do các PR trước cứ chỉnh gradient xong chân lại rơi ra ngoài vùng
          tối ở breakpoint khác. Đo cao độ thật của mọi điểm tiếp đất (từ mép
          trên khối): chân ghế sau ~95-100px (md 1440/1920 lẫn mobile 390 —
          đã tính theo tỉ lệ ảnh từng breakpoint), chân ghế trước ~146px, giày
          người ~148-154px. Ramp mới: trong suốt 0 → đen đặc 90px (45% @28px,
          80% @52px, 96% @74px) — mốc 90px chọn SAU khi đo lại trên mobile:
          chân ghế sau rơi đúng 95.4px, mốc thử đầu 95px chỉ dư 0.4px (quá
          sát, dễ vỡ vì rounding) → hạ 90px cho mọi điểm tiếp đất dư biên
          ≥5px trong vùng đen đặc 100%, chân "chìm hẳn trong tối" đúng nghĩa,
          không cần bóng đỡ. Chữ body kết ở ~32px TRÊN mép khối này (đo 1440/1920)
          nên đầu ramp trong suốt không chạm chữ. pt tăng 44→56 (mobile) và
          52→72 (md): tạo dải đen DÀY thật sự giữa giày và vệt sơn Signature —
          đo trước khi sửa: mép loé sáng của vệt sơn (tính cả blur 20px) chạm
          y giày chỉ cách ~24px → chính là lỗi "giày đạp lên vệt sáng"; sau khi
          tăng pt + thu lề vệt sơn (140→100px), khoảng đen giữa giày và mép
          loé ≥50px ở md (đo lại sau sửa, xem báo cáo). */}
      {/* SỬA 22/07/2026 (brief thu gọn vùng tối) — Kenji thấy dải xám lem lên
          vườn/vòm trên nền MỚI (PR#58). Đo lại: mép trên khối tối ở 59.3%
          chiều cao section, ramp cũ bắt đầu MỜ NGAY TỪ MÉP (45% đen chỉ sau
          28px) — hợp với ảnh cũ nhưng lem lên cảnh đẹp của ảnh mới. Đồng
          thời PR#58 đã THU NHỎ Kenji (82%→60%) nên điểm tiếp đất tụt SÂU
          hơn mốc PR#57 tính: đo lại ở md — chân ghế sau +116px (1440/1920,
          nông nhất trong dải md; 768 là +135, 1024 là +127), tức mốc đen
          90px đang DƯ ~26px phía trên. TÁCH RAMP THEO BREAKPOINT (điều
          PR#57 chưa cần vì khi đó 2 breakpoint trùng nhu cầu ~95px):
          - MOBILE giữ NGUYÊN stops cũ (đen đặc 90px) — mobile tip vẫn ở
            +95.5px (ảnh mobile không đổi scale ở PR#58), không có dư địa
            hạ, và mobile cũng không bị kêu haze.
          - md+: đẩy điểm bắt đầu mờ xuống 0→55px (trong suốt hoàn toàn tới
            55px = trả lại ~55px cảnh villa phía trên), nén ramp còn 53px,
            đen đặc ở 108px — chân sau +116 vẫn dư biên 8px trong đen 100%
            (tiêu chuẩn ≥5px như PR#57). Cả 2 mục tiêu brief cùng đạt:
            vườn rõ hơn + chân vẫn chìm, xác nhận bằng ảnh chụp + số đo. */}
      <div className="relative -mx-6 -mt-16 pt-56 pb-24 md:pt-72 md:pb-32 px-6 overflow-visible">
        <div
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, transparent 0px, color-mix(in srgb, var(--essence-black-2026) 45%, transparent) 28px, color-mix(in srgb, var(--essence-black-2026) 80%, transparent) 52px, color-mix(in srgb, var(--essence-black-2026) 96%, transparent) 74px, var(--essence-black-2026) 90px, var(--essence-black-2026) 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, transparent 0px, transparent 55px, color-mix(in srgb, var(--essence-black-2026) 40%, transparent) 80px, color-mix(in srgb, var(--essence-black-2026) 85%, transparent) 97px, var(--essence-black-2026) 108px, var(--essence-black-2026) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative text-center">
          <div className="relative inline-block">
            {/* Vệt sơn sáng — nhát cọ nhoè, THU HẸP theo brief 21/07 (thu gọn).
                w-[calc(100%+140px)]: "100%" = bề rộng khối bọc inline-block
                (đã shrink-to-fit theo <p> max-w-[640px] ≈ 609px chữ thật),
                +140px (~70px mỗi bên ≈ 17-20% brief yêu cầu) là phần lề nhát
                cọ. Ellipse cao/hẹp hơn bản cũ (62% 82%, thay 75% 90%) + rút
                chiều cao (170/190px, thay 260/300px) để tỉ lệ thuôn dài hơn,
                đúng dáng "nhát cọ quẹt ngang" thay vì mảng tròn to. */}
            {/* SỬA 22/07/2026 (brief làm sạch đáy Hero) — thu lề nhát cọ
                140→100px: mép loé bên trái (sau blur) từng lan tới dưới giày
                Kenji ở md, cùng với pt tăng ở khối cha là cặp sửa cho lỗi
                "giày đạp lên vệt sáng". Chữ Signature vẫn nằm trọn trong lõi
                sáng của ellipse (chữ 609px < lõi ~62% của 709px + lề). */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+100px)] h-[170px] md:h-[190px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 62% 82% at center, rgba(241,239,232,0.98) 0%, rgba(241,239,232,0.94) 40%, rgba(241,239,232,0.65) 62%, rgba(241,239,232,0.22) 82%, transparent 100%)",
                filter: "blur(20px)",
              }}
              aria-hidden="true"
            />
            {/* SỬA 21/07/2026 (brief "hiệu ứng Signature Moment") — Doc V9 gốc
                mô tả "dừng cuộn 2 giây" = khoá cuộn, VI PHẠM luật motion dự án
                nên KHÔNG làm; thay bằng class .e26-signature-reveal (định
                nghĩa trong globals.css) — chỉ ghi đè duration/easing/khoảng
                dịch của CHÍNH cơ chế .e26-reveal có sẵn (IntersectionObserver
                qua useHomeReveal, không thêm thư viện/quan sát viên mới).
                800ms/10px/easeOutCubic thay vì 250ms/12px mặc định — chậm hơn
                cho đúng nhịp "khoảnh khắc lặng", nhưng KHÔNG khoá/ép cuộn:
                đã test scrollTo() nhảy xa tức thời (0→5000px) phản hồi tức
                khắc (~8ms, không có độ trễ/chặn) — xác nhận không có cơ chế
                giữ chân. prefers-reduced-motion: đã xác nhận bằng cách đọc
                trực tiếp CSSOM (không chỉ đọc mã nguồn) — rule reduced-motion
                có sẵn trong globals.css giữ !important trên transition, còn
                rule .e26-signature-reveal ở đây KHÔNG có !important (đã kiểm
                priority rỗng qua CSSOM) nên !important luôn thắng bất kể độ
                đặc hiệu — người dùng bật giảm chuyển động sẽ thấy ngay lập
                tức, không chạy animation. GIỚI HẠN CÔNG CỤ TỰ KIỂM (ghi nhận
                minh bạch): IntersectionObserver không tự bắn callback khi
                cuộn lập trình trong môi trường browser tự động của phiên này
                — đã thử cả window.scrollTo + chờ, scrollIntoView, và một
                observer MỚI hoàn toàn độc lập (không dùng lại observer của
                useHomeReveal) đều không bắn callback dù phần tử chắc chắn đã
                vào khung nhìn (rectTop đo được nằm trong viewport) — đây là
                giới hạn môi trường đã ghi nhận trước đó trong phiên làm việc
                này (không phải lỗi code), không phải điều tôi có thể tự sửa.
                Đã xác nhận được: cơ chế đúng (code), trạng thái CUỐI (đã
                is-visible) hiển thị đẹp qua ảnh chụp thật, và cascade
                reduced-motion đúng qua CSSOM — KHÔNG tự xác nhận được việc
                observer tự bắn khi người dùng thật cuộn chuột trong công cụ
                này. */}
            <p className="relative e26-reveal e26-signature-reveal font-serif italic font-normal text-[22px] md:text-[28px] leading-snug text-e26-text max-w-[640px] px-8">
              Có lẽ đã rất lâu rồi, bạn mới ngồi xuống chỉ để ở cùng chính mình.
            </p>
          </div>
        </div>

        {/* ĐÃ XOÁ 21/07/2026 (brief sửa vệt sáng dư, Việc A) — trước đây ở đây
            có "Phần 1b" (PR#46): một đuôi mờ SÁNG (radial cream 0.32) của vệt
            sơn, z-20, bottom-[-70px], cố ý bleed xuống ĐẦU ③ để tan mượt vào
            nền đen TRƠN của ③ lúc bấy giờ (③ khi ấy CHƯA có ảnh riêng).
            PR#52 cho ③ ảnh villa + overlay riêng → cơ chế viện trợ cũ này trở
            thành thừa VÀ gây lỗi: đã đo thật — Hero kết ở y=1328, ③ bắt đầu
            đúng y=1328, còn đuôi này trải 1308→1398 nên 70px của nó nằm TRONG
            ③; z-20 của nó đè lên overlay ③ (z-auto) → vẽ một đốm sáng kem lạc
            chỗ giữa vùng đen, ngay dưới vệt sơn và trên tiêu đề ③ (đã chụp ảnh
            xác nhận trước khi xoá). Nay ③ tự lo overlay đen đặc từ mép trên
            nên KHÔNG cần đuôi viện trợ nữa → xoá hẳn, đường nối vẫn mượt (đã
            chụp lại xác nhận). Xem docs/website/BAI-HOC-KY-THUAT.md mục 1 & 6. */}
      </div>
    </section>
  );
}
