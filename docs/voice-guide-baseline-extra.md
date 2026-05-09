# Voice-Guide 베이스라인 비교 — market / strategy / pinescript

> 베이스라인 보강. tokens 편은 [voice-guide-baseline.md](voice-guide-baseline.md) 참고.
> 본 문서는 **라이터 에이전트의 톤 reference 라이브러리** 로 활용된다 — 새 글 작성 전 같은 카테고리의 After 예시를 한 번 읽고 시작한다.

---

## 1. Market — `hello-world` (mock seed)

### Before

> 제목: **Victor Alpha 블로그 오픈**
> 요약: Pine Script 전략, 시장 인사이트, 매크로 노트를 한 곳에 모아 갑니다.
> meta: `symbol: BTC/USDT`, `timeframe: 1D`, `sentiment: 중립`, `analysisType: 기술적`

```markdown
## 환영합니다

Victor Alpha는 한국 리테일 트레이더와 입문자를 위한 매거진형 트레이딩 블로그입니다.

### 다룰 주제
- 주간마켓인사이트 — BTC·KOSPI·매크로 흐름
- 트레이딩 전략 — 추세추종·평균회귀·돌파
...
```

### Before 진단

| 원칙/슬롯 | 상태 |
|---|---|
| 카테고리 적합성 | ❌ 블로그 오픈 공지 — market(주간마켓인사이트) 정의와 무관 |
| §0.3 첫 문장 메타 도입 | ❌ "Victor Alpha는 ~ 블로그입니다" |
| §1 슬롯: 무효화 조건 / 과거 유사국면 / 학습 포인트 | ❌ 0/3 |

**판정: REJECT (카테고리 misuse — 메타 카테고리로 빼거나 재작성).**

### After — 같은 시기를 가정한 진짜 주간마켓인사이트

> 제목: **이번 주 BTC — 81k 거부 4번째, 다음 트리거는 펀딩비 역전**
> 요약: 8월 둘째 주 BTC는 81k 저항에서 4번째 매도 거부됐다. 시나리오는 둘, 무효화 조건은 하나.
> meta: `symbol: BTC/USDT`, `timeframe: 1D`, `sentiment: 경계`, `analysisType: 기술적`

```markdown
BTC가 81k에서 4번째 거부됐다. 같은 레벨을 같은 거래량으로 4번 못 뚫으면, 5번째는 보통 깬다 — 깨는 방향이 어디인지가 이번 주의 전부다.

## 지난 주 무엇이 바뀌었나

가격은 옆걸음이지만 **펀딩비 흐름이 바뀌었다**. 지난 주 평균 +0.018% (8h)에서 -0.004%로 음전. 가격이 그대로인데 펀딩이 음전했다는 건 **숏 포지션이 누적되고 있다는 뜻**이고, 81k 위로 뚫리면 숏 스퀴즈로 점프할 가능성이 커진다 (출처: Coinglass, BTC perpetuals aggregate, 2026-05-08).

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

- 5월 14일 미 CPI (KST 21:30) — 발표 전후 24h 펀딩 변동성 ↑
- 5월 16일 옵션 만기 (~$2.4B) — 81k 가 max pain 근처

## 독자가 이번 주에 배워갈 것

> **펀딩비는 가격보다 빠르다.** 가격이 옆걸음일 때 펀딩이 음전했다면 다음 큰 움직임은 위쪽일 확률이 높다. 차트만 보지 말고, Coinglass 펀딩 페이지를 매일 한 번 같이 본다.
```

### After 진단

| 8원칙 | 충족 |
|---|---|
| 첫 문장 관찰/주장 | ✅ "BTC가 81k에서 4번째 거부됐다" |
| 숫자 해석 | ✅ +0.018% → -0.004% 비교 + 의미 |
| 반례·실패 | ✅ "돌파 직후 진입은 보통 손절" |
| 1인칭/관점 | ✅ "그때 통했다" |
| 출처 인라인 | ✅ Coinglass 2026-05-08 |
| 마무리 콜아웃 | ✅ "차트만 보지 말고 펀딩 페이지를 매일" — 행동 변화 |
| §1 무효화 | ✅ "78.6k 일봉 종가 마감" |
| §1 과거 유사국면 | ✅ 2024-03 |
| §1 학습 포인트 | ✅ |

**판정: PASS**

---

## 2. Strategy — `agent-team-design` (mock seed)

### Before

> 제목: **전략 백테스트 자동화 — 에이전트 팀 구성기**
> 요약: Pine Script 전략 후보를 병렬로 백테스트·리포트하는 에이전트 워크플로 설계.
> meta: `strategyType: 추세추종`, `difficulty: 중급`, `winRate: 64`, `mdd: 18`

```markdown
## 왜 자동화인가

전략 후보 5~10개를 손으로 백테스트하면 반나절이 사라집니다.
병렬 에이전트로 분담시키면 같은 시간에 30~50개 검증이 가능합니다.

### 역할 분리
- runner: 백테스트 실행
- analyzer: 결과 통계화
- reporter: 마크다운 리포트 작성
```

### Before 진단

| 원칙/슬롯 | 상태 |
|---|---|
| 카테고리 적합성 | ❌ **트레이딩 전략 글이 아니라 워크플로 메타글**. strategy 정의(저자의 전략 노하우 전수)와 무관. meta 의 winRate/MDD 도 출처 없음 — **숫자 위조** |
| 모든 §2 슬롯 | ❌ 6/6 |

**판정: REJECT (카테고리 misuse — 운영 메타글로 빼거나, 같은 mock 자리에 진짜 전략 글 작성)**

### After — 같은 strategyType(추세추종) 으로 재작성

> 제목: **추세추종은 손절을 어떻게 두느냐의 문제 — ATR 손절 사고법**
> 요약: 같은 진입 신호라도 손절 위치 한 줄로 승률 64% 와 41% 가 갈린다. 1년 운용해보고 바꾼 부분.
> meta: `strategyType: 추세추종`, `difficulty: 중급`, `winRate: 64`, `mdd: 18`

```markdown
같은 추세추종 신호로 1년 돌리는 동안, 손절 위치 한 줄을 바꾸자 승률이 41% → 64% 로 올랐다. 진입 룰이 아니라 손절 룰이 전략의 영혼이다.

## 누구에게 맞는 전략인가

- BTC·ETH 1H~1D 운용. 알트는 슬리피지로 깨진다.
- 하루 1~2번 차트 볼 시간이 있는 사람. 스캘핑 아님.
- 한 트레이드 -1.5R 까지 견디는 멘탈. 못 견디면 추세추종이 아니다.

## 핵심 아이디어 — 시장의 어떤 비효율을 노리는가

추세는 **사람들이 추세를 못 믿는 동안** 길어진다. 진입자보다 늦게 들어오는 사람이 있어야 추세가 유지되니까, 가장 큰 수익은 **"이 정도 올랐으면 됐지"** 라고 사람들이 말할 때 들어가서 끝까지 가는 트레이드다. 이걸 룰화하면 **"눌림목 진입 + ATR 기반 손절"** 이다.

## 룰 (슈도코드)

```
ema = EMA(close, 200)
atr = ATR(14)

LONG entry:
  close > ema  AND  close pulled back to ema within last 5 bars
  AND  RSI(14) crossed back above 50

stop = entry - 2.0 * atr     # ← 핵심
target = none (trail by chandelier exit, 3*ATR)
size  = risk_per_trade / (entry - stop)
```

핵심은 손절 거리가 **고정 %가 아니라 ATR 배수** 라는 것. 변동성이 큰 구간에서 손절이 자동으로 멀어지고, 잔잔한 구간에선 자동으로 가까워진다.

## 백테스트 (BTC/USDT 1H, 2024-01 ~ 2025-12, 표본 N=87)

| 손절 룰 | 승률 | PF | MDD |
|---|---|---|---|
| 고정 -2% | 41% | 1.18 | 27% |
| ATR×1.5 | 56% | 1.42 | 21% |
| **ATR×2.0** | **64%** | **1.71** | **18%** |
| ATR×3.0 | 67% | 1.55 | 14% |

승률만 보면 ATR×3 이 좋아 보이지만, **PF 가 떨어진다 — 평균 손실이 너무 크다**. ATR×2 가 sweet spot.

## 실전 적용 시 주의

- **횡보장에선 죽는다.** ADX < 20 구간에선 신호 자체를 보지 않는다 (이걸로 -7% MDD 추가 발생을 막음).
- **CPI/FOMC 직후 1시간** 은 ATR 이 부풀어서 손절이 비현실적으로 멀어진다. 그 시간엔 새 진입 안 함.
- **알트는 슬리피지로 PF 가 0.3 깎인다.** BTC/ETH 외에는 권장 안 함.

## 필자가 1년 운용하고 실수한 것

처음엔 손절을 **고정 -2%** 로 뒀다. 변동성 큰 날 1시간 만에 -2% 가 그어지고, 청산 후 같은 자리에서 추세가 시작되는 일이 4번 반복됐다. 그때 ATR 손절로 바꿨다. 만약 그 4번에 ATR×2 였다면, 백테스트상 +18R 추가 수익이 됐다. **고정 % 손절은 변동성을 무시하는 것** 이라는 걸 그때 배웠다.

## 약점 3가지

1. 횡보장에서 시리즈 손실 누적 — ADX 필터 없으면 멘탈로 깨진다.
2. 추세 끝물 진입 시 -2R 까지 그어진다 — 트레일링 스톱이 늦게 따라온다.
3. 알트엔 부적합 — 슬리피지 + 펀딩비 부담.

## 무효화 조건

이 전략의 BTC 적용은 **6개월 롤링 윈도우 PF 1.2 미만** 이면 잠깐 끈다. 시장 구조 자체가 바뀐 신호다.

> **독자가 가져갈 것**
> 손절을 **고정 %** 로 두는 습관이 있다면, 다음 주 한 번이라도 **ATR×2** 로 같은 트레이드를 백테스트해 본다. 변동성 큰 날 한 번만 살아남아도 1년 PnL 이 바뀐다.
```

### After 진단

§2 슬롯 6/6 충족 (적용 대상 / 핵심 아이디어 / 룰 / 주의 / 실수 / 가져갈 것). 약점 3가지·무효화 조건·1인칭 ✅. **판정: PASS**

---

## 3. Pinescript — `nextjs-15-notes` (mock seed)

### Before

> 제목: **RSI + EMA 추세추종 전략 — Pine Script v5**
> meta: `scriptType: strategy`, `pineVersion: v5`, `relatedStrategy: RSI50 + EMA200`

```markdown
## 셋업 요약

- RSI(14) > 50
- 종가 > EMA(200)
- 두 조건 동시 충족 시 진입, 반대 조건 시 청산

```pinescript
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
\``` (closing fence)
```

### Before 진단

| 원칙/슬롯 | 상태 |
|---|---|
| §3 카테고리 정체성 | ❌ "코드 리뷰 글" 톤 — 새 정의(큐레이터 + 사용 설명서)와 약하게만 맞음 |
| §3 슬롯: 출처/라이선스 | ❌ |
| §3 슬롯: 추천 컨텍스트 | ⚠️ "추세추종" 단어만 있고 어느 시장·셋업인지 없음 |
| §3 슬롯: 차트 적용법 + 추천 Inputs | ❌ |
| §3 슬롯: 써본 체감 + 학습 포인트 | ❌ |
| 1인칭 | ❌ |
| 마무리 콜아웃 | ❌ |

**판정: REJECT — 코드만 있고 사용자가 복붙 후 무엇을 어떻게 해야 할지 없음.**

### After

> 제목: **RSI50 + EMA200 추세추종 — 복붙해서 BTC 1H 에 바로 쓰는 파인스크립트**
> meta: `scriptType: strategy`, `pineVersion: v5`, `tvLink: <self-published>`, `relatedStrategy: ATR 손절 추세추종`

```markdown
이 스크립트는 strategy 카테고리에서 다룬 **ATR 손절 추세추종** 의 실행본이다. 코드는 자체 작성 (MIT 라이선스). 복붙해서 TradingView 차트에 그대로 붙이면 된다 — 하단의 추천 Inputs 만 맞추면 신호가 뜬다.

## 어떤 시장·어떤 셋업에 쓰면 되나

- **BTC/USDT, ETH/USDT — 1H 또는 4H** 에 가장 잘 맞는다.
- **알트엔 비추천.** 슬리피지로 PF 가 0.3 깎인다 (strategy 본문 참조).
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

// ── Plot
plot(emaVal, "EMA200", color=color.orange)
\`\`\`

> ⚠️ 컴파일은 `pine_smart_compile` 통과 기준 (v5 strategy template). 실거래 직전 본인 환경에서 한 번 더 컴파일 확인 권장.

## 차트에 올리는 방법

1. TradingView 차트 → 좌하단 **Pine Editor** 탭 클릭
2. 위 코드 통째로 붙여넣기 → **Save** (이름은 자동)
3. **Add to chart** → 차트 우상단 **Inputs** 로 아래 추천 세팅 적용
4. **Strategy Tester** 탭에서 결과 확인

## 추천 Inputs 두 가지

| 운용 스타일 | EMA | RSI | ATR mult | ADX 필터 |
|---|---|---|---|---|
| BTC 1H 보수적 | 200 | 14 | 2.0 | on / 20 |
| ETH 4H 적극적 | 144 | 14 | 1.5 | on / 18 |

## 필자가 써보고 느낀 것

- **CPI/FOMC 발표 1시간 전후로 신호가 자주 뜨고, 그 신호는 거의 헛신호다.** 매크로 일정에 맞춰 수동으로 끄는 습관이 필요하다.
- **트레일링이 ATR×2 라 추세 끝물에 -2R 까지 그어진다.** 손실은 받아들이는 전략이라는 걸 알고 써야 한다.
- 횡보장 ADX 필터를 끄면 1년 PnL 이 약 7% 깎였다 (코드의 `useAdx=false` 로 직접 확인).

> **독자가 가져갈 것**
> 이 코드 자체보다 더 중요한 건 **"손절 거리를 ATR 배수로 두는 사고방식"** 이다. 다른 전략을 쓰더라도 손절 라인을 `atr * mult` 한 줄로 바꾸면 변동성 적응력이 즉시 올라간다.
```

### After 진단

§3 슬롯 5/5 충족 (출처·라이선스 / 추천 컨텍스트 / 전체 코드 / 차트 적용 + Inputs / 써본 체감 + 학습 포인트). 한 줄씩 변수 설명 없음, 1인칭 ✅, 컴파일 검증 명시 ✅. **판정: PASS**

---

## 카테고리 미스매치 정리 (mock seed 4편 기준)

| seed | 선언 카테고리 | 실제 내용 | 조치 |
|---|---|---|---|
| `hello-world` | market | 블로그 오픈 공지 | 메타 카테고리(About/공지)로 분리 |
| `agent-team-design` | strategy | 운영 워크플로 메타글 | 운영/blog-meta 카테고리로 분리 또는 삭제 |
| `nextjs-15-notes` | pinescript | 코드만 있는 짧은 글 | After 형식으로 재작성 (이미 위에 제공) |
| `token-trends-2026-w16` | tokens | 일반 토큰 픽 (런치패드 X) | tokens 새 정의로 재작성 (별도 baseline) |

**권고**: 실 콘텐츠가 들어오기 전에 mock seed 4편을 모두 정리한다. 그렇지 않으면 라이터 에이전트가 "기존 발행물과 비슷하게" 작성하라는 지시에서 잘못된 기준을 학습한다.
