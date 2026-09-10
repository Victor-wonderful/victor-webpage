import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CodeBlock } from "./code-block";
import { GlossaryTerm } from "./glossary-term";
import { remarkGlossary } from "@/lib/glossary-remark";
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
  // Split body and the standardized "이 글에서 가져갈 것" closing block
  // so the closing block can render in a distinct call-out container.
  const TAKEAWAY_MARKER = /^##\s*📚\s*이 글에서 가져갈 것\s*$/m;
  const markerMatch = source.match(TAKEAWAY_MARKER);
  let body = source;
  let takeaway: string | null = null;
  if (markerMatch && markerMatch.index !== undefined) {
    body = source.slice(0, markerMatch.index).trimEnd();
    // Strip any trailing horizontal rule used as separator
    body = body.replace(/\n+---\s*$/, "").trimEnd();
    takeaway = source.slice(markerMatch.index + markerMatch[0].length).trim();
  }

  // 독자 우선 정책 v2 (docs/content-policy.md §1): `## 🔬 검산 노트` 부터는 «뒷면».
  // 표·전수 검산·채점은 접힌 <details> 안에 두고, 앞면만 펼쳐진 채로 보여준다.
  // 마커 문자열은 scripts/lib/post-layout.mjs 의 BACK_MARKER 와 같아야 한다.
  const BACK_MARKER = /^##\s*🔬\s*검산 노트\s*$/m;
  const backMatch = body.match(BACK_MARKER);
  let back: string | null = null;
  if (backMatch && backMatch.index !== undefined) {
    back = body.slice(backMatch.index + backMatch[0].length).trim();
    body = body.slice(0, backMatch.index).replace(/\n+---\s*$/, "").trimEnd();
  }

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

  // 앞면과 뒷면(검산 노트)이 같은 플러그인·컴포넌트를 쓴다.
  const remarkPlugins: ComponentProps<typeof ReactMarkdown>["remarkPlugins"] = [
    [remarkGfm, { singleTilde: false }],
    remarkUnwrapImages,
    remarkGlossary,
  ];
  const mdComponents: ComponentProps<typeof ReactMarkdown>["components"] = {
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
    a: ({ href, children, node, ...props }) => {
      // remark-glossary 가 실어 준 data-glossary 를 툴팁 컴포넌트로 교체
      const gid =
        (props as Record<string, string>)["data-glossary"] ??
        (node?.properties?.dataGlossary as string | undefined);
      if (gid) return <GlossaryTerm id={gid}>{children}</GlossaryTerm>;
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
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
        remarkPlugins={remarkPlugins}
        rehypePlugins={[rehypeHighlight]}
        components={mdComponents}
      >
        {body}
      </ReactMarkdown>

      {back && (
        <details
          className={cn(
            "group mt-12 rounded-md border border-border bg-surface-warm/40",
            "[&_h2]:mt-8 [&_h2]:text-2xl [&_h3]:mt-6 [&_h3]:text-xl",
            "[&_table]:text-sm",
          )}
        >
          <summary className="cursor-pointer select-none list-none px-6 py-4 font-display text-lg font-bold tracking-tight [&::-webkit-details-marker]:hidden">
            <span className="mr-2 inline-block transition-transform group-open:rotate-90">▸</span>
            🔬 검산 노트
            <span className="ml-2 text-sm font-normal text-fg-muted">
              숫자와 근거 · 펼쳐서 확인
            </span>
          </summary>
          <div className="px-6 pb-8">
            <ReactMarkdown
              remarkPlugins={remarkPlugins}
              rehypePlugins={[rehypeHighlight]}
              components={mdComponents}
            >
              {back}
            </ReactMarkdown>
          </div>
        </details>
      )}

      {takeaway && (
        <aside
          aria-label="이 글에서 가져갈 것"
          className="mt-16 rounded-md border border-accent/30 bg-accent/5 p-8 md:p-10"
        >
          <p className="text-eyebrow text-accent">📚 Reader's Block</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            이 글에서 가져갈 것
          </h2>
          <div
            className={cn(
              "mt-6 font-serif-body text-[17px] leading-[1.7] text-fg",
              "[&_h2]:hidden",
              "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold",
              "[&_p]:my-3",
              // Section-label paragraphs: <p> whose only child is <strong>
              "[&_p:has(>strong:only-child)]:mt-7 [&_p:has(>strong:only-child)]:mb-1",
              "[&_p:has(>strong:only-child)>strong]:font-display [&_p:has(>strong:only-child)>strong]:text-sm [&_p:has(>strong:only-child)>strong]:font-bold [&_p:has(>strong:only-child)>strong]:uppercase [&_p:has(>strong:only-child)>strong]:tracking-wider [&_p:has(>strong:only-child)>strong]:text-accent",
              "first:[&_p:has(>strong:only-child)]:mt-0",
              // Inline <strong> stays inline (default), no overrides needed
              "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:my-1",
            )}
          >
            <ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
              {takeaway}
            </ReactMarkdown>
          </div>
        </aside>
      )}
    </div>
  );
}
