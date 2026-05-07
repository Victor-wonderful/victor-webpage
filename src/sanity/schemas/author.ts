import { defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "작성자",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "이름",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "슬러그",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({
      name: "bio",
      title: "소개",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "avatar",
      title: "프로필 이미지",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
