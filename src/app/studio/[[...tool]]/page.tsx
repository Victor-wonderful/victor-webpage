/**
 * Studio is currently served via Sanity's hosted environment because
 * @sanity/ui depends on `use-effect-event` which conflicts with React 19's
 * stable build (no `useEffectEvent` export). When Sanity ships a React 19
 * compatible version we'll re-enable the embedded Studio here.
 *
 * For now this route renders a hand-off page with the hosted Studio link.
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const HOSTED_STUDIO = `https://${PROJECT_ID}.sanity.studio/`;
const MANAGE_URL = `https://www.sanity.io/manage/personal/project/${PROJECT_ID}`;

export default function StudioPage() {
  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Studio</p>
      <h1 className="mt-3 font-display text-[44px] font-extrabold leading-[1.05] tracking-tighter md:text-[56px]">
        콘텐츠 편집은 Sanity 호스팅 Studio에서
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        지금은 sanity.io에서 직접 글을 작성·편집하실 수 있습니다.
      </p>

      <section className="mt-10 space-y-6">
        <a
          href={MANAGE_URL}
          target="_blank"
          rel="noreferrer"
          className="block rounded-md border border-border bg-surface-warm p-6 transition-colors hover:border-accent"
        >
          <p className="text-eyebrow text-accent">Sanity Manage</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
            sanity.io/manage 열기 ↗
          </h2>
          <p className="mt-2 font-serif-body text-[15px] leading-[1.6] text-fg-muted">
            프로젝트 설정, CORS, API 토큰, 그리고 데이터셋의 모든 문서를 여기서 관리합니다.
            상단 메뉴의 <strong>“Open Studio”</strong> 버튼을 누르면 호스팅 Studio가 열립니다.
          </p>
        </a>

        <a
          href={HOSTED_STUDIO}
          target="_blank"
          rel="noreferrer"
          className="block rounded-md border border-border p-6 transition-colors hover:border-accent"
        >
          <p className="text-eyebrow text-accent">Hosted Studio</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
            호스팅 Studio 직접 열기 ↗
          </h2>
          <p className="mt-2 font-mono text-[13px] text-fg-muted">
            {HOSTED_STUDIO}
          </p>
          <p className="mt-3 font-serif-body text-[15px] leading-[1.6] text-fg-muted">
            ⚠️ 처음 접속 시 Sanity Manage에서 <strong>“Deploy Studio”</strong> 버튼으로 한 번 배포해야 활성화됩니다.
          </p>
        </a>
      </section>

      <p className="mt-12 text-center font-serif-body text-[14px] text-fg-muted">
        <Link href="/" className="text-accent hover:underline">
          ← 홈으로
        </Link>
      </p>
    </article>
  );
}
