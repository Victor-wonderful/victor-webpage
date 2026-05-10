import type { TokenPick } from "@/lib/editorial";

const STANCE_LABEL: Record<NonNullable<TokenPick["stance"]>, string> = {
  long: "Long",
  watch: "Watch",
  hold: "Hold",
  avoid: "Avoid",
};

export function TokenPicksStatus({ picks }: { picks: TokenPick[] }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold tracking-tight">
        Token Picks ({picks.length})
      </h2>
      {picks.length === 0 ? (
        <p className="mt-3 text-meta text-fg-muted">활성 픽이 없습니다.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border rounded-md border border-border bg-surface-warm">
          {picks.map((p) => (
            <li key={p._id} className="flex items-center gap-3 p-4">
              <p className="min-w-0 flex-1 truncate font-medium">
                {p.name}
                {p.ticker && (
                  <span className="ml-2 text-meta text-fg-muted">
                    {p.ticker}
                  </span>
                )}
              </p>
              {p.stance && (
                <span className="rounded-full border border-border px-2 py-0.5 text-meta">
                  {STANCE_LABEL[p.stance]}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
