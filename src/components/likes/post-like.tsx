import { getLikeState } from "@/lib/likes";
import { createClient } from "@/lib/supabase/server";
import { LikeButton } from "./like-button";

/**
 * Server wrapper — fetches initial like state and current auth, then
 * hands off to the optimistic client component.
 */
export async function PostLike({ slug }: { slug: string }) {
  const [{ count, liked }, supabase] = await Promise.all([
    getLikeState(slug),
    createClient(),
  ]);
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = !!data?.user;

  return (
    <LikeButton
      slug={slug}
      initialCount={count}
      initialLiked={liked}
      isLoggedIn={isLoggedIn}
    />
  );
}
