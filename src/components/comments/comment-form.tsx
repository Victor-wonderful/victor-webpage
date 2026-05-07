"use client";

import { useState, useTransition } from "react";
import { createComment } from "@/lib/comments";

export function CommentForm({ slug }: { slug: string }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        await createComment(formData);
        setBody("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "댓글 작성에 실패했습니다.");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-3">
      <input type="hidden" name="slug" value={slug} />
      <label htmlFor="comment-body" className="sr-only">
        댓글
      </label>
      <textarea
        id="comment-body"
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        maxLength={4000}
        required
        placeholder="이 글에 대한 생각을 남겨주세요…"
        disabled={pending}
        className="w-full resize-y rounded-md border border-ink/20 bg-bg px-4 py-3 font-serif-body text-base leading-[1.6] focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-meta text-fg-muted">
          {body.length} / 4000자 · 마크다운 미지원
        </p>
        <button
          type="submit"
          disabled={pending || body.trim().length === 0}
          className="rounded-full bg-accent px-5 py-2 text-pill text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "등록 중…" : "댓글 등록"}
        </button>
      </div>
      {error && (
        <p
          className="rounded-md border border-down/30 bg-down/10 px-3 py-2 text-meta text-down"
          role="alert"
        >
          {error}
        </p>
      )}
    </form>
  );
}
