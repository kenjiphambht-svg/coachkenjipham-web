import Head from 'next/head';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Essence Coaching · Kenji Phạm</title>
        <meta 
          name="description" 
          content="Essence Coaching by Kenji Phạm — Coming Soon" 
        />
      </Head>
      
      <main className="min-h-screen w-full flex items-center justify-center bg-[#100f0c] px-6">
        <div className="text-center max-w-2xl">
          
          {/* Brand logo */}
          <div className="mb-12">
            <div className="text-[10px] tracking-[0.38em] uppercase text-[#8a6820] font-medium mb-2">
              Kenji Phạm
            </div>
            <div className="font-serif italic text-3xl md:text-4xl text-[#c9a84c]">
              Essence Coaching
            </div>
          </div>
          
          {/* Gold divider */}
          <div className="w-12 h-px bg-[#c9a84c] mx-auto mb-12 opacity-60" />
          
          {/* Coming Soon */}
          <div className="text-[11px] tracking-[0.35em] uppercase text-[#8a6820] font-medium mb-6">
            Coming Soon
          </div>
          
          <p className="font-serif italic text-xl md:text-2xl text-[#f2ead8] leading-relaxed mb-12">
            Câu chuyện cuộc sống của bạn là một kiệt tác.<br />
            Một không gian dành riêng cho người đi tìm bản sắc.
          </p>
          
          {/* CTA to /kidbook */}
          <Link 
            href="/kidbook"
            prefetch={true}
            className="inline-block px-8 py-3 border border-[#c9a84c] text-[#c9a84c] text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#c9a84c] hover:text-[#100f0c] transition-colors duration-500"
          >
            Khám phá Mini Ebook Bản Sắc
          </Link>
          
          {/* Footer */}
          <div className="mt-24 text-[9px] tracking-[0.3em] uppercase text-[#8a6820] opacity-90">
            Sài Gòn · 2026
          </div>
          
        </div>
      </main>
    </>
  );
}