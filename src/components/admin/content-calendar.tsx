import Link from "next/link";
import type { CalendarSlots } from "@/lib/admin/calendar";
import { getCategory } from "@/lib/categories";
import { formatDate } from "@/lib/format";

export function ContentCalendar({ slots }: { slots: CalendarSlots }) {
  const { scheduled, drafts } = slots;
  const isEmpty = scheduled.length === 0 && drafts.length === 0;

  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-bold tracking-tight">
        Content Calendar
      </h2>
      <p className="mt-1 text-meta text-fg-muted">
        다가올 14일 예약발행 + 미발행 drafts.
      </p>

      {isEmpty ? (
        <p className="mt-4 rounded-md border border-border bg-surface-warm p-5 text-meta text-fg-muted">
          예약 발행이나 draft가 없습니다.
        </p>
      ) : (
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-eyebrow text-accent">Scheduled</h3>
            {scheduled.length === 0 ? (
              <p className="mt-3 text-meta text-fg-muted">예약된 글 없음.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border rounded-md border border-border bg-surface-warm">
                {scheduled.map((p) => {
                  const cat = p.category ? getCategory(p.category) : undefined;
                  return (
                    <li key={p._id} className="p-4">
                      <p className="text-meta text-fg-muted">
                        {formatDate(p.publishedAt)}
                        {cat && <> · {cat.label}</>}
                      </p>
                      <p className="mt-1 font-medium">{p.title}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-eyebrow text-fg-muted">Backlog (Drafts)</h3>
            {drafts.length === 0 ? (
              <p className="mt-3 text-meta text-fg-muted">draft 없음.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border rounded-md border border-border bg-surface-warm">
                {drafts.map((p) => {
                  const cat = p.category ? getCategory(p.category) : undefined;
                  return (
                    <li key={p._id} className="p-4">
                      <p className="text-meta text-fg-muted">
                        수정 {formatDate(p._updatedAt)}
                        {cat && <> · {cat.label}</>}
                      </p>
                      <p className="mt-1 font-medium">{p.title}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      <p className="mt-3 text-meta">
        <Link href="/studio" target="_blank" className="text-accent hover:underline">
          Studio에서 편집 ↗
        </Link>
      </p>
    </section>
  );
}
