import "server-only";

import { client } from "@/sanity/client";
import { writeClient } from "@/sanity/client";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  recentPostsForAdminQuery,
  draftsCountQuery,
} from "@/sanity/queries";
import type { CategorySlug } from "@/lib/categories";

export type AdminPost = {
  _id: string;
  title: string;
  slug: string;
  category: CategorySlug;
  publishedAt: string;
  telegramSentAt?: string | null;
  telegramMessageId?: number | null;
};

export type EngagementCount = {
  comments: number;
  likes: number;
  bookmarks: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSanity = (c: typeof client, q: string, p?: Record<string, unknown>) =>
  (c.fetch as any)(q, p ?? {});

/** Recent published posts (most recent first), limited to N. */
export async function getRecentPostsForAdmin(limit = 20): Promise<AdminPost[]> {
  try {
    const result = await fetchSanity(client, recentPostsForAdminQuery, { limit });
    if (!Array.isArray(result)) return [];
    // Defend against duplicate slugs in Sanity (e.g. accidental copies).
    // Keep the first occurrence — already sorted by publishedAt desc.
    const seen = new Set<string>();
    const out: AdminPost[] = [];
    for (const p of result as AdminPost[]) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      out.push(p);
    }
    return out;
  } catch {
    return [];
  }
}

/** Count of unpublished drafts in Sanity. Requires SANITY_API_TOKEN. */
export async function getDraftsCount(): Promise<number> {
  try {
    // drafts.** requires a token-authenticated client.
    const result = await fetchSanity(writeClient, draftsCountQuery);
    return typeof result === "number" ? result : 0;
  } catch {
    return 0;
  }
}

/**
 * For a list of post slugs, returns per-slug counts of comments/likes/bookmarks.
 * Uses the service-role admin client — caller MUST have passed getAdminUser().
 */
export async function getEngagementCounts(
  slugs: string[],
): Promise<Record<string, EngagementCount>> {
  if (slugs.length === 0) return {};
  const admin = createAdminClient();

  const [commentsRes, likesRes, bookmarksRes] = await Promise.all([
    admin.from("comments").select("post_slug").in("post_slug", slugs),
    admin.from("likes").select("post_slug").in("post_slug", slugs),
    admin.from("bookmarks").select("post_slug").in("post_slug", slugs),
  ]);

  const result: Record<string, EngagementCount> = {};
  for (const slug of slugs) {
    result[slug] = { comments: 0, likes: 0, bookmarks: 0 };
  }
  for (const row of commentsRes.data ?? []) {
    if (result[row.post_slug]) result[row.post_slug].comments += 1;
  }
  for (const row of likesRes.data ?? []) {
    if (result[row.post_slug]) result[row.post_slug].likes += 1;
  }
  for (const row of bookmarksRes.data ?? []) {
    if (result[row.post_slug]) result[row.post_slug].bookmarks += 1;
  }
  return result;
}

export type AdminCommentRow = {
  id: string;
  post_slug: string;
  body: string;
  created_at: string;
  user_id: string;
  author_name: string | null;
};

/** Most recent comments across the entire site, for moderation feed. */
export async function getRecentComments(limit = 5): Promise<AdminCommentRow[]> {
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("comments")
    .select("id, post_slug, body, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (!rows || rows.length === 0) return [];

  const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, display_name")
    .in("id", userIds);
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));

  return rows.map((r) => ({
    id: r.id,
    post_slug: r.post_slug,
    body: r.body,
    created_at: r.created_at,
    user_id: r.user_id,
    author_name: nameById.get(r.user_id) ?? null,
  }));
}
