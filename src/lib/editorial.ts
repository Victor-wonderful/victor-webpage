import { client } from "@/sanity/client";
import { editorialQuery, tokenPicksQuery } from "@/sanity/queries";

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

export async function getTokenPicks(): Promise<TokenPick[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await (client.fetch as any)(tokenPicksQuery);
    return Array.isArray(res) ? (res as TokenPick[]) : [];
  } catch {
    return [];
  }
}
