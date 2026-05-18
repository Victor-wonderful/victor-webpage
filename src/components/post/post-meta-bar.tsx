import type { Post } from "@/lib/posts";
import type { CategorySlug } from "@/lib/categories";

/**
 * PostMetaBar — 글 상단 한 줄 메타바.
 *
 * Voice Guide §0.5 (독자 계층) 시각화:
 *   ⭐ 입문 · 5분 · 사전지식 없음
 *   ⭐⭐⭐ 중급 · 12분 · 사전지식: RSI · 이동평균
 *
 * 표시 규칙:
 * - basics: 항상 표시 (level/readMinutes/prerequisites 모두 default 가능)
 * - 그 외: meta.level 또는 meta.prerequisites 또는 meta.readMinutes 가 있을 때만 표시
 *
 * 본문 안의 TypedMetaBlock 과는 역할 분리:
 * - PostMetaBar = 헤더 한 줄, "들어가도 되겠는가" 즉시 판단용
 * - TypedMetaBlock = 본문 진입 직전, 카테고리별 상세 메타 패널
 */

type LooseMeta = Record<string, string | number | undefined>;

const LEVEL_RANK: Record<string, { stars: string; label: string }> = {
  "입문": { stars: "⭐", label: "입문" },
  "초급": { stars: "⭐", label: "초급" },
  "기초": { stars: "⭐", label: "기초" },
  "중급": { stars: "⭐⭐", label: "중급" },
  "고급": { stars: "⭐⭐⭐", label: "고급" },
  "심화": { stars: "⭐⭐⭐", label: "심화" },
};

function resolveLevel(
  category: CategorySlug,
  meta: LooseMeta,
): { stars: string; label: string } | null {
  const raw = (meta.level ?? meta.difficulty) as string | undefined;
  if (raw && LEVEL_RANK[raw]) return LEVEL_RANK[raw];
  if (raw) return { stars: "⭐⭐", label: raw };

  // 카테고리 기본 추정
  if (category === "learn") return LEVEL_RANK["입문"];
  if (category === "basics") return LEVEL_RANK["초급"]; // 월가의 전설(책 연재) — 입문~초급
  if (category === "macro") return LEVEL_RANK["초급"];
  if (category === "market") return LEVEL_RANK["중급"];
  if (category === "strategy" || category === "tokens" || category === "pinescript") {
    return LEVEL_RANK["중급"];
  }
  return null;
}

export function PostMetaBar({ post }: { post: Post }) {
  const meta: LooseMeta = (post.meta ?? {}) as LooseMeta;
  const category = post.category;

  const level = resolveLevel(category, meta);
  const readMinutes = meta.readMinutes ? `${meta.readMinutes}분` : null;
  const prereqRaw = meta.prerequisites;
  const prerequisites =
    typeof prereqRaw === "string"
      ? prereqRaw.trim() || undefined
      : Array.isArray(prereqRaw) && prereqRaw.length > 0
        ? prereqRaw.map(String).join(" · ")
        : undefined;

  // basics(월가의 전설) / learn(입문 가이드) 외 카테고리는 메타가 비면 표시하지 않음
  const hasAnyMeta = level || readMinutes || prerequisites;
  const isAlwaysShown = category === "basics" || category === "learn";
  if (!isAlwaysShown && !hasAnyMeta) return null;

  // 항상 노출 카테고리는 default fallback 보장
  const finalLevel = level ?? LEVEL_RANK["입문"];
  const finalReadMinutes = readMinutes ?? (isAlwaysShown ? "5분" : null);
  const finalPrereq =
    prerequisites ?? (isAlwaysShown ? "사전지식 없음" : null);

  return (
    <div
      className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-meta text-fg-muted"
      aria-label="글 난이도 및 사전지식"
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-surface-warm px-2.5 py-1 font-medium text-fg">
        <span aria-hidden>{finalLevel.stars}</span>
        <span>{finalLevel.label}</span>
      </span>
      {finalReadMinutes && (
        <span className="inline-flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <span>{finalReadMinutes}</span>
        </span>
      )}
      {finalPrereq && (
        <span className="inline-flex items-center gap-1.5">
          <span className="text-fg-muted">사전지식</span>
          <span className="font-medium text-fg">{finalPrereq}</span>
        </span>
      )}
    </div>
  );
}
