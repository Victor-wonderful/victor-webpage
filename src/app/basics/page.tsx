import Link from "next/link";
import type { Metadata } from "next";
import { getPostsByCategory, type Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { PillNav } from "@/components/pill-nav";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "입문 가이드 시리즈 — Victor Alpha",
  description:
    "출판 예정 도서 원고를 블로그로 연재하는 입문 가이드 시리즈. 챕터 순서대로 구성된 학습 인덱스.",
};

type ChapterGroup = { chapter: string; posts: Post[] };

function groupByChapter(posts: Post[]): {
  groups: ChapterGroup[];
  unassigned: Post[];
} {
  const map = new Map<string, Post[]>();
  const unassigned: Post[] = [];

  for (const p of posts) {
    const ch = p.meta?.bookChapter;
    if (ch === undefined || ch === null || ch === "") {
      unassigned.push(p);
      continue;
    }
    const key = String(ch);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }

  // Numeric-aware sort: "1" < "2" < "10" instead of lexical
  const groups: ChapterGroup[] = [...map.entries()]
    .map(([chapter, posts]) => ({
      chapter,
      posts: posts.sort((a, b) =>
        a.publishedAt.localeCompare(b.publishedAt),
      ),
    }))
    .sort((a, b) => {
      const an = Number(a.chapter);
      const bn = Number(b.chapter);
      if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn;
      return a.chapter.localeCompare(b.chapter);
    });

  return { groups, unassigned };
}

export default async function BasicsSeriesPage() {
  const posts = await getPostsByCategory("basics");
  const { groups, unassigned } = groupByChapter(posts);
  const totalAssigned = groups.reduce((n, g) => n + g.posts.length, 0);

  return (
    <>
      {/* Header */}
      <section className="container-page mt-12">
        <header className="border-b border-border pb-10">
          <p className="text-eyebrow text-accent">Series · 도서 연재</p>
          <h1 className="mt-3 font-display text-[56px] font-extrabold leading-[0.95] tracking-tighter md:text-[80px]">
            입문 가이드
          </h1>
          <p className="mt-4 max-w-2xl text-meta text-fg-muted">
            출판 예정 도서의 원고를 블로그로 연재합니다. 차트와 지표의 기초부터,
            트레이딩을 처음 시작하는 분이 알아야 할 개념과 사고 방식을 챕터
            순서대로 정리했습니다.
          </p>
          <p className="mt-3 text-meta text-fg-muted">
            총 {totalAssigned + unassigned.length}편 · 챕터 {groups.length}개
            {unassigned.length > 0 && ` · 미분류 ${unassigned.length}편`}
            {" · "}
            <Link
              href="/category/basics"
              className="text-accent hover:underline"
            >
              발행일 순 보기 →
            </Link>
          </p>
        </header>
        <div className="mt-8">
          <PillNav />
        </div>
      </section>

      {/* TOC */}
      <section className="container-page mt-16">
        {posts.length === 0 ? (
          <p className="py-20 text-center text-fg-muted">
            아직 발행된 입문 글이 없습니다.
          </p>
        ) : (
          <div className="space-y-16">
            {groups.map((g) => (
              <ChapterBlock key={g.chapter} group={g} />
            ))}

            {unassigned.length > 0 && (
              <ChapterBlock
                group={{ chapter: "기타", posts: unassigned }}
                muted
              />
            )}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="container-page mt-24 mb-24">
        <div className="border-t border-border pt-10">
          <p className="text-eyebrow text-accent">다음 편 알림</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            새 챕터가 올라올 때 받아보세요
          </h2>
          <Link
            href="/subscribe"
            className="mt-6 inline-block rounded-full border border-ink bg-ink px-6 py-3 text-meta font-medium text-bg hover:bg-fg"
          >
            구독하기
          </Link>
        </div>
      </section>
    </>
  );
}

function ChapterBlock({
  group,
  muted = false,
}: {
  group: ChapterGroup;
  muted?: boolean;
}) {
  return (
    <div>
      <header className="mb-6 flex items-baseline gap-4">
        <p className="font-display text-5xl font-extrabold leading-none tracking-tighter text-accent">
          {muted ? "·" : `${group.chapter}.`}
        </p>
        <p className="text-eyebrow text-fg-muted">
          {muted ? "미분류" : `Chapter ${group.chapter}`} · 글{" "}
          {group.posts.length}편
        </p>
      </header>
      <ul className="divide-y divide-border border-y border-border">
        {group.posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="group flex flex-col gap-2 py-5 transition-colors hover:bg-surface-warm/50 md:flex-row md:items-baseline md:justify-between"
            >
              <div className="min-w-0 flex-1 pr-4">
                <h3 className="font-serif-body text-xl font-bold leading-snug tracking-tight group-hover:text-accent">
                  {p.title}
                </h3>
                {p.summary && (
                  <p className="mt-1 line-clamp-1 text-sm text-fg-muted">
                    {p.summary}
                  </p>
                )}
              </div>
              <p className="shrink-0 text-meta text-fg-muted">
                {formatDate(p.publishedAt)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
