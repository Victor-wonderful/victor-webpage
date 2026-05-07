"use client";

import { useTransition } from "react";
import { deleteComment } from "@/lib/comments";

export function DeleteCommentButton({
  id,
  slug,
}: {
  id: string;
  slug: string;
}) {
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    if (!confirm("이 댓글을 삭제하시겠습니까?")) return;
    startTransition(async () => {
      try {
        await deleteComment(formData);
      } catch (e) {
        alert(e instanceof Error ? e.message : "삭제 실패");
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        disabled={pending}
        className="text-meta text-fg-muted hover:text-down disabled:opacity-50"
        aria-label="댓글 삭제"
      >
        {pending ? "삭제 중…" : "삭제"}
      </button>
    </form>
  );
}
