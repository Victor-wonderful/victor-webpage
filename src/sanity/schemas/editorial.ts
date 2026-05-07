import { defineField, defineType } from "sanity";

/**
 * Singleton "editorial" document — used for the homepage Editor's Note +
 * Sentence of the Day block. Only one instance is ever expected.
 */
export const editorialType = defineType({
  name: "editorial",
  title: "에디토리얼 (홈 페이지)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "내부 라벨 (대시보드 식별용)",
      type: "string",
      initialValue: "Editorial — Home",
      readOnly: true,
    }),
    defineField({
      name: "editorNote",
      title: "이번 주 에디터 노트",
      description: "이번 주 시장의 톤·관전 포인트를 3~5줄로 정리합니다.",
      type: "text",
      rows: 5,
      validation: (r) => r.max(800),
    }),
    defineField({
      name: "editorNoteAuthor",
      title: "필자 이름",
      type: "string",
      initialValue: "Victor",
    }),
    defineField({
      name: "sentenceOfTheDay",
      title: "Sentence of the Day",
      description: "오늘의 한 줄 인사이트 (트윗처럼 짧고 강하게).",
      type: "string",
      validation: (r) => r.max(180),
    }),
    defineField({
      name: "updatedAt",
      title: "마지막 갱신",
      description: "수동으로 갱신 시각을 입력하면 사이트에 표시됩니다.",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "sentenceOfTheDay" },
  },
});
