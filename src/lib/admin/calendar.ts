import "server-only";

import { client, writeClient } from "@/sanity/client";
import { scheduledPostsQuery, draftsListQuery } from "@/sanity/queries";
import type { CategorySlug } from "@/lib/categories";

export type ScheduledSlot = {
  _id: string;
  title: string;
  slug: string;
  category: CategorySlug;
  publishedAt: string;
};

export type DraftSlot = {
  _id: string;
  title: string;
  slug?: string;
  category?: CategorySlug;
  _updatedAt: string;
};

export type CalendarSlots = {
  scheduled: ScheduledSlot[];
  drafts: DraftSlot[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSanity = (c: typeof client, q: string, p?: Record<string, unknown>) =>
  (c.fetch as any)(q, p ?? {});

export async function getCalendarSlots(
  opts: { days?: number; draftLimit?: number } = {},
): Promise<CalendarSlots> {
  const days = opts.days ?? 14;
  const draftLimit = opts.draftLimit ?? 20;

  const [scheduled, drafts] = await Promise.all([
    fetchSanity(client, scheduledPostsQuery, { days }).catch(() => []),
    fetchSanity(writeClient, draftsListQuery, { limit: draftLimit }).catch(
      () => [],
    ),
  ]);

  return {
    scheduled: Array.isArray(scheduled) ? (scheduled as ScheduledSlot[]) : [],
    drafts: Array.isArray(drafts) ? (drafts as DraftSlot[]) : [],
  };
}
