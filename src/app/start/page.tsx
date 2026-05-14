import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "처음이신가요? — Victor Alpha 30초 안내",
  description:
    "Victor Alpha가 독자에게 약속하는 5가지를 30초 안에 보고, 자기에게 맞는 진입점을 고르세요.",
  alternates: { canonical: "/start" },
};

type Promise = {
  no: string;
  title: string;
  who: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

// Plan Part A4 / Part C 매칭. 카피는 1차안 — 운영하며 다듬는다.
const PROMISES: Promise[] = [
  {
    no: "01",
    title: "시장을 매일 1분에 읽는다",
    who: "매일 차트는 켜는데, 시장 전체 그림이 흐릿하다고 느끼는 사람",
    body: "공포·탐욕 지수, BTC 도미넌스, 김치 프리미엄, 펀딩비, 매크로 일정. 트레이딩 데스크가 매일 보는 6가지를 한 화면에 묶었다. 차트 켜기 전 1분 루틴.",
    ctaLabel: "대시보드 열기",
    ctaHref: "/dashboard",
    secondaryLabel: "오늘의 시장 글 보기",
    secondaryHref: "/category/macro",
  },
  {
    no: "02",
    title: "검증된 트레이딩 셋업과 사고 방식을 가져간다",
    who: "남이 주는 신호 말고, 자기 셋업을 만들고 싶은 트레이더",
    body: "백테스트 수치(승률·MDD)는 공개하지만, 본문 무게는 \"왜 이 셋업이 통하는가\"의 논리. 약점·실수도 같이. TradingView 인기 파인스크립트 큐레이션은 복붙 가능한 코드까지.",
    ctaLabel: "전략 카테고리",
    ctaHref: "/category/strategy",
    secondaryLabel: "파인스크립트 큐레이션",
    secondaryHref: "/category/pinescript",
  },
  {
    no: "03",
    title: "위험·감정을 관리하는 운영체계를 갖춘다",
    who: "잘 잡은 셋업도 돈 관리·심리에서 무너지는 트레이더",
    body: "포지션 사이징, R:R 계산기, 진입 체크리스트, 트레이드 저널, 감정 자가진단, 주간 플랜, 복리 계산기, 프로젝트 검증. 매매 전·후를 모두 도구로 받친다.",
    ctaLabel: "도구 8종 보기",
    ctaHref: "/tools",
  },
  {
    no: "04",
    title: "처음부터 체계적으로 배운다",
    who: "코인이 처음이거나, 누적 지식이 필요한 사람",
    body: "두 트랙으로 분리되어 있습니다. (1) **입문 가이드** — 진짜 처음 배우는 사람을 위한 한 편 한 편(거래소 기초, 차트 보는 법, 지갑·보안). (2) **월가의 전설** — 필자의 출판 도서 100편 연재(Livermore·Soros·Tudor Jones·Dalio).",
    ctaLabel: "입문 가이드 시작",
    ctaHref: "/category/learn",
    secondaryLabel: "월가의 전설 시리즈",
    secondaryHref: "/category/basics",
  },
  {
    no: "05",
    title: "오늘 바로 따라할 수 있는 매매를 본다",
    who: "오늘 진입가/손절가/익절가 한 카드가 필요한 사람",
    body: "필자가 실제 매매하는 셋업이 있는 날에만 카드가 올라갑니다. 진입가·손절가·익절가·무효화 조건·R:R을 한 카드로, 마감 후엔 결과(승/패/PnL)까지 같은 자리에 누적. 빈 날은 비워 둡니다 — 매일 강제로 뽑는 신호가 아닙니다. 텔레그램 채널에는 카드가 게시되는 즉시 함께 나갑니다.",
    ctaLabel: "오늘의 셋업 보드",
    ctaHref: "/today",
    secondaryLabel: "텔레그램 채널 구독",
    secondaryHref: "/subscribe",
  },
];

const NOT_OFFERED = [
  "자동 매수 신호 봇 — 사람이 큐레이션한다",
  "거래소 직결 주문 — 별도 거래소 앱에서 직접 매매",
  "구체적 종목 추천 — 셋업과 사고 방식만 공유",
  "단기 100배 약속 — 위험 관리가 먼저",
];

const FIRST_WEEK = [
  { day: "Day 1", what: "/start 다 읽고, /about 한 번 훑기" },
  { day: "Day 2", what: "/dashboard 1분 루틴 직접 따라하기" },
  { day: "Day 3", what: "최신 macro 데일리 글 1편 읽고, 모르는 용어 /glossary 확인" },
  { day: "Day 4", what: "/category/learn 첫 글 — 진짜 입문 콘텐츠 1편" },
  { day: "Day 5", what: "/category/strategy 글 1편으로 셋업 사고 방식 맛보기" },
  { day: "Day 6", what: "/tools — 포지션 사이징·R:R 계산기 한 번씩 돌려보기" },
  { day: "Day 7", what: "/tools/trade-journal 첫 거래 기록 시작" },
];

export default function StartPage() {
  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Start here</p>
      <h1 className="mt-3 font-display text-[32px] font-extrabold leading-[1.05] tracking-tighter md:text-[44px]">
        Victor Alpha가 약속하는 5가지
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        자기에게 가장 가까운 약속 1개를 골라 거기서 시작하세요. 다 안 읽어도 됩니다.
      </p>

      {/* 5-Promise Picker */}
      <ul className="mt-12 grid gap-5">
        {PROMISES.map((p) => (
          <li
            key={p.no}
            className="rounded-md border border-border bg-surface p-6 md:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                {p.no}
              </span>
              <span className="text-meta text-fg-muted">·</span>
              <span className="text-meta text-fg-muted">{p.who}</span>
            </div>
            <h2 className="mt-3 break-keep font-display text-[22px] font-extrabold leading-tight md:text-[26px]">
              {p.title}
            </h2>
            <p className="mt-3 break-keep font-serif-body text-[15px] leading-[1.7] text-fg-muted md:text-[16px]">
              {p.body}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={p.ctaHref}
                className="inline-flex items-center gap-1.5 rounded-md bg-ink px-4 py-2 text-meta font-medium text-bg hover:bg-accent dark:bg-fg dark:text-ink"
              >
                {p.ctaLabel} →
              </Link>
              {p.secondaryHref && p.secondaryLabel && (
                <Link
                  href={p.secondaryHref}
                  className="text-meta text-fg-muted hover:text-accent"
                >
                  {p.secondaryLabel}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* 정직 코너 */}
      <section className="mt-16">
        <h2 className="font-display text-[22px] font-extrabold tracking-tight md:text-[26px]">
          여기서 못 얻는 것
        </h2>
        <p className="mt-3 font-serif-body text-[15px] leading-[1.7] text-fg-muted md:text-[16px]">
          기대를 정확히 맞추기 위해 안 하는 것도 적어 둡니다.
        </p>
        <ul className="mt-5 grid gap-2">
          {NOT_OFFERED.map((line) => (
            <li
              key={line}
              className="rounded border border-ink/10 bg-surface-warm px-4 py-3 text-meta text-fg"
            >
              <span className="mr-2 text-fg-muted" aria-hidden>
                ✕
              </span>
              {line}
            </li>
          ))}
        </ul>
      </section>

      {/* 첫 1주 동선 */}
      <section className="mt-16">
        <h2 className="font-display text-[22px] font-extrabold tracking-tight md:text-[26px]">
          첫 1주 추천 동선
        </h2>
        <p className="mt-3 font-serif-body text-[15px] leading-[1.7] text-fg-muted md:text-[16px]">
          하루 10~15분이면 충분합니다. 순서대로 따라가면 사이트의 5가지 약속을 모두 한 번씩 만져보게 됩니다.
        </p>
        <ol className="mt-5 grid gap-2">
          {FIRST_WEEK.map((row) => (
            <li
              key={row.day}
              className="grid grid-cols-[80px_1fr] items-baseline gap-3 rounded border border-border bg-surface px-4 py-3"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                {row.day}
              </span>
              <span className="text-meta text-fg">{row.what}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-16 flex flex-wrap gap-3 border-t border-border pt-8">
        <Link
          href="/about"
          className="text-meta font-medium text-accent hover:text-accent-hover"
        >
          더 깊은 약속 페이지 (about) →
        </Link>
        <span className="text-meta text-fg-muted">·</span>
        <Link
          href="/glossary"
          className="text-meta text-fg-muted hover:text-accent"
        >
          용어 사전
        </Link>
        <span className="text-meta text-fg-muted">·</span>
        <Link
          href="/subscribe"
          className="text-meta text-fg-muted hover:text-accent"
        >
          주간 브리핑 구독
        </Link>
      </div>
    </article>
  );
}
