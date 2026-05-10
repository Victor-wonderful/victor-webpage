import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = {
  title: "새 비밀번호 설정",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  // The user reaches this page only after clicking the recovery email link,
  // which exchanges the code for a session via /auth/callback. If there's
  // no session, the link is invalid or expired.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/forgot-password?error=expired");
  }

  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Reset Password</p>
      <h1 className="mt-3 font-display text-[32px] font-extrabold leading-[1.05] tracking-tighter md:text-[44px]">
        새 비밀번호 설정
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        새로 사용할 비밀번호를 입력해 주세요.
      </p>

      <section className="mt-10 rounded-md border border-border bg-surface-warm p-6 md:p-8">
        <ResetPasswordForm />
      </section>

      <p className="mt-10 text-center font-serif-body text-[14px] text-fg-muted">
        <Link href="/" className="text-accent hover:underline">
          ← 홈으로
        </Link>
      </p>
    </article>
  );
}
