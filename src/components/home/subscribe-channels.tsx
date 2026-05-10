import Link from "next/link";

const TG_CHANNEL = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL;
const TG_GROUP = process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL;

/**
 * Paired subscription cluster on the home page.
 *  - Alpha Research (always shown) — premium members-only research
 *  - Telegram public (only when channel/group envs are set) — public alerts
 *
 * The two channels are complementary: Alpha Research = members-only deep
 * research, Telegram public = public real-time alerts + open discussion.
 */
export function SubscribeChannels() {
  const hasTelegram = Boolean(TG_CHANNEL || TG_GROUP);

  return (
    <section className="container-page mt-24 border-t border-b border-ink/20 py-16">
      <div className={`grid gap-6 ${hasTelegram ? "md:grid-cols-2" : ""}`}>
        {/* Alpha Research card */}
        <article className="flex h-full flex-col rounded-md border-2 border-accent/40 bg-accent/5 p-8 md:p-10">
          <p className="text-eyebrow text-accent">
            Members Only · Premium Research
          </p>
          <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            Alpha Research 구독
          </h3>
          <p className="mt-4 max-w-md font-serif-body text-base leading-[1.7] text-fg-muted">
            블로그에 공개되지 않는 회원 전용 리서치를 신청하신 채널로 직접
            전달해드립니다. 신규 프로젝트 소개, 토큰 X-ray, 심층 시장 분석 등
            엄선된 콘텐츠로 구성됩니다.
          </p>
          <div className="mt-auto pt-8">
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-accent-hover active:scale-[0.98]"
            >
              구독 신청
            </Link>
          </div>
        </article>

        {/* Telegram card — only if at least one of channel/group URL is set */}
        {hasTelegram && (
          <article className="flex h-full flex-col rounded-md border border-border bg-surface p-8 md:p-10">
            <p className="text-eyebrow text-accent">📡 Telegram</p>
            <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
              실시간 시그널·토론
            </h3>
            <p className="mt-4 max-w-md font-serif-body text-base text-fg-muted">
              새 글은 채널에서 즉시 알림, 의견·질문은 토론방에서 실시간으로.
            </p>
            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              {TG_CHANNEL && (
                <Link
                  href={TG_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-accent-hover active:scale-[0.98]"
                >
                  <TelegramIcon />
                  채널 구독
                </Link>
              )}
              {TG_GROUP && (
                <Link
                  href={TG_GROUP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/30 bg-bg px-6 py-3.5 text-base font-semibold text-fg transition-all hover:border-accent hover:text-accent active:scale-[0.98]"
                >
                  <ChatIcon />
                  토론방 입장
                </Link>
              )}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}
