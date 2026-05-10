"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, isCategorySlug } from "@/lib/categories";

export type WelcomeFormState = {
  error?: string;
};

const NICKNAME_RE = /^[\p{L}\p{N}_.\-\s]{2,16}$/u;

export async function submitWelcome(
  _prev: WelcomeFormState | undefined,
  formData: FormData,
): Promise<WelcomeFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const displayName = String(formData.get("display_name") ?? "").trim();
  if (!NICKNAME_RE.test(displayName)) {
    return { error: "닉네임은 2~16자, 한·영·숫자·_-. 만 사용 가능합니다." };
  }

  const interests = CATEGORIES.map((c) => c.slug).filter((slug) =>
    formData.getAll("interests").includes(slug),
  );

  const optIn = formData.get("newsletter_opt_in") === "on";
  const channel = String(formData.get("newsletter_channel") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const telegram = String(formData.get("telegram_handle") ?? "").trim();

  let newsletterChannel: "phone" | "telegram" | null = null;
  let phoneToSave: string | null = null;
  let telegramToSave: string | null = null;
  let consentAt: string | null = null;

  if (optIn) {
    if (channel !== "phone" && channel !== "telegram") {
      return { error: "뉴스레터 수신 채널을 선택해 주세요." };
    }
    if (channel === "phone") {
      if (phone.length < 7) {
        return { error: "휴대폰 번호를 입력해 주세요." };
      }
      newsletterChannel = "phone";
      phoneToSave = phone;
    } else {
      if (telegram.length < 2) {
        return { error: "텔레그램 아이디를 입력해 주세요." };
      }
      newsletterChannel = "telegram";
      telegramToSave = telegram.startsWith("@") ? telegram : `@${telegram}`;
    }
    consentAt = new Date().toISOString();
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      interests,
      newsletter_opt_in: optIn,
      newsletter_channel: newsletterChannel,
      phone: phoneToSave,
      telegram_handle: telegramToSave,
      newsletter_consent_at: consentAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: `저장 실패: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/members");
  redirect("/");
}

export type NewsletterUpdateState = {
  ok?: boolean;
  error?: string;
};

/**
 * Update only newsletter-related fields on the current user's profile.
 * Used by /subscribe and /me to enable/disable Alpha Research without
 * touching nickname or interests.
 */
export async function updateNewsletter(
  _prev: NewsletterUpdateState | undefined,
  formData: FormData,
): Promise<NewsletterUpdateState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const optIn = formData.get("newsletter_opt_in") === "on";
  const channel = String(formData.get("newsletter_channel") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const telegram = String(formData.get("telegram_handle") ?? "").trim();

  let newsletterChannel: "phone" | "telegram" | null = null;
  let phoneToSave: string | null = null;
  let telegramToSave: string | null = null;
  let consentAt: string | null = null;

  if (optIn) {
    if (channel !== "phone" && channel !== "telegram") {
      return { error: "수신 채널(휴대폰/텔레그램)을 선택해 주세요." };
    }
    if (channel === "phone") {
      if (phone.length < 7) return { error: "휴대폰 번호를 입력해 주세요." };
      newsletterChannel = "phone";
      phoneToSave = phone;
    } else {
      if (telegram.length < 2) return { error: "텔레그램 아이디를 입력해 주세요." };
      newsletterChannel = "telegram";
      telegramToSave = telegram.startsWith("@") ? telegram : `@${telegram}`;
    }
    consentAt = new Date().toISOString();
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      newsletter_opt_in: optIn,
      newsletter_channel: newsletterChannel,
      phone: phoneToSave,
      telegram_handle: telegramToSave,
      newsletter_consent_at: consentAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: `저장 실패: ${error.message}` };

  revalidatePath("/admin");
  revalidatePath("/admin/members");
  revalidatePath("/subscribe");
  return { ok: true };
}

/** Returns the current user's profile, or null if not logged in. */
export async function getMyProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select(
      "id, display_name, avatar_url, interests, newsletter_opt_in, newsletter_channel, phone, telegram_handle",
    )
    .eq("id", user.id)
    .maybeSingle();
  return data;
}
