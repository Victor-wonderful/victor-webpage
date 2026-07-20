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
  | "macro"
  | "market-structure"
  | "onchain"
  | "derivatives"
  | "technical"
  | "smc-ict"
  | "wallet-security";

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
    id: "macro",
    label: "매크로 · 거시경제",
    description: "금리·물가·고용 등 크립토를 움직이는 거시 지표와 연준(Fed) 관련 용어. 데일리 글의 배경.",
  },
  {
    id: "market-structure",
    label: "시장 구조",
    description: "전체 시장의 흐름·심리·자금 분포를 설명하는 개념.",
  },
  {
    id: "onchain",
    label: "온체인 · 펀더멘털",
    description: "ETF·스테이킹·반감기 등 자산의 수급과 본질 가치를 읽는 데이터.",
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
  {
    id: "wallet-security",
    label: "지갑 · 보안",
    description: "자산을 어디에 어떻게 보관하는가. 시드 문구·콜드월렛·승인 권한 등 잃지 않기 위한 용어.",
  },
];

export const GLOSSARY: GlossaryEntry[] = [
  // ── 매크로 · 거시경제 ──────────────────────────────────────
  {
    id: "cpi",
    term: "CPI (소비자물가지수)",
    alias: "Consumer Price Index",
    category: "macro",
    definition:
      "소비자가 사는 상품·서비스 물가의 전년 대비 상승률(%). 연준이 금리를 올릴지 내릴지 판단하는 1순위 지표다. 예상보다 높으면 '인플레 고착 → 긴축 우려'로 위험자산에 악재, 낮으면 그 반대.",
    analogy:
      "장바구니 물가가 작년보다 몇 % 비싸졌는지를 나라 전체로 잰 숫자.",
  },
  {
    id: "pce",
    term: "PCE (개인소비지출 물가)",
    alias: "Personal Consumption Expenditures",
    category: "macro",
    definition:
      "연준이 CPI보다 더 신뢰하는 물가 지표. 소비 패턴 변화까지 반영해 실제 지출에 가깝다. 특히 변동성 큰 식품·에너지를 뺀 '근원 PCE'가 연준의 진짜 목표(2%)다.",
    analogy:
      "CPI가 '정가표 물가'라면 PCE는 '실제로 계산대에서 낸 돈' 기준 물가.",
  },
  {
    id: "fomc",
    term: "FOMC (연방공개시장위원회)",
    alias: "Federal Open Market Committee",
    category: "macro",
    definition:
      "미국 기준금리를 결정하는 연준의 회의체. 1년에 8번 열리며 결정문·기자회견·점도표가 시장을 크게 흔든다. 크립토는 24시간 열려 있어 이 발표에 즉각 반응한다.",
  },
  {
    id: "nfp",
    term: "NFP (비농업 고용지표)",
    alias: "Non-Farm Payrolls",
    category: "macro",
    definition:
      "매달 첫째 주 금요일 발표되는 미국 신규 일자리 수(농업 제외). 고용이 강하면 '경기 과열 → 긴축 지속', 약하면 '침체 우려 → 완화 기대'로 읽힌다. 실업률과 함께 본다.",
    analogy:
      "미국 경제가 지난달 사람을 몇 명 더 뽑았나를 보는 월간 건강검진.",
  },
  {
    id: "dot-plot",
    term: "점도표 (Dot Plot)",
    alias: "Dot Plot",
    category: "macro",
    definition:
      "FOMC 위원 각자가 예상하는 향후 금리 수준을 점으로 찍은 분포도. 분기마다 공개되며, 중앙값이 '연준이 스스로 그리는 금리 경로'다. 시장 기대와 어긋나면 변동성이 커진다.",
  },
  {
    id: "quantitative-tightening",
    term: "양적긴축 (QT)",
    alias: "Quantitative Tightening",
    category: "macro",
    definition:
      "연준이 보유 자산을 줄여 시중 유동성을 회수하는 정책. 반대로 자산을 사서 돈을 푸는 것이 양적완화(QE)다. QT는 위험자산에 역풍, QE는 순풍으로 작용하는 경우가 많다.",
    analogy:
      "시장이라는 욕조에서 물(돈)을 빼는 게 QT, 채우는 게 QE.",
  },
  {
    id: "fed",
    term: "연준 (Fed)",
    alias: "Federal Reserve",
    category: "macro",
    definition:
      "미국의 중앙은행. 기준금리와 유동성을 조절해 물가·고용을 관리한다. 달러가 기축통화라 연준의 결정은 크립토를 포함한 전 세계 위험자산의 방향을 좌우한다.",
  },
  {
    id: "policy-rate",
    term: "기준금리",
    alias: "Policy Rate",
    category: "macro",
    definition:
      "연준이 정하는 미국의 기본 금리. 오르면(인상) 안전한 예금·채권 수익이 커져 크립토 같은 위험자산에서 자금이 빠지고, 내리면(인하) 그 반대로 위험자산에 우호적이다.",
    analogy:
      "돈의 '기본 몸값'. 이게 비싸지면 굳이 위험한 곳에 돈을 둘 이유가 줄어든다.",
  },

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

  // ── 온체인 · 펀더멘털 ──────────────────────────────────────
  {
    id: "spot-etf",
    term: "ETF (현물 ETF)",
    alias: "Spot ETF",
    category: "onchain",
    definition:
      "비트코인·이더리움 현물을 담아 주식처럼 거래소에서 사고파는 펀드. 기관·연기금이 지갑 없이도 크립토에 투자하는 통로라, 순유입/순유출 데이터가 기관 수급의 바로미터로 쓰인다.",
    analogy:
      "코인을 직접 안 사도 '코인 담은 주식'을 증권 계좌에서 사는 것.",
  },
  {
    id: "tvl",
    term: "TVL (예치총액)",
    alias: "Total Value Locked",
    category: "onchain",
    definition:
      "디파이(DeFi) 프로토콜에 예치된 자산의 총 달러 가치. 그 체인·서비스에 실제로 얼마의 돈이 묶여 일하는지를 보여줘, 생태계 규모와 신뢰도를 재는 대표 지표다.",
  },
  {
    id: "staking",
    term: "스테이킹",
    alias: "Staking",
    category: "onchain",
    definition:
      "코인을 네트워크에 맡겨 검증에 참여하고 보상을 받는 것. 지분증명(PoS) 체인의 핵심으로, 예치된 물량은 유통에서 빠져 매도 압력을 줄이는 효과도 있다.",
    analogy:
      "코인을 은행에 예금처럼 묶어두고 이자를 받되, 그 돈이 네트워크 보안에 쓰이는 것.",
  },
  {
    id: "halving",
    term: "반감기",
    alias: "Halving",
    category: "onchain",
    definition:
      "비트코인 채굴 보상이 약 4년마다 절반으로 줄어드는 이벤트. 신규 공급이 급감해 역사적으로 강세장의 방아쇠로 여겨졌다. 다만 '이미 알려진 재료'라 반영 시점은 논쟁적이다.",
    analogy:
      "금광에서 캐낼 수 있는 금의 양이 4년마다 반으로 줄어드는 것.",
  },
  {
    id: "fear-greed",
    term: "공포탐욕지수",
    alias: "Fear & Greed Index",
    category: "onchain",
    definition:
      "변동성·거래량·SNS 심리 등을 0~100으로 합산한 시장 심리 지표. 낮으면 '극단적 공포'(저점 신호로 자주 해석), 높으면 '극단적 탐욕'(과열 경고). 대표적 역발상 지표.",
    analogy:
      "시장 전체의 기분을 100점 만점으로 잰 감정 온도계.",
  },
  {
    id: "whale",
    term: "고래",
    alias: "Whale",
    category: "onchain",
    definition:
      "시세를 흔들 만큼 대량의 코인을 보유한 개인·기관. 이들의 지갑 이동(거래소 입금/출금)은 온체인 분석의 핵심 관찰 대상으로, 대량 입금은 매도 준비 신호로 읽히곤 한다.",
    analogy:
      "작은 연못에서 몸을 한 번 뒤척이면 온 물결이 출렁이는 큰 물고기.",
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

  {
    id: "leverage",
    term: "레버리지",
    alias: "Leverage",
    category: "derivatives",
    definition:
      "증거금의 몇 배 규모로 포지션을 잡는 것(예: 10배). 수익도 손실도 같은 배수로 커진다. 배율이 높을수록 청산 가격이 진입가에 가까워져, 작은 역방향 움직임에도 전액을 잃을 수 있다.",
    analogy:
      "내 돈 100만으로 1,000만어치를 굴리는 것 — 벌 때도 10배, 잃을 때도 10배.",
  },
  {
    id: "liquidation",
    term: "청산",
    alias: "Liquidation",
    category: "derivatives",
    definition:
      "레버리지 포지션의 손실이 증거금을 넘어서기 직전, 거래소가 강제로 포지션을 종료하는 것. 청산이 연쇄로 터지면 가격이 한 방향으로 급하게 쏠린다(청산 캐스케이드).",
    analogy:
      "빌린 돈으로 산 집값이 담보 밑으로 떨어지면 은행이 강제로 파는 것.",
  },
  {
    id: "perpetual",
    term: "무기한 선물",
    alias: "Perpetual · Perp",
    category: "derivatives",
    definition:
      "만기가 없는 선물 계약. 펀딩비로 현물 가격에 계속 붙어 있게 설계돼 있다. 크립토 거래량의 대부분을 차지하며, 롱·숏 베팅과 레버리지의 주 무대다.",
  },
  {
    id: "short-squeeze",
    term: "숏 스퀴즈",
    alias: "Short Squeeze",
    category: "derivatives",
    definition:
      "하락에 베팅한 숏 포지션이 가격 상승에 몰려 강제 청산되고, 그 청산이 다시 매수를 불러 가격을 더 밀어올리는 현상. 급등의 연료가 되며, 반대 방향은 '롱 스퀴즈'.",
    analogy:
      "내릴 거라 판 사람들이 '어? 오르네' 하고 급히 되사면서 불을 더 키우는 것.",
  },
  {
    id: "margin",
    term: "마진 (증거금)",
    alias: "Margin",
    category: "derivatives",
    definition:
      "레버리지 포지션을 유지하기 위해 담보로 맡기는 돈. 손실로 증거금이 유지 기준 아래로 내려가면 추가 입금 요구(마진콜)나 청산이 발생한다.",
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

  {
    id: "support-resistance",
    term: "지지·저항",
    alias: "Support / Resistance",
    category: "technical",
    definition:
      "가격이 반복해서 튕겨 오른 바닥이 지지, 반복해서 막힌 천장이 저항이다. 매수·매도 주문이 몰려 있는 심리적 경계선으로, 돌파·이탈 여부가 다음 방향의 기준이 된다.",
    analogy:
      "공을 튀길 때 바닥(지지)과 천장(저항) 사이를 오가는 것과 같다.",
  },
  {
    id: "divergence",
    term: "다이버전스",
    alias: "Divergence",
    category: "technical",
    definition:
      "가격과 보조지표(RSI·MACD 등)가 서로 반대로 움직이는 현상. 가격은 신고점인데 지표는 못 따라오면(약세 다이버전스) 추세 힘이 빠졌다는 조기 경고로 읽는다.",
  },
  {
    id: "volume",
    term: "거래량",
    alias: "Volume",
    category: "technical",
    definition:
      "일정 기간 체결된 거래의 총량. 추세의 '진짜 여부'를 검증하는 도구로, 가격 상승에 거래량이 실리면 신뢰도가 높고, 거래량 없이 오르면 힘이 약한 상승으로 본다.",
    analogy:
      "가격이 '무슨 말을 하는지'라면, 거래량은 '그 말에 몇 명이 동의하는지'.",
  },
  {
    id: "vwap",
    term: "VWAP (거래량가중평균가)",
    alias: "Volume Weighted Average Price",
    category: "technical",
    definition:
      "거래량을 가중치로 계산한 평균 가격선. 기관이 '오늘 잘 산 건지'를 판단하는 기준선으로 쓰며, 가격이 VWAP 위면 매수 우위, 아래면 매도 우위로 해석한다.",
  },
  {
    id: "fibonacci",
    term: "피보나치 되돌림",
    alias: "Fibonacci Retracement",
    category: "technical",
    definition:
      "상승·하락 파동의 되돌림 구간을 38.2%·50%·61.8% 등 비율로 표시한 도구. 이 자리들이 지지·저항으로 자주 작동한다고 보고 진입·목표 설정에 활용한다.",
  },
  {
    id: "bollinger-bands",
    term: "볼린저 밴드",
    alias: "Bollinger Bands",
    category: "technical",
    definition:
      "이동평균선 위아래로 변동성(표준편차)만큼 띠를 두른 지표. 밴드가 좁아지면 변동성 폭발 임박(스퀴즈), 가격이 밴드 상·하단에 닿으면 과열·과매도 신호로 읽는다.",
    analogy:
      "가격이 다니는 '탄력 있는 도로 차선' — 좁아지면 곧 크게 움직인다는 신호.",
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

  // ── 지갑 · 보안 ────────────────────────────────────────────
  {
    id: "seed-phrase",
    term: "시드 문구 (니모닉)",
    alias: "Seed Phrase / Mnemonic / BIP-39",
    category: "wallet-security",
    definition:
      "BIP-39 표준으로 만들어지는 12~24개 단어 나열. 지갑 내부 난수를 사람이 옮겨 적을 수 있는 단어로 바꾼 것으로, HD 월렛 구조상 이 문구 하나에서 지갑의 모든 주소·모든 코인 개인키가 다시 계산된다. 즉 시드 문구를 아는 사람이 그 지갑의 전권을 갖는다. 어떤 지원팀도 이것을 묻지 않는다 — 물어보면 피싱이다.",
    analogy:
      "집 열쇠 하나가 아니라, 그 집과 집 안 모든 금고를 동시에 여는 만능키.",
    relatedSlugs: ["learn-phase2-ep09-wallet-security-seed-phrase-cold-wallet-approval"],
  },
  {
    id: "cold-wallet",
    term: "콜드월렛 · 핫월렛",
    alias: "Cold Wallet / Hot Wallet / Hardware Wallet",
    category: "wallet-security",
    definition:
      "콜드월렛은 개인키를 오프라인에서 생성·보관하고 거래 승인마다 기기의 물리 버튼·PIN을 요구하는 하드웨어 지갑, 핫월렛은 메타마스크처럼 인터넷에 연결된 채 개인키를 보관하는 소프트웨어 지갑. 콜드월렛은 원격 피싱·악성코드가 서명을 가로채기 어렵지만 매번 기기를 연결해야 해 번거롭고, 핫월렛은 편하지만 온라인 공격에 노출된다.",
    analogy:
      "콜드월렛은 은행 대여금고(찾으러 가야 하지만 안전), 핫월렛은 지갑 속 현금(바로 쓰지만 소매치기 위험).",
    relatedSlugs: ["learn-phase2-ep09-wallet-security-seed-phrase-cold-wallet-approval"],
  },
  {
    id: "unlimited-approve",
    term: "무제한 승인",
    alias: "Unlimited Approve / Infinite Allowance",
    category: "wallet-security",
    definition:
      "ERC-20 토큰의 지출 승인(allowance) 한도를 사실상 무한대(2^256-1)로 설정하는 방식. 매번 재승인 가스비를 아끼려는 목적으로 다수 dApp이 기본값처럼 요청하지만, 승인 대상 컨트랙트가 취약하거나 악의적이면 보유 토큰 전량이 언제든 인출될 수 있다. Revoke.cash나 이더스캔 Token Approval Checker에서 승인 목록을 조회하고 취소할 수 있다.",
    analogy:
      "\"이번 한 번만 100만 원 꺼내가도 됩니다\"가 아니라 \"내 잔고 전부를 언제든 꺼내가도 됩니다\"에 도장을 찍어주는 것.",
    relatedSlugs: ["learn-phase2-ep09-wallet-security-seed-phrase-cold-wallet-approval"],
  },
  {
    id: "permit",
    term: "Permit (EIP-2612)",
    alias: "EIP-2612 / Gasless Permit",
    category: "wallet-security",
    definition:
      "온체인 approve 트랜잭션 없이 가스비 없는 오프체인 서명 한 번으로 토큰 지출 승인을 내주는 ERC-20 확장 표준. 가스비가 없어 \"그냥 로그인\"처럼 가볍게 느껴지지만 실제로는 자금 이동 권한을 넘기는 서명이라, 2024년 월렛 드레이너 공격에서 가장 많이 악용된 서명 유형(56.7%)이었다. USDC·UNI 등 이 표준을 구현한 토큰에만 해당한다.",
    analogy:
      "도장을 찍는 대신 구두로 \"네, 그렇게 하세요\"라고 답한 것뿐인데, 그 한마디가 계약서 서명과 똑같은 효력을 갖는 셈.",
    relatedSlugs: ["learn-phase2-ep09-wallet-security-seed-phrase-cold-wallet-approval"],
  },
];
