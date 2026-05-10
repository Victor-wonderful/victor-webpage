export function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-md border border-border bg-surface-warm p-5">
      <p className="text-eyebrow text-fg-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-extrabold tracking-tight">
        {typeof value === "number" ? value.toLocaleString("ko-KR") : value}
      </p>
      {hint && <p className="mt-1 text-meta text-fg-muted">{hint}</p>}
    </div>
  );
}
