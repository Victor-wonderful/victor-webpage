"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type Comment = {
  id: string;
  post_slug: string;
  user_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  author: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

/**
 * Fetch comments for a post, with author profile joined.
 * Public read — RLS allows anyone.
 */
export async function getPostComments(slug: string): Promise<Comment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
        id, post_slug, user_id, body, created_at, updated_at,
        author:profiles!comments_user_id_fkey ( display_name, avatar_url )
      `,
    )
    .eq("post_slug", slug)
    .order("created_at", { ascending: true });

  if (error) {
    // Foreign-key alias may not be set up; fall back to a simpler query.
    const { data: simple } = await supabase
      .from("comments")
      .select("id, post_slug, user_id, body, created_at, updated_at")
      .eq("post_slug", slug)
      .order("created_at", { ascending: true });

    if (!simple) return [];

    // Hydrate authors in a second round trip.
    const userIds = Array.from(new Set(simple.map((c) => c.user_id)));
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", userIds);

    const byId = new Map(profiles?.map((p) => [p.id, p]) ?? []);
    return simple.map((c) => ({
      ...c,
      author: byId.get(c.user_id)
        ? {
            display_name: byId.get(c.user_id)!.display_name,
            avatar_url: byId.get(c.user_id)!.avatar_url,
          }
        : null,
    }));
  }

  return (data ?? []).map((row) => ({
    ...row,
    author: Array.isArray(row.author) ? row.author[0] ?? null : row.author,
  })) as Comment[];
}

/**
 * Returns post slugs ranked by comment count over the last `days` days.
 * Used for the "Most Discussed" home section.
 */
export async function getMostDiscussedSlugs(
  days = 30,
  limit = 3,
): Promise<{ slug: string; count: number }[]> {
  const supabase = await createClient();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("comments")
    .select("post_slug")
    .gte("created_at", since);
  if (error || !data) return [];

  const counts = new Map<string, number>();
  for (const row of data) {
    counts.set(row.post_slug, (counts.get(row.post_slug) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Create a comment as the current user. RLS enforces that user_id matches.
 * Throws on auth failure or invalid body.
 */
export async function createComment(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!slug) throw new Error("post slug missing");
  if (body.length < 1) throw new Error("댓글 내용을 입력해 주세요.");
  if (body.length > 4000) throw new Error("댓글이 너무 깁니다 (최대 4000자).");

  const supabase = await createClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) throw new Error("로그인이 필요합니다.");

  const { error } = await supabase.from("comments").insert({
    post_slug: slug,
    user_id: userData.user.id,
    body,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/blog/${slug}`);
}

/**
 * Delete the user's own comment. RLS prevents deleting others'.
 */
export async function deleteComment(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!id || !slug) throw new Error("missing id/slug");

  const supabase = await createClient();
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/blog/${slug}`);
}
