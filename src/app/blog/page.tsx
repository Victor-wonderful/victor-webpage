import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "블로그",
  description: "개발, 디자인, 트레이딩에 관한 글.",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">블로그</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          총 {posts.length}개의 글.
        </p>
      </header>

      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {posts.map((p) => (
          <li key={p.slug} className="py-6">
            <Link href={`/blog/${p.slug}`} className="group block">
              <div className="flex items-center gap-3">
                {p.coverEmoji && <span className="text-xl">{p.coverEmoji}</span>}
                <h2 className="text-xl font-semibold group-hover:underline">
                  {p.title}
                </h2>
              </div>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                {p.summary}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
                <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
                <span>·</span>
                <div className="flex gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
