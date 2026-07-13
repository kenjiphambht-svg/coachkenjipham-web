import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";

// ============================================================
// FORM INTAKE "Lặng 90'" — /lang-90/dat-phien (noindex)
// 6 câu nguyên văn tài liệu Bộ lọc của Kenji. Logic an toàn:
//  - Câu 2 = C (ý nghĩ tự hại/hại người): CHẶN — không cho sang thanh toán,
//    hiện thông điệp + hướng dẫn chuyên gia lâm sàng, KHÔNG thu thêm dữ liệu.
//  - Câu 5 = C: cảnh báo thẳng, KHÔNG chặn.
//  - Câu 3 = B: ghi chú thông tin, KHÔNG chặn.
//  - Consent bắt buộc (checkbox).
// Lưu trữ: không backend — đáp án đưa qua sessionStorage sang trang xác nhận,
// người dùng gửi cho Kenji qua nút mailto ở trang đó. Nhánh chặn: gửi/không lưu gì.
//
// ⚠️ THÔNG ĐIỆP CHẶN (khối .crisis) — Kenji CHƯA cấp nguyên văn. Đoạn dưới do
//    Claude soạn theo tinh thần tài liệu; CẦN KENJI DUYỆT TỪNG CHỮ và điền số
//    đường dây nóng đã xác minh vào chỗ [SỐ HOTLINE — KENJI ĐIỀN]. Không ship
//    public khi chưa duyệt đoạn này.
// ============================================================

export default function Lang90Form() {
  const router = useRouter();

  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");
  const [q6, setQ6] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const blocked = q2 === "C";

  const valid =
    !blocked &&
    q1.trim() !== "" &&
    q2 !== "" &&
    q3 !== "" &&
    q4.trim() !== "" &&
    q5 !== "" &&
    name.trim() !== "" &&
    contact.trim() !== "" &&
    consent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setShowErrors(true);
      return;
    }
    // Mã đơn — không chứa dữ liệu cá nhân, dùng để đối soát VietQR ↔ intake.
    const orderCode = "LANG90-" + Date.now().toString(36).toUpperCase().slice(-6);
    const intake = { orderCode, q1, q2, q3, q4, q5, q6, name, contact };
    try {
      sessionStorage.setItem("lang90-intake", JSON.stringify(intake));
    } catch {
      // sessionStorage có thể bị chặn — vẫn điều hướng, trang xác nhận có nhánh dự phòng.
    }
    router.push("/lang-90/xac-nhan");
  };

  const labelCls = "block font-serif text-lg text-e26-text mb-1";
  const hintCls = "font-sans text-[14px] text-e26-text-2 mb-4";
  const inputCls =
    "w-full px-4 py-3 border border-e26-border bg-e26-white font-sans text-[15px] focus:outline-none focus:border-e26-gold-deep transition-colors";
  const radioRow =
    "flex items-start gap-3 py-2.5 font-sans text-[15px] leading-[1.5] text-e26-text cursor-pointer";

  return (
    <>
      <SEO
        title="Đặt phiên Lặng 90' — Kenji Phạm (Bản nháp)"
        description="Form đặt phiên Lặng 90' với Kenji Phạm."
        url="https://coachkenjipham.com/lang-90/dat-phien"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
      </Head>

      <main className="bg-e26-ivory text-e26-text min-h-screen">
        <div className="max-w-[620px] mx-auto px-6 py-12 md:py-16">
          <p className="font-sans text-sm text-e26-text-2 mb-2">Lặng 90'</p>
          <h1 className="font-serif font-normal text-[28px] md:text-[36px] text-e26-text mb-4">
            Trước khi chúng ta ngồi xuống
          </h1>
          <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2 mb-10">
            Sáu câu này giúp tôi hiểu bạn đang ở đâu — và để bảo vệ cả bạn lẫn tôi. Hãy trả lời
            thật. Không cần văn vẻ.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-10">
            {/* CÂU 1 */}
            <div>
              <label htmlFor="q1" className={labelCls}>
                Câu 1: Bạn đang trải qua điều gì khiến bạn cần phiên này ngay lúc này?
              </label>
              <p className={hintCls}>Trả lời tự do. Không cần văn vẻ. Viết đúng như bạn đang cảm thấy.</p>
              <textarea id="q1" rows={4} value={q1} onChange={(e) => setQ1(e.target.value)} className={`${inputCls} resize-none`} />
              {showErrors && q1.trim() === "" && (
                <p className="font-sans text-[13px] text-e26-gold-deep mt-1">Bạn chia sẻ giúp một chút nhé.</p>
              )}
            </div>

            {/* CÂU 2 */}
            <div>
              <p className={labelCls}>Câu 2: Hiện tại bạn đang ở mức nào? Chọn một.</p>
              <div className="mt-2">
                {[
                  { v: "A", t: "Hoang mang, mất phương hướng — chưa biết làm gì tiếp theo" },
                  { v: "B", t: "Đang ở điểm gãy — tài chính, quan hệ, hoặc nội tâm đang sụp đổ" },
                  { v: "C", t: "Đang có suy nghĩ muốn tự làm hại bản thân hoặc người khác" },
                  { v: "D", t: "Đang ổn — tôi chỉ muốn hiểu mình hơn" },
                ].map((o) => (
                  <label key={o.v} className={radioRow}>
                    <input
                      type="radio"
                      name="q2"
                      value={o.v}
                      checked={q2 === o.v}
                      onChange={() => setQ2(o.v)}
                      className="mt-1 accent-[#8A6D1F]"
                    />
                    <span>{o.t}</span>
                  </label>
                ))}
              </div>
              {showErrors && q2 === "" && (
                <p className="font-sans text-[13px] text-e26-gold-deep mt-1">Chọn giúp một mục nhé.</p>
              )}
            </div>

            {/* NHÁNH CHẶN — Câu 2 = C. Không render phần còn lại của form.
                ⚠️ Đoạn chữ dưới do Claude soạn — Kenji cần duyệt + điền hotline thật. */}
            {blocked ? (
              <div className="crisis border-t border-e26-border pt-8">
                <div className="border border-e26-border bg-e26-white p-6 md:p-8 space-y-4 font-sans text-[15px] leading-[1.75] text-e26-text">
                  <p className="font-serif text-xl text-e26-text">Cảm ơn bạn đã thành thật.</p>
                  <p>
                    Điều bạn vừa chia sẻ cho tôi biết: ngay lúc này, thứ bạn cần là một người có
                    chuyên môn lâm sàng ở bên — không phải một phiên coaching. Đó không phải vì bạn
                    &ldquo;quá nặng&rdquo; hay có gì sai. Chỉ là đúng người, đúng lúc mới giúp được.
                  </p>
                  <p>
                    Lặng 90' là coaching — tôi không thay thế được bác sĩ tâm thần hay chuyên gia
                    tâm lý lâm sàng, nên tôi sẽ không nhận phiên trong tình huống này.
                  </p>
                  <p className="text-e26-text-2">
                    Nếu bạn đang trong nguy hiểm tức thời, xin hãy liên hệ ngay đường dây nóng{" "}
                    <span className="font-medium text-e26-text">[SỐ HOTLINE — KENJI ĐIỀN]</span>. Bạn
                    cũng có thể tìm đến một chuyên gia tâm lý lâm sàng hoặc bác sĩ tâm thần gần bạn.
                  </p>
                  <p className="text-e26-text">
                    Bạn không một mình. Và bước tìm đúng sự giúp đỡ — đã là một bước rất dũng cảm.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* CÂU 3 */}
                <div>
                  <p className={labelCls}>
                    Câu 3: Bạn đã từng làm việc với coach, therapist, hoặc chuyên gia tâm lý nào chưa?
                  </p>
                  <div className="mt-2">
                    {[
                      { v: "A", t: "Chưa bao giờ" },
                      { v: "B", t: "Có — và tôi vẫn đang trong quá trình trị liệu" },
                      { v: "C", t: "Có — nhưng đã dừng" },
                    ].map((o) => (
                      <label key={o.v} className={radioRow}>
                        <input type="radio" name="q3" value={o.v} checked={q3 === o.v} onChange={() => setQ3(o.v)} className="mt-1 accent-[#8A6D1F]" />
                        <span>{o.t}</span>
                      </label>
                    ))}
                  </div>
                  {q3 === "B" && (
                    <p className="font-sans text-[14px] leading-[1.6] text-e26-text-2 mt-2 border-l border-e26-gold pl-4">
                      Nếu chọn B — tôi cần biết thêm để đảm bảo hai quá trình không xung đột nhau.
                    </p>
                  )}
                  {showErrors && q3 === "" && (
                    <p className="font-sans text-[13px] text-e26-gold-deep mt-1">Chọn giúp một mục nhé.</p>
                  )}
                </div>

                {/* CÂU 4 */}
                <div>
                  <label htmlFor="q4" className={labelCls}>
                    Câu 4: Điều bạn muốn rời khỏi phiên này với nó là gì?
                  </label>
                  <p className={hintCls}>
                    Không cần mục tiêu rõ ràng. Một cảm giác, một câu hỏi, hoặc &ldquo;tôi không
                    biết&rdquo; cũng được.
                  </p>
                  <textarea id="q4" rows={3} value={q4} onChange={(e) => setQ4(e.target.value)} className={`${inputCls} resize-none`} />
                  {showErrors && q4.trim() === "" && (
                    <p className="font-sans text-[13px] text-e26-gold-deep mt-1">Bạn viết giúp một dòng nhé.</p>
                  )}
                </div>

                {/* CÂU 5 */}
                <div>
                  <p className={labelCls}>
                    Câu 5: Bạn sẵn sàng nghe một góc nhìn hoàn toàn khác với những gì bạn đang nghĩ không?
                  </p>
                  <div className="mt-2">
                    {[
                      { v: "A", t: "Có — đó là lý do tôi ở đây" },
                      { v: "B", t: "Không chắc — nhưng tôi sẵn sàng thử" },
                      { v: "C", t: "Không — tôi chỉ cần người lắng nghe" },
                    ].map((o) => (
                      <label key={o.v} className={radioRow}>
                        <input type="radio" name="q5" value={o.v} checked={q5 === o.v} onChange={() => setQ5(o.v)} className="mt-1 accent-[#8A6D1F]" />
                        <span>{o.t}</span>
                      </label>
                    ))}
                  </div>
                  {q5 === "C" && (
                    <p className="font-sans text-[14px] leading-[1.6] text-e26-text mt-2 border-l border-e26-gold pl-4">
                      Nếu chọn C — phiên này có thể không phải thứ bạn cần lúc này. Tôi sẽ nói thẳng
                      điều đó. Bạn vẫn có thể tiếp tục nếu muốn.
                    </p>
                  )}
                  {showErrors && q5 === "" && (
                    <p className="font-sans text-[13px] text-e26-gold-deep mt-1">Chọn giúp một mục nhé.</p>
                  )}
                </div>

                {/* CÂU 6 */}
                <div>
                  <label htmlFor="q6" className={labelCls}>
                    Câu 6: Có điều gì bạn muốn tôi biết trước khi chúng ta ngồi xuống không?
                  </label>
                  <p className={hintCls}>Hoàn toàn tùy chọn. Nhưng nếu có — viết ra đây.</p>
                  <textarea id="q6" rows={3} value={q6} onChange={(e) => setQ6(e.target.value)} className={`${inputCls} resize-none`} />
                </div>

                {/* LIÊN HỆ */}
                <div className="border-t border-e26-border pt-8 space-y-6">
                  <div>
                    <label htmlFor="name" className={labelCls}>Tên gọi</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Tên bạn muốn tôi gọi" />
                    {showErrors && name.trim() === "" && (
                      <p className="font-sans text-[13px] text-e26-gold-deep mt-1">Cho tôi biết tên gọi nhé.</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact" className={labelCls}>Kênh liên hệ</label>
                    <input id="contact" type="text" value={contact} onChange={(e) => setContact(e.target.value)} className={inputCls} placeholder="Email hoặc số Zalo để tôi xác nhận lịch" />
                    {showErrors && contact.trim() === "" && (
                      <p className="font-sans text-[13px] text-e26-gold-deep mt-1">Cho tôi một cách liên hệ nhé.</p>
                    )}
                  </div>
                </div>

                {/* CONSENT */}
                <div className="border-t border-e26-border pt-8">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1.5 accent-[#8A6D1F]" />
                    <span className="font-sans text-[15px] leading-[1.7] text-e26-text">
                      Tôi đã đọc và hiểu rõ phạm vi của Lặng 90'. Tôi hiểu đây là dịch vụ coaching
                      — không phải trị liệu tâm lý lâm sàng. Tôi đồng ý với các chính sách nêu trên
                      và sẵn sàng tham gia với tinh thần cởi mở và trung thực.
                    </span>
                  </label>
                  {showErrors && !consent && (
                    <p className="font-sans text-[13px] text-e26-gold-deep mt-2">
                      Cần bạn xác nhận đồng ý trước khi tiếp tục.
                    </p>
                  )}
                </div>

                {/* SUBMIT (nút vàng duy nhất của trang) */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
                  >
                    Tiếp tục — giữ chỗ
                  </button>
                  <p className="font-sans text-[13px] text-e26-text-2 text-center mt-3">
                    Bước tiếp theo: hướng dẫn thanh toán. Chưa thanh toán — chưa giữ chỗ.
                  </p>
                </div>
              </>
            )}
          </form>
        </div>
      </main>
    </>
  );
}
