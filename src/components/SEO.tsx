import Head from 'next/head';

interface SEOProps {
  title?: string;
  ogTitle?: string;
  description?: string;
  // Mô tả RIÊNG cho og:description/twitter:description khi khác với
  // <meta name="description"> chuẩn SEO — vd trang chủ muốn description
  // Google dài, đầy đủ, nhưng card chia sẻ mạng xã hội ngắn gọn, giữ "by
  // Kenji Phạm" (Kenji xác nhận giữ riêng ở đây, 19/07/2026). Optional,
  // fallback về `description` như hành vi cũ — không đổi trang nào khác.
  ogDescription?: string;
  image?: string;
  url?: string;
  // og:type — mặc định "website" giữ nguyên hành vi mọi trang cũ. Trang
  // entity cá nhân (vd /ve-kenji) cần "profile" cho schema mạng xã hội.
  type?: string;
}

// CHỈ dùng trong _document.tsx cho markup THẬT SỰ giống nhau mọi trang
// (favicon). KHÔNG còn render title/description/OG/Twitter ở đây — sửa
// 27/07/2026: next/document's <Head> không merge/dedupe với next/head's
// <Head> theo kiểu "trang thắng"; khi cả hai cùng có <title>, next/document
// (đăng ký trước, do bọc toàn bộ cây) luôn thắng, khiến MỌI trang gọi
// <SEO title="..."/> riêng đều bị hiện title mặc định sai (đo thật bằng
// curl: /ve-kenji, /phuong-phap, /lang-90 production đều trả về title
// "Essence Coaching · Kenji Phạm" dù mỗi trang set title khác nhau).
// Trang nào cần title/description riêng phải tự gọi <SEO/> (không props =
// dùng đúng default cũ). Xem SEO() bên dưới cho default.
export function SEOElements() {
  return <link rel="icon" href="/essence-monogram-light.svg" type="image/svg+xml" />;
}

// SEO component for use in pages/_app.tsx or individual pages (uses next/head)
// Note: Flattened structure (no fragment) for better Next.js Head compatibility during hot reload
export function SEO({
  title = "Essence Coaching · Kenji Phạm",
  ogTitle,
  description = "Câu chuyện cuộc sống của bạn là một kiệt tác. Essence Coaching by Kenji Phạm — Sài Gòn",
  ogDescription,
  image = "/og-image.png",
  url = undefined,
  type = "website",
}: SEOProps) {
  const shareDescription = ogDescription ?? description;
  const shareTitle = ogTitle ?? title;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/essence-monogram-light.svg" type="image/svg+xml" />

      {/* Open Graph */}
      <meta property="og:title" content={shareTitle} />
      <meta property="og:description" content={shareDescription} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={type} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={shareTitle} />
      <meta name="twitter:description" content={shareDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}
