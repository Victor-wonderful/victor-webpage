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
  {
    slug: "candle-basics",
    title: "캔들 차트 처음 보는 분을 위한 5분 가이드",
    summary:
      "양봉·음봉, 꼬리, 시가·종가의 의미와 가장 흔한 4가지 캔들 패턴을 정리합니다.",
    publishedAt: "2026-04-10",
    tags: ["캔들", "차트", "기초"],
    category: "basics",
    meta: { level: "초급", readMinutes: 5, prerequisites: "없음" },
    content: `## 캔들 한 개가 말해주는 것

캔들 하나는 한 단위 시간(1분, 1시간, 1일 등)의 시가·고가·저가·종가 4개 가격을 그림 한 장으로 압축합니다.

### 양봉 vs 음봉
- **양봉** — 종가 > 시가, 가격이 그 시간 동안 올랐다.
- **음봉** — 종가 < 시가, 가격이 그 시간 동안 내렸다.

### 꼬리(심지)의 의미
위/아래 꼬리는 그 시간 안에서 가격이 잠깐 도달했지만 결국 되돌아왔다는 뜻입니다. 긴 꼬리는 매수·매도세의 충돌이 격렬했음을 시사합니다.

### 자주 보는 4가지 패턴
1. **장대양봉/장대음봉** — 강한 추세 신호
2. **도지** — 시가 = 종가, 방향성 부재
3. **망치형** — 긴 아래꼬리, 바닥 반등 가능성
4. **유성형** — 긴 위꼬리, 상승 후 매물 출현`,
  },
  {
    slug: "fomc-2026-04-preview",
    title: "4월 FOMC 프리뷰 — 금리 동결과 점도표 변화 가능성",
    summary:
      "이번 FOMC에서 시장이 주목하는 세 가지 포인트와 자산군별 시나리오를 정리합니다.",
    publishedAt: "2026-04-09",
    tags: ["FOMC", "금리", "매크로"],
    category: "macro",
    meta: {
      event: "FOMC",
      region: "미국",
      scheduledAt: "2026-04-30 03:00 KST",
      impact: "상",
    },
    content: `## 시장이 주목하는 3가지

1. **점도표(dot plot) 이동 폭** — 연내 인하 횟수 컨센서스 변화
2. **파월 의장의 톤** — 인플레이션 경계 vs 성장 둔화 우려 비중
3. **QT 속도 조정** — 양적긴축 종료 시점 힌트

### 자산별 시나리오
- **매파적**: USD 강세, 금리 ↑, 위험자산 약세
- **중립**: 변동성 수렴, BTC 박스권 유지 가능
- **비둘기파적**: USD 약세, 골드/BTC 단기 랠리, KOSPI 외국인 순매수 기대`,
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
