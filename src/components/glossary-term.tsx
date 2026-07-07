"use client";

/**
 * GlossaryTerm — 본문 안에서 용어 사전 표제어를 감싸는 인라인 컴포넌트.
 *
 * - 점선 밑줄로 "설명이 붙은 단어"임을 표시.
 * - 데스크톱: 마우스 오버(또는 키보드 포커스) 시 정의 툴팁 카드.
 * - 클릭/탭: `/glossary#<id>` 로 이동(모바일은 호버가 없으므로 이 경로가 주 동선).
 *
 * remark-glossary 플러그인이 링크에 실어 준 `data-glossary=<id>` 를 받아
 * markdown-content 의 `a` 렌더러가 이 컴포넌트로 교체한다.
 */

import { useState } from "react";
import { GLOSSARY } from "@/content/glossary";

const BY_ID = new Map(GLOSSARY.map((e) => [e.id, e]));

export function GlossaryTerm({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const entry = BY_ID.get(id);
  const [open, setOpen] = useState(false);

  // 사전에 없는 id면 평범한 링크로 폴백
  if (!entry) {
    return (
      <a href={`/glossary#${id}`} className="text-accent underline underline-offset-4">
        {children}
      </a>
    );
  }

  return (
    <span className="relative inline-block">
      <a
        href={`/glossary#${id}`}
        aria-describedby={open ? `gloss-tip-${id}` : undefined}
        className="cursor-help border-b border-dashed border-accent/60 text-inherit no-underline transition-colors hover:border-accent hover:text-accent-hover"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </a>
      {open && (
        <span
          role="tooltip"
          id={`gloss-tip-${id}`}
          className="absolute bottom-full left-1/2 z-30 mb-2 block w-72 -translate-x-1/2 rounded-md border border-border bg-bg p-4 text-left shadow-lg"
        >
          <span className="block font-display text-sm font-bold text-fg">
            {entry.term}
            {entry.alias && (
              <span className="ml-1 font-mono text-xs font-normal text-fg-muted">
                {entry.alias}
              </span>
            )}
          </span>
          <span className="mt-1.5 block font-serif-body text-[13px] leading-relaxed text-fg-muted">
            {entry.definition}
          </span>
          {entry.analogy && (
            <span className="mt-2 block border-t border-border pt-2 font-serif-body text-[13px] leading-relaxed text-fg">
              💡 {entry.analogy}
            </span>
          )}
          <span className="mt-2 block text-[11px] font-medium uppercase tracking-wider text-accent">
            클릭하면 용어사전으로 →
          </span>
        </span>
      )}
    </span>
  );
}
