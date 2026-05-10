import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/profile";
import { WelcomeForm } from "@/components/welcome/welcome-form";

export const metadata: Metadata = {
  title: "환영합니다",
  description: "프로필을 완성하고 Victor Alpha를 시작하세요.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/welcome")}`);
  }

  const profile = await getMyProfile();

  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Welcome</p>
      <h1 className="mt-3 font-display text-[44px] font-extrabold leading-[1.05] tracking-tighter md:text-[56px]">
        환영합니다 👋
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        몇 가지만 알려주시면 바로 시작합니다.
      </p>

      <WelcomeForm
        defaults={{
          display_name: profile?.display_name ?? "",
          interests: Array.isArray(profile?.interests) ? profile.interests : [],
          newsletter_opt_in: !!profile?.newsletter_opt_in,
          newsletter_channel:
            (profile?.newsletter_channel as "phone" | "telegram" | null) ?? "",
          phone: profile?.phone ?? "",
          telegram_handle: profile?.telegram_handle ?? "",
        }}
      />
    </article>
  );
}
