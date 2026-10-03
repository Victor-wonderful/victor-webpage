import Link from "next/link";
import { getEditorial, getLatestMacroJudgment } from "@/lib/editorial";
import { formatDate } from "@/lib/format";

/**
 * Editor's Note + Sentence of the Day — a short editorial block on the home.
 * Hides itself when no editorial doc exists.
 */
export async function EditorNote() {
  const [ed, judgment] = await Promise.all([getEditorial(), getLatestMacroJudgment()]);

  // Sentence of the Day = 최신 매크로 데일리의 Victor 판단 한 줄(매일 바뀜).
  // 매크로가 없을 때만 editorial 문서의 sentenceOfTheDay(주 1회 갱신)로 대체한다.
  // 에디토리얼과 같이 주 1회만 바뀌어 지난 PCE를 «앞으로»처럼 말하던 문제(2026-10-03).
  const sentence = judgment?.sentence ?? ed?.sentenceOfTheDay;
  const sentenceAt = judgment?.publishedAt ?? ed?.updatedAt;
  if (!ed?.editorNote && !sentence) return null;

  return (
    <section className="container-page mt-24">
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* Sentence of the Day — left column, large quote */}
        {sentence && (
          <aside className="rounded-md bg-ink p-8 text-bg dark:bg-fg dark:text-ink md:sticky md:top-24">
            <p className="text-eyebrow text-accent">Sentence of the Day</p>
            <blockquote
              className={`mt-4 font-display font-bold leading-snug tracking-tight ${
                sentence.length > 60 ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
              }`}
            >
              <span className="select-none text-accent">“ </span>
              {sentence}
              <span className="select-none text-accent"> ”</span>
            </blockquote>
            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2 text-meta">
              {sentenceAt && (
                <span className="opacity-70">업데이트 · {formatDate(sentenceAt)}</span>
              )}
              {judgment && (
                <Link href={`/blog/${judgment.slug}`} className="text-accent hover:underline">
                  오늘의 시장 →
                </Link>
              )}
            </div>
          </aside>
        )}

        {/* Editor's Note — right column, longer text */}
        {ed?.editorNote && (
          <article>
            <p className="text-eyebrow text-accent">Editor&apos;s Note</p>
            <h2 className="mt-3 font-display text-[32px] font-extrabold leading-[1.1] tracking-tight md:text-[40px]">
              이번 주의 시선
            </h2>
            <p className="mt-6 whitespace-pre-line break-keep text-pretty font-serif-body text-[17px] leading-[1.85] text-fg">
              {ed.editorNote}
            </p>
            <p className="mt-6 text-meta text-fg-muted">
              — {ed.editorNoteAuthor ?? "Victor"}
            </p>
          </article>
        )}
      </div>
    </section>
  );
}
