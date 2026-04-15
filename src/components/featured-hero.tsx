import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { EditorialImage } from "./editorial-image";

export function FeaturedHero({ post }: { post: Post }) {
  return (
    <section className="container-page mt-10">
      <div className="relative overflow-hidden rounded-md border border-border bg-ink text-bg">
        <EditorialImage seed={post.slug} variant="hero" priority alt={post.title} />
        {/* Floating overlay card */}
        <div className="absolute bottom-6 left-6 right-6 max-w-md rounded-md bg-surface p-6 text-fg shadow-sm md:left-auto md:right-8 md:bottom-8">
          <p className="text-eyebrow text-accent">이번 주 핵심 차트</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-[1.05] tracking-tighter md:text-4xl">
            <Link href={`/blog/${post.slug}`} className="hover:text-accent">
              {post.title}
            </Link>
          </h2>
          <p className="mt-3 text-sm text-fg-muted line-clamp-2">{post.summary}</p>
          <p className="mt-4 text-meta text-fg-muted">{formatDate(post.publishedAt)}</p>
        </div>
      </div>
    </section>
  );
}
