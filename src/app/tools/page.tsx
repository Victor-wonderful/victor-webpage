import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "도구 — 트레이딩 데스크",
  description:
    "포지션 사이징 계산기, 진입 전 체크리스트, 매매 일지 템플릿. 정보가 아니라 도구를 가져갑니다.",
};

type Tool = {
  href: string;
  title: string;
  description: string;
  status: "live" | "soon";
  category: "계산기" | "체크리스트" | "템플릿";
};

const TOOLS: Tool[] = [
  {
    href: "/tools/position-sizing",
    title: "포지션 사이징 계산기",
    description:
      "자본·리스크·진입가·손절가·레버리지 입력 → 권장 수량·1R 금액·청산가·위험 신호 출력. 모든 진입 직전에 한 번.",
    status: "live",
    category: "계산기",
  },
  {
    href: "/tools/rr-calculator",
    title: "R:R + 손익분기 승률 계산기",
    description:
      "진입·손절·목표가 → 손익비, 본전 승률, 100회 매매 EV 시뮬. 셋업 평가의 표준 도구.",
    status: "live",
    category: "계산기",
  },
  {
    href: "/tools/compound-calculator",
    title: "복리 수익률·손실 회복 계산기",
    description:
      "복리 성장 시뮬, 손실 회복 비대칭률, 목표 자본 역산 — 한 도구 3 모드.",
    status: "live",
    category: "계산기",
  },
  {
    href: "/tools/entry-checklist",
    title: "진입 전 체크리스트 (10문항)",
    description:
      "셋업·손절·1R·시장 환경·감정 5축에서 진입 전 자가 점검. 필수 항목 미충족 시 자동 차단.",
    status: "live",
    category: "체크리스트",
  },
  {
    href: "/tools/emotion-diagnostic",
    title: "FOMO·복수매매 감정 진단",
    description:
      "FOMO·복수매매·상태/맥락 3축 12문항으로 진입 직전 감정 신호 진단. Yes 카운트 = 위험 점수.",
    status: "live",
    category: "체크리스트",
  },
  {
    href: "/tools/project-checklist",
    title: "프로젝트 검증 체크리스트 (35문항)",
    description:
      "토크노믹스·베스팅·팀·메커니즘·규제·정량지표·펀더트랙 7축 35문항. a16z·Messari·Token Terminal 프레임 합성.",
    status: "live",
    category: "체크리스트",
  },
  {
    href: "/tools/trade-journal",
    title: "매매 일지 템플릿",
    description:
      "Plan·Execute·Review 3단 인터랙티브 일지. 자동 저장, Markdown 복사, 인쇄 지원. Notion·Obsidian과 연동.",
    status: "live",
    category: "템플릿",
  },
  {
    href: "/tools/weekly-plan",
    title: "주간 트레이딩 플랜",
    description:
      "회고·매크로·레벨·셋업·리스크·한 줄 의지 7섹션. 주말 30분에 한 주 트레이딩 데스크를 깔아둠.",
    status: "live",
    category: "템플릿",
  },
];

const CATEGORIES = ["계산기", "체크리스트", "템플릿"] as const;

export default function ToolsPage() {
  return (
    <article className="container-page mt-12 mb-24">
      <p className="text-eyebrow text-accent">Tools</p>
      <h1 className="mt-3 break-keep font-display text-[32px] font-extrabold leading-[1.2] md:text-[44px] md:leading-[1.15]">
        도구함
      </h1>
      <p className="mt-5 break-keep font-serif-body text-xl italic text-fg-muted">
        정보를 가져가는 게 아니라 도구를 가져가십시오.
      </p>
      <p className="mt-6 max-w-2xl break-keep font-serif-body text-[16px] leading-[1.7] text-fg">
        진입 직전에 1분, 진입 후 1분, 주말에 30분. 매번 같은 프레임으로 매매를
        점검하는 도구 모음입니다. 트레이딩 데스크에서 매번 쓰던 체크 항목을
        한국 리테일에 맞게 풉니다.
      </p>

      {CATEGORIES.map((cat) => {
        const items = TOOLS.filter((t) => t.category === cat);
        if (items.length === 0) return null;
        return (
          <section
            key={cat}
            className="mt-14 border-t border-border pt-10"
          >
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {cat}
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {items.map((t) => {
                const card = (
                  <div
                    className={`flex h-full flex-col rounded-md border border-border bg-surface p-5 transition-colors ${
                      t.status === "live"
                        ? "hover:border-accent"
                        : "opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-bold leading-tight">
                        {t.title}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                          t.status === "live"
                            ? "border-up/40 bg-up/10 text-up"
                            : "border-border bg-bg text-fg-muted"
                        }`}
                      >
                        {t.status === "live" ? "사용 가능" : "준비 중"}
                      </span>
                    </div>
                    <p className="mt-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
                      {t.description}
                    </p>
                  </div>
                );

                return (
                  <li key={t.title}>
                    {t.status === "live" ? (
                      <Link href={t.href} className="block h-full">
                        {card}
                      </Link>
                    ) : (
                      card
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section className="mt-14 rounded-md border border-border bg-surface-warm p-6">
        <p className="text-eyebrow text-accent">Note</p>
        <p className="mt-3 break-keep font-serif-body text-[15px] leading-[1.7] text-fg">
          도구는 매주 1~2개씩 추가됩니다. 다음 도구가 풀릴 때 메일로 받고
          싶다면{" "}
          <Link href="/subscribe" className="text-accent underline">
            주간 브리핑
          </Link>
          을 구독하세요.
        </p>
      </section>
    </article>
  );
}
