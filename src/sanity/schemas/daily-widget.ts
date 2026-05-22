import { defineField, defineType } from "sanity";

/**
 * Daily-rotating home widget. Replaces the always-poll slot.
 * One active widget at a time — fetcher picks the latest by displayDate desc.
 * Each `type` lights up a different subset of fields (see hidden conditions).
 */
export const dailyWidgetType = defineType({
  name: "dailyWidget",
  title: "오늘의 위젯 (홈)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: "type",
      title: "유형",
      type: "string",
      options: {
        list: [
          { title: "투표 (Poll)", value: "poll" },
          { title: "가격 스냅샷 (Price)", value: "price" },
          { title: "오늘의 숫자 (Number)", value: "number" },
          { title: "D-N 카운트다운", value: "dN" },
          { title: "퀴즈 (Quiz)", value: "quiz" },
          { title: "오늘의 차트 (Chart)", value: "chart" },
          { title: "고래 동향 (Whale)", value: "whale" },
          { title: "뉴스 한 줄 (News)", value: "news" },
          { title: "자유 텍스트 (Snippet)", value: "snippet" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subtitle",
      title: "부제 / 한 줄 설명",
      type: "string",
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "body",
      title: "본문 (마크다운)",
      description: "선택. 짧은 컨텍스트나 해석.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA 라벨 (선택)",
      type: "string",
    }),
    defineField({
      name: "ctaHref",
      title: "CTA 링크 (선택)",
      type: "string",
      description: "내부: /blog/... · 외부: https://...",
    }),
    defineField({
      name: "active",
      title: "활성",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "displayDate",
      title: "표시 날짜",
      description:
        "이 날짜에 홈에 노출. 같은 날짜에 여러 개면 가장 최근에 만든 것이 우선.",
      type: "date",
      validation: (r) => r.required(),
    }),

    // ── 유형별 필드 ─────────────────────────────────
    defineField({
      name: "pollRef",
      title: "연결할 투표",
      type: "reference",
      to: [{ type: "poll" }],
      hidden: ({ document }) => document?.type !== "poll",
      description: "type=poll 일 때 기존 poll 문서를 가리킴 (투표 인프라 재사용).",
    }),

    defineField({
      name: "eventName",
      title: "이벤트 이름",
      type: "string",
      hidden: ({ document }) => document?.type !== "dN",
    }),
    defineField({
      name: "eventAt",
      title: "이벤트 일시",
      type: "datetime",
      hidden: ({ document }) => document?.type !== "dN",
    }),

    defineField({
      name: "metric",
      title: "메트릭 (숫자/가격/김프 등)",
      type: "string",
      description:
        '예: "BTC $77,625 · -0.3%" / "김프 +1.8%" / "Funding +0.08%"',
      hidden: ({ document }) =>
        !["price", "number"].includes(document?.type as string),
    }),

    defineField({
      name: "quiz",
      title: "퀴즈",
      type: "object",
      hidden: ({ document }) => document?.type !== "quiz",
      fields: [
        { name: "choices", title: "선택지", type: "array", of: [{ type: "string" }] },
        { name: "answerIndex", title: "정답 인덱스 (0부터)", type: "number" },
        { name: "explanation", title: "해설", type: "text", rows: 3 },
      ],
    }),

    defineField({
      name: "chartImage",
      title: "차트 이미지",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => document?.type !== "chart",
    }),
    defineField({
      name: "chartCaption",
      title: "차트 캡션",
      type: "string",
      hidden: ({ document }) => document?.type !== "chart",
    }),

    defineField({
      name: "whaleAmount",
      title: "이체 규모",
      type: "string",
      description: '예: "$120M USDC → Binance"',
      hidden: ({ document }) => document?.type !== "whale",
    }),
    defineField({
      name: "whaleTxHref",
      title: "트랜잭션 링크 (선택)",
      type: "string",
      hidden: ({ document }) => document?.type !== "whale",
    }),
  ],
  orderings: [
    {
      title: "표시 날짜 (최신순)",
      name: "displayDateDesc",
      by: [{ field: "displayDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "type", date: "displayDate" },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: `[${subtitle}] ${date ?? ""}`,
      };
    },
  },
});
