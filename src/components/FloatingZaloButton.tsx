'use client';

// Màu #0068FF là màu xanh dương chính thức của thương hiệu Zalo (đã tra cứu,
// không đoán) — cố ý KHÔNG dùng token -2026 của Essence vì đây là icon bên
// thứ ba, cần đúng nhận diện gốc để người dùng nhận ra ngay.
export default function FloatingZaloButton() {
  const ZALO_URL = 'https://zalo.me/0907491289';
  
  return (
    <a
      href={ZALO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat với Kenji qua Zalo"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#0068FF] opacity-40 animate-ping-slow" />
      
      <span className="relative flex flex-col items-center justify-center w-16 h-16 rounded-full bg-[#0068FF] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 48 48" 
          className="w-6 h-6 mb-0.5"
          fill="white"
        >
          <path d="M24 4C12.95 4 4 12.95 4 24c0 3.43.86 6.65 2.38 9.47L4 44l10.85-2.32C17.55 43.16 20.69 44 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4zm-5.5 22.5h-3v-9h3v9zm0-10.5h-3v-2h3v2zm10.5 10.5h-3l-3.5-5v5h-3v-9h3l3.5 5v-5h3v9zm5.5 0h-3v-2.5h-2.5V20H29v-2.5h5.5v9z"/>
        </svg>
        <span className="text-white text-[9px] font-bold tracking-wider uppercase">
          Zalo
        </span>
      </span>
      
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#1a1510] text-[#f2ead8] text-xs px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block">
        Chat với Kenji qua Zalo
      </span>
    </a>
  );
}