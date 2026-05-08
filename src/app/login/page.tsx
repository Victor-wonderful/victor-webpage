import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { EmailMagicLinkForm } from "@/components/email-magic-link-form";

export const metadata: Metadata = {
  title: "로그인 / 회원가입",
  description: "Victor Alpha 로그인 또는 회원가입. 처음이신 분도 자동으로 가입됩니다.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;

  // Already logged in? Bounce away.
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    redirect(sp.next ?? "/");
  }

  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Sign In · Sign Up</p>
      <h1 className="mt-3 font-display text-[44px] font-extrabold leading-[1.05] tracking-tighter md:text-[56px]">
        로그인 / 회원가입
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        댓글·좋아요·북마크를 위해 계정이 필요합니다. 처음이신 분도 자동으로 가입됩니다.
      </p>

      {sp.error === "oauth_failed" && (
        <p
          className="mt-6 rounded-md border border-down/30 bg-down/10 px-4 py-2 text-meta text-down"
          role="alert"
        >
          로그인이 완료되지 않았습니다. 다시 시도해 주세요.
        </p>
      )}

      {/* 1. Google */}
      <section className="mt-10 rounded-md border border-border bg-surface-warm p-8">
        <p className="text-eyebrow text-accent">Option 1 · 소셜 로그인</p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
          Google 계정으로 시작하기
        </h2>
        <p className="mt-3 font-serif-body text-[16px] leading-[1.6] text-fg-muted">
          가장 빠른 1초 로그인. 처음이신 분도 자동으로 가입됩니다.
        </p>
        <div className="mt-6">
          <GoogleSignInButton redirectTo={sp.next ?? "/"} />
        </div>
      </section>

      {/* Divider */}
      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-meta uppercase tracking-[0.18em] text-fg-muted">또는</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* 2. Magic Link */}
      <section className="rounded-md border border-border bg-surface-warm p-8">
        <p className="text-eyebrow text-accent">Option 2 · 이메일 매직 링크</p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
          이메일로 로그인 / 가입하기
        </h2>
        <p className="mt-3 font-serif-body text-[16px] leading-[1.6] text-fg-muted">
          비밀번호 없이 이메일에 받은 링크 클릭으로 로그인합니다. 네이버·카카오·회사 메일 등 어떤 이메일이든 가능합니다.
        </p>
        <div className="mt-6">
          <EmailMagicLinkForm redirectTo={sp.next ?? "/"} />
        </div>
      </section>

      <p className="mt-10 text-center font-serif-body text-[14px] text-fg-muted">
        로그인 없이도 글을 읽을 수 있습니다 ·{" "}
        <Link href="/" className="text-accent hover:underline">
          홈으로 돌아가기
        </Link>
      </p>
    </article>
  );
}
