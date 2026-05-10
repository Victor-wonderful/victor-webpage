import { createClient } from "@/lib/supabase/server";
import { AlphaResearchBanner } from "@/components/alpha-research-banner";

/**
 * Server wrapper that decides whether the banner should be shown at all.
 * We only mount the client banner for logged-in users who have NOT yet
 * subscribed to Alpha Research. Logged-out visitors and existing
 * subscribers skip it entirely.
 */
export async function AlphaResearchBannerMount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let optedIn = false;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("newsletter_opt_in")
      .eq("id", user.id)
      .maybeSingle();
    optedIn = !!(data as { newsletter_opt_in?: boolean } | null)
      ?.newsletter_opt_in;
  } catch {
    // If the column hasn't been migrated yet, treat as not opted-in.
  }
  if (optedIn) return null;

  return <AlphaResearchBanner />;
}
