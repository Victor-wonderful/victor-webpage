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
    <details className="group mt-4">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-4 py-2 text-meta font-semibold text-accent transition-colors hover:border-accent hover:bg-accent/10 [&::-webkit-details-marker]:hidden">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <span>이 섹션 이해하기</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>

      <div className="mt-5 grid gap-4 border-l-2 border-accent/40 pl-4 sm:grid-cols-2 lg:grid-cols-3">
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
