/**
 * 블로그 포스트 데이터 레이어 — Sanity GROQ 단일 소스.
 *
 * 마이그레이션 완료(2026-05-09): 이전의 하드코딩 mock POSTS 배열은 제거.
 * 모든 콘텐츠는 Sanity Studio에서 관리한다.
 */

import { client } from "@/sanity/client";
import {
  allPostsQuery,
  allPostsPageQuery,
  allPostsCountQuery,
  allSlugsQuery,
  postBySlugQuery,
  postsByCategoryQuery,
  postsByCategoryPageQuery,
  postsByCategoryCountQuery,
  postsByTagQuery,
} from "@/sanity/queries";
import type { CategorySlug } from "./categories";

export type SanityImageRef = {
  asset?: { _ref?: string; _id?: string; url?: string };
  alt?: string;
};

export type SanityFileRef = {
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string;
    originalFilename?: string;
    size?: number;
    extension?: string;
    mimeType?: string;
  };
};

export type PostAttachment = {
  label: string;
  description?: string;
  file?: SanityFileRef;
};

/**
 * Post.meta is a loose record; values can be strings or numbers.
 * Trade setups moved out to the tradeIdea content type — see lib/trade-ideas.
 */
export type PostMeta = Record<string, string | number | undefined>;

export type Post = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  tags: string[];
  category: CategorySlug;
  meta?: PostMeta;
  coverImage?: SanityImageRef;
  bodyImages?: SanityImageRef[];
  attachments?: PostAttachment[];
  // System fields managed by /api/telegram/publish
  telegramSentAt?: string;
  telegramMessageId?: number;
  // Optional per-post override for the Telegram opinion poll.
  //   - false  → no poll, even if category has a default
  //   - object → custom question/options (replaces category default)
  //   - undefined → category default applies
  telegramPoll?: false | { question: string; options: string[] };
};

function normalize(p: Post): Post {
  return {
    ...p,
    publishedAt: p.publishedAt?.slice(0, 10) ?? p.publishedAt,
    tags: p.tags ?? [],
  };
}

/**
 * Defends the UI against duplicate slugs in Sanity (e.g. accidental copies,
 * legacy drafts that surfaced via a misconfigured perspective). Keeps the
 * first occurrence — already sorted by `publishedAt desc` upstream so the
 * latest copy wins.
 */
function dedupeBySlug<T extends { slug: string }>(posts: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const p of posts) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    out.push(p);
  }
  return out;
}

/**
 * Loosely-typed fetch helper.
 * @sanity/client v7 infers params from the query template-literal type, but
 * our queries use string interpolation (POST_PROJECTION) which defeats that
 * inference. We forward through a wrapper to keep `this` bound.
 */
function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (client.fetch as any)(query, params ?? {}) as Promise<T>;
}

export async function getAllPosts(): Promise<Post[]> {
  const result = await sanityFetch<Post[]>(allPostsQuery);
  return dedupeBySlug((result ?? []).map(normalize));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const result = await sanityFetch<Post | null>(postBySlugQuery, { slug });
  return result ? normalize(result) : null;
}

export async function getAllSlugs(): Promise<string[]> {
  const result = await sanityFetch<string[]>(allSlugsQuery);
  return result ?? [];
}

export async function getPostsByCategory(
  category: CategorySlug,
): Promise<Post[]> {
  const result = await sanityFetch<Post[]>(postsByCategoryQuery, { category });
  return dedupeBySlug((result ?? []).map(normalize));
}

export const POSTS_PER_PAGE = 12;

/** Paginated all-posts (across all categories). 1-based page. */
export async function getAllPostsPage(
  page: number,
  perPage: number = POSTS_PER_PAGE,
): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  const safePage = Math.max(1, Math.floor(page));
  const start = (safePage - 1) * perPage;
  const end = start + perPage;

  const [pagePosts, total] = await Promise.all([
    sanityFetch<Post[]>(allPostsPageQuery, { start, end }),
    sanityFetch<number>(allPostsCountQuery),
  ]);
  const safeTotal = typeof total === "number" ? total : 0;
  return {
    posts: dedupeBySlug((pagePosts ?? []).map(normalize)),
    total: safeTotal,
    totalPages: Math.max(1, Math.ceil(safeTotal / perPage)),
  };
}

/**
 * Paginated category fetch. Returns one page of posts plus the total count
 * needed to render pagination controls.
 *
 * `page` is 1-based.
 */
export async function getPostsByCategoryPage(
  category: CategorySlug,
  page: number,
  perPage: number = POSTS_PER_PAGE,
): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  const safePage = Math.max(1, Math.floor(page));
  const start = (safePage - 1) * perPage;
  const end = start + perPage;

  const [pagePosts, total] = await Promise.all([
    sanityFetch<Post[]>(postsByCategoryPageQuery, { category, start, end }),
    sanityFetch<number>(postsByCategoryCountQuery, { category }),
  ]);
  const safeTotal = typeof total === "number" ? total : 0;
  return {
    posts: dedupeBySlug((pagePosts ?? []).map(normalize)),
    total: safeTotal,
    totalPages: Math.max(1, Math.ceil(safeTotal / perPage)),
  };
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const result = await sanityFetch<Post[]>(postsByTagQuery, { tag });
  return dedupeBySlug((result ?? []).map(normalize));
}
