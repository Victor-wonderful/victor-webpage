import Link from "next/link";
import { cn } from "@/lib/cn";

export function EditorialCTA({
  eyebrow,
  headline,
  ctaLabel,
  ctaHref,
  className,
}: {
  eyebrow?: string;
  /** Two lines — pass `\n` or array */
  headline: string | [string, string];
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}) {
  const lines = Array.isArray(headline) ? headline : headline.split("\n");
  return (
    <section
      className={cn(
        "container-page mt-24 border-t border-b border-ink/20 py-16",
        className,
      )}
    >
      <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          {eyebrow && <p className="mb-4 text-eyebrow text-accent">{eyebrow}</p>}
          <h2 className="font-display text-[40px] font-extrabold leading-[1.02] tracking-tight md:text-[52px]">
            {lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center self-end rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-all hover:bg-accent-hover active:scale-[0.98] md:self-center"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
