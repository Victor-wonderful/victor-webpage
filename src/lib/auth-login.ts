"use server";

import { createClient } from "@/lib/supabase/server";

export type LoginActionState = {
  ok?: boolean;
  error?: string;
  hint?: "use_google" | "use_reset" | "not_confirmed";
};

/**
 * Email + password login. Returns rich error states so the form can suggest
 * the right next action (Google for OAuth-only users, reset for users who
 * never set a password, etc.).
 */
export async function loginWithPassword(
  _prev: LoginActionState | undefined,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "올바른 이메일 주소를 입력해 주세요." };
  }
  if (!password) return { error: "비밀번호를 입력해 주세요." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("email not confirmed")) {
      return {
        error:
          "이메일 인증이 완료되지 않았습니다. 가입 시 받으신 메일의 링크를 클릭해 주세요.",
        hint: "not_confirmed",
      };
    }
    if (msg.includes("invalid login credentials")) {
      return {
        error:
          "이메일 또는 비밀번호가 올바르지 않습니다. Google로 가입하셨거나 비밀번호를 모르시면 아래 옵션을 이용해 주세요.",
        hint: "use_reset",
      };
    }
    return { error: error.message };
  }
  return { ok: true };
}
