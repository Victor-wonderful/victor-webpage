import { cn } from "@/lib/cn";
import type { Post } from "@/lib/posts";

/**
 * Typed meta block — visual emphasis box for post-type-specific fields.
 * Cream background + ink 1px border + 4px orange left rule, per spec.
 *
 * Variants per spec ch.4:
 * - market    : symbol · timeframe · sentiment · analysisType
 * - strategy  : strategyType · difficulty · winRate · MDD
 * - pinescript: scriptType · pineVersion · TV link · relatedStrategy
 * - basics    : level · estimated reading · prerequisites
 * - macro     : event · region · scheduledAt · marketImpact
 * - chart-note: symbol · timeframe (compact)
 *
 * Until Sanity schemas land, fields read from post.meta (loose Record).
 */

type Field = { label: string; value: React.ReactNode };

function MetaShell({
  icon,
  title,
  fields,
}: {
  icon: React.ReactNode;
  title: string;
  fields: Field[];
}) {
  return (
    <aside
      className={cn(
        "relative my-10 rounded-md border border-ink/15 bg-surface-warm p-6",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-md before:bg-accent before:content-['']",
      )}
    >
      <header className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-bg dark:bg-fg dark:text-ink">
          {icon}
        </span>
        <h2 className="text-eyebrow text-fg">{title}</h2>
      </header>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {fields.map((f) => (
          <div key={f.label}>
            <dt className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
              {f.label}
            </dt>
            <dd className="mt-1 font-serif-body text-base font-bold tracking-tight">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

const Icons = {
  trendingUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M4 4h11a3 3 0 0 1 3 3v14H7a3 3 0 0 1-3-3V4z" />
      <path d="M4 18h14" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
    </svg>
  ),
  coins: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <circle cx="9" cy="9" r="6" />
      <path d="M14.5 4.5a6 6 0 0 1 0 11" />
      <path d="M17 8.5a6 6 0 0 1 0 11 6 6 0 0 1-6 0" />
    </svg>
  ),
};

type LooseMeta = Record<string, string | number | undefined>;

export function TypedMetaBlock({ post }: { post: Post }) {
  const meta: LooseMeta = (post as Post & { meta?: LooseMeta }).meta ?? {};

  switch (post.category) {
    case "market":
      return (
        <MetaShell
          icon={Icons.trendingUp}
          title="주간마켓인사이트"
          fields={[
            { label: "심볼", value: meta.symbol ?? "BTC/USDT" },
            { label: "타임프레임", value: meta.timeframe ?? "1D" },
            { label: "센티먼트", value: meta.sentiment ?? "중립" },
            { label: "분석유형", value: meta.analysisType ?? "기술적" },
          ]}
        />
      );
    case "strategy":
      return (
        <MetaShell
          icon={Icons.activity}
          title="트레이딩 전략"
          fields={[
            { label: "전략 유형", value: meta.strategyType ?? "추세추종" },
            { label: "난이도", value: meta.difficulty ?? "중급" },
            { label: "승률", value: <span className="tabular-nums">{(meta.winRate as number) ?? 64}%</span> },
            { label: "MDD", value: <span className="tabular-nums">{(meta.mdd as number) ?? 18}%</span> },
          ]}
        />
      );
    case "pinescript":
      return (
        <MetaShell
          icon={Icons.code}
          title="Pine Script"
          fields={[
            { label: "스크립트", value: meta.scriptType ?? "strategy" },
            { label: "Pine 버전", value: meta.pineVersion ?? "v5" },
            { label: "TV 링크", value: meta.tvLink ? <a href={String(meta.tvLink)} className="text-accent hover:underline" target="_blank" rel="noreferrer">열기 ↗</a> : "—" },
            { label: "연관 전략", value: meta.relatedStrategy ?? "—" },
          ]}
        />
      );
    case "basics":
      return (
        <MetaShell
          icon={Icons.book}
          title="입문 가이드"
          fields={[
            { label: "레벨", value: meta.level ?? "초급" },
            { label: "읽는 시간", value: meta.readMinutes ? `${meta.readMinutes}분` : "5분" },
            { label: "선수 지식", value: meta.prerequisites ?? "없음" },
            ...(meta.bookChapter
              ? [{ label: "책 챕터", value: String(meta.bookChapter) }]
              : []),
          ]}
        />
      );
    case "tokens":
      return (
        <MetaShell
          icon={Icons.coins}
          title="토큰 트렌드"
          fields={[
            { label: "섹터", value: meta.sector ?? "AI · RWA" },
            { label: "기간", value: meta.timeframe ?? "주간" },
            { label: "데이터", value: meta.dataSource ?? "CoinGecko" },
            { label: "리스크", value: meta.riskLevel ?? "중" },
          ]}
        />
      );
    case "macro":
      return (
        <MetaShell
          icon={Icons.globe}
          title="오늘의 시장"
          fields={[
            { label: "이벤트", value: meta.event ?? "FOMC" },
            { label: "지역", value: meta.region ?? "글로벌" },
            { label: "예정/발표", value: meta.scheduledAt ?? "TBD" },
            { label: "시장 임팩트", value: meta.impact ?? "중" },
          ]}
        />
      );
    default:
      return null;
  }
}
