import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "구독",
  description:
    "Victor Alpha의 새 글을 이메일과 RSS로 받아보세요. 매주 트레이딩 전략, Pine Script 노트, 토큰 트렌드를 정리해 보내드립니다.",
};

export default function SubscribePage() {
  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Subscribe</p>
      <h1 className="mt-3 font-display text-[44px] font-extrabold leading-[1.05] tracking-tighter md:text-[56px]">
        새 글을 가장 먼저
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        매주 트레이딩 전략, Pine Script 노트, 토큰 트렌드를 정리해 보내드립니다.
      </p>

      <section className="mt-10 rounded-md border border-border bg-surface-warm p-6">
        <p className="text-eyebrow text-accent">Email Newsletter</p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
          이메일로 받기
        </h2>
        <p className="mt-3 font-serif-body text-[16px] leading-[1.6] text-fg-muted">
          이메일 발행 서비스 연동(예: Buttondown · Substack · Resend)은 곧 준비됩니다.
        </p>

        <form
          className="mt-5 flex flex-col gap-3 sm:flex-row"
          aria-label="이메일 구독 폼"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            disabled
            className="flex-1 rounded-md border border-ink/30 bg-bg px-4 py-2.5 font-serif-body text-base disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="이메일 주소"
          />
          <button
            type="submit"
            disabled
            className="rounded-full bg-accent px-6 py-2.5 text-pill text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            준비 중
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-md border border-border p-6">
        <p className="text-eyebrow text-accent">RSS Feed</p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
          RSS로 받기
        </h2>
        <p className="mt-3 font-serif-body text-[16px] leading-[1.6] text-fg-muted">
          Feedly, Inoreader, NetNewsWire 등 RSS 리더에 아래 주소를 추가하세요.
        </p>
        <a
          href="/rss.xml"
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
