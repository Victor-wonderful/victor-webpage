/**
 * Category metadata — single source of truth.
 * Slugs are English (URL-stable), labels are Korean (display).
 * Add/rename here and the menu, breadcrumbs, and routes auto-pick it up.
 */

export type CategorySlug =
  | "market"
  | "strategy"
  | "tokens"
  | "basics"
  | "macro";

export type Category = {
  slug: CategorySlug;
  label: string;
  description: string;
  eyebrow: string; // English short label for editorial eyebrow
};

export const CATEGORIES: Category[] = [
  {
    slug: "market",
    label: "주간마켓인사이트",
    description: "이번 주 주목해야 할 L1/L2 프로젝트, 비트코인 도미넌스 변화, 혹은 거시 경제 일정(FOMC 등)에 따른 시나리오.",
    eyebrow: "Market Insight",
  },
  {
    slug: "strategy",
    label: "트레이딩 전략",
    description: "추세추종·평균회귀·돌파 전략과 백테스트 결과.",
    eyebrow: "Strategy",
  },
  {
    slug: "tokens",
    label: "심층분석",
    description: "프로젝트 X-ray — 백서·토크노믹스·베스팅·메커니즘을 같은 프레임으로 정량 분해해 '무엇을 살까'를 결정하기 위한 노하우.",
    eyebrow: "Project X-ray",
  },
  {
    slug: "basics",
    label: "입문 가이드",
    description: "차트 보는 법, 지표 기초, 매매 원칙 — 처음 시작하는 분들을 위해.",
    eyebrow: "Basics",
  },
  {
    slug: "macro",
    label: "오늘의 시장",
    description: "오늘 BTC·ETH·주요 알트 가격 흐름 + 금리·CPI·정책 등 매크로 이벤트의 크립토 전가 해석.",
    eyebrow: "Today's Market",
  },
];

/**
 * Standalone nav items that aren't category-routed (e.g. /dashboard).
 * The PillNav renders these alongside the category pills.
 */
export type NavItem = {
  label: string;
  href: string;
};

export const EXTRA_NAV_ITEMS: NavItem[] = [
  { label: "대시보드", href: "/dashboard" },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return CATEGORIES.some((c) => c.slug === slug);
}
