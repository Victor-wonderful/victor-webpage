import "server-only";

import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns the currently logged-in user IFF their id is in ADMIN_USER_IDS.
 * Returns null otherwise (logged-out OR logged-in-but-not-admin).
 *
 * Configure admins via env var (comma-separated Supabase user UUIDs):
 *   ADMIN_USER_IDS=uuid-1,uuid-2
 */
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const allowList = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (allowList.length === 0) return null;
  return allowList.includes(user.id) ? user : null;
}
