import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  // Mô tả RIÊNG cho og:description/twitter:description khi khác với
  // <meta name="description"> chuẩn SEO — vd trang chủ muốn description
  // Google dài, đầy đủ, nhưng card chia sẻ mạng xã hội ngắn gọn, giữ "by
  // Kenji Phạm" (Kenji xác nhận giữ riêng ở đây, 19/07/2026). Optional,
  // fallback về `description` như hành vi cũ — không đổi trang nào khác.
  ogDescription?: string;
  image?: string;
  url?: string;
}

// SEO elements that can be used in _document.tsx (returns JSX without Head wrapper)
export function SEOElements({
  title = "Essence Coaching · Kenji Phạm",
  description = "Câu chuyện cuộc sống của bạn là một kiệt tác. Essence Coaching by Kenji Phạm — Sài Gòn",
  image = "/og-image.png",
  url = undefined,
}: SEOProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/essence-monogram-light.svg" type="image/svg+xml" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </>
  );
}

// SEO component for use in pages/_app.tsx or individual pages (uses next/head)
// Note: Flattened structure (no fragment) for better Next.js Head compatibility during hot reload
export function SEO({
  title = "Essence Coaching · Kenji Phạm",
  description = "Câu chuyện cuộc sống của bạn là một kiệt tác. Essence Coaching by Kenji Phạm — Sài Gòn",
  ogDescription,
  image = "/og-image.png",
  url = undefined,
}: SEOProps) {
  const shareDescription = ogDescription ?? description;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/essence-monogram-light.svg" type="image/svg+xml" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={shareDescription} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={shareDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}