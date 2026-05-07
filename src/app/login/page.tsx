import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

export const metadata: Metadata = {
  title: "로그인",
  description: "Victor Alpha 로그인. 댓글·좋아요 기능을 위해 로그인하세요.",
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
      <p className="text-eyebrow text-accent">Sign In</p>
      <h1 className="mt-3 font-display text-[44px] font-extrabold leading-[1.05] tracking-tighter md:text-[56px]">
        로그인
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        댓글·좋아요·북마크를 위해 로그인이 필요합니다.
      </p>

      <section className="mt-10 rounded-md border border-border bg-surface-warm p-8">
        <p className="text-eyebrow text-accent">소셜 로그인</p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
          Google 계정으로 시작하기
        </h2>
        <p className="mt-3 font-serif-body text-[16px] leading-[1.6] text-fg-muted">
          별도의 비밀번호 없이 Google 계정으로 안전하게 로그인합니다.
        </p>

        {sp.error === "oauth_failed" && (
          <p
            className="mt-4 rounded-md border border-down/30 bg-down/10 px-4 py-2 text-meta text-down"
            role="alert"
          >
            로그인이 완료되지 않았습니다. 다시 시도해 주세요.
          </p>
        )}

        <div className="mt-6">
          <GoogleSignInButton redirectTo={sp.next ?? "/"} />
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
