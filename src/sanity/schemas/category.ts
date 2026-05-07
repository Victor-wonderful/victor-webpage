import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "카테고리",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "이름",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "슬러그 (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow (영문 짧은 라벨)",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "설명",
      type: "text",
      rows: 2,
    }),
  ],
});
