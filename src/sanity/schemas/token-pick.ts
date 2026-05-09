import { defineField, defineType } from "sanity";

/**
 * Token investment pick. A short curated stance card for the home page.
 * NOT for long-form analysis posts — those live as `post` documents with
 * category=tokens (심층분석) and render in the Deep Dives section instead.
 */
export const tokenPickType = defineType({
  name: "tokenPick",
  title: "토큰 픽 — 코어 자산 stance",
  description:
    "BTC·ETH 같은 코어 자산의 stance(Long/Watch/Hold/Avoid) 카드. 짧은 thesis 1~3문장. 활성 카드 3~6개 권장. 본격 분석 글은 여기 말고 [포스트] → 카테고리 [심층분석]에서 작성.",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "프로젝트명",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ticker",
      title: "티커",
      description: "예: BTC, ETH, SOL",
      type: "string",
    }),
    defineField({
      name: "sector",
      title: "섹터",
      description: "예: AI, RWA, DePIN, L2, Meme, Stablecoin",
      type: "string",
    }),
    defineField({
      name: "stance",
      title: "포지션",
      type: "string",
      options: {
        list: [
          { title: "🟢 Long (롱)", value: "long" },
          { title: "🔵 Watch (관찰)", value: "watch" },
          { title: "🟡 Hold (보유)", value: "hold" },
          { title: "🔴 Avoid (회피)", value: "avoid" },
        ],
        layout: "radio",
      },
      initialValue: "watch",
    }),
    defineField({
      name: "thesis",
      title: "투자 논리",
      description: "왜 이 토큰을 추천하는지 1~3문장.",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(400),
    }),
    defineField({
      name: "logo",
      title: "로고 (선택)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "externalLink",
      title: "관련 링크 (공식 사이트, CoinGecko 등)",
      type: "url",
    }),
    defineField({
      name: "active",
      title: "활성",
      description: "비활성화하면 사이트에서 숨겨집니다.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "표시 순서 (낮을수록 위)",
      type: "number",
      initialValue: 100,
    }),
    defineField({
      name: "updatedAt",
      title: "마지막 갱신",
      type: "datetime",
    }),
    defineField({
      name: "disclaimer",
      title: "면책 표시",
      description: "추가 면책 문구 (선택).",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "ticker", media: "logo" },
  },
  orderings: [
    {
      title: "표시 순서",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
