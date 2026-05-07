"use client";

import { useState, type ReactNode } from "react";

/**
 * Wraps <pre> with a copy-to-clipboard button (top-right).
 * Used as a custom renderer for `pre` in ReactMarkdown.
 */
export function CodeBlock({ children }: { children?: ReactNode }) {
  const [copied, setCopied] = useState(false);

  // Extract language from child <code class="language-xxx">
  const child = Array.isArray(children) ? children[0] : children;
  let language: string | undefined;
  let text = "";
  if (
    child &&
    typeof child === "object" &&
    "props" in child &&
    child.props &&
    typeof child.props === "object"
  ) {
    const props = child.props as { className?: string; children?: ReactNode };
    const m = /language-([\w-]+)/.exec(props.className ?? "");
    if (m) language = m[1];
    text = extractText(props.children);
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative my-6 group">
      {language && (
        <span className="absolute left-4 top-2.5 z-10 select-none font-mono text-[10px] uppercase tracking-[0.18em] text-bg/50">
          {language}
        </span>
      )}
      <button
        type="button"
        onClick={onCopy}
        aria-label="코드 복사"
        className="absolute right-3 top-2.5 z-10 inline-flex items-center gap-1.5 rounded-md border border-bg/20 bg-ink-soft/80 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-bg/80 backdrop-blur transition-colors hover:border-accent hover:text-accent"
      >
        {copied ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            복사됨
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
              <rect x="9" y="9" width="11" height="11" rx="1.5" />
              <path d="M5 15V5a1.5 1.5 0 0 1 1.5-1.5H15" />
            </svg>
            복사
          </>
        )}
      </button>
      <pre className="overflow-x-auto rounded-md bg-ink p-5 pt-10 text-[14px] leading-[1.6]">
        {children}
      </pre>
    </div>
  );
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return extractText(props?.children);
  }
  return "";
}
