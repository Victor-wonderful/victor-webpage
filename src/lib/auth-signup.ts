"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/categories";

const SIGNUP_COOKIE = "va_signup_data";
const NICKNAME_RE = /^[\p{L}\p{N}_.\-\s]{2,16}$/u;

export type SignupActionState = {
  ok?: boolean;
  email?: string;
  error?: string;
};

export type StoredSignupData = {
  display_name: string;
  interests: string[];
  newsletter_opt_in: boolean;
  newsletter_channel: "phone" | "telegram" | null;
  phone: string | null;
  telegram_handle: string | null;
  terms_agreed_at: string;
};

/**
 * Validates the full signup form, sets a short-lived cookie carrying the
 * collected fields, then triggers a magic-link email. The cookie is read in
 * /auth/callback after the user clicks the link, allowing us to populate the
 * entire profile in one shot — the user does NOT pass through /welcome.
 */
export async function signupWithEmail(
  _prev: SignupActionState | undefined,
  formData: FormData,
): Promise<SignupActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const terms = formData.get("terms") === "on";
  const privacy = formData.get("privacy") === "on";
  const age = formData.get("age") === "on";

  if (!NICKNAME_RE.test(displayName)) {
    return {
      error: "닉네임은 2~16자, 한·영·숫자·_-. 만 사용 가능합니다.",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "올바른 이메일 주소를 입력해 주세요." };
  }
  if (password.length < 8) {
    return { error: "비밀번호는 8자 이상으로 설정해 주세요." };
  }
  if (password.length > 72) {
    return { error: "비밀번호는 72자 이하로 설정해 주세요." };
  }
  if (!terms || !privacy || !age) {
    return { error: "필수 약관 3개에 모두 동의해 주셔야 가입할 수 있습니다." };
  }

  const interests = CATEGORIES.map((c) => c.slug).filter((slug) =>
    formData.getAll("interests").includes(slug),
  );

  const optIn = formData.get("newsletter_opt_in") === "on";
  let newsletterChannel: "phone" | "telegram" | null = null;
  let phoneToSave: string | null = null;
  let telegramToSave: string | null = null;

  if (optIn) {
    const channel = String(formData.get("newsletter_channel") ?? "").trim();
    if (channel !== "phone" && channel !== "telegram") {
      return { error: "뉴스레터 수신 채널(휴대폰/텔레그램)을 선택해 주세요." };
    }
    if (channel === "phone") {
      const phone = String(formData.get("phone") ?? "").trim();
      if (phone.length < 7) return { error: "휴대폰 번호를 입력해 주세요." };
      newsletterChannel = "phone";
      phoneToSave = phone;
    } else {
      const tg = String(formData.get("telegram_handle") ?? "").trim();
      if (tg.length < 2) return { error: "텔레그램 아이디를 입력해 주세요." };
      newsletterChannel = "telegram";
      telegramToSave = tg.startsWith("@") ? tg : `@${tg}`;
    }
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent("/")}`,
      data: { full_name: displayName },
    },
  });
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already") || msg.includes("registered")) {
      return {
        error:
          "이미 가입된 이메일입니다. 로그인 페이지에서 비밀번호로 로그인해 주세요.",
      };
    }
    return { error: error.message };
  }

  const data: StoredSignupData = {
    display_name: displayName,
    interests,
    newsletter_opt_in: optIn,
    newsletter_channel: newsletterChannel,
    phone: phoneToSave,
    telegram_handle: telegramToSave,
    terms_agreed_at: new Date().toISOString(),
  };

  const cookieStore = await cookies();
  cookieStore.set(SIGNUP_COOKIE, JSON.stringify(data), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
  });

  return { ok: true, email };
}

/** Read the signup cookie and clear it. Called from /auth/callback. */
export async function readAndClearSignupData(): Promise<StoredSignupData | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SIGNUP_COOKIE)?.value;
  if (!raw) return null;
  cookieStore.delete(SIGNUP_COOKIE);
  try {
    return JSON.parse(raw) as StoredSignupData;
  } catch {
    return null;
  }
}
