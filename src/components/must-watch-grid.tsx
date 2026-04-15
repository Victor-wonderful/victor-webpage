import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { EditorialImage } from "./editorial-image";

export function MustWatchGrid({ posts }: { posts: Post[] }) {
  return (
    <section className="container-page mt-24">
      <header className="mb-10">
        <p className="text-eyebrow text-accent">Charts</p>
        <h2 className="mt-3 font-display text-[44px] font-extrabold leading-[1.02] tracking-tight md:text-[56px]">
          Must-Watch Charts
        </h2>
      </header>
      <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="group block overflow-hidden rounded-md border border-border bg-surface transition-colors hover:border-accent"
            >
              <EditorialImage seed={p.slug} variant="card" alt={p.title} />
              <div className="p-5">
                <p className="text-eyebrow text-fg-muted">차트노트</p>
                <h3 className="mt-2 font-serif-body text-lg font-bold leading-snug tracking-tight group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-fg-muted">
                  {p.summary}
                </p>
                <p className="mt-4 text-meta text-fg-muted">
                  {formatDate(p.publishedAt)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
