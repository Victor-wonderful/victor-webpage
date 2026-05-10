import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { EmailLoginForm } from "@/components/email-login-form";

export const metadata: Metadata = {
  title: "로그인",
  description: "Victor Alpha 로그인.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    redirect(sp.next ?? "/");
  }

  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Sign In</p>
      <h1 className="mt-3 font-display text-[32px] font-extrabold leading-[1.05] tracking-tighter md:text-[44px]">
        로그인
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        가입된 계정으로 로그인하세요.
      </p>

      {sp.error === "oauth_failed" && (
        <p
          className="mt-6 rounded-md border border-down/30 bg-down/10 px-4 py-2 text-meta text-down"
          role="alert"
        >
          로그인이 완료되지 않았습니다. 다시 시도해 주세요.
        </p>
      )}
      {sp.error === "link_expired" && (
        <p
          className="mt-6 rounded-md border border-down/30 bg-down/10 px-4 py-2 text-meta text-down"
          role="alert"
        >
          인증 링크가 만료되었습니다. 가입 / 비밀번호 재설정을 다시 시도해
          주세요. (링크는 1시간만 유효합니다)
        </p>
      )}
      {sp.error === "link_invalid" && (
        <p
          className="mt-6 rounded-md border border-down/30 bg-down/10 px-4 py-2 text-meta text-down"
          role="alert"
        >
          인증 링크가 이미 사용되었거나 유효하지 않습니다. 가입 / 비밀번호
          재설정을 다시 시도해 주세요.
        </p>
      )}

      <section className="mt-10 rounded-md border border-border bg-surface-warm p-6 md:p-8">
        {/* 메인 — 이메일 매직 링크 */}
        <label
          htmlFor="login-email"
          className="block text-sm font-medium"
        >
          이메일
        </label>
        <p className="mt-1 text-meta text-fg-muted">
          가입한 이메일을 입력하시면 비밀번호 없이 로그인 링크를 보내드립니다.
        </p>
        <div className="mt-3">
          <EmailLoginForm redirectTo={sp.next ?? "/"} />
        </div>

        {/* 구분선 */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-meta uppercase tracking-[0.18em] text-fg-muted">
            또는
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* 보조 — Google */}
        <GoogleSignInButton redirectTo={sp.next ?? "/"} label="Google로 로그인" />
      </section>

      <p className="mt-10 text-center font-serif-body text-[14px] text-fg-muted">
        처음이신가요?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          회원가입 →
        </Link>
        <br />
        <Link href="/" className="mt-2 inline-block text-fg-muted hover:underline">
          홈으로 돌아가기
        </Link>
      </p>
    </article>
  );
}
