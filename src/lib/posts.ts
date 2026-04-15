/**
 * 블로그 포스트 데이터 레이어.
 *
 * 현재: 로컬 목 데이터.
 * 추후: Sanity GROQ 또는 Supabase로 이 모듈의 함수 시그니처를
 *       유지한 채 구현체만 교체. 페이지 컴포넌트는 수정 불필요.
 */

import type { CategorySlug } from "./categories";

export type Post = {
  slug: string;
  title: string;
  summary: string;
  content: string; // 향후 MDX/Sanity 포터블 텍스트로 교체
  publishedAt: string; // ISO 8601
  tags: string[];
  category: CategorySlug;
  /** 카테고리별 자유 형태 메타 필드 (Sanity 스키마 도입 전까지 임시) */
  meta?: Record<string, string | number>;
};

const POSTS: Post[] = [
  {
    slug: "hello-world",
    title: "Victor Alpha 블로그 오픈",
    summary:
      "Pine Script 전략, 시장 인사이트, 매크로 노트를 한 곳에 모아 갑니다.",
    publishedAt: "2026-04-15",
    tags: ["공지", "시작"],
    category: "market",
    meta: { symbol: "BTC/USDT", timeframe: "1D", sentiment: "중립", analysisType: "기술적" },
    content: `## 환영합니다

Victor Alpha는 한국 리테일 트레이더와 입문자를 위한 매거진형 트레이딩 블로그입니다.

### 다룰 주제
- 시장인사이트 — BTC·KOSPI·매크로 흐름
- 트레이딩 전략 — 추세추종·평균회귀·돌파
- Pine Script — 지표/전략 코드
- 입문 가이드 — 차트와 지표 기초
- 매크로·뉴스 — 금리·CPI·정책 해석

거의 매일 업데이트하겠습니다.`,
  },
  {
    slug: "agent-team-design",
    title: "전략 백테스트 자동화 — 에이전트 팀 구성기",
    summary:
      "Pine Script 전략 후보를 병렬로 백테스트·리포트하는 에이전트 워크플로 설계.",
    publishedAt: "2026-04-14",
    tags: ["백테스트", "자동화"],
    category: "strategy",
    meta: { strategyType: "추세추종", difficulty: "중급", winRate: 64, mdd: 18 },
    content: `## 왜 자동화인가

전략 후보 5~10개를 손으로 백테스트하면 반나절이 사라집니다.
병렬 에이전트로 분담시키면 같은 시간에 30~50개 검증이 가능합니다.

### 역할 분리
- runner: 백테스트 실행
- analyzer: 결과 통계화
- reporter: 마크다운 리포트 작성`,
  },
  {
    slug: "nextjs-15-notes",
    title: "RSI + EMA 추세추종 전략 — Pine Script v5",
    summary:
      "RSI 50 돌파 + EMA 200 위 조건을 결합한 가벼운 추세추종 셋업과 백테스트 결과.",
    publishedAt: "2026-04-12",
    tags: ["RSI", "EMA", "추세추종"],
    category: "pinescript",
    meta: { scriptType: "strategy", pineVersion: "v5", relatedStrategy: "RSI50 + EMA200" },
    content: `## 셋업 요약

- RSI(14) > 50
- 종가 > EMA(200)
- 두 조건 동시 충족 시 진입, 반대 조건 시 청산

\`\`\`pinescript
//@version=5
strategy("RSI50 + EMA200 Trend", overlay=true)
emaLen = input.int(200, "EMA length")
rsiLen = input.int(14, "RSI length")
ema = ta.ema(close, emaLen)
rsi = ta.rsi(close, rsiLen)
long = rsi > 50 and close > ema
if long
    strategy.entry("L", strategy.long)
if not long
    strategy.close("L")
\`\`\``,
  },
];

export async function getAllPosts(): Promise<Post[]> {
  return [...POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getAllSlugs(): Promise<string[]> {
  return POSTS.map((p) => p.slug);
}

export async function getPostsByCategory(
  category: CategorySlug,
): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.category === category);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.tags.includes(tag));
}
