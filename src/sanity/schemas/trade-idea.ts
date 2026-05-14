import { defineField, defineType } from "sanity";

/**
 * Trade Idea — "오늘 바로 따라할 수 있는 매매 셋업" 카드.
 * Plan Part C Phase 2 (옵션 1).
 *
 * macro 데일리 글의 meta.tradeSetup 슬롯을 대체하는 1급 콘텐츠 타입.
 * 분리 이유:
 * - 시황 글 발행 빈도와 실제 매매 셋업 빈도는 다름
 * - 결과 추적(승/패/PnL)을 위해 자체 상태 머신 필요
 * - /today 보드에서 활성/만료/체결 카드를 한곳에 모아 보여줌
 */
export const tradeIdeaType = defineType({
  name: "tradeIdea",
  title: "오늘의 셋업",
  type: "document",
  fields: [
    // ── 식별 ─────────────────────────────────────────────
    defineField({
      name: "title",
      title: "제목",
      description:
        '자동 생성 권장: "BTCUSDT Long · 67,000 진입 (200DMA 풀백)" 형식. 비우면 라이터가 채움.',
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
      name: "publishedAt",
      title: "발행 시각",
      type: "datetime",
      validation: (r) => r.required(),
    }),

    // ── 상태 머신 ────────────────────────────────────────
    defineField({
      name: "status",
      title: "상태",
      description:
        "draft → active → (expired | triggered_tp | triggered_sl | manually_closed). 한 번만 active 노출.",
      type: "string",
      options: {
        list: [
          { title: "초안 (draft)", value: "draft" },
          { title: "활성 (active) — /today에 노출", value: "active" },
          { title: "만료 (expired) — validUntil 지남", value: "expired" },
          { title: "익절 체결 (triggered_tp)", value: "triggered_tp" },
          { title: "손절 체결 (triggered_sl)", value: "triggered_sl" },
          { title: "수동 마감 (manually_closed)", value: "manually_closed" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (r) => r.required(),
    }),

    // ── 셋업 본체 ────────────────────────────────────────
    defineField({
      name: "symbol",
      title: "심볼",
      description: '예: "BTCUSDT", "ETHUSDT", "SOLUSDT"',
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "direction",
      title: "방향",
      type: "string",
      options: {
        list: [
          { title: "Long (롱)", value: "Long" },
          { title: "Short (숏)", value: "Short" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "entry",
      title: "진입가",
      type: "number",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "stopLoss",
      title: "손절가",
      description: "필수 — 손절 없는 셋업은 게시 X (voice-guide §6 trade idea 룰)",
      type: "number",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "takeProfits",
      title: "익절가 (1차/2차/3차)",
      description:
        "최대 3개. 첫 항목이 1차 익절(주 노출). 비워도 게시 가능하지만 권장.",
      type: "array",
      of: [{ type: "number" }],
      validation: (r) => r.max(3),
    }),
    defineField({
      name: "rr",
      title: "R:R 배수",
      description:
        "리스크 1 대비 리워드. 비우면 (entry, stopLoss, 첫 takeProfit)으로 자동 계산하는 헬퍼 사용.",
      type: "number",
    }),
    defineField({
      name: "validUntil",
      title: "유효기한 (KST)",
      description: "이 시각 지나면 status를 expired로 자동 전환 (UI 표시 기준)",
      type: "datetime",
    }),

    // ── 근거 / 무효화 ────────────────────────────────────
    defineField({
      name: "thesis",
      title: "한 줄 근거",
      description: "1~2문장. 카드 본문 첫 줄.",
      type: "text",
      rows: 2,
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: "thesisLong",
      title: "상세 근거 (Markdown, 선택)",
      description:
        "/today/[slug] 상세 페이지에 표시. 카드만 보여줄 거면 비워도 됨.",
      type: "text",
      rows: 12,
    }),
    defineField({
      name: "invalidationCondition",
      title: "무효화 조건",
      description: '예: "1H 종가가 67,200 아래로 마감 시 무효". 필수.',
      type: "string",
      validation: (r) => r.required(),
    }),

    // ── 연관 글 ─────────────────────────────────────────
    defineField({
      name: "relatedMacroPost",
      title: "연관 macro 글 (선택)",
      description:
        "이 셋업이 나온 그날의 시황 글 참조. /today 카드에서 '관련 시황 →' 링크로 노출.",
      type: "reference",
      to: [{ type: "post" }],
      options: {
        filter: 'category->slug.current == "macro"',
      },
    }),

    // ── 결과 추적 (마감 후) ──────────────────────────────
    defineField({
      name: "result",
      title: "결과 (마감 후 채움)",
      description: "status가 triggered_* 또는 manually_closed 일 때만 의미",
      type: "object",
      fields: [
        {
          name: "closedAt",
          title: "마감 시각",
          type: "datetime",
        },
        {
          name: "closedPrice",
          title: "마감가",
          type: "number",
        },
        {
          name: "outcome",
          title: "결과",
          type: "string",
          options: {
            list: [
              { title: "승 (win)", value: "win" },
              { title: "패 (loss)", value: "loss" },
              { title: "본전 (breakeven)", value: "breakeven" },
            ],
          },
        },
        {
          name: "pnlR",
          title: "PnL (R 단위)",
          description: '예: 익절가 도달 = +1.5R, 손절 = -1.0R',
          type: "number",
        },
        {
          name: "notesAfter",
          title: "회고 메모 (선택)",
          description: "왜 잘 됐는지/안 됐는지 한 줄. 누적되면 나중에 분석 가능.",
          type: "text",
          rows: 3,
        },
      ],
    }),

    // ── 시스템 ─────────────────────────────────────────
    defineField({
      name: "tags",
      title: "태그",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
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
  ],
  orderings: [
    {
      title: "발행일 (최신순)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "상태 (활성 우선)",
      name: "statusFirst",
      by: [
        { field: "status", direction: "asc" },
        { field: "publishedAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      symbol: "symbol",
      direction: "direction",
      status: "status",
    },
    prepare({ title, symbol, direction, status }) {
      const dot =
        status === "active"
          ? "🟢"
          : status === "expired"
            ? "⏰"
            : status === "triggered_tp"
              ? "✅"
              : status === "triggered_sl"
                ? "❌"
                : status === "manually_closed"
                  ? "⚪"
                  : "📝";
      return {
        title: title || `${symbol} ${direction}`,
        subtitle: `${dot} ${status} · ${symbol} ${direction}`,
      };
    },
  },
});
