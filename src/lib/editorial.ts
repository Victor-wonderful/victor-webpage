import { client } from "@/sanity/client";
import {
  editorialQuery,
  latestMacroJudgmentQuery,
  tokenPicksQuery,
} from "@/sanity/queries";

export type Editorial = {
  editorNote?: string;
  editorNoteAuthor?: string;
  sentenceOfTheDay?: string;
  updatedAt?: string;
};

export type TokenPick = {
  _id: string;
  name: string;
  ticker?: string;
  sector?: string;
  stance?: "long" | "watch" | "hold" | "avoid";
  thesis: string;
  logoUrl?: string | null;
  externalLink?: string;
  updatedAt?: string;
  disclaimer?: string;
};

export async function getEditorial(): Promise<Editorial | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await (client.fetch as any)(editorialQuery);
    return (res as Editorial) ?? null;
  } catch {
    return null;
  }
}

export type DailyJudgment = {
  sentence: string;
  slug: string;
  publishedAt: string;
};

/** 최신 매크로 글의 `> **Victor:**` 줄. 없거나 조회 실패면 null. */
export async function getLatestMacroJudgment(): Promise<DailyJudgment | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await (client.fetch as any)(latestMacroJudgmentQuery);
    const content: unknown = res?.content;
    if (typeof content !== "string" || !res.slug || !res.publishedAt) return null;
    const m = content.match(/^>?\s*\*\*Victor:\*\*\s*(.+)$/m);
    if (!m) return null;
    const sentence = m[1]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [텍스트](링크) → 텍스트
      .replace(/\*\*|__|`/g, "")
      .trim();
    if (!sentence) return null;
    return { sentence, slug: res.slug, publishedAt: res.publishedAt };
  } catch {
    return null;
  }
}

export async function getTokenPicks(): Promise<TokenPick[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await (client.fetch as any)(tokenPicksQuery);
    return Array.isArray(res) ? (res as TokenPick[]) : [];
  } catch {
    return [];
  }
}
