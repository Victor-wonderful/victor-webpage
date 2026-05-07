"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns whether the current user has bookmarked the given post.
 * (Bookmarks are private — RLS only lets users see their own.)
 */
export async function getBookmarkState(slug: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return false;

  const { data } = await supabase
    .from("bookmarks")
    .select("post_slug")
    .eq("post_slug", slug)
    .eq("user_id", userData.user.id)
    .maybeSingle();
  return !!data;
}

/** List the current user's bookmarked post slugs (most recent first). */
export async function getUserBookmarkSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return [];

  const { data } = await supabase
    .from("bookmarks")
    .select("post_slug, created_at")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });
  return (data ?? []).map((b) => b.post_slug);
}

export async function toggleBookmark(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) throw new Error("post slug missing");

  const supabase = await createClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) throw new Error("로그인이 필요합니다.");
  const userId = userData.user.id;

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("post_slug")
    .eq("post_slug", slug)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("post_slug", slug)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("bookmarks")
      .insert({ post_slug: slug, user_id: userId });
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/blog/${slug}`);
  revalidatePath(`/bookmarks`);
}
