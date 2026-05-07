import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Numeric pagination footer.
 *
 * Renders Prev / 1 ... 4 5 [6] 7 8 ... 12 / Next.
 * Only the active page is highlighted; ellipses appear when there are
 * more than ~7 pages.
 */
export function Pagination({
  basePath,
  currentPage,
  totalPages,
  className,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const href = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`;

  const items = pageList(currentPage, totalPages);

  return (
    <nav
      aria-label="페이지 이동"
      className={cn(
        "mt-12 flex flex-wrap items-center justify-center gap-1",
        className,
      )}
    >
      <PageLink
        href={href(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        ariaLabel="이전 페이지"
      >
        ← 이전
      </PageLink>

      {items.map((it, i) =>
        it === "ellipsis" ? (
          <span
            key={`e-${i}`}
            className="px-2 text-meta text-fg-muted"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <PageLink
            key={it}
            href={href(it)}
            active={it === currentPage}
            ariaLabel={`${it} 페이지로 이동`}
          >
            {it}
          </PageLink>
        ),
      )}

      <PageLink
        href={href(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        ariaLabel="다음 페이지"
      >
        다음 →
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  children,
  active = false,
  disabled = false,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const cls = cn(
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-pill transition-colors",
    active
      ? "border-ink bg-ink text-bg dark:border-fg dark:bg-fg dark:text-ink cursor-default"
      : disabled
        ? "border-border bg-transparent text-fg-muted opacity-50 cursor-not-allowed"
        : "border-border bg-transparent text-fg hover:border-accent hover:text-accent dark:border-fg/20",
  );
  if (active || disabled) {
    return (
      <span className={cls} aria-current={active ? "page" : undefined}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={ariaLabel} className={cls}>
      {children}
    </Link>
  );
}

/** Compact page list with ellipses around current page. */
function pageList(current: number, total: number): (number | "ellipsis")[] {
  const out: (number | "ellipsis")[] = [];
  const window = 1; // pages on each side of current

  for (let i = 1; i <= total; i++) {
    const inEdges = i === 1 || i === total;
    const inWindow = Math.abs(i - current) <= window;
    if (inEdges || inWindow) {
      out.push(i);
    } else if (out[out.length - 1] !== "ellipsis") {
      out.push("ellipsis");
    }
  }
  return out;
}
