"use server";

import { revalidatePath } from "next/cache";
import { client } from "@/sanity/client";
import { activePollQuery } from "@/sanity/queries";
import { createClient } from "@/lib/supabase/server";

export type Poll = {
  _id: string;
  question: string;
  slug: string;
  options: string[];
  startsAt?: string;
  endsAt?: string;
  context?: string;
};

export type PollResult = {
  counts: number[];
  total: number;
  userVote: number | null;
  isLoggedIn: boolean;
  isClosed: boolean;
};

export async function getActivePoll(): Promise<Poll | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await (client.fetch as any)(activePollQuery);
    if (!data || !data.slug || !Array.isArray(data.options)) return null;
    return data as Poll;
  } catch {
    return null;
  }
}

export async function getPollResult(poll: Poll): Promise<PollResult> {
  const supabase = await createClient();
  const counts = new Array<number>(poll.options.length).fill(0);

  const { data: rows } = await supabase
    .from("poll_votes")
    .select("option_index")
    .eq("poll_slug", poll.slug);
  if (rows) {
    for (const row of rows) {
      const i = row.option_index as number;
      if (i >= 0 && i < counts.length) counts[i]++;
    }
  }

  const { data: userData } = await supabase.auth.getUser();
  let userVote: number | null = null;
  const isLoggedIn = !!userData?.user;
  if (isLoggedIn && userData?.user) {
    const { data: own } = await supabase
      .from("poll_votes")
      .select("option_index")
      .eq("poll_slug", poll.slug)
      .eq("user_id", userData.user.id)
      .maybeSingle();
    if (own) userVote = own.option_index as number;
  }

  const isClosed = poll.endsAt
    ? new Date(poll.endsAt).getTime() < Date.now()
    : false;

  return {
    counts,
    total: counts.reduce((a, b) => a + b, 0),
    userVote,
    isLoggedIn,
    isClosed,
  };
}

export async function castVote(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "").trim();
  const optionIndex = Number(formData.get("optionIndex"));
  if (!slug) throw new Error("poll slug missing");
  if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex > 9) {
    throw new Error("invalid option");
  }

  const supabase = await createClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) throw new Error("로그인이 필요합니다.");

  const { error } = await supabase.from("poll_votes").upsert(
    {
      poll_slug: slug,
      user_id: userData.user.id,
      option_index: optionIndex,
    },
    { onConflict: "poll_slug,user_id" },
  );
  if (error) throw new Error(error.message);

  revalidatePath("/");
}
