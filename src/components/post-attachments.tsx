import type { PostAttachment } from "@/lib/posts";
import { resolveAttachment, formatBytes } from "@/lib/post-attachments";

/**
 * Renders the post's downloadable attachments (PDFs, code, datasets).
 * Hidden when there are no attachments.
 */
export function PostAttachments({ items }: { items?: PostAttachment[] }) {
  const resolved = (items ?? []).map(resolveAttachment).filter((a) => a.url);
  if (resolved.length === 0) return null;

  return (
    <section className="mt-12 rounded-md border border-border bg-surface-warm p-6">
      <header className="flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-accent"
          aria-hidden="true"
        >
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 1 1-8.49-8.49l9.19-9.19a4 4 0 1 1 5.66 5.66l-9.2 9.19a2 2 0 1 1-2.83-2.83l8.49-8.48" />
        </svg>
        <h2 className="text-eyebrow text-fg">첨부 파일</h2>
      </header>
      <ul className="mt-4 space-y-3">
        {resolved.map((a, i) => {
          const ext = (a.extension ?? "FILE").toUpperCase();
          return (
            <li key={`${a.url}-${i}`}>
              <a
                href={a.url ?? "#"}
                download={a.filename ?? a.label}
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-md border border-border bg-bg p-4 transition-colors hover:border-accent"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink font-mono text-[10px] font-bold text-bg dark:bg-fg dark:text-ink">
                  {ext.slice(0, 4)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-serif-body text-base font-bold text-fg group-hover:text-accent">
                    {a.label}
                  </span>
                  {a.description && (
                    <span className="mt-0.5 block truncate text-meta text-fg-muted">
                      {a.description}
                    </span>
                  )}
                  <span className="mt-1 block text-meta text-fg-muted">
                    {a.filename ?? "file"}
                    {a.size != null && ` · ${formatBytes(a.size)}`}
                  </span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 shrink-0 text-fg-muted group-hover:text-accent"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
