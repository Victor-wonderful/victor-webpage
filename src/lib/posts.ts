/**
 * 블로그 포스트 데이터 레이어.
 *
 * 1순위: Sanity GROQ.
 * Sanity 응답이 비어있거나 실패하면 로컬 mock으로 fallback.
 * 마이그레이션 전후 양쪽에서 사이트가 동작하도록 유지.
 */

import { client } from "@/sanity/client";
import {
  allPostsQuery,
  allPostsPageQuery,
  allPostsCountQuery,
  allSlugsQuery,
  postBySlugQuery,
  postsByCategoryQuery,
  postsByCategoryPageQuery,
  postsByCategoryCountQuery,
  postsByTagQuery,
} from "@/sanity/queries";
import type { CategorySlug } from "./categories";

export type SanityImageRef = {
  asset?: { _ref?: string; _id?: string; url?: string };
  alt?: string;
};

export type SanityFileRef = {
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string;
    originalFilename?: string;
    size?: number;
    extension?: string;
    mimeType?: string;
  };
};

export type PostAttachment = {
  label: string;
  description?: string;
  file?: SanityFileRef;
};

export type Post = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string; // ISO 8601
  tags: string[];
  category: CategorySlug;
  meta?: Record<string, string | number>;
  bodyImages?: SanityImageRef[];
  attachments?: PostAttachment[];
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
    slug: "token-trends-2026-w16",
    title: "이번 주 토큰 트렌드 — AI·RWA 섹터 자금 유입 TOP 5",
    summary:
      "4월 셋째 주, 거래소 신규 상장과 온체인 자금 흐름 기준으로 본 주목할 만한 토큰 5종.",
    publishedAt: "2026-04-16",
    tags: ["토큰", "AI", "RWA", "온체인"],
    category: "tokens",
    meta: {
      sector: "AI · RWA",
      timeframe: "주간",
      dataSource: "CoinGecko · Nansen",
      riskLevel: "중·고",
    },
    content: `## 이번 주 픽 5종

이번 주는 **AI 에이전트 섹터**와 **RWA(실물자산 토큰화)** 두 축에서 자금 유입이 두드러졌습니다. 가격 추종이 아닌 **온체인 활동 + 거래소 상장** 기준 큐레이션입니다.

### TOP 5 (가나다 순)

1. **AI Agent 섹터 토큰 A** — 주요 거래소 동시 상장, 24h 거래량 5배 증가
2. **RWA 플랫폼 토큰 B** — 미 국채 토큰화 TVL 30% 증가, 기관 지갑 신규 유입
3. **DePIN 인프라 토큰 C** — 노드 수 주간 +12%, 에어드랍 시즌 종료 후 가격 안정화
4. **L2 인프라 토큰 D** — 메인넷 업그레이드 직후 활성 주소 +40%
5. **Meme 섹터 대표 E** — 단기 변동성 ↑, 진입은 신중히

### 보는 관점

- **자금 흐름**: 거래량/TVL 증가 토큰만 후보
- **상장 모멘텀**: 주요 거래소 신규 상장 ±7일 구간
- **온체인 시그널**: 활성 주소·고래 지갑 누적 잔고 변화

> ⚠️ **본 글은 투자 추천이 아닙니다.** 큐레이션 관점의 분석/의견이며, 매매 결정은 본인 책임입니다.`,
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

function normalize(p: Post): Post {
  return {
    ...p,
    publishedAt: p.publishedAt?.slice(0, 10) ?? p.publishedAt,
    tags: p.tags ?? [],
  };
}

async function trySanity<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const result = await fn();
    if (Array.isArray(result) && result.length === 0) return fallback;
    if (result == null) return fallback;
    return result;
  } catch (err) {
    console.warn("[posts] Sanity query failed, using mock:", err);
    return fallback;
  }
}

/**
 * Loosely-typed fetch helper.
 * @sanity/client v7 infers params from the query template-literal type, but
 * our queries use string interpolation (POST_PROJECTION) which defeats that
 * inference. We forward through a wrapper to keep `this` bound.
 */
function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (client.fetch as any)(query, params ?? {}) as Promise<T>;
}

export async function getAllPosts(): Promise<Post[]> {
  const fallback = [...POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const result = await trySanity(
    () => sanityFetch<Post[]>(allPostsQuery),
    fallback,
  );
  return result.map(normalize);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const mock = POSTS.find((p) => p.slug === slug) ?? null;
  const result = await trySanity(
    () => sanityFetch<Post | null>(postBySlugQuery, { slug }),
    mock,
  );
  return result ? normalize(result) : null;
}

export async function getAllSlugs(): Promise<string[]> {
  const fallback = POSTS.map((p) => p.slug);
  return trySanity(
    () => sanityFetch<string[]>(allSlugsQuery),
    fallback,
  );
}

export async function getPostsByCategory(
  category: CategorySlug,
): Promise<Post[]> {
  const fallback = POSTS.filter((p) => p.category === category);
  const result = await trySanity(
    () => sanityFetch<Post[]>(postsByCategoryQuery, { category }),
    fallback,
  );
  return result.map(normalize);
}

export const POSTS_PER_PAGE = 12;

/** Paginated all-posts (across all categories). 1-based page. */
export async function getAllPostsPage(
  page: number,
  perPage: number = POSTS_PER_PAGE,
): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  const safePage = Math.max(1, Math.floor(page));
  const start = (safePage - 1) * perPage;
  const end = start + perPage;

  const fallbackAll = [...POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const fallback = {
    posts: fallbackAll.slice(start, end),
    total: fallbackAll.length,
    totalPages: Math.max(1, Math.ceil(fallbackAll.length / perPage)),
  };

  try {
    const [pagePosts, total] = await Promise.all([
      sanityFetch<Post[]>(allPostsPageQuery, { start, end }),
      sanityFetch<number>(allPostsCountQuery),
    ]);
    if (!Array.isArray(pagePosts) || typeof total !== "number") return fallback;
    return {
      posts: pagePosts.map(normalize),
      total,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  } catch (err) {
    console.warn("[posts] paginated fetch failed, using mock:", err);
    return fallback;
  }
}

/**
 * Paginated category fetch. Returns one page of posts plus the total count
 * needed to render pagination controls.
 *
 * `page` is 1-based.
 */
export async function getPostsByCategoryPage(
  category: CategorySlug,
  page: number,
  perPage: number = POSTS_PER_PAGE,
): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  const safePage = Math.max(1, Math.floor(page));
  const start = (safePage - 1) * perPage;
  const end = start + perPage;

  const fallbackAll = POSTS.filter((p) => p.category === category);
  const fallback = {
    posts: fallbackAll.slice(start, end),
    total: fallbackAll.length,
    totalPages: Math.max(1, Math.ceil(fallbackAll.length / perPage)),
  };

  try {
    const [pagePosts, total] = await Promise.all([
      sanityFetch<Post[]>(postsByCategoryPageQuery, { category, start, end }),
      sanityFetch<number>(postsByCategoryCountQuery, { category }),
    ]);
    if (!Array.isArray(pagePosts) || typeof total !== "number") return fallback;
    return {
      posts: pagePosts.map(normalize),
      total,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  } catch (err) {
    console.warn("[posts] paginated fetch failed, using mock:", err);
    return fallback;
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const fallback = POSTS.filter((p) => p.tags.includes(tag));
  const result = await trySanity(
    () => sanityFetch<Post[]>(postsByTagQuery, { tag }),
    fallback,
  );
  return result.map(normalize);
}
