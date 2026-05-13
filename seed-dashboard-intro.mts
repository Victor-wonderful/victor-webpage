/**
 * One-shot: seed the "트레이딩 대시보드 1분 루틴" intro post as a Sanity draft.
 *
 * Usage (from project root, .env.local must contain SANITY_API_TOKEN and
 * NEXT_PUBLIC_SANITY_PROJECT_ID):
 *
 *   npx tsx scripts/seed-dashboard-intro.ts
 *
 * After it runs, the post appears in Sanity Studio under Drafts so you
 * can preview, optionally run "🎨 AI 커버 생성" on it, then click Publish.
 *
 * Idempotent on the slug: if a draft or published doc with this slug
 * already exists, the script bails so re-runs don't duplicate.
 */

import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

// Load .env.local manually so we don't need the dotenv package.
function loadEnvLocal() {
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local not found — fall back to whatever process.env has
  }
}
loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("✘ NEXT_PUBLIC_SANITY_PROJECT_ID not set in .env.local");
  process.exit(1);
}
if (!token) {
  console.error("✘ SANITY_API_TOKEN not set in .env.local (needs write scope)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const SLUG = "dashboard-1min-scan-routine";

const CONTENT = `차트를 켜기 전에 시장이 지금 어디 있는지 30초 안에 파악할 수 있다면, 매매의 절반은 끝난 것입니다. 시그널이 부족해서가 아니라 **컨텍스트가 없어서** 손실 보는 트레이더가 대부분이거든요.

오늘 [Victor Alpha 트레이딩 대시보드](/dashboard)를 새로 열었습니다. 영문 대시보드(Coinglass·Coinmarketcal 등)들이 채우지 못하는 **김치 프리미엄**과 **Victor의 그날 시각**을 한 페이지에 모아둔 도구입니다. 이 글은 그 페이지를 매일 1분만 보는 루틴으로 쓰는 법입니다.

## 왜 "스캔"이 먼저인가

차트만 본 트레이더는 시장이 강할 때 약한 코인을 사고, 시장이 약할 때 강한 코인의 추격을 합니다. 동일한 셋업이라도 **시장 사이클의 어느 지점**에서 등장했느냐에 따라 승률이 두 배 차이 납니다.

스캔이란 매매 결정 전에 다음 4가지를 1분 안에 답하는 행위입니다:

- 지금 시장 심리는 어디? (공포 / 중립 / 탐욕)
- 자금이 BTC로 몰리나, 알트로 가나?
- 한국 시장은 글로벌 대비 과열인가, 식었나?
- 다가올 24시간 안에 변동성 이벤트가 있나?

대시보드는 이 네 질문의 답을 한 페이지에 띄웁니다.

## 1분 스캔 5단계

매일 아침(또는 매매 시작 전) 페이지를 열고 위에서 아래로 훑으세요. 각 카드의 "이 섹션 이해하기" 토글이 자세한 임계값을 보여줍니다.

**Step 1 — 오늘의 시각 카드 읽기 (10초)**
오른쪽 "Victor의 시각" 카드의 macro 글 요약을 봅니다. 그날의 핵심 레벨과 시나리오가 정리돼 있어요. 데이터를 읽기 전에 **해석의 틀**부터.

**Step 2 — Technicals 표 훑기 (15초)**
주요 6코인의 추세·RSI·200DMA·펀딩비를 한 줄씩. RSI 70+ 또는 30- 코인이 있는지, 200DMA를 깬 코인이 있는지만 체크. 자동 생성되는 한 줄 요약을 그대로 받아들이지 말고 **이상 신호만** 표시.

**Step 3 — Live Market 6 카드 (20초)**
순서대로:

- **F&G** 25 이하 또는 75 이상이면 표시
- **BTC Dominance** 어제 대비 ↑↓ 방향
- **Alt Season** 75 이상 또는 25 이하인지
- **김치 프리미엄** 4% 이상 또는 음수 (역프)
- **Stablecoin Mcap** 7일 ↑ 또는 ↓ (유동성 방향)
- **Long/Short** 한쪽 65%↑ 쏠림 여부

여기서 **두 개 이상 극단값**이 동시에 떴다면 그날은 큰 베팅 자제 신호.

**Step 4 — Funding Rate 표 (5초)**
펀딩비 ±0.05% 이상 코인 명단만 훑기. 본인 관심 코인이 거기 있으면 역추세 후보.

**Step 5 — This Week 매크로 (10초)**
오늘·내일 발표 예정 이벤트 있는지. 직전 24시간엔 큰 포지션 회피.

총 1분. 끝.

## 자주 묶어 보는 시그널 조합 4가지

데이터 한 개만 보면 거의 의미가 없습니다. **둘 이상 짝지어** 봤을 때 진짜 신호가 됩니다.

**조합 1 — 강한 risk-on**

- TVL 7일 ↑ + Stablecoin 시총 ↑ + F&G 55 이상
- 해석: 자금이 DeFi에 유입 + 매수 탄약 누적 + 심리 우호. 알트 추격 우호 구간.

**조합 2 — 알트 시즌 진입 신호**

- BTC Dominance 7일 ↓ + Alt Season Index 60 이상 + 특정 체인 TVL 비중 급증
- 해석: BTC에서 알트로 자금 이동 진행. 비중 급증한 체인의 토큰 우선 관심.

**조합 3 — 디레버리징 / 단기 바닥 후보**

- TVL 급락 + Funding 음수 지속 + L/S 숏 65%+
- 해석: 강제 청산 진행 중. **칼날 잡지 말 것** — 바닥 확인은 며칠 후. 단기 바운스 트레이드 후보지만 사이즈 작게.

**조합 4 — 한국 과열 / 매도 압력**

- 김프 5%+ + Funding 양수 지속 + F&G 70+
- 해석: 한국 FOMO + 글로벌 과열 동조. 차익거래 매물 + 단기 조정 위험. 신규 진입은 조정 후 검토.

## 데이터로 못 잡는 것

스캔은 만능이 아닙니다. 다음은 **반드시 별도로** 챙기세요:

- **해킹·러그풀·거래소 사고** — 트위터·디스코드 모니터링 필요
- **규제 발표** — 미국 SEC·한국 금융위 일정 별도 추적
- **개별 토큰 언락·에어드롭** — 토큰별 캘린더 확인
- **거시 충격** — 전쟁·실적 시즌·정치 이벤트

대시보드는 **시장 컨텍스트의 일상 부분**만 자동화합니다. 비일상은 여전히 사람의 일.

## 매일 쓰는 습관 만들기

- 첫 두 주: 매매 전 무조건 한 번 봅니다. **봤다 안 봤다**가 매매 결과를 가른다는 걸 데이터로 체감하게 됩니다.
- 그 다음: 본인의 매매 일지에 **그날 스캔의 두 줄**을 적어둡니다. (예: "F&G 42, 김프 +1.8%, Funding 균형, 매크로 없음 → 추세 추종 우호")
- 한 달 후: 본인 매매 결과와 그날 스캔을 매칭해보세요. 어떤 시장 상태에서 본인이 잘하고 못하는지 패턴이 보입니다.

## 📚 이 글에서 가져갈 것

---

**왜 필요한가**

차트만 보는 트레이더는 시장 사이클을 못 봅니다. 1분 스캔이 매매 결과의 절반을 바꿉니다.

**1분 루틴 5단계**

Victor의 시각 → Technicals 표 → Live Market 6카드 → Funding → This Week. 위에서 아래로.

**짝지어 읽기**

단일 지표는 거의 의미 없음. 두 개 이상 극단값이 같이 떴을 때 진짜 신호. 4가지 조합 패턴을 기억하세요.

**대시보드의 한계**

해킹·규제·언락·거시 충격은 별도 추적. 대시보드는 일상 컨텍스트만.

**습관화**

본인 매매 일지에 그날 스캔의 두 줄을 적어두면, 한 달 후 본인이 어떤 시장 상태에서 강하고 약한지 보입니다.
`;

async function main() {
  // 1. Look up the basics category
  const basicsCategory = await client.fetch<{ _id: string } | null>(
    `*[_type=="category" && slug.current=="basics"][0]{_id}`,
  );
  if (!basicsCategory?._id) {
    console.error('✘ Category with slug "basics" not found in Sanity.');
    console.error('  Make sure the basics category document exists in Studio.');
    process.exit(1);
  }

  // 2. Look up the first author (assumed to be Victor)
  const author = await client.fetch<{ _id: string; name?: string } | null>(
    `*[_type=="author"][0]{_id, name}`,
  );

  // 3. Idempotency: bail if a doc with this slug already exists
  const existing = await client.fetch<{ _id: string; title?: string } | null>(
    `*[_type=="post" && slug.current==$slug][0]{_id, title}`,
    { slug: SLUG },
  );
  if (existing?._id) {
    console.error(`✘ A post with slug "${SLUG}" already exists (${existing._id}).`);
    console.error(`  Delete it in Studio first, or change SLUG in this script.`);
    process.exit(1);
  }

  // 4. Create as a draft (id prefixed with "drafts.")
  const draftId = `drafts.${crypto.randomUUID()}`;

  const doc = {
    _id: draftId,
    _type: "post",
    title: "Victor Alpha 트레이딩 대시보드 — 차트 켜기 전 1분 루틴",
    slug: { _type: "slug", current: SLUG },
    summary:
      "매일 차트 켜기 전 1분으로 시장 컨텍스트 잡는 법. F&G·도미넌스·김프·펀딩비·TVL — 무엇을 어떤 순서로, 어떻게 짝지어 읽을지.",
    category: { _type: "reference", _ref: basicsCategory._id },
    ...(author?._id
      ? { author: { _type: "reference", _ref: author._id } }
      : {}),
    publishedAt: new Date().toISOString(),
    tags: ["대시보드", "시장 스캔", "루틴", "김프", "펀딩비", "TVL"],
    content: CONTENT,
    meta: {
      level: "초급",
      readMinutes: 6,
      prerequisites: "없음",
    },
  };

  const created = await client.create(doc);
  console.log("✓ Draft created");
  console.log("  Document ID:", created._id);
  console.log("  Slug:        " + SLUG);
  console.log("");
  console.log("  Next steps:");
  console.log("  1. Open https://victor-alpha.sanity.studio");
  console.log("  2. Find this post under Drafts");
  console.log('  3. Optionally click "🎨 AI 커버 생성" to add a cover image');
  console.log("  4. Click Publish");
}

main().catch((err) => {
  console.error("✘ Seeding failed:", err);
  process.exit(1);
});
