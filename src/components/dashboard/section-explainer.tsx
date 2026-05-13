/**
 * Expandable "이 섹션 이해하기" block for each dashboard section.
 *
 * Server component using native <details>/<summary> so it works without
 * any client JS. Collapsed by default — keeps the dashboard scannable
 * for repeat users, but new visitors get full guidance when they need it.
 */

export type ExplainerTopic = {
  title: string;
  body: React.ReactNode;
};

export function SectionExplainer({ topics }: { topics: ExplainerTopic[] }) {
  return (
    <details className="group mt-3 border-l-2 border-accent/40 pl-4">
      <summary className="cursor-pointer list-none text-meta font-semibold text-accent hover:text-accent-hover">
        <span className="inline group-open:hidden">이 섹션 이해하기 ▾</span>
        <span className="hidden group-open:inline">접기 ▴</span>
      </summary>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <div key={t.title} className="flex flex-col gap-1">
            <p className="break-keep font-display text-[14px] font-bold leading-snug">
              {t.title}
            </p>
            <div className="break-keep text-meta leading-[1.65] text-fg-muted">
              {t.body}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
