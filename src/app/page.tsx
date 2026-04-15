import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export default async function Home() {
  const posts = (await getAllPosts()).slice(0, 3);
  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">안녕하세요, Victor입니다.</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          개발, 디자인, 트레이딩에 관한 생각을 기록합니다.
        </p>
      </section>

      <section className="space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold">최근 글</h2>
          <Link
            href="/blog"
            className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            전체 보기 →
          </Link>
        </div>
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block rounded-lg border border-neutral-200 p-5 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
              >
                <div className="flex items-center gap-3">
                  {p.coverEmoji && <span className="text-2xl">{p.coverEmoji}</span>}
                  <h3 className="text-lg font-semibold group-hover:underline">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {p.summary}
                </p>
                <p className="mt-3 text-xs text-neutral-500">
                  {formatDate(p.publishedAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
