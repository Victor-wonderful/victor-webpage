import Image from "next/image";
import Link from "next/link";
import {
  getActiveDailyWidget,
  type DailyWidget,
} from "@/lib/daily-widget";
import { getPollResult } from "@/lib/polls";
import { PollWidget } from "./poll-widget";

const EYEBROW_BY_TYPE: Record<string, string> = {
  poll: "Today's Poll",
  price: "Today's Snapshot",
  number: "Today's Number",
  dN: "Countdown",
  quiz: "Today's Quiz",
  chart: "Chart of the Day",
  whale: "Whale Watch",
  news: "News One-liner",
  snippet: "Today's Note",
};

/** Server component: picks the right shape by widget.type. Fallback to D-N when none. */
export async function DailyHomeWidget() {
  const widget = await getActiveDailyWidget();

  if (!widget) {
    return <FallbackPanel />;
  }

  if (widget.type === "poll" && widget.poll) {
    const result = await getPollResult(widget.poll);
    return (
      <PollWidget
        slug={widget.poll.slug}
        question={widget.poll.question}
        context={widget.poll.context ?? widget.subtitle}
        options={widget.poll.options}
        initialCounts={result.counts}
        initialUserVote={result.userVote}
        isLoggedIn={result.isLoggedIn}
        isClosed={result.isClosed}
      />
    );
  }

  return <GenericPanel widget={widget} />;
}

function GenericPanel({ widget }: { widget: DailyWidget }) {
  const eyebrow = EYEBROW_BY_TYPE[widget.type] ?? "Today";

  return (
    <section className="container-page mt-24">
      <div className="rounded-md border border-border bg-surface-warm p-8 md:p-10">
        <p className="text-eyebrow text-accent">{eyebrow}</p>
        <h2 className="mt-3 font-display text-2xl font-bold leading-snug tracking-tight md:text-3xl">
          {widget.title}
        </h2>
        {widget.subtitle && (
          <p className="mt-3 font-serif-body text-base leading-relaxed text-fg-muted">
            {widget.subtitle}
          </p>
        )}

        <TypeBody widget={widget} />

        {widget.body && (
          <p className="mt-6 whitespace-pre-line font-serif-body text-base leading-relaxed text-fg">
            {widget.body}
          </p>
        )}

        {widget.ctaHref && widget.ctaLabel && (
          <div className="mt-6">
            <Link
              href={widget.ctaHref}
              className="inline-flex items-center gap-1 text-meta font-semibold text-accent hover:underline"
            >
              {widget.ctaLabel} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function TypeBody({ widget }: { widget: DailyWidget }) {
  switch (widget.type) {
    case "price":
    case "number":
      return widget.metric ? (
        <p className="mt-6 font-mono text-3xl font-bold tabular-nums text-fg md:text-4xl">
          {widget.metric}
        </p>
      ) : null;

    case "dN":
      return <DNCountdown name={widget.eventName} at={widget.eventAt} />;

    case "quiz":
      return <QuizBlock quiz={widget.quiz} />;

    case "chart":
      return widget.chartImageUrl ? (
        <figure className="mt-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-border bg-bg">
            <Image
              src={widget.chartImageUrl}
              alt={widget.chartCaption ?? widget.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 800px, 100vw"
            />
          </div>
          {widget.chartCaption && (
            <figcaption className="mt-2 text-meta text-fg-muted">
              {widget.chartCaption}
            </figcaption>
          )}
        </figure>
      ) : null;

    case "whale":
      return widget.whaleAmount ? (
        <div className="mt-6">
          <p className="font-mono text-2xl font-bold tabular-nums text-fg">
            {widget.whaleAmount}
          </p>
          {widget.whaleTxHref && (
            <a
              href={widget.whaleTxHref}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-meta text-fg-muted hover:text-accent"
            >
              트랜잭션 보기 ↗
            </a>
          )}
        </div>
      ) : null;

    default:
      return null;
  }
}

function DNCountdown({ name, at }: { name?: string; at?: string }) {
  if (!at) return null;
  const days = Math.max(
    0,
    Math.ceil((new Date(at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );
  return (
    <div className="mt-6 flex items-baseline gap-4">
      <span className="font-mono text-5xl font-bold tabular-nums text-fg md:text-6xl">
        D-{days}
      </span>
      {name && (
        <span className="font-serif-body text-base text-fg-muted">{name}</span>
      )}
    </div>
  );
}

function QuizBlock({ quiz }: { quiz: DailyWidget["quiz"] }) {
  if (!quiz?.choices?.length) return null;
  return (
    <details className="mt-6 group">
      <summary className="cursor-pointer list-none">
        <ol className="space-y-2 list-decimal list-inside font-serif-body">
          {quiz.choices.map((c, i) => (
            <li key={i} className="text-fg">
              {c}
            </li>
          ))}
        </ol>
        <span className="mt-4 inline-block text-meta font-semibold text-accent group-open:hidden">
          정답 보기 →
        </span>
      </summary>
      {typeof quiz.answerIndex === "number" && quiz.choices[quiz.answerIndex] && (
        <div className="mt-4 rounded-md border border-accent/40 bg-accent/5 p-4">
          <p className="text-meta font-semibold text-accent">
            정답: {quiz.answerIndex + 1}. {quiz.choices[quiz.answerIndex]}
          </p>
          {quiz.explanation && (
            <p className="mt-2 font-serif-body text-base leading-relaxed text-fg">
              {quiz.explanation}
            </p>
          )}
        </div>
      )}
    </details>
  );
}

function FallbackPanel() {
  return (
    <section className="container-page mt-24">
      <div className="rounded-md border border-dashed border-border bg-surface-warm p-8 md:p-10 text-center">
        <p className="text-eyebrow text-fg-muted">Today</p>
        <p className="mt-3 font-serif-body text-base text-fg-muted">
          오늘의 위젯이 준비되는 중입니다.
        </p>
      </div>
    </section>
  );
}
