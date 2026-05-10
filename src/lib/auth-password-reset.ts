"use server";

import { createClient } from "@/lib/supabase/server";

export type ForgotPasswordState = {
  ok?: boolean;
  email?: string;
  error?: string;
};

export async function requestPasswordReset(
  _prev: ForgotPasswordState | undefined,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "올바른 이메일 주소를 입력해 주세요." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // Send users through /auth/callback so the recovery code is exchanged for
  // a session, then forwarded to the form where they pick a new password.
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent("/auth/reset-password")}`,
  });
  if (error) return { error: error.message };
  return { ok: true, email };
}

export type ResetPasswordState = {
  ok?: boolean;
  error?: string;
};

export async function setNewPassword(
  _prev: ResetPasswordState | undefined,
  formData: FormData,
): Promise<ResetPasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("password_confirm") ?? "");

  if (password.length < 8) {
    return { error: "비밀번호는 8자 이상으로 설정해 주세요." };
  }
  if (password.length > 72) {
    return { error: "비밀번호는 72자 이하로 설정해 주세요." };
  }
  if (password !== confirm) {
    return { error: "두 비밀번호가 일치하지 않습니다." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error:
        "세션이 만료되었습니다. 비밀번호 재설정 메일을 다시 요청해 주세요.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { ok: true };
}
