import type { Metadata } from "next";
import Link from "next/link";
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  type GlossaryEntry,
} from "@/content/glossary";

export const metadata: Metadata = {
  title: "용어 사전 — Victor Alpha",
  description:
    "도미넌스, 펀딩비, 청산맵, FVG, 오더 블록… 본문에서 자주 쓰는 용어를 한 곳에 정리.",
  alternates: { canonical: "/glossary" },
};

function groupByCategory(entries: GlossaryEntry[]) {
  const map = new Map<string, GlossaryEntry[]>();
  for (const e of entries) {
    const list = map.get(e.category) ?? [];
    list.push(e);
    map.set(e.category, list);
  }
  // 표제어 가나다 정렬
  for (const list of map.values()) {
    list.sort((a, b) => a.term.localeCompare(b.term, "ko"));
  }
  return map;
}

export default function GlossaryPage() {
  const grouped = groupByCategory(GLOSSARY);

  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Glossary</p>
      <h1 className="mt-3 font-display text-[32px] font-extrabold leading-[1.05] tracking-tighter md:text-[44px]">
        용어 사전
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        본문에서 풀어 쓰지 않은 단어가 나오면 여기서 확인하세요.
      </p>

      {/* 카테고리 목차 */}
      <nav className="mt-10 grid gap-2 rounded-md border border-border bg-surface-warm p-4 md:p-6">
        <p className="text-eyebrow text-fg-muted">목차</p>
        <ul className="grid gap-2 md:grid-cols-2">
          {GLOSSARY_CATEGORIES.map((c) => (
            <li key={c.id}>
              <a
                href={`#cat-${c.id}`}
                className="text-meta font-medium text-fg hover:text-accent"
              >
                {c.label}{" "}
                <span className="text-fg-muted">
                  · {grouped.get(c.id)?.length ?? 0}개
                </span>
              </a>
              <p className="mt-0.5 text-meta text-fg-muted">{c.description}</p>
            </li>
          ))}
        </ul>
      </nav>

      {/* 카테고리별 항목 */}
      {GLOSSARY_CATEGORIES.map((cat) => {
        const items = grouped.get(cat.id) ?? [];
        if (items.length === 0) return null;
        return (
          <section key={cat.id} id={`cat-${cat.id}`} className="mt-16 scroll-mt-24">
            <h2 className="font-display text-[24px] font-extrabold tracking-tight md:text-[28px]">
              {cat.label}
            </h2>
            <p className="mt-2 font-serif-body text-[15px] leading-[1.7] text-fg-muted md:text-[16px]">
              {cat.description}
            </p>
            <dl className="mt-6 grid gap-4">
              {items.map((entry) => (
                <div
                  key={entry.id}
                  id={entry.id}
                  className="scroll-mt-24 rounded-md border border-border bg-surface p-5 md:p-6"
                >
                  <dt className="flex flex-wrap items-baseline gap-2">
                    <span className="font-display text-[18px] font-extrabold tracking-tight md:text-[20px]">
                      {entry.term}
                    </span>
                    {entry.alias && (
                      <span className="font-mono text-[12px] text-fg-muted">
                        {entry.alias}
                      </span>
                    )}
                    <a
                      href={`#${entry.id}`}
                      className="ml-auto text-[11px] text-fg-muted hover:text-accent"
                      aria-label={`${entry.term} 항목 링크`}
                    >
                      #
                    </a>
                  </dt>
                  <dd className="mt-3">
                    <p className="break-keep font-serif-body text-[15px] leading-[1.7] text-fg md:text-[16px]">
                      {entry.definition}
                    </p>
                    {entry.analogy && (
                      <p className="mt-3 rounded border-l-2 border-accent bg-surface-warm px-3 py-2 text-meta italic text-fg-muted">
                        💡 {entry.analogy}
                      </p>
                    )}
                    {entry.relatedSlugs && entry.relatedSlugs.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {entry.relatedSlugs.map((s) => (
                          <li key={s}>
                            <Link
                              href={`/blog/${s}`}
                              className="rounded-full border border-ink/15 bg-surface-warm px-3 py-1 text-pill text-fg hover:text-accent"
                            >
                              본 글에서 다룸
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}

      <div className="mt-16 flex flex-wrap gap-3 border-t border-border pt-8">
        <Link
          href="/start"
          className="text-meta font-medium text-accent hover:text-accent-hover"
        >
          처음이신가요? 30초 안내 →
        </Link>
        <span className="text-meta text-fg-muted">·</span>
        <Link
          href="/category/basics"
          className="text-meta text-fg-muted hover:text-accent"
        >
          입문 트랙
        </Link>
        <span className="text-meta text-fg-muted">·</span>
        <Link
          href="/about"
          className="text-meta text-fg-muted hover:text-accent"
        >
          이 사이트가 약속하는 것
        </Link>
      </div>
    </article>
  );
}
