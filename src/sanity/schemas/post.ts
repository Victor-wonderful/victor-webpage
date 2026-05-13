import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "포스트",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
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
      name: "summary",
      title: "요약",
      type: "text",
      rows: 2,
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "category",
      title: "카테고리",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "작성자",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "publishedAt",
      title: "발행일",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      title: "태그",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "coverImage",
      title: "커버 이미지",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "content",
      title: "본문 (Markdown)",
      type: "text",
      rows: 30,
      description:
        "마크다운 지원: ## 제목, **굵게**, ```코드```. " +
        "본문 이미지 참조: ![캡션](#1), ![](#2) — 아래 '본문 이미지' 배열의 1번/2번을 가져옴.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bodyImages",
      title: "본문 이미지",
      description:
        "여기에 업로드한 이미지를 본문 마크다운에서 ![캡션](#1), ![](#2) 형식으로 참조하세요. (1번부터 시작)",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "대체 텍스트 (선택)",
              type: "string",
              description: "이미지 설명. 본문에 ![](#N)으로 alt가 비어있을 때 사용됨.",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "attachments",
      title: "첨부 파일",
      description: "PDF, ZIP, 데이터 파일 등. 글 하단에 다운로드 섹션으로 표시됩니다.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "표시 이름",
              type: "string",
              description: '예: "백테스트 결과 PDF", "전략 코드 (Pine v5)"',
              validation: (r) => r.required(),
            },
            {
              name: "file",
              title: "파일",
              type: "file",
              validation: (r) => r.required(),
            },
            {
              name: "description",
              title: "설명 (선택)",
              type: "string",
            },
          ],
          preview: {
            select: { title: "label", subtitle: "description" },
          },
        },
      ],
    }),
    defineField({
      name: "telegramSentAt",
      title: "텔레그램 발송 시각 (시스템)",
      description: "/api/telegram/publish 가 자동 기록. 수동 편집 금지.",
      type: "datetime",
      readOnly: true,
      hidden: ({ document }) => !document?.telegramSentAt,
    }),
    defineField({
      name: "telegramMessageId",
      title: "텔레그램 메시지 ID (시스템)",
      type: "number",
      readOnly: true,
      hidden: ({ document }) => !document?.telegramMessageId,
    }),
    defineField({
      name: "meta",
      title: "타입별 메타 (선택)",
      type: "object",
      description: "카테고리에 따른 추가 메타 데이터",
      fields: [
        { name: "symbol", title: "심볼 (market)", type: "string" },
        { name: "timeframe", title: "타임프레임", type: "string" },
        { name: "sentiment", title: "센티먼트", type: "string" },
        { name: "analysisType", title: "분석유형", type: "string" },
        { name: "strategyType", title: "전략 유형", type: "string" },
        { name: "difficulty", title: "난이도", type: "string" },
        { name: "winRate", title: "승률 (%)", type: "number" },
        { name: "mdd", title: "MDD (%)", type: "number" },
        { name: "level", title: "레벨", type: "string" },
        { name: "readMinutes", title: "읽는 시간 (분)", type: "number" },
        { name: "prerequisites", title: "선수 지식", type: "string" },
        { name: "bookChapter", title: "책 챕터 번호 (basics)", type: "string" },
        { name: "event", title: "이벤트", type: "string" },
        { name: "region", title: "지역", type: "string" },
        { name: "scheduledAt", title: "예정/발표", type: "string" },
        { name: "impact", title: "시장 임팩트", type: "string" },
        { name: "sector", title: "섹터 (tokens)", type: "string" },
        { name: "dataSource", title: "데이터 출처", type: "string" },
        { name: "riskLevel", title: "리스크", type: "string" },
      ],
    }),
  ],
  orderings: [
    {
      title: "발행일 (최신순)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "coverImage" },
  },
});
