import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { SEO } from "@/components/SEO";

// ============================================================
// TRANG XÁC NHẬN "Lặng 90'" — /lang-90/xac-nhan (noindex)
// Chỉ tới đây khi API nhận form hợp lệ (không rơi nhánh chặn Câu 2=C).
// Không hiển thị thanh toán/booking trước Human Decision Gate. Không dữ liệu
// nhạy cảm trên URL hoặc sessionStorage — browser chỉ nhận lại mã đơn.
// ============================================================

interface Submission {
  orderCode: string;
}

export default function Lang90Confirm() {
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lang90-confirmation");
      if (raw) setSubmission(JSON.parse(raw) as Submission);
    } catch {
      // Không đọc được — hiện bản không có mã đơn, không suy ra bất kỳ dữ liệu nào khác.
    }
  }, []);

  const orderCode = submission?.orderCode ?? "—";

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
            Đã nhận thông tin của bạn
          </h1>
          <p className="font-sans text-[15px] leading-[1.7] text-e26-text-2 mb-8">
            Kenji sẽ tự đọc trước khi quyết định có thể đi tiếp hay không. Ở bước này chưa có
            thanh toán và cũng chưa có đặt lịch.
          </p>

          {/* Mã đơn */}
          <div className="border border-e26-border bg-e26-white p-6 mb-8">
            <p className="font-sans text-xs tracking-[0.08em] uppercase text-e26-text-2 mb-1">Mã đơn của bạn</p>
            <p className="font-serif text-2xl text-e26-text">{orderCode}</p>
          </div>

          <div className="border-t border-e26-border pt-8 font-sans text-[14px] leading-[1.7] text-e26-text-2">
            <p>
              Nếu Kenji thấy phù hợp, anh sẽ chủ động liên hệ bằng kênh bạn đã để lại để hướng dẫn
              bước tiếp theo. Nếu không, hồ sơ cũng sẽ không tự động chuyển thành lịch hẹn hay thanh toán.
            </p>
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
