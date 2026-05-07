"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns:
 *   count   — total likes for the post
 *   liked   — whether the *current* user has liked it
 */
export async function getLikeState(slug: string): Promise<{
  count: number;
  liked: boolean;
}> {
  const supabase = await createClient();

  const [countRes, userRes] = await Promise.all([
    supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_slug", slug),
    supabase.auth.getUser(),
  ]);

  const userId = userRes.data?.user?.id;
  let liked = false;
  if (userId) {
    const { data } = await supabase
      .from("likes")
      .select("user_id")
      .eq("post_slug", slug)
      .eq("user_id", userId)
      .maybeSingle();
    liked = !!data;
  }

  return { count: countRes.count ?? 0, liked };
}

/**
 * Toggle the like state for the current user.
 * Returns the new state so the optimistic UI can sync.
 */
export async function toggleLike(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) throw new Error("post slug missing");

  const supabase = await createClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) throw new Error("로그인이 필요합니다.");
  const userId = userData.user.id;

  const { data: existing } = await supabase
    .from("likes")
    .select("user_id")
    .eq("post_slug", slug)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_slug", slug)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("likes")
      .insert({ post_slug: slug, user_id: userId });
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/blog/${slug}`);
}
