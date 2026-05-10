import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "회원가입",
  description:
    "Victor Alpha 회원가입. 닉네임·관심분야·뉴스레터 설정을 한 번에.",
};

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    redirect("/");
  }

  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Sign Up</p>
      <h1 className="mt-3 font-display text-[32px] font-extrabold leading-[1.05] tracking-tighter md:text-[44px]">
        회원가입
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        댓글·좋아요·북마크·뉴스레터를 한 번에 설정합니다. 가입은 무료입니다.
      </p>

      {/* 메인 — 이메일 가입 폼 */}
      <section className="mt-10 rounded-md border border-border bg-surface-warm p-6 md:p-8">
        <SignupForm />
      </section>

      {/* 구분선 */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-meta uppercase tracking-[0.18em] text-fg-muted">
          또는
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* 보조 — Google 빠른 가입 */}
      <section className="rounded-md border border-border bg-bg p-5">
        <p className="text-meta text-fg-muted">
          Google 계정으로 빠르게 가입할 수도 있습니다. 가입 후 닉네임·관심분야
          입력 페이지로 이동합니다. 버튼을 누르면{" "}
          <Link href="/terms" target="_blank" className="text-accent underline">
            이용약관
          </Link>
          {" "}및{" "}
          <Link
            href="/privacy"
            target="_blank"
            className="text-accent underline"
          >
            개인정보처리방침
          </Link>
          에 동의한 것으로 간주됩니다.
        </p>
        <div className="mt-3">
          <GoogleSignInButton redirectTo="/welcome" label="Google로 빠르게 가입" />
        </div>
      </section>

      <p className="mt-10 text-center font-serif-body text-[14px] text-fg-muted">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-accent hover:underline">
          로그인 →
        </Link>
      </p>
    </article>
  );
}
