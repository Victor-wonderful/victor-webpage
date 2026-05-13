/**
 * Site-wide constants — single source of truth for URL, title, etc.
 * Override in production via NEXT_PUBLIC_SITE_URL.
 */

export const SITE = {
  name: "Victor Alpha",
  description:
    "라이브 트레이딩 대시보드와 함께 보는 시장 인사이트·전략 노트·토큰 트렌드 큐레이션.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
  author: "Victor",
  locale: "ko_KR",
} as const;
