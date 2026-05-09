import { getTokenPicks, type TokenPick } from "@/lib/editorial";

const STANCE: Record<NonNullable<TokenPick["stance"]>, { label: string; cls: string }> = {
  long: {
    label: "Long",
    cls: "border-up/40 bg-up/10 text-up",
  },
  watch: {
    label: "Watch",
    cls: "border-info/40 bg-info/10 text-fg",
  },
  hold: {
    label: "Hold",
    cls: "border-warning/40 bg-warning/10 text-warning",
  },
  avoid: {
    label: "Avoid",
    cls: "border-down/40 bg-down/10 text-down",
  },
};

export async function TokenPicks() {
  const picks = await getTokenPicks();
  if (picks.length === 0) return null;

  return (
    <section className="container-page mt-24">
      <header className="mb-10 flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <p className="text-eyebrow text-accent">Token Picks</p>
          <h2 className="mt-3 font-display text-[32px] font-extrabold leading-[1.1] tracking-tight md:text-[40px]">
            투자 후보 토큰
          </h2>
          <p className="mt-3 max-w-xl break-keep text-pretty text-meta leading-[1.7] text-fg-muted">
            이번 주 주목하는 코어 자산의 stance 한 줄 — 단기 입장 요약입니다.
          </p>
        </div>
      </header>

      <ul className="grid gap-6 md:grid-cols-2">
        {picks.map((p) => {
          const stance = p.stance ? STANCE[p.stance] : STANCE.watch;
          return (
            <li key={p._id}>
              <div className="flex h-full flex-col rounded-md border border-border bg-surface p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {p.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.logoUrl}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs font-bold text-bg dark:bg-fg dark:text-ink">
                        {(p.ticker ?? p.name).slice(0, 4).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-display text-xl font-bold tracking-tight truncate">
                        {p.name}
                      </h3>
                      {p.ticker && (
                        <p className="font-mono text-meta text-fg-muted">
                          {p.ticker}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${stance.cls}`}
                  >
                    {stance.label}
                  </span>
                </div>

                {p.sector && (
                  <p className="mt-3 text-meta text-fg-muted">섹터 · {p.sector}</p>
                )}

                <p className="mt-4 break-keep text-pretty whitespace-pre-line font-serif-body text-[15px] leading-[1.75] text-fg">
                  {p.thesis}
                </p>

                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                  <p className="text-[11px] text-fg-muted">
                    {p.updatedAt &&
                      `갱신 ${new Date(p.updatedAt).toLocaleDateString("ko-KR")}`}
                    {p.disclaimer && (
                      <span className="block mt-1 italic">⚠️ {p.disclaimer}</span>
                    )}
                  </p>
                  {p.externalLink && (
                    <a
                      href={p.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[12px] font-medium text-fg-muted hover:text-accent"
                    >
                      자세히 ↗
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-[11px] italic text-fg-muted">
        ⚠️ 본 섹션은 투자 추천이 아닌 큐레이션·분석입니다. 매매 결정과 결과는 본인 책임입니다.
      </p>
    </section>
  );
}
