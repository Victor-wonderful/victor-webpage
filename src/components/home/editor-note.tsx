import { getEditorial } from "@/lib/editorial";

/**
 * Editor's Note + Sentence of the Day — a short editorial block on the home.
 * Hides itself when no editorial doc exists.
 */
export async function EditorNote() {
  const ed = await getEditorial();
  if (!ed?.editorNote && !ed?.sentenceOfTheDay) return null;

  return (
    <section className="container-page mt-24">
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* Sentence of the Day — left column, large quote */}
        {ed.sentenceOfTheDay && (
          <aside className="rounded-md bg-ink p-8 text-bg dark:bg-fg dark:text-ink md:sticky md:top-24">
            <p className="text-eyebrow text-accent">Sentence of the Day</p>
            <blockquote className="mt-4 font-display text-2xl font-bold leading-snug tracking-tight md:text-3xl">
              <span className="select-none text-accent">“ </span>
              {ed.sentenceOfTheDay}
              <span className="select-none text-accent"> ”</span>
            </blockquote>
            {ed.updatedAt && (
              <p className="mt-6 text-meta opacity-70">
                업데이트 ·{" "}
                {new Date(ed.updatedAt).toLocaleDateString("ko-KR")}
              </p>
            )}
          </aside>
        )}

        {/* Editor's Note — right column, longer text */}
        {ed.editorNote && (
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
