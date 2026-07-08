import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { getCategory } from "@/lib/categories";
import { formatDate } from "@/lib/format";
import { PostCoverImage } from "@/components/post-cover-image";
import { resolvePhotoUrl } from "@/lib/telegram";
import { TypedMetaBlock } from "@/components/typed-meta";
import { MarkdownContent } from "@/components/markdown-content";
import { PostAttachments } from "@/components/post-attachments";
import { CommentsSection } from "@/components/comments/comments-section";
import { PostLike } from "@/components/likes/post-like";
import { PostBookmark } from "@/components/bookmarks/post-bookmark";
import { PostMetaBar } from "@/components/post/post-meta-bar";

export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getPostBySlug(slug);
  if (!post) return { title: "글을 찾을 수 없습니다" };
  // Always resolve an image: cover → first body image → category banner.
  // Guarantees link previews (Telegram/X/etc.) render a thumbnail even when
  // a post has no manually-set cover.
  const ogImage = resolvePhotoUrl(post);
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [ogImage],
    },
  };
}

export default async function PostPage(
  { params }: { params: Promise<Params> },
) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const category = getCategory(post.category);

  return (
    <article>
      {/* Header */}
      <header className="container-prose mt-12 border-b border-border pb-10">
        <Link
          href="/blog"
          className="text-meta text-fg-muted hover:text-accent"
        >
          ← 전체 글
        </Link>
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className="mt-8 block text-eyebrow text-accent hover:underline"
          >
            {category.label}
          </Link>
        )}
        <h1 className="mt-4 font-display text-[32px] font-extrabold leading-[1.05] tracking-tighter md:text-[44px]">
          {post.title}
        </h1>
        <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
          {post.summary}
        </p>
        <PostMetaBar post={post} />
        <div className="mt-6 flex flex-wrap items-center gap-3 text-meta text-fg-muted">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-bg">
            V
          </span>
          <span className="font-medium text-fg">Victor</span>
          <span>·</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span>·</span>
          <span>읽는 시간 4분</span>
        </div>
      </header>

      {/* Full-bleed cover */}
      <div className="mt-10 w-full">
        <PostCoverImage post={post} variant="hero" priority alt={post.title} />
      </div>

      {/* Body */}
      <div className="container-prose mt-12">
        <TypedMetaBlock post={post} />
        <MarkdownContent
          source={post.content}
          bodyImages={post.bodyImages}
        />

        {/* Attachments (only renders when post has files) */}
        <PostAttachments items={post.attachments} />

        {/* Tags + actions */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-ink/20 bg-surface-warm px-3 py-1.5 text-pill text-fg"
              >
                #{t}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <PostLike slug={slug} />
            <PostBookmark slug={slug} />
          </div>
        </div>

        {/* Comments */}
        <CommentsSection slug={slug} />
      </div>
    </article>
  );
}
