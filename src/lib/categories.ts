/**
 * Category metadata — single source of truth.
 * Slugs are English (URL-stable), labels are Korean (display).
 * Add/rename here and the menu, breadcrumbs, and routes auto-pick it up.
 */

export type CategorySlug =
  | "market"
  | "strategy"
  | "pinescript"
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
    slug: "pinescript",
    label: "Pine Script",
    description: "TradingView 지표·전략 코드와 구현 노트.",
    eyebrow: "Pine Script",
  },
  {
    slug: "tokens",
    label: "심층분석",
    description: "트레이딩 외에도 장기적인 안목을 보여줄 수 있는 섹션으로 프로젝트/토큰 노믹스 심층 분석.",
    eyebrow: "Token Trends",
  },
  {
    slug: "basics",
    label: "입문 가이드",
    description: "차트 보는 법, 지표 기초, 매매 원칙 — 처음 시작하는 분들을 위해.",
    eyebrow: "Basics",
  },
  {
    slug: "macro",
    label: "매크로·뉴스",
    description: "금리·CPI·정책 등 매크로 이벤트와 시장 해석.",
    eyebrow: "Macro & News",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return CATEGORIES.some((c) => c.slug === slug);
}
