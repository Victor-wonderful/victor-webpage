import { client } from "@/sanity/client";
import { activeDailyWidgetQuery } from "@/sanity/queries";
import type { Poll } from "@/lib/polls";

export type DailyWidgetType =
  | "poll"
  | "price"
  | "number"
  | "dN"
  | "quiz"
  | "chart"
  | "whale"
  | "news"
  | "snippet";

export type DailyWidget = {
  _id: string;
  title: string;
  type: DailyWidgetType;
  subtitle?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  displayDate?: string;
  metric?: string;
  eventName?: string;
  eventAt?: string;
  quiz?: {
    choices?: string[];
    answerIndex?: number;
    explanation?: string;
  };
  chartImageUrl?: string;
  chartCaption?: string;
  whaleAmount?: string;
  whaleTxHref?: string;
  poll?: Poll | null;
};

export async function getActiveDailyWidget(): Promise<DailyWidget | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await (client.fetch as any)(activeDailyWidgetQuery);
    if (!data || !data.type) return null;
    return data as DailyWidget;
  } catch {
    return null;
  }
}
