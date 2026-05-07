import Link from "next/link";
import { getPostComments } from "@/lib/comments";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { CommentForm } from "./comment-form";
import { DeleteCommentButton } from "./delete-comment-button";

/**
 * Server-rendered comments block. Lists comments and shows either the
 * write-form (if signed in) or a sign-in CTA.
 */
export async function CommentsSection({ slug }: { slug: string }) {
  const [comments, supabase] = await Promise.all([
    getPostComments(slug),
    createClient(),
  ]);
  const { data } = await supabase.auth.getUser();
  const currentUserId = data?.user?.id ?? null;

  return (
    <section className="mt-16 border-t border-border pt-10">
      <header className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          댓글 <span className="text-fg-muted">({comments.length})</span>
        </h2>
      </header>

      {/* Compose */}
      <div className="mt-6">
        {currentUserId ? (
          <CommentForm slug={slug} />
        ) : (
          <div className="rounded-md border border-border bg-surface-warm p-5 text-center">
            <p className="font-serif-body text-base text-fg">
              댓글을 작성하려면 로그인이 필요합니다.
            </p>
            <Link
              href={`/login?next=${encodeURIComponent(`/blog/${slug}`)}`}
              className="mt-3 inline-block rounded-full bg-accent px-5 py-2 text-pill text-white hover:bg-accent-hover"
            >
              로그인하기
            </Link>
          </div>
        )}
      </div>

      {/* List */}
      <ul className="mt-10 space-y-8">
        {comments.length === 0 && (
          <li className="text-center text-meta text-fg-muted">
            첫 댓글을 남겨주세요.
          </li>
        )}
        {comments.map((c) => {
          const name = c.author?.display_name ?? "익명";
          const initial = name.charAt(0).toUpperCase();
          const isOwn = currentUserId === c.user_id;
          return (
            <li key={c.id} className="flex gap-4">
              {c.author?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.author.avatar_url}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-bg">
                  {initial}
                </span>
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-serif-body font-bold text-fg">
                    {name}
                  </span>
                  <time
                    dateTime={c.created_at}
                    className="text-meta text-fg-muted"
                  >
                    {formatDate(c.created_at)}
                  </time>
                  {c.created_at !== c.updated_at && (
                    <span className="text-meta text-fg-muted">(수정됨)</span>
                  )}
                  {isOwn && (
                    <DeleteCommentButton id={c.id} slug={slug} />
                  )}
                </div>
                <p className="mt-1 whitespace-pre-wrap font-serif-body text-[16px] leading-[1.65] text-fg">
                  {c.body}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
