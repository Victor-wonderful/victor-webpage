import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata: Metadata = {
  title: "비밀번호 재설정",
  description: "비밀번호를 잊으셨나요? 이메일로 재설정 링크를 보내드립니다.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Forgot Password</p>
      <h1 className="mt-3 font-display text-[44px] font-extrabold leading-[1.05] tracking-tighter md:text-[56px]">
        비밀번호 재설정
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        가입하신 이메일을 입력하시면 재설정 링크를 보내드립니다.
      </p>

      <section className="mt-10 rounded-md border border-border bg-surface-warm p-6 md:p-8">
        <ForgotPasswordForm />
      </section>

      <p className="mt-10 text-center font-serif-body text-[14px] text-fg-muted">
        <Link href="/login" className="text-accent hover:underline">
          ← 로그인으로 돌아가기
        </Link>
      </p>
    </article>
  );
}
