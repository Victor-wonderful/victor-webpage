import type { Metadata } from "next";
import Link from "next/link";
import {
  getActiveTradeIdeas,
  getAllTradeIdeas,
  effectiveStatus,
  awaitingEvaluation,
} from "@/lib/trade-ideas";
import { TradeIdeaCard } from "@/components/today/trade-idea-card";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "오늘의 셋업 — Victor Alpha",
  description:
    "필자가 실제 매매하는 트레이딩 셋업. 진입가·손절가·익절가·무효화 조건을 카드로 공개하고 결과를 추적합니다. 매매 추천이 아닙니다.",
  alternates: { canonical: "/today" },
};

export default async function TodayBoardPage() {
  const [active, all] = await Promise.all([
    getActiveTradeIdeas(),
    getAllTradeIdeas(),
  ]);

  // 비활성 = 활성 슬러그를 뺀 나머지 (status가 active이지만 만료된 것도 포함)
  const activeSlugs = new Set(active.map((i) => i.slug));
  const archived = all
    .filter((i) => !activeSlugs.has(i.slug))
    .slice(0, 12); // 최근 12개만

  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Today&apos;s Setups</p>
      <h1 className="mt-3 font-display text-[32px] font-extrabold leading-[1.05] tracking-tighter md:text-[44px]">
        오늘의 셋업
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        필자가 실제 매매하는 셋업이 있는 날에만 카드가 올라갑니다. 빈 날은 비워 둡니다.
      </p>

      <p className="mt-4 rounded border-l-2 border-rose-500/50 bg-surface-warm px-4 py-3 text-meta text-fg-muted">
        ※ 모든 카드는 <strong className="text-fg">교육용·필자의 매매 기록</strong> 공유입니다. 매매 추천이 아니며, 진입·청산은 본인 판단으로 하세요. <strong className="text-fg">DYOR.</strong>
      </p>

      {/* 활성 보드 */}
      <section className="mt-12">
        <header className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-[22px] font-extrabold tracking-tight md:text-[26px]">
            활성 셋업{" "}
            <span className="text-fg-muted">· {active.length}개</span>
          </h2>
        </header>

        {active.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-surface-warm p-10 text-center text-fg-muted">
            현재 활성 셋업이 없습니다. 다음 진입은 셋업이 보일 때 다시 올라옵니다.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {active.map((idea) => (
              <TradeIdeaCard key={idea.slug} idea={idea} variant="board" />
            ))}
          </div>
        )}
      </section>

      {/* 아카이브 */}
      {archived.length > 0 && (
        <section className="mt-16">
          <header className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-[22px] font-extrabold tracking-tight md:text-[26px]">
              지난 셋업
            </h2>
            <p className="text-meta text-fg-muted">최근 {archived.length}건</p>
          </header>
          <ul className="divide-y divide-border border-y border-border">
            {archived.map((idea) => {
              const st = effectiveStatus(idea);
              const pending = awaitingEvaluation(idea);
              return (
                <li key={idea.slug}>
                  <Link
                    href={`/today/${idea.slug}`}
                    className="group flex flex-col gap-2 py-5 transition-colors hover:bg-surface-warm/50 md:flex-row md:items-baseline md:justify-between"
                  >
                    <div className="min-w-0 flex-1 pr-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[12px] font-semibold text-fg group-hover:text-accent">
                          {idea.symbol}
                        </span>
                        <span className="text-[11px] text-fg-muted">
                          · {idea.direction}
                        </span>
                        {idea.result?.outcome ? (
                          <span
                            className={`text-[11px] font-medium ${
                              idea.result.outcome === "win"
                                ? "text-emerald-700 dark:text-emerald-300"
                                : idea.result.outcome === "loss"
                                  ? "text-rose-700 dark:text-rose-300"
                                  : "text-fg-muted"
                            }`}
                          >
                            ·{" "}
                            {idea.result.outcome === "win"
                              ? "승"
                              : idea.result.outcome === "loss"
                                ? "패"
                                : "본전"}
                            {typeof idea.result.pnlR === "number" &&
                              ` ${idea.result.pnlR > 0 ? "+" : ""}${idea.result.pnlR.toFixed(2)}R`}
                            {idea.result.autoEvaluated && (
                              <span
                                className="ml-1 text-[10px] font-normal text-fg-muted"
                                title="평가 시점 마감가 기준 자동 산출. 회고 메모 입력 시 검증·보정됩니다."
                              >
                                (자동)
                              </span>
                            )}
                          </span>
                        ) : pending ? (
                          <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300">
                            · 평가 대기
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 line-clamp-1 break-keep font-serif-body text-base text-fg group-hover:text-accent">
                        {idea.title}
                      </p>
                    </div>
                    <p className="shrink-0 text-meta text-fg-muted">
                      {st === "expired"
                        ? pending
                          ? "만료 · 미평가"
                          : "만료"
                        : st === "triggered_tp"
                          ? "익절"
                          : st === "triggered_sl"
                            ? "손절"
                            : st === "manually_closed"
                              ? "마감"
                              : st}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* CTA */}
      <div className="mt-16 flex flex-wrap gap-3 border-t border-border pt-8">
        <Link
          href="/category/macro"
          className="text-meta font-medium text-accent hover:text-accent-hover"
        >
          오늘의 시장 글 →
        </Link>
        <span className="text-meta text-fg-muted">·</span>
        <Link
          href="/subscribe"
          className="text-meta text-fg-muted hover:text-accent"
        >
          텔레그램 채널 받기
        </Link>
        <span className="text-meta text-fg-muted">·</span>
        <Link
          href="/glossary"
          className="text-meta text-fg-muted hover:text-accent"
        >
          용어 사전
        </Link>
      </div>
    </article>
  );
}
