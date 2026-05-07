/**
 * Site-wide constants — single source of truth for URL, title, etc.
 * Override in production via NEXT_PUBLIC_SITE_URL.
 */

export const SITE = {
  name: "Victor Alpha",
  description:
    "Pine Script로 시작하는 트레이딩 전략과 시장 인사이트, 토큰 트렌드 큐레이션.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
  author: "Victor",
  locale: "ko_KR",
} as const;
