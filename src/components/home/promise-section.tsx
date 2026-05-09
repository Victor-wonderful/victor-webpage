/**
 * Promise section header — divides the home page into 5 약속 zones.
 * Visual anchor that connects the positioning strip's promises to the
 * actual content below them.
 */
export function PromiseSection({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="container-page mt-24 mb-2">
      <div className="border-t-2 border-ink/15 pt-10 dark:border-fg/15">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[12px] font-bold uppercase tracking-wider text-accent">
            Promise · {number}
          </span>
        </div>
        <h2 className="mt-2 break-keep font-display text-[28px] font-extrabold leading-[1.2] md:text-[32px]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl break-keep font-serif-body text-[15px] leading-[1.7] text-fg-muted">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
