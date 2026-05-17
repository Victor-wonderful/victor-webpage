import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/profile";
import { SubscribeForm } from "@/components/subscribe/subscribe-form";

export const metadata: Metadata = {
  title: "Alpha Research 구독",
  description:
    "Victor Alpha의 회원 전용 리서치를 텔레그램 또는 휴대폰으로 받아보세요.",
};

export const dynamic = "force-dynamic";

export default async function SubscribePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getMyProfile() : null;

  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Members Only · Premium Research</p>
      <h1 className="mt-3 font-display text-[32px] font-extrabold leading-[1.05] tracking-tighter md:text-[44px]">
        Alpha Research 구독
      </h1>
      <p className="mt-5 font-serif-body text-xl italic leading-[1.7] text-fg-muted">
        블로그에 공개되지 않는 회원 전용 리서치 — 신규 프로젝트 소개,
        토큰 X-ray, 심층 시장 분석을 텔레그램 또는 휴대폰으로 직접
        전달해드립니다. 주 1~2회, 비정기 발송.
      </p>

      {!user ? (
        <section className="mt-10 rounded-md border-2 border-accent/40 bg-accent/5 p-8">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            회원가입 후 신청하실 수 있습니다
          </h2>
          <p className="mt-3 font-serif-body text-[16px] leading-[1.7] text-fg-muted">
            Alpha Research는 회원 전용 서비스입니다. 가입은 무료이며,
            가입 폼에서 채널(텔레그램/휴대폰)을 선택하면 바로 구독이 시작됩니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              회원가입 하기
            </Link>
            <Link
              href="/login?next=/subscribe"
              className="inline-flex items-center justify-center rounded-full border border-ink/30 bg-bg px-7 py-3 text-base font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              로그인
            </Link>
          </div>
        </section>
      ) : (
        <>
          {profile?.newsletter_opt_in && (
            <section className="mt-8 rounded-md border border-accent/30 bg-accent/5 p-5">
              <p className="text-meta font-medium">
                ✅ 현재 구독 중입니다
              </p>
              <p className="mt-1 text-meta text-fg-muted">
                {profile.newsletter_channel === "telegram"
                  ? `✈️ 텔레그램 — ${profile.telegram_handle ?? ""}`
                  : profile.newsletter_channel === "phone"
                    ? `📱 휴대폰 — ${profile.phone ?? ""}`
                    : ""}
              </p>
            </section>
          )}

          <section className="mt-8 rounded-md border-2 border-accent/40 bg-accent/5 p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {profile?.newsletter_opt_in ? "수신 채널 변경 / 구독 해제" : "구독 신청"}
            </h2>
            <p className="mt-2 text-meta text-fg-muted">
              아래에서 채널과 연락처를 입력하신 후 저장해 주세요.
            </p>
            <div className="mt-6">
              <SubscribeForm
                defaults={{
                  newsletter_opt_in: !!profile?.newsletter_opt_in,
                  newsletter_channel:
                    (profile?.newsletter_channel as
                      | "phone"
                      | "telegram"
                      | null) ?? "",
                  phone: profile?.phone ?? "",
                  telegram_handle: profile?.telegram_handle ?? "",
                }}
              />
            </div>
          </section>
        </>
      )}

      <section className="mt-12 rounded-md border border-border p-6">
        <p className="text-eyebrow text-fg-muted">RSS Feed</p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
          공개 글 RSS로 받기
        </h2>
        <p className="mt-3 font-serif-body text-[15px] leading-[1.7] text-fg-muted">
          블로그의 공개 글은 RSS로도 받으실 수 있습니다. Alpha Research(회원
          전용)와는 다른 채널입니다.
        </p>
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener"
          className="mt-4 inline-flex items-center gap-2 font-mono text-[14px] text-accent underline-offset-4 hover:underline"
        >
          /rss.xml
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M5 19l14-14M9 5h10v10" />
          </svg>
        </a>
      </section>
    </article>
  );
}
