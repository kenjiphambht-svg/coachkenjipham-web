import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

// SEO elements that can be used in _document.tsx (returns JSX without Head wrapper)
export function SEOElements({
  title = "Kenji Phạm | Essence Coaching — Khai vấn bản sắc AI-native",
  description = "Kenji Phạm là Essence Coach và founder Essence Coaching System — hệ khai vấn bản sắc AI-native giúp con người nhìn rõ bản sắc, an định phản xạ cảm xúc và chọn bước đi kế tiếp bằng một giao thức có cấu trúc.",
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
  title = "Kenji Phạm | Essence Coaching — Khai vấn bản sắc AI-native",
  description = "Kenji Phạm là Essence Coach và founder Essence Coaching System — hệ khai vấn bản sắc AI-native giúp con người nhìn rõ bản sắc, an định phản xạ cảm xúc và chọn bước đi kế tiếp bằng một giao thức có cấu trúc.",
  image = "/og-image.png",
  url = undefined,
}: SEOProps) {
  return (
    <Head>
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
    </Head>
  );
}
