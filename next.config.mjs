/** @type {import('next').NextConfig} */
import { createRequire } from "module";

// Check if element-tagger is available
function isElementTaggerAvailable() {
  try {
    const require = createRequire(import.meta.url);
    require.resolve("@softgenai/element-tagger");
    return true;
  } catch {
    return false;
  }
}

// Build turbo rules only if tagger is available
function getTurboRules() {
  if (!isElementTaggerAvailable()) {
    console.log(
      "[Softgen] Element tagger not found, skipping loader configuration"
    );
    return {};
  }

  return {
    "*.tsx": ["@softgenai/element-tagger"],
    "*.jsx": ["@softgenai/element-tagger"],
  };
}

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: getTurboRules(),
    },
  },
  // Đã kiểm toàn repo (grep mọi <Image src=...>): 100% ảnh dùng path local
  // trong /public, không route nào load ảnh remote qua Image Optimizer.
  // Bỏ hẳn remotePatterns thay vì whitelist domain nào — vá advisory HIGH
  // "DoS via Image Optimizer remotePatterns" (GHSA-9g9p-9gw9-jx7f) tận gốc
  // thay vì chỉ nâng version. Nếu sau này cần ảnh remote thật, thêm domain
  // cụ thể vào đây — không dùng lại hostname "**".
  images: {},
  allowedDevOrigins: ["*.daytona.work", "*.softgen.dev"],
};

export default nextConfig;
