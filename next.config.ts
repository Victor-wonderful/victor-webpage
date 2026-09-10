import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Google account avatars (OAuth profile photos)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
      // Sanity CDN (in case we switch to next/image for cover images)
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    return [
      // 정식 도메인 victor-alpha.link (2026-09-11 연결). www 와 옛 vercel.app 주소는 정식 도메인으로 영구 이동.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.victor-alpha.link" }],
        destination: "https://victor-alpha.link/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "victor-alpha-neon.vercel.app" }],
        destination: "https://victor-alpha.link/:path*",
        permanent: true,
      },
      // Pine Script 카테고리는 폐지 → 트레이딩 대시보드로 안내
      {
        source: "/category/pinescript",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
