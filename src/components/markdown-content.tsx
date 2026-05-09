import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CodeBlock } from "./code-block";
import { imageUrl } from "@/sanity/image";
import type { SanityImageRef } from "@/lib/posts";
import { cn } from "@/lib/cn";

/**
 * Remark plugin: lift standalone images out of paragraphs.
 * Without this, `<figure>` ends up inside `<p>` which is invalid HTML
 * (causes hydration mismatch in React 19).
 */
type MdNode = { type: string; children?: MdNode[] };
function remarkUnwrapImages() {
  return (tree: MdNode) => {
    const walk = (node: MdNode) => {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const c = node.children[i];
        if (
          c.type === "paragraph" &&
          c.children?.length === 1 &&
          c.children[0].type === "image"
        ) {
          node.children[i] = c.children[0];
        } else {
          walk(c);
        }
      }
    };
    walk(tree);
  };
}

/**
 * Renders post.content (markdown) with Editorial Canvas typography.
 *
 * Body images: when markdown uses `![alt](#N)` (e.g. `![](#1)`), the `N`
 * indexes into the post's bodyImages array (1-based) and is rendered as
 * a Sanity-hosted figure with the alt text as caption.
 */
export function MarkdownContent({
  source,
  bodyImages = [],
  className,
}: {
  source: string;
  bodyImages?: SanityImageRef[];
  className?: string;
}) {
  // Resolve `#N` placeholder URLs against the bodyImages array.
  const resolveSrc = (
    src: string | undefined,
  ): { url: string; fallbackAlt?: string } | null => {
    if (!src) return null;
    const m = /^#(\d+)$/.exec(src.trim());
    if (!m) return { url: src };
    const idx = parseInt(m[1], 10) - 1;
    const ref = bodyImages?.[idx];
    if (!ref) return null;
    const url = imageUrl(ref, 1600);
    if (!url) return null;
    return { url, fallbackAlt: ref?.alt };
  };

  return (
    <div
      className={cn(
        "font-serif-body text-[18px] leading-[1.7] text-fg",
        // Headings
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:tracking-tighter",
        "[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:tracking-tight",
        "[&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:font-display [&_h4]:text-xl [&_h4]:font-bold",
        // Paragraphs
        "[&_p]:my-5",
        // Lists
        "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:my-1.5",
        "[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:my-1.5",
        // Links
        "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-accent-hover",
        // Strong / em
        "[&_strong]:font-bold [&_strong]:text-fg [&_em]:italic",
        // Blockquote
        "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:bg-surface-warm [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:italic [&_blockquote]:text-fg-muted",
        // Inline code
        "[&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-surface-warm [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.9em] [&_:not(pre)>code]:text-accent-hover",
        // Code blocks (block styling is in <CodeBlock>; only inline tweaks here)
        "[&_pre_code]:font-mono [&_pre_code]:text-bg [&_pre_code]:bg-transparent",
        // HR
        "[&_hr]:my-10 [&_hr]:border-border",
        // Tables
        "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-base",
        "[&_th]:border-b-2 [&_th]:border-ink [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-display [&_th]:font-bold",
        "[&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:py-2",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkUnwrapImages]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          img: ({ src, alt }) => {
            const resolved = resolveSrc(typeof src === "string" ? src : undefined);
            if (!resolved) return null;
            const caption = alt && alt.trim().length > 0 ? alt : resolved.fallbackAlt;
            return (
              <figure className="my-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolved.url}
                  alt={caption ?? ""}
                  className="block w-full rounded-md"
                  loading="lazy"
                />
                {caption && (
                  <figcaption className="mt-2 text-center text-sm italic text-fg-muted">
                    {caption}
                  </figcaption>
                )}
              </figure>
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
