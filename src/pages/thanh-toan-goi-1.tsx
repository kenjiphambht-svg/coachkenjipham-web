import Head from 'next/head';
import Link from 'next/link';
import { useMistFadeIn } from '@/hooks/useMistFadeIn';

export default function ThanhToanGoi1() {
  useMistFadeIn();

  return (
    <>
      <Head>
        <title>Hoàn tất thanh toán · KIDMAP Gói 1 · Essence Coaching</title>
      </Head>
      
      <main className="min-h-screen bg-[#faf8f3] py-12 md:py-16 px-6">
        <div className="max-w-2xl mx-auto">
          
          <div className="text-center mb-12 fade-in-section">
            <div className="text-[10px] tracking-[0.38em] uppercase text-[#8a6820] font-medium mb-1">
              Kenji Phạm
            </div>
            <div className="font-serif italic text-2xl text-[#c9a84c]">
              Essence Coaching
            </div>
          </div>
          
          <div className="w-12 h-px bg-[#c9a84c] mx-auto mb-12 opacity-60 fade-in-section" />
          
          <div className="text-center mb-10 fade-in-section">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] font-medium mb-4">
              Bước cuối cùng
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1a1510] leading-tight mb-4">
              Thông tin của bé đã được<br />ghi nhận an toàn
            </h1>
            <p className="font-serif italic text-lg text-[#6b5432]">
              Vui lòng hoàn tất chuyển khoản để Kenji bắt đầu hành trình
            </p>
          </div>
          
          <div className="bg-white border border-[#c9a84c]/30 p-8 md:p-10 mb-8 fade-in-section">
            <div className="text-center mb-6">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a6820] font-medium mb-2">
                Quét mã để chuyển khoản
              </div>
              <div className="font-serif text-2xl text-[#1a1510]">
                2.000.000đ
              </div>
            </div>
            
            <div className="aspect-square max-w-[280px] mx-auto bg-[#f2ead8] border-2 border-dashed border-[#c9a84c]/40 flex items-center justify-center mb-6">
              <img src="/G1.jpg" alt="QR Code Gói 1 - 2.000.000đ" className="w-full h-full object-contain" />
            </div>
            
            <div className="bg-[#faf8f3] border-l-2 border-[#c9a84c] p-5">
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#8a6820] font-medium mb-3">
                Hoặc chuyển khoản thủ công
              </div>
              <div className="space-y-1.5 text-sm text-[#1a1510]">
                <div><span className="text-[#6b5432]">Ngân hàng:</span> <span className="font-medium">[Kenji điền sau]</span></div>
                <div><span className="text-[#6b5432]">Số tài khoản:</span> <span className="font-medium">[Kenji điền sau]</span></div>
                <div><span className="text-[#6b5432]">Chủ tài khoản:</span> <span className="font-medium">KENJI PHẠM</span></div>
                <div className="pt-2">
                  <span className="text-[#6b5432]">Nội dung CK:</span><br />
                  <span className="font-medium text-[#c9a84c]">KIDMAP G1 [Tên bé]</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#f2ead8] border-l-2 border-[#c9a84c] p-6 mb-8 fade-in-section">
            <div className="font-serif text-lg font-semibold text-[#1a1510] mb-4">
              Sau khi chuyển khoản
            </div>
            <ol className="space-y-3 text-sm text-[#3d3020] leading-relaxed">
              <li className="flex gap-3">
                <span className="text-[#c9a84c] font-semibold">1.</span>
                <span>Chụp màn hình biên lai chuyển khoản</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#c9a84c] font-semibold">2.</span>
                <span>Nhắn cho Kenji qua Zalo (bấm bong bóng vàng góc phải)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#c9a84c] font-semibold">3.</span>
                <span>Kenji sẽ xác nhận trong vòng <strong>12 giờ</strong> và bắt đầu làm báo cáo cho bé</span>
              </li>
            </ol>
          </div>
          
          <div className="text-center mb-12 fade-in-section">
            <p className="font-serif italic text-sm text-[#6b5432] leading-relaxed">
              Mã QR có hiệu lực lưu trữ thông tin trong 24h,<br />
              ba/mẹ vui lòng hoàn tất sớm để Kenji bắt đầu làm Ebook nhé.
            </p>
          </div>
          
          <div className="text-center mb-12 fade-in-section">
            <div className="inline-block border border-[#c9a84c]/40 px-6 py-3">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a6820] font-medium mb-1">
                Thời gian giao báo cáo
              </div>
              <div className="font-serif text-lg text-[#1a1510]">
                3 – 5 ngày làm việc
              </div>
            </div>
          </div>
          
          <div className="text-center fade-in-section">
            <Link href="/kidbook" className="text-sm text-[#8a6820] hover:text-[#c9a84c] transition-colors">
              ← Về trang Kidmap
            </Link>
          </div>
          
          <div className="text-center mt-16 pt-8 border-t border-[#c9a84c]/20 fade-in-section">
            <div className="text-[9px] tracking-[0.3em] uppercase text-[#8a6820] opacity-60">
              Kenji Phạm · Essence Coaching · Sài Gòn · 2026
            </div>
          </div>
          
        </div>
      </main>
    </>
  );
}