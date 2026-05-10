import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type MemberKpis = {
  total: number;
  newLast7d: number;
  activeLast7d: number;
  newsletterTotal: number;
  newsletterPhone: number;
  newsletterTelegram: number;
};

export type RecentSignup = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  created_at: string;
};

export type ActivityRankRow = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  comments: number;
  likes: number;
  bookmarks: number;
  total: number;
};

export type MemberListRow = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  created_at: string;
  comments: number;
  likes: number;
  bookmarks: number;
  last_activity: string | null;
  newsletter_opt_in: boolean;
  newsletter_channel: "phone" | "telegram" | null;
  phone: string | null;
  telegram_handle: string | null;
  terms_agreed_at: string | null;
};

export type MemberListResult = {
  rows: MemberListRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const sinceIso = (ms: number) => new Date(Date.now() - ms).toISOString();

export async function getMemberKpis(): Promise<MemberKpis> {
  const admin = createAdminClient();
  const since7 = sinceIso(SEVEN_DAYS_MS);

  // Authoritative member counts come from auth.users (every signup lands
  // there). profiles may be empty if the auto-insert trigger is missing.
  const authUsers = await fetchAllAuthUsers();
  const total = authUsers.length;
  const newLast7d = authUsers.filter(
    (u) => u.created_at && u.created_at > since7,
  ).length;

  const [c, l, b, nlTotal, nlPhone, nlTg] = await Promise.all([
    admin.from("comments").select("user_id, created_at").gte("created_at", since7),
    admin.from("likes").select("user_id, created_at").gte("created_at", since7),
    admin
      .from("bookmarks")
      .select("user_id, created_at")
      .gte("created_at", since7),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("newsletter_opt_in", true),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("newsletter_opt_in", true)
      .eq("newsletter_channel", "phone"),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("newsletter_opt_in", true)
      .eq("newsletter_channel", "telegram"),
  ]);

  const activeIds = new Set<string>();
  for (const r of c.data ?? []) activeIds.add(r.user_id);
  for (const r of l.data ?? []) activeIds.add(r.user_id);
  for (const r of b.data ?? []) activeIds.add(r.user_id);

  return {
    total,
    newLast7d,
    activeLast7d: activeIds.size,
    newsletterTotal: nlTotal.count ?? 0,
    newsletterPhone: nlPhone.count ?? 0,
    newsletterTelegram: nlTg.count ?? 0,
  };
}

/** Fetch every user from auth.users via the admin API. Caps at 50 pages. */
async function fetchAllAuthUsers(): Promise<
  { id: string; email: string | null; created_at: string }[]
> {
  const admin = createAdminClient();
  const out: { id: string; email: string | null; created_at: string }[] = [];
  const perPage = 200;
  for (let page = 1; page <= 50; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error || !data) break;
    for (const u of data.users) {
      out.push({
        id: u.id,
        email: u.email ?? null,
        created_at: u.created_at,
      });
    }
    if (data.users.length < perPage) break;
  }
  return out;
}

export async function getRecentSignups(limit = 10): Promise<RecentSignup[]> {
  const admin = createAdminClient();

  // Authoritative source is auth.users — works even if profiles trigger
  // hasn't been set up yet.
  const users = (await fetchAllAuthUsers())
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, limit);
  if (users.length === 0) return [];

  // Hydrate display_name / avatar from profiles where available.
  const ids = users.map((u) => u.id);
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", ids);
  const byId = new Map(
    (profiles ?? []).map((p) => [
      p.id,
      { display_name: p.display_name, avatar_url: p.avatar_url },
    ]),
  );

  return users.map((u) => ({
    id: u.id,
    display_name: byId.get(u.id)?.display_name ?? null,
    avatar_url: byId.get(u.id)?.avatar_url ?? null,
    email: u.email,
    created_at: u.created_at,
  }));
}

export async function getActivityRanking(limit = 10): Promise<ActivityRankRow[]> {
  const admin = createAdminClient();
  const [c, l, b] = await Promise.all([
    admin.from("comments").select("user_id"),
    admin.from("likes").select("user_id"),
    admin.from("bookmarks").select("user_id"),
  ]);

  const counts = new Map<
    string,
    { comments: number; likes: number; bookmarks: number }
  >();
  const bump = (uid: string, key: "comments" | "likes" | "bookmarks") => {
    const cur = counts.get(uid) ?? { comments: 0, likes: 0, bookmarks: 0 };
    cur[key] += 1;
    counts.set(uid, cur);
  };
  for (const r of c.data ?? []) bump(r.user_id, "comments");
  for (const r of l.data ?? []) bump(r.user_id, "likes");
  for (const r of b.data ?? []) bump(r.user_id, "bookmarks");

  const ranked = Array.from(counts.entries())
    .map(([user_id, v]) => ({
      user_id,
      ...v,
      total: v.comments + v.likes + v.bookmarks,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);

  if (ranked.length === 0) return [];
  const userIds = ranked.map((r) => r.user_id);
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", userIds);
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return ranked.map((r) => ({
    user_id: r.user_id,
    display_name: profileById.get(r.user_id)?.display_name ?? null,
    avatar_url: profileById.get(r.user_id)?.avatar_url ?? null,
    comments: r.comments,
    likes: r.likes,
    bookmarks: r.bookmarks,
    total: r.total,
  }));
}

export async function listMembers(opts: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<MemberListResult> {
  const admin = createAdminClient();
  const page = Math.max(1, Math.floor(opts.page ?? 1));
  const pageSize = Math.max(5, Math.min(100, Math.floor(opts.pageSize ?? 20)));
  const search = (opts.search ?? "").trim().toLowerCase();

  // Authoritative list comes from auth.users — works whether or not the
  // profiles auto-create trigger has been installed yet.
  const allUsers = (await fetchAllAuthUsers()).sort((a, b) =>
    a.created_at < b.created_at ? 1 : -1,
  );

  // Pull profile metadata (display_name, newsletter, etc) for the same ids.
  const profileById = new Map<
    string,
    {
      display_name: string | null;
      avatar_url: string | null;
      newsletter_opt_in: boolean;
      newsletter_channel: "phone" | "telegram" | null;
      phone: string | null;
      telegram_handle: string | null;
      terms_agreed_at: string | null;
    }
  >();
  if (allUsers.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select(
        "id, display_name, avatar_url, newsletter_opt_in, newsletter_channel, phone, telegram_handle, terms_agreed_at",
      )
      .in(
        "id",
        allUsers.map((u) => u.id),
      );
    for (const p of profiles ?? []) {
      const row = p as {
        id: string;
        display_name: string | null;
        avatar_url: string | null;
        newsletter_opt_in?: boolean;
        newsletter_channel?: "phone" | "telegram" | null;
        phone?: string | null;
        telegram_handle?: string | null;
        terms_agreed_at?: string | null;
      };
      profileById.set(row.id, {
        display_name: row.display_name,
        avatar_url: row.avatar_url,
        newsletter_opt_in: !!row.newsletter_opt_in,
        newsletter_channel: row.newsletter_channel ?? null,
        phone: row.phone ?? null,
        telegram_handle: row.telegram_handle ?? null,
        terms_agreed_at: row.terms_agreed_at ?? null,
      });
    }
  }

  // Apply search across nickname + email.
  const filtered = search
    ? allUsers.filter((u) => {
        const nick = profileById.get(u.id)?.display_name?.toLowerCase() ?? "";
        const email = u.email?.toLowerCase() ?? "";
        return nick.includes(search) || email.includes(search);
      })
    : allUsers;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = (page - 1) * pageSize;
  const pageUsers = filtered.slice(from, from + pageSize);
  if (pageUsers.length === 0) {
    return { rows: [], total, page, pageSize, totalPages };
  }
  const userIds = pageUsers.map((u) => u.id);

  const [c, l, b] = await Promise.all([
    admin.from("comments").select("user_id, created_at").in("user_id", userIds),
    admin.from("likes").select("user_id, created_at").in("user_id", userIds),
    admin.from("bookmarks").select("user_id, created_at").in("user_id", userIds),
  ]);

  const stats = new Map<
    string,
    { comments: number; likes: number; bookmarks: number; last: string | null }
  >();
  const ensure = (uid: string) => {
    if (!stats.has(uid))
      stats.set(uid, { comments: 0, likes: 0, bookmarks: 0, last: null });
    return stats.get(uid)!;
  };
  const apply = (
    rows: { user_id: string; created_at: string }[] | null,
    key: "comments" | "likes" | "bookmarks",
  ) => {
    for (const r of rows ?? []) {
      const s = ensure(r.user_id);
      s[key] += 1;
      if (!s.last || r.created_at > s.last) s.last = r.created_at;
    }
  };
  apply(c.data, "comments");
  apply(l.data, "likes");
  apply(b.data, "bookmarks");

  const rows: MemberListRow[] = pageUsers.map((u) => {
    const s = stats.get(u.id) ?? {
      comments: 0,
      likes: 0,
      bookmarks: 0,
      last: null,
    };
    const prof = profileById.get(u.id);
    return {
      id: u.id,
      display_name: prof?.display_name ?? null,
      avatar_url: prof?.avatar_url ?? null,
      email: u.email,
      created_at: u.created_at,
      comments: s.comments,
      likes: s.likes,
      bookmarks: s.bookmarks,
      last_activity: s.last,
      newsletter_opt_in: !!prof?.newsletter_opt_in,
      newsletter_channel: prof?.newsletter_channel ?? null,
      phone: prof?.phone ?? null,
      telegram_handle: prof?.telegram_handle ?? null,
      terms_agreed_at: prof?.terms_agreed_at ?? null,
    };
  });

  return { rows, total, page, pageSize, totalPages };
}

/**
 * Email lookup helper used by listMembers. Reuses fetchAllAuthUsers and
 * filters down to the requested ids.
 */
async function fetchEmailsForUsers(
  userIds: string[],
): Promise<Map<string, string | null>> {
  const result = new Map<string, string | null>();
  if (userIds.length === 0) return result;
  const ids = new Set(userIds);
  const all = await fetchAllAuthUsers();
  for (const u of all) {
    if (ids.has(u.id)) result.set(u.id, u.email);
  }
  return result;
}
