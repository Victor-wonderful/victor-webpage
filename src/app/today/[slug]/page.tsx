import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllTradeIdeaSlugs,
  getTradeIdeaBySlug,
} from "@/lib/trade-ideas";
import { TradeIdeaCard } from "@/components/today/trade-idea-card";

export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllTradeIdeaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const idea = await getTradeIdeaBySlug(slug);
  if (!idea) return { title: "셋업을 찾을 수 없습니다" };

  return {
    title: `${idea.title} — 오늘의 셋업`,
    description: idea.thesis,
    alternates: { canonical: `/today/${idea.slug}` },
  };
}

export default async function TradeIdeaDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const idea = await getTradeIdeaBySlug(slug);
  if (!idea) notFound();

  return (
    <article className="container-prose mt-12 mb-24">
      <Link
        href="/today"
        className="text-meta text-fg-muted hover:text-accent"
      >
        ← 오늘의 셋업 보드
      </Link>

      <header className="mt-6">
        <p className="text-eyebrow text-accent">Today&apos;s Setup</p>
        <h1 className="mt-3 break-keep font-display text-[28px] font-extrabold leading-[1.05] tracking-tighter md:text-[36px]">
          {idea.title}
        </h1>
      </header>

      <div className="mt-10">
        <TradeIdeaCard idea={idea} variant="detail" />
      </div>
    </article>
  );
}
