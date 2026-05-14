/**
 * Victor Alpha 용어 사전 — 정적 데이터.
 *
 * Voice Guide §0.5 (독자 계층) 구현:
 * basics / macro 데일리 글에서 새 용어가 등장할 때 첫 1회 `/glossary#<id>` 로 링크.
 *
 * 추가 가이드:
 * - 1문단 풀이 = 처음 보는 사람이 1번에 이해 가능한 길이 (약 2~3문장)
 * - analogy = 한 줄 비유. basics 카테고리에서 인용하기 위함
 * - relatedSlugs = 이 용어를 본격적으로 다룬 포스트 slug (선택)
 */

export type GlossaryCategory =
  | "market-structure"
  | "derivatives"
  | "technical"
  | "smc-ict";

export type GlossaryEntry = {
  /** URL 앵커 식별자 (`/glossary#funding-rate`) */
  id: string;
  /** 한글 표제어 */
  term: string;
  /** 영문 또는 약어 (있을 때) */
  alias?: string;
  category: GlossaryCategory;
  /** 1~3문장 풀이 */
  definition: string;
  /** 한 줄 비유 (선택, basics 인용용) */
  analogy?: string;
  /** 본격 해설 포스트 (선택) */
  relatedSlugs?: string[];
};

export const GLOSSARY_CATEGORIES: { id: GlossaryCategory; label: string; description: string }[] = [
  {
    id: "market-structure",
    label: "시장 구조",
    description: "전체 시장의 흐름·심리·자금 분포를 설명하는 개념.",
  },
  {
    id: "derivatives",
    label: "파생상품",
    description: "선물·옵션·무기한 시장에서 트레이더가 매일 보는 수치.",
  },
  {
    id: "technical",
    label: "기술적 분석",
    description: "차트 위 보조지표와 추세 판단의 기본 도구.",
  },
  {
    id: "smc-ict",
    label: "SMC / ICT",
    description: "스마트 머니 컨셉(SMC)과 ICT 트레이딩의 핵심 용어. 중급 이상.",
  },
];

export const GLOSSARY: GlossaryEntry[] = [
  // ── 시장 구조 ──────────────────────────────────────────────
  {
    id: "btc-dominance",
    term: "BTC 도미넌스",
    alias: "BTC Dominance",
    category: "market-structure",
    definition:
      "전체 크립토 시장 시가총액에서 비트코인이 차지하는 비중(%). 도미넌스가 오르면 자금이 BTC로 몰리고, 내리면 알트코인으로 흩어진다는 뜻이다. 추세 전환의 1차 신호로 자주 쓰인다.",
    analogy:
      "크립토 시장 전체를 100원짜리 빵 하나로 보면, 그 중 BTC가 몇 원어치 차지하느냐.",
  },
  {
    id: "alt-season",
    term: "알트시즌",
    alias: "Altseason",
    category: "market-structure",
    definition:
      "BTC가 멈춰 있거나 천천히 오를 때, 알트코인이 BTC보다 빠르게 오르는 국면. 통상 'Altseason Index 75 이상'을 기준으로 본다. 도미넌스 하락과 함께 나타나는 경우가 많다.",
  },
  {
    id: "kimchi-premium",
    term: "김치 프리미엄",
    alias: "Kimchi Premium",
    category: "market-structure",
    definition:
      "한국 거래소 가격이 글로벌 거래소보다 비싸게 형성되는 현상(%). 한국 리테일의 매수 압력과 환·송금 제약을 동시에 반영한다. 양수가 클수록 단기 과열 신호.",
    analogy:
      "같은 BTC가 업비트에선 1억, 바이낸스에선 9,800만이면 김프 +2%.",
  },
  {
    id: "stablecoin-mcap",
    term: "스테이블코인 시가총액",
    alias: "Stablecoin Mcap",
    category: "market-structure",
    definition:
      "USDT·USDC 등 1달러 페그 토큰의 총 발행량. 시장에 \"대기 중인 현금\"으로 해석한다. 발행량이 늘면 매수 화력 충전, 줄면 자금 유출 신호.",
  },

  // ── 파생상품 ──────────────────────────────────────────────
  {
    id: "funding-rate",
    term: "펀딩비",
    alias: "Funding Rate",
    category: "derivatives",
    definition:
      "무기한 선물(Perpetual)에서 롱·숏의 균형을 맞추기 위해 8시간마다 한쪽이 다른 쪽에 지급하는 수수료. 양수면 롱이 숏에 지급(롱 과열), 음수면 그 반대. 극단값은 청산 도화선이 된다.",
    analogy:
      "롱이 너무 많아지면 \"줄 서서 오신 분들 자릿세 내세요\"라고 거래소가 강제로 균형을 맞추는 장치.",
  },
  {
    id: "basis",
    term: "베이시스",
    alias: "Basis",
    category: "derivatives",
    definition:
      "선물 가격과 현물 가격의 차이. 선물이 비싸면 콘탱고(미래 강세 베팅), 현물이 비싸면 백워데이션(현금화 압력). 캐리 트레이드와 차익거래의 출발점.",
  },
  {
    id: "open-interest",
    term: "미결제약정",
    alias: "Open Interest · OI",
    category: "derivatives",
    definition:
      "현재 시점에 청산되지 않고 살아 있는 선물 계약 총량. 가격이 오르며 OI가 같이 늘면 신규 자금 유입(추세 확인), 가격은 오르는데 OI가 빠지면 숏 커버(추세 약화).",
  },
  {
    id: "liquidation-map",
    term: "청산맵",
    alias: "Liquidation Heatmap",
    category: "derivatives",
    definition:
      "현재 미결제 포지션이 강제 청산되는 가격대를 히트맵으로 표시한 도구. 큰 청산 클러스터는 \"가격이 빨려 들어가는 자석\"처럼 작동한다. 진입·손절 위치 결정의 보조 지표.",
  },
  {
    id: "long-short-ratio",
    term: "롱·숏 비율",
    alias: "Long/Short Ratio",
    category: "derivatives",
    definition:
      "거래소 트레이더의 롱 포지션 수 ÷ 숏 포지션 수. 1보다 크면 롱 우세. 단, \"군중이 다 한쪽이면 그 반대로 간다\"는 역지표로도 자주 쓰인다.",
  },

  // ── 기술적 분석 ───────────────────────────────────────────
  {
    id: "rsi",
    term: "상대강도지수",
    alias: "RSI · Relative Strength Index",
    category: "technical",
    definition:
      "최근 14봉(기본값)의 상승·하락 강도를 비교해 0~100으로 표시한 모멘텀 지표. 통상 70 이상은 과매수, 30 이하는 과매도 신호로 본다. 횡보장에선 잘 맞고, 강추세에선 헛신호가 잦다.",
  },
  {
    id: "moving-average",
    term: "이동평균",
    alias: "Moving Average · MA",
    category: "technical",
    definition:
      "지정한 기간 동안의 종가 평균을 선으로 그린 추세 지표. 단기(20·50일)와 장기(200일)의 교차로 추세 전환을 본다. 200DMA(일 이동평균)는 시장의 \"기관 추세선\"으로 자주 인용된다.",
  },
  {
    id: "atr",
    term: "ATR",
    alias: "Average True Range",
    category: "technical",
    definition:
      "최근 N봉의 평균 변동폭(절대값). 손절 거리와 포지션 사이징의 기본 단위. \"오늘은 평균 ±$1,200 움직이는 종목\"이라는 사실 한 줄을 숫자로 준다.",
  },
  {
    id: "macd",
    term: "MACD",
    alias: "Moving Average Convergence Divergence",
    category: "technical",
    definition:
      "단기·장기 이동평균의 차이를 막대그래프로 보여 모멘텀 전환을 잡는 지표. 시그널선과의 교차, 다이버전스(가격은 신고가인데 MACD는 못 따라옴)가 핵심.",
  },

  // ── SMC / ICT ─────────────────────────────────────────────
  {
    id: "fvg",
    term: "FVG (불균형 갭)",
    alias: "Fair Value Gap",
    category: "smc-ict",
    definition:
      "급등·급락 시 캔들 3개 사이에 생기는, 매수·매도가 부딪히지 않은 가격 구간. 시장은 이 빈틈을 \"채우러 다시 온다\"는 가정으로 진입 후보 구간으로 사용한다.",
  },
  {
    id: "order-block",
    term: "오더 블록",
    alias: "Order Block",
    category: "smc-ict",
    definition:
      "큰 추세가 시작된 직전의 마지막 반대 방향 캔들. 기관의 대량 주문이 누적된 흔적으로 해석하고, 가격이 그 자리로 돌아오면 같은 방향으로 다시 움직일 확률이 높다고 본다.",
  },
  {
    id: "liquidity-sweep",
    term: "유동성 스윕",
    alias: "Liquidity Sweep",
    category: "smc-ict",
    definition:
      "전고점·전저점을 살짝 깬 뒤 빠르게 반대로 돌아오는 움직임. 그 자리에 몰려 있던 손절 주문을 한 번 가져간 다음 본격 추세로 가는 패턴. ICT 트레이더의 단골 진입 트리거.",
  },
  {
    id: "bos",
    term: "BOS (구조 돌파)",
    alias: "Break of Structure",
    category: "smc-ict",
    definition:
      "직전 고점(상승 추세) 또는 저점(하락 추세)을 명확히 깨뜨려 추세가 이어진다는 신호. CHoCH와 함께 시장 구조를 객관적으로 읽는 1차 도구.",
  },
  {
    id: "choch",
    term: "CHoCH (추세 전환)",
    alias: "Change of Character",
    category: "smc-ict",
    definition:
      "기존 추세의 마지막 고점/저점이 깨지며 추세 방향이 바뀌는 첫 신호. BOS가 \"추세 지속\"을 알리면 CHoCH는 \"추세 전환\"을 알린다.",
  },
  {
    id: "smc",
    term: "SMC",
    alias: "Smart Money Concept",
    category: "smc-ict",
    definition:
      "기관·고래의 주문 흐름(유동성 사냥, 오더 블록, FVG)을 따라가자는 트레이딩 철학. 리테일 추세 추종과 달리 \"손절이 모인 곳\"을 먼저 본다.",
  },
  {
    id: "ict",
    term: "ICT",
    alias: "Inner Circle Trader",
    category: "smc-ict",
    definition:
      "Michael J. Huddleston(ICT)가 정립한 시장 구조·시간대(Killzone)·유동성 기반 트레이딩 방법론. SMC의 모태가 된 사고 방식.",
  },
];
