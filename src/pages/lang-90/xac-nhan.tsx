import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";

// ============================================================
// TRANG XÁC NHẬN "Lặng 90'" — /lang-90/xac-nhan (noindex)
// Chỉ tới đây khi form hợp lệ (không rơi nhánh chặn Câu 2=C).
// Hiển thị: mã đơn + VietQR tĩnh (theo pattern thanh-toan-goi-*, chi tiết ngân hàng
// Kenji điền sau) + chính sách booking nguyên văn + nút gửi intake cho Kenji (mailto).
// Không dữ liệu nhạy cảm trên URL — đọc từ sessionStorage do form đặt.
// ============================================================

interface Intake {
  orderCode: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  name: string;
  contact: string;
}

const Q2_LABEL: Record<string, string> = {
  A: "Hoang mang, mất phương hướng",
  B: "Đang ở điểm gãy",
  D: "Đang ổn — muốn hiểu mình hơn",
};
const Q3_LABEL: Record<string, string> = {
  A: "Chưa bao giờ",
  B: "Có — vẫn đang trị liệu",
  C: "Có — đã dừng",
};
const Q5_LABEL: Record<string, string> = {
  A: "Sẵn sàng nghe góc nhìn khác",
  B: "Không chắc — sẵn sàng thử",
  C: "Chỉ cần người lắng nghe",
};

export default function Lang90Confirm() {
  const [intake, setIntake] = useState<Intake | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lang90-intake");
      if (raw) setIntake(JSON.parse(raw) as Intake);
    } catch {
      // Không đọc được — hiện bản không có mã đơn (nhánh dự phòng bên dưới).
    }
  }, []);

  const orderCode = intake?.orderCode ?? "—";

  const mailtoHref = intake
    ? `mailto:kenjipham.bht@gmail.com?subject=${encodeURIComponent(
        `Đặt phiên Lặng 90' — ${intake.orderCode}`
      )}&body=${encodeURIComponent(
        [
          `Mã đơn: ${intake.orderCode}`,
          `Tên gọi: ${intake.name}`,
          `Liên hệ: ${intake.contact}`,
          ``,
          `Câu 1 (đang trải qua): ${intake.q1}`,
          `Câu 2 (mức độ): ${Q2_LABEL[intake.q2] ?? intake.q2}`,
          `Câu 3 (đã làm việc với chuyên gia): ${Q3_LABEL[intake.q3] ?? intake.q3}`,
          `Câu 4 (muốn rời phiên với): ${intake.q4}`,
          `Câu 5 (sẵn sàng nghe góc nhìn khác): ${Q5_LABEL[intake.q5] ?? intake.q5}`,
          `Câu 6 (muốn tôi biết trước): ${intake.q6 || "(không có)"}`,
        ].join("\n")
      )}`
    : "mailto:kenjipham.bht@gmail.com?subject=" + encodeURIComponent("Đặt phiên Lặng 90'");

  return (
    <>
      <SEO
        title="Xác nhận đặt phiên Lặng 90' — Kenji Phạm (Bản nháp)"
        description="Xác nhận đặt phiên Lặng 90'."
        url="https://coachkenjipham.com/lang-90/xac-nhan"
      />
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
      </Head>

      <main className="bg-e26-ivory text-e26-text min-h-screen">
        <div className="max-w-[620px] mx-auto px-6 py-12 md:py-16">
          <p className="font-sans text-sm text-e26-text-2 mb-2">Lặng 90'</p>
          <h1 className="font-serif font-normal text-[28px] md:text-[36px] text-e26-text mb-4">
            Gần xong rồi
          </h1>
          <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2 mb-8">
            Còn hai việc: gửi thông tin cho tôi và hoàn tất thanh toán. Xong hai việc này, tôi
            sẽ liên hệ xác nhận lịch trong vòng 24h.
          </p>

          {/* Mã đơn */}
          <div className="border border-e26-border bg-e26-white p-6 mb-8">
            <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-1">Mã đơn của bạn</p>
            <p className="font-serif text-2xl text-e26-text">{orderCode}</p>
          </div>

          {/* Bước 1 — gửi thông tin (nút vàng duy nhất) */}
          <div className="mb-10">
            <p className="font-serif text-lg text-e26-text mb-3">1. Gửi thông tin đặt phiên cho tôi</p>
            <a
              href={mailtoHref}
              className="inline-block bg-e26-gold text-e26-black rounded-none font-sans font-medium text-[13px] tracking-[0.08em] uppercase px-9 py-4 hover:bg-e26-gold-deep hover:text-e26-ivory transition-colors duration-300"
            >
              Gửi thông tin cho Kenji
            </a>
            <p className="font-sans text-[13px] text-e26-text-2 mt-3">
              Nút này mở email đã điền sẵn thông tin bạn vừa nhập. Nếu không tiện email, bạn có
              thể nhắn Zalo cho tôi kèm mã đơn <span className="font-medium">{orderCode}</span>.
            </p>
          </div>

          {/* Bước 2 — thanh toán VietQR tĩnh */}
          <div className="mb-10">
            <p className="font-serif text-lg text-e26-text mb-3">2. Thanh toán 100% trước phiên — 10.000.000đ</p>
            <div className="border border-e26-border bg-e26-white p-6">
              <div className="aspect-square max-w-[240px] mx-auto bg-e26-cream border border-e26-border flex items-center justify-center mb-5">
                {/* VietQR tĩnh — Kenji thay bằng ảnh QR thật (pattern như /thanh-toan-goi-*) */}
                <span className="font-sans text-[13px] text-e26-text-2 text-center px-4">
                  [Ảnh VietQR — Kenji điền sau]
                </span>
              </div>
              <div className="space-y-1.5 font-sans text-[14px] text-e26-text">
                <div><span className="text-e26-text-2">Ngân hàng:</span> <span className="font-medium">[Kenji điền sau]</span></div>
                <div><span className="text-e26-text-2">Số tài khoản:</span> <span className="font-medium">[Kenji điền sau]</span></div>
                <div><span className="text-e26-text-2">Chủ tài khoản:</span> <span className="font-medium">KENJI PHẠM</span></div>
                <div className="pt-1">
                  <span className="text-e26-text-2">Nội dung CK:</span>{" "}
                  <span className="font-medium text-e26-gold-deep">{orderCode}</span>
                </div>
              </div>
            </div>
            <p className="font-sans text-[13px] text-e26-text-2 mt-3">
              Ghi đúng mã đơn <span className="font-medium">{orderCode}</span> trong nội dung chuyển
              khoản để tôi đối soát. Chưa thanh toán — chưa giữ chỗ.
            </p>
          </div>

          {/* Chính sách booking — nguyên văn */}
          <div className="border-t border-e26-border pt-8">
            <h2 className="font-serif text-xl text-e26-text mb-5">Chính sách</h2>
            <ul className="space-y-4 font-sans text-[14px] leading-[1.7] text-e26-text-2">
              <li>
                <span className="text-e26-text font-medium">Thanh toán:</span> 100% trước phiên
                qua VietQR tĩnh theo mã đơn. Chưa thanh toán — chưa giữ chỗ.
              </li>
              <li>
                <span className="text-e26-text font-medium">Hủy phiên:</span> Báo trước 48h →
                hoàn tiền 100% hoặc dời lịch. Dưới 48h → không hoàn tiền, có thể dời 1 lần.
              </li>
              <li>
                <span className="text-e26-text font-medium">Trễ giờ:</span> Trễ quá 15 phút →
                phiên vẫn kết thúc đúng giờ. Không bù thêm.
              </li>
              <li>
                <span className="text-e26-text font-medium">Bảo mật:</span> Mọi nội dung phiên
                được giữ kín. Không chia sẻ thông tin khách với bất kỳ ai. Không ghi âm phiên trừ
                khi có đồng ý bằng văn bản từ cả hai phía.
              </li>
              <li>
                <span className="text-e26-text font-medium">Sau phiên:</span> Báo cáo tóm tắt
                trong 24h + check-in ngày 7 và ngày 30. Không có follow-up không giới hạn — nếu
                cần thêm, đặt phiên mới.
              </li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <Link href="/lang-90" className="font-sans text-sm text-e26-text-2 underline underline-offset-4 decoration-e26-border hover:text-e26-gold-deep transition-colors">
              ← Về trang Lặng 90'
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
