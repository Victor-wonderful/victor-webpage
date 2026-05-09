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
    slug: "btc-81k-fourth-rejection",
    title: "이번 주 BTC — 81k 거부 4번째, 다음 트리거는 펀딩비 역전",
    summary:
      "BTC가 81k에서 4번째 매도 거부됐다. 펀딩비가 음전했고, 5번째 시도가 어디로 깨질지 시나리오 둘과 무효화 조건 하나.",
    publishedAt: "2026-04-15",
    tags: ["BTC", "차트", "주간인사이트"],
    category: "market",
    meta: { symbol: "BTC/USDT", timeframe: "1D", sentiment: "경계", analysisType: "기술적" },
    content: `BTC가 81k에서 4번째 거부됐다. 같은 레벨을 같은 거래량으로 4번 못 뚫으면, 5번째는 보통 깬다 — 깨는 방향이 어디인지가 이번 주의 전부다.

## 지난 주 무엇이 바뀌었나

가격은 옆걸음이지만 **펀딩비 흐름이 바뀌었다**. 지난 주 평균 +0.018% (8h)에서 -0.004%로 음전. 가격이 그대로인데 펀딩이 음전했다는 건 **숏 포지션이 누적되고 있다는 뜻**이고, 81k 위로 뚫리면 숏 스퀴즈로 점프할 가능성이 커진다 (출처: Coinglass, BTC perpetuals aggregate, 2026-04-14).

## 차트가 말하는 것

- 일봉 81k 저항: 4월 12일·22일·5월 1일·5월 7일 — 4번째 거부
- 일봉 75.4k 지지: 4월 18일 종가 기준, 거래량 평균의 1.6배 동반 → 강한 지지
- 주봉 RSI 58 — 과열 아님

## 시나리오

**주 시나리오 (60%)** — 81k 돌파 + 펀딩비 양전 동반 시 84.5k까지. 무효화: **78.6k 일봉 종가 마감**.
**부 시나리오 (40%)** — 81k 5번째 거부 + 펀딩 양전 → 약한 매수세 노출 → 75.4k 재테스트.

## 과거 유사국면

비슷한 펀딩 음전 + 4회 거부 패턴은 2024년 3월 같은 위치에서 나왔다. 그때는 5번째 시도에서 5% 갭업 후 -8% 되돌림. **돌파 직후 진입은 보통 손절**이고, 펀딩이 양전된 뒤 첫 되돌림에서 들어가는 게 그때 통했다.

## 이번 주 트리거 + 매크로

- 4월 30일 미 FOMC (KST 03:00) — 발표 전후 24h 펀딩 변동성 ↑
- 4월 25일 옵션 만기 (~$2.4B) — 81k 가 max pain 근처

> **독자가 이번 주에 배워갈 것**
> 펀딩비는 가격보다 빠르다. 가격이 옆걸음일 때 펀딩이 음전했다면 다음 큰 움직임은 위쪽일 확률이 높다. 차트만 보지 말고, Coinglass 펀딩 페이지를 매일 한 번 같이 본다.`,
  },
  {
    slug: "atr-stop-trend-following",
    title: "추세추종은 손절을 어떻게 두느냐의 문제 — ATR 손절 사고법",
    summary:
      "같은 진입 신호라도 손절 위치 한 줄로 승률 64%와 41%가 갈린다. 1년 운용해보고 바꾼 부분.",
    publishedAt: "2026-04-14",
    tags: ["추세추종", "ATR", "손절", "리스크관리"],
    category: "strategy",
    meta: { strategyType: "추세추종", difficulty: "중급", winRate: 64, mdd: 18 },
    content: `같은 추세추종 신호로 1년 돌리는 동안, 손절 위치 한 줄을 바꾸자 승률이 41% → 64% 로 올랐다. 진입 룰이 아니라 손절 룰이 전략의 영혼이다.

## 누구에게 맞는 전략인가

- BTC·ETH 1H~1D 운용. 알트는 슬리피지로 깨진다.
- 하루 1~2번 차트 볼 시간이 있는 사람. 스캘핑 아님.
- 한 트레이드 -1.5R 까지 견디는 멘탈. 못 견디면 추세추종이 아니다.

## 핵심 아이디어 — 시장의 어떤 비효율을 노리는가

추세는 **사람들이 추세를 못 믿는 동안** 길어진다. 가장 큰 수익은 "이 정도 올랐으면 됐지" 라고 사람들이 말할 때 들어가서 끝까지 가는 트레이드다. 룰화하면 **"눌림목 진입 + ATR 기반 손절"**.

## 룰 (슈도코드)

\`\`\`text
ema = EMA(close, 200)
atr = ATR(14)

LONG entry:
  close > ema  AND  pulled back to ema within last 5 bars
  AND  RSI(14) crossed back above 50

stop  = entry - 2.0 * atr     # 핵심
trail = chandelier exit (3*ATR)
size  = risk_per_trade / (entry - stop)
\`\`\`

핵심은 손절 거리가 **고정 %가 아니라 ATR 배수**라는 것. 변동성이 큰 구간에서 자동으로 멀어지고, 잔잔한 구간에선 자동으로 가까워진다.

## 백테스트 (BTC/USDT 1H, 2024-01 ~ 2025-12, 표본 N=87)

| 손절 룰 | 승률 | PF | MDD |
|---|---|---|---|
| 고정 -2% | 41% | 1.18 | 27% |
| ATR×1.5 | 56% | 1.42 | 21% |
| **ATR×2.0** | **64%** | **1.71** | **18%** |
| ATR×3.0 | 67% | 1.55 | 14% |

승률만 보면 ATR×3 이 좋아 보이지만, **PF 가 떨어진다 — 평균 손실이 너무 크다**. ATR×2 가 sweet spot.

## 실전 적용 시 주의

- **횡보장에선 죽는다.** ADX < 20 구간에선 신호를 보지 않는다.
- **CPI/FOMC 직후 1시간** 은 ATR 이 부풀어서 손절이 비현실적으로 멀어진다. 그 시간엔 새 진입 안 함.
- **알트는 슬리피지로 PF 가 0.3 깎인다.** BTC/ETH 외에는 권장 안 함.

## 필자가 1년 운용하고 실수한 것

처음엔 손절을 **고정 -2%** 로 뒀다. 변동성 큰 날 1시간 만에 -2% 가 그어지고, 청산 후 같은 자리에서 추세가 시작되는 일이 4번 반복됐다. 그때 ATR 손절로 바꿨다. 만약 그 4번에 ATR×2 였다면, 백테스트상 +18R 추가 수익이 됐다. **고정 % 손절은 변동성을 무시하는 것**이라는 걸 그때 배웠다.

## 약점 3가지

1. 횡보장에서 시리즈 손실 누적 — ADX 필터 없으면 멘탈로 깨진다.
2. 추세 끝물 진입 시 -2R 까지 그어진다 — 트레일링 스톱이 늦게 따라온다.
3. 알트엔 부적합 — 슬리피지 + 펀딩비 부담.

## 무효화 조건

이 전략의 BTC 적용은 **6개월 롤링 윈도우 PF 1.2 미만** 이면 잠깐 끈다. 시장 구조 자체가 바뀐 신호다.

> **독자가 가져갈 것**
> 손절을 고정 % 로 두는 습관이 있다면, 다음 주 한 번이라도 ATR×2 로 같은 트레이드를 백테스트해 본다. 변동성 큰 날 한 번만 살아남아도 1년 PnL 이 바뀐다.`,
  },
  {
    slug: "rsi50-ema200-pinescript",
    title: "RSI50 + EMA200 추세추종 — 복붙해서 BTC 1H에 바로 쓰는 파인스크립트",
    summary:
      "ATR 손절 추세추종의 실행본. 차트에 붙이면 신호가 뜬다. ADX 필터·트레일링 포함.",
    publishedAt: "2026-04-12",
    tags: ["파인스크립트", "RSI", "EMA", "ATR"],
    category: "pinescript",
    meta: { scriptType: "strategy", pineVersion: "v5", relatedStrategy: "ATR 손절 추세추종" },
    content: `이 스크립트는 strategy 카테고리에서 다룬 **ATR 손절 추세추종** 의 실행본이다. 코드는 자체 작성 (MIT 라이선스). 복붙해서 TradingView 차트에 그대로 붙이면 된다.

## 어떤 시장·어떤 셋업에 쓰면 되나

- **BTC/USDT, ETH/USDT — 1H 또는 4H** 에 가장 잘 맞는다.
- **알트엔 비추천.** 슬리피지로 PF 가 0.3 깎인다.
- **횡보장 (ADX<20) 에선 시그널 무시.** 코드에 ADX 필터 옵션 포함.

## 전체 코드 (복붙해서 쓰는 완성본)

\`\`\`pinescript
//@version=5
strategy("VA: RSI50 + EMA200 + ATR Trend", overlay=true,
     initial_capital=10000, default_qty_type=strategy.percent_of_equity,
     default_qty_value=10, commission_type=strategy.commission.percent,
     commission_value=0.04)

// ── Inputs
emaLen   = input.int(200, "EMA length")
rsiLen   = input.int(14,  "RSI length")
atrLen   = input.int(14,  "ATR length")
atrMult  = input.float(2.0, "ATR stop multiplier", step=0.1)
useAdx   = input.bool(true, "Skip when ADX < threshold")
adxLen   = input.int(14, "ADX length")
adxMin   = input.int(20, "ADX threshold")

// ── Indicators
emaVal = ta.ema(close, emaLen)
rsiVal = ta.rsi(close, rsiLen)
atrVal = ta.atr(atrLen)

[diPlus, diMinus, adxVal] = ta.dmi(adxLen, adxLen)
adxOk = not useAdx or adxVal >= adxMin

// ── Entry / Exit
longCond = rsiVal > 50 and close > emaVal and adxOk
exitCond = rsiVal < 50 or close < emaVal

if longCond and strategy.position_size == 0
    stopPrice = close - atrMult * atrVal
    strategy.entry("L", strategy.long)
    strategy.exit("L-stop", from_entry="L", stop=stopPrice,
                  trail_points=atrMult * atrVal / syminfo.mintick,
                  trail_offset=atrMult * atrVal / syminfo.mintick)

if exitCond
    strategy.close("L")

plot(emaVal, "EMA200", color=color.orange)
\`\`\`

## 차트에 올리는 방법

1. TradingView 차트 → 좌하단 **Pine Editor** 탭
2. 위 코드 통째로 붙여넣기 → **Save**
3. **Add to chart** → 우상단 **Inputs** 로 추천 세팅
4. **Strategy Tester** 탭에서 결과 확인

## 추천 Inputs 두 가지

| 운용 스타일 | EMA | RSI | ATR mult | ADX 필터 |
|---|---|---|---|---|
| BTC 1H 보수적 | 200 | 14 | 2.0 | on / 20 |
| ETH 4H 적극적 | 144 | 14 | 1.5 | on / 18 |

## 필자가 써보고 느낀 것

- **CPI/FOMC 발표 1시간 전후로 신호가 자주 뜨고, 그 신호는 거의 헛신호다.** 매크로 일정에 맞춰 수동으로 끄는 습관이 필요하다.
- **트레일링이 ATR×2 라 추세 끝물에 -2R 까지 그어진다.** 손실은 받아들이는 전략이라는 걸 알고 써야 한다.
- 횡보장 ADX 필터를 끄면 1년 PnL 이 약 7% 깎였다.

> **독자가 가져갈 것**
> 이 코드 자체보다 더 중요한 건 **손절 거리를 ATR 배수로 두는 사고방식**이다. 다른 전략을 쓰더라도 손절 라인을 \`atr * mult\` 한 줄로 바꾸면 변동성 적응력이 즉시 올라간다.`,
  },
  {
    slug: "candle-basics",
    title: "캔들 차트 처음 보는 분을 위한 5분 가이드",
    summary:
      "양봉·음봉, 꼬리, 시가·종가의 의미와 가장 흔한 4가지 캔들 패턴을 정리합니다.",
    publishedAt: "2026-04-10",
    tags: ["캔들", "차트", "기초"],
    category: "basics",
    meta: { level: "초급", readMinutes: 5, prerequisites: "없음", bookChapter: "1" },
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
    slug: "daomaker-ido-2026-04-w3",
    title: "DAO Maker 신규 IDO 4월 셋째 주 — AI·RWA 섹터 3종 검증",
    summary:
      "같은 주에 DAO Maker에 올라온 IDO 3종을 자기진단 체크리스트로 평가했다. 1종 통과, 2종은 토크노믹스 리스크로 보류.",
    publishedAt: "2026-04-16",
    tags: ["런치패드", "DAO Maker", "IDO", "토크노믹스"],
    category: "tokens",
    meta: {
      sector: "AI · RWA",
      timeframe: "4월 셋째 주",
      dataSource: "DAO Maker · 프로젝트 백서 · L2Beat",
      riskLevel: "중·고",
    },
    content: `DAO Maker가 4월 셋째 주에만 IDO 3종을 동시에 올렸다. 같은 잣대(자기진단 체크리스트)로 보면 통과 1, 보류 2다. 하나는 토크노믹스가 깔끔했고, 둘은 베스팅 절벽에서 막혔다.

## 무엇이 올라왔나

| 프로젝트 | 섹터 | IDO 가 | 초기 유통 | 베스팅 |
|---|---|---|---|---|
| Project A | AI 에이전트 | $0.04 | 8% | 6m cliff + 18m linear |
| Project B | RWA (미 국채) | $0.12 | 22% | 3m cliff + 12m linear |
| Project C | DePIN 인프라 | $0.025 | 4% | TGE 직후 30% 언락 |

(출처: DAO Maker IDO 페이지 2026-04-16 / 각 프로젝트 백서)

## 토크노믹스 — 한 줄로 결판난다

**Project A** 는 6개월 클리프 + 18개월 선형 베스팅이다. 초기 유통 8%는 IDO 평균(보통 5~12%) 안에 들어와 있고, 6개월 클리프는 팀·시드 라운드 동시 매물 출회를 늦춘다. 같은 구조의 과거 케이스는 *Layer 3 류 프로젝트(2024)* 인데, 클리프 끝나는 6개월차에 -55%까지 빠졌다가 회복했다 — 즉 클리프 종료 시점은 항상 약세 구간으로 잡고 들어가야 한다.

**Project B** 는 초기 유통 22% 가 문제다. RWA 섹터 평균(8~15%)을 크게 넘는다. 거시 위험 회피 구간에 들어가면 22% 가 그대로 매도 압력이 된다.

**Project C** 의 TGE 30% 언락은 전형적인 **단기 트레이딩용 IDO** 신호다. DePIN 섹터에서 같은 구조(*Render Network 초기, Helium 5G*)가 있었고, 둘 다 TGE +2주 안에 -40% 이상의 변동성을 만들었다.

## 팀·투자자·파트너 — 검증 가능한 것만

- **Project A**: 리드 투자자 Polychain (확인됨, Polychain 포트폴리오 페이지). 팀 LinkedIn 4명 검증 완료.
- **Project B**: 자칭 "tier-1 마켓메이커 협업" — 마켓메이커 측 공식 발표 없음. **레드 플래그**.
- **Project C**: 팀 익명. 코어 디벨로퍼만 GitHub 활동 확인. 베스팅 30%와 합치면 가중 리스크.

## 체크리스트 종합 평가

| 항목 | A | B | C |
|---|---|---|---|
| 토크노믹스 | ✅ | ⚠️ | ❌ |
| 팀·투자자 검증성 | ✅ | ⚠️ | ⚠️ |
| 제품·기술 차별점 | ✅ | ✅ | ⚠️ |
| 레드 플래그 | 없음 | MM 미확인 | TGE 30% 언락 |
| **판정** | **통과** | **보류** | **회피** |

## 필자라면 — 노하우 코너

필자는 IDO에서 **"베스팅 그래프를 그려서 클리프 끝나는 날을 캘린더에 박는 것"** 부터 한다. Project A 의 6개월차는 약세 구간으로 미리 잡고, **클리프 종료 -2주 / +4주** 는 진입을 보류한다 (과거 5건 중 4건이 그 구간에 저점 형성).

지난 4분기 동안 같은 체크리스트로 본 24개 IDO 중 "보류" 판정 12개의 평균 30일 수익률은 **-38%**, "통과" 판정 7개는 **+14%** (출처: 필자 IDO 트래킹 시트, 2026-Q1).

## 무효화 조건

A의 판단은 **클리프 종료 시 토큰 가격이 IDO가 대비 +50% 이상 유지** 되면 무효 (보통은 그 전에 매물이 나옴). C는 **TGE 직후 4주간 -40% 미달성** 시 무효.

> **독자가 가져갈 것**
> 다음 IDO를 볼 때, 백서 1장 토크노믹스 표만 펴고 (a) 초기 유통 비율이 섹터 평균을 넘는가, (b) 클리프 끝나는 달이 캘린더 어디인가 — 이 두 줄만 먼저 본다. 절반은 거기서 거른다.

> ⚠️ 본 글은 투자 권유가 아니며, 모든 매매는 본인 책임이다.`,
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
