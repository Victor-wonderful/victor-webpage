import { useState } from "react";
import type {
  DocumentActionComponent,
  DocumentActionDescription,
  DocumentActionProps,
} from "sanity";

/**
 * Studio document action: "🎨 AI 커버 이미지 생성".
 *
 * Only rendered for `post` documents. On click, posts the document's
 * title + summary to /api/ai/generate-cover, which generates a DALL-E 3
 * image, uploads to Sanity, and patches the document's coverImage.
 *
 * The shared secret is read from NEXT_PUBLIC_STUDIO_AI_SECRET — it's
 * a soft gate (anyone with Studio access can see it) which matches
 * Studio's own access control. Treat it as defense-in-depth, not a
 * cryptographic boundary.
 */
export const generateCoverAction: DocumentActionComponent = (
  props: DocumentActionProps,
): DocumentActionDescription | null => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [running, setRunning] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [message, setMessage] = useState<string | null>(null);

  if (props.type !== "post") return null;

  const doc = (props.draft ?? props.published) as
    | { _id: string; title?: string; summary?: string }
    | null;

  return {
    label: running ? "생성 중…" : "🎨 AI 커버 생성",
    disabled: running || !doc?.title,
    onHandle: async () => {
      if (!doc) return;
      setRunning(true);
      setMessage(null);
      try {
        const documentId = doc._id.replace(/^drafts\./, "");
        const res = await fetch("/api/ai/generate-cover", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-studio-secret":
              process.env.NEXT_PUBLIC_STUDIO_AI_SECRET ?? "",
          },
          body: JSON.stringify({
            documentId,
            title: doc.title,
            summary: doc.summary,
          }),
        });
        const json = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
        };
        if (!res.ok || !json.ok) {
          setMessage(`실패: ${json.error ?? `HTTP ${res.status}`}`);
        } else {
          setMessage(
            "✅ 커버 이미지가 생성되었습니다. coverImage 필드를 확인하세요.",
          );
        }
      } catch (e) {
        setMessage(`예외: ${(e as Error).message}`);
      } finally {
        setRunning(false);
        // Close the action UI after handle completes
        props.onComplete();
      }
    },
    dialog: message
      ? {
          type: "dialog" as const,
          header: "AI 커버 생성 결과",
          content: message,
          onClose: () => setMessage(null),
        }
      : undefined,
  };
};
