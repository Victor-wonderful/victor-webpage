import Link from "next/link";

/**
 * Tools Rail — quick access to the 8 tools from the home page.
 * Promise #4 ("자기 진단 도구") payoff zone.
 */

const TOOLS = [
  {
    href: "/tools/position-sizing",
    label: "포지션 사이징",
    cat: "계산기",
    hint: "1R 역산",
  },
  {
    href: "/tools/rr-calculator",
    label: "R:R + 손익분기",
    cat: "계산기",
    hint: "셋업 평가",
  },
  {
    href: "/tools/compound-calculator",
    label: "복리·손실 회복",
    cat: "계산기",
    hint: "비대칭 회복률",
  },
  {
    href: "/tools/entry-checklist",
    label: "진입 전 체크리스트",
    cat: "체크리스트",
    hint: "10문항",
  },
  {
    href: "/tools/project-checklist",
    label: "프로젝트 검증",
    cat: "체크리스트",
    hint: "35문항 · 7축",
  },
  {
    href: "/tools/emotion-diagnostic",
    label: "FOMO 감정 진단",
    cat: "체크리스트",
    hint: "12문항",
  },
  {
    href: "/tools/trade-journal",
    label: "매매 일지",
    cat: "템플릿",
    hint: "Plan·Execute·Review",
  },
  {
    href: "/tools/weekly-plan",
    label: "주간 트레이딩 플랜",
    cat: "템플릿",
    hint: "주말 30분",
  },
];

export function ToolsRail() {
  return (
    <section className="container-page mt-10">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <p className="text-meta text-fg-muted">
          매매 직전·직후·주말에 한 번씩 들르는 8개 도구
        </p>
        <Link
          href="/tools"
          className="text-meta font-medium text-accent hover:text-accent-hover"
        >
          도구함 전체 →
        </Link>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="group flex h-full flex-col rounded-md border border-border bg-surface p-4 transition-colors hover:border-accent"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
                {t.cat}
              </p>
              <p className="mt-2 break-keep font-display text-[15px] font-bold leading-snug group-hover:text-accent">
                {t.label}
              </p>
              <p className="mt-1 break-keep font-serif-body text-[12px] leading-[1.5] text-fg-muted">
                {t.hint}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
