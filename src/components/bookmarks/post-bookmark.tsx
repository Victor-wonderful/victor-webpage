import { getBookmarkState } from "@/lib/bookmarks";
import { createClient } from "@/lib/supabase/server";
import { BookmarkButton } from "./bookmark-button";

export async function PostBookmark({ slug }: { slug: string }) {
  const [bookmarked, supabase] = await Promise.all([
    getBookmarkState(slug),
    createClient(),
  ]);
  const { data } = await supabase.auth.getUser();
  return (
    <BookmarkButton
      slug={slug}
      initialBookmarked={bookmarked}
      isLoggedIn={!!data?.user}
    />
  );
}
