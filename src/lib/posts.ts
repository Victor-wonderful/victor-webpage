/**
 * 블로그 포스트 데이터 레이어.
 *
 * 현재: 로컬 목 데이터.
 * 추후: Notion API(@notionhq/client) 또는 Supabase로 이 모듈의 함수 시그니처를
 *       유지한 채 구현체만 교체. 페이지 컴포넌트는 수정 불필요.
 */

export type Post = {
  slug: string;
  title: string;
  summary: string;
  content: string; // 향후 MDX/Notion 블록으로 교체
  publishedAt: string; // ISO 8601
  tags: string[];
  coverEmoji?: string;
};

const POSTS: Post[] = [
  {
    slug: "hello-world",
    title: "Victor 블로그 오픈",
    summary:
      "첫 번째 포스트입니다. 앞으로 개발, 디자인, 트레이딩에 관한 글을 올립니다.",
    publishedAt: "2026-04-15",
    tags: ["공지", "시작"],
    coverEmoji: "👋",
    content: `## 환영합니다

이 블로그는 Next.js 15, Tailwind, 그리고 Claude Code 기반 에이전트 팀으로 구축되었습니다.

### 앞으로 다룰 주제
- 웹 개발 (Next.js / React)
- AI 에이전트 설계
- 트레이딩 자동화

천천히 채워 나가겠습니다.`,
  },
  {
    slug: "agent-team-design",
    title: "Claude Code로 에이전트 팀 구성하기",
    summary:
      "혼합형 팀 구성 — TeamCreate 병렬 리서치와 서브에이전트 호출을 조합한 설계.",
    publishedAt: "2026-04-14",
    tags: ["agents", "claude-code"],
    coverEmoji: "🤖",
    content: `## 왜 혼합형인가

순수 병렬 팀은 조정 비용이, 순수 순차는 병목이 문제입니다.
기획 단계는 병렬, 구현 단계는 메인 + 필요 시 서브에이전트 호출이 실용적입니다.

### 에이전트 역할 분리
- frontend-builder: UI 구현
- ui-reviewer: 리뷰 (읽기 전용)
- backend-integrator: API 연동
- qa-tester: Playwright E2E`,
  },
  {
    slug: "nextjs-15-notes",
    title: "Next.js 15 App Router로 블로그 만들기",
    summary:
      "SSG + ISR 조합으로 Notion 데이터를 캐싱하면서도 즉시 반영되게 하는 패턴.",
    publishedAt: "2026-04-12",
    tags: ["nextjs", "blog"],
    coverEmoji: "⚡",
    content: `## 데이터 소스 추상화

\`src/lib/posts.ts\` 에 함수 시그니처만 고정하고 내부 구현은 자유롭게 교체하는 패턴을 씁니다.

- Phase 1: 목 데이터 (지금)
- Phase 2: Notion API + ISR (revalidate: 60)
- Phase 3: 웹훅으로 on-demand revalidate`,
  },
];

export async function getAllPosts(): Promise<Post[]> {
  return [...POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getAllSlugs(): Promise<string[]> {
  return POSTS.map((p) => p.slug);
}
