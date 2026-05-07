import { defineField, defineType } from "sanity";

/**
 * Poll definition. Votes themselves live in Supabase (poll_votes).
 * The poll slug is the cross-system key.
 */
export const pollType = defineType({
  name: "poll",
  title: "투표",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "질문",
      type: "string",
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "slug",
      title: "슬러그 (식별자)",
      description:
        "투표 결과는 이 슬러그로 저장됩니다. 한 번 정하면 가급적 변경하지 마세요.",
      type: "slug",
      options: { source: "question", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "options",
      title: "선택지",
      description: "2~6개 권장.",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.required().min(2).max(6),
    }),
    defineField({
      name: "active",
      title: "활성",
      description: "비활성화하면 사이트에서 숨겨집니다.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "startsAt",
      title: "시작 시각 (선택)",
      type: "datetime",
    }),
    defineField({
      name: "endsAt",
      title: "종료 시각 (선택)",
      description: "지나면 결과만 표시되고 투표 불가.",
      type: "datetime",
    }),
    defineField({
      name: "context",
      title: "보조 설명 (선택)",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "slug.current" },
  },
});
