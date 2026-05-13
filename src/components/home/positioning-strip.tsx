import Link from "next/link";

/**
 * Home positioning strip — appears above the featured hero.
 * Single-sentence promise + 4 약속 chips so a first-time visitor
 * can answer "what is this site for me" within 5 seconds.
 */
export function PositioningStrip() {
  return (
    <section className="container-page mt-10">
      <div className="rounded-md border border-border bg-surface-warm p-6 md:p-8">
        <div className="flex items-center gap-3">
          <p className="text-eyebrow text-accent">Victor Alpha</p>
          <span className="text-meta text-fg-muted">·</span>
          <p className="font-mono text-[11px] uppercase tracking-wider text-fg-muted">
            by{" "}
            <a
              href="https://titantrading.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:text-accent"
            >
              Titan Trading 파운더
            </a>
          </p>
        </div>
        <h1 className="mt-3 break-keep text-pretty font-display text-[28px] font-extrabold leading-[1.3] md:text-[36px] md:leading-[1.25]">
          <span className="block md:inline">매일 1개의 신호,</span>{" "}
          <span className="block md:inline">매주 1개의 셋업,</span>{" "}
          <span className="block md:inline">매월 1단계 성장.</span>
        </h1>
        <p className="mt-3 break-keep text-pretty font-serif-body text-[15px] leading-[1.7] text-fg-muted md:text-[16px]">
          전통 금융 파생상품 딜러 + 10여 년 프롭 트레이더 경력의 Victor가
          <strong className="font-bold text-fg"> 한국 리테일 트레이더</strong>에게
          전하는 트레이딩 운영체제. 정보를 읽고 끝나는 게 아니라, 매번 매매 전·후에 점검하는 트레이딩 데스크.
        </p>

        <ul className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <li className="rounded border border-border bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-accent">01</p>
            <p className="mt-2 break-keep text-pretty font-display text-[15px] font-bold leading-snug">
              매일 1개 시장 신호
            </p>
            <p className="mt-1 break-keep font-serif-body text-[12px] leading-[1.5] text-fg-muted">
              주간마켓인사이트 — 한 페이지, 한 결정.
            </p>
          </li>
          <li className="rounded border border-border bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-accent">02</p>
            <p className="mt-2 break-keep text-pretty font-display text-[15px] font-bold leading-snug">
              프로젝트 가려보기
            </p>
            <p className="mt-1 break-keep font-serif-body text-[12px] leading-[1.5] text-fg-muted">
              심층분석 +{" "}
              <Link
                href="/tools/project-checklist"
                className="text-accent underline"
              >
                35문항 체크리스트
              </Link>
              .
            </p>
          </li>
          <li className="rounded border border-border bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-accent">03</p>
            <p className="mt-2 break-keep text-pretty font-display text-[15px] font-bold leading-snug">
              검증된 셋업 라이브러리
            </p>
            <p className="mt-1 break-keep font-serif-body text-[12px] leading-[1.5] text-fg-muted">
              실전 운용 셋업과 백테스트 수치를 공개.
            </p>
          </li>
          <li className="rounded border border-border bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-accent">04</p>
            <p className="mt-2 break-keep text-pretty font-display text-[15px] font-bold leading-snug">
              자기 진단 도구
            </p>
            <p className="mt-1 break-keep font-serif-body text-[12px] leading-[1.5] text-fg-muted">
              <Link href="/tools" className="text-accent underline">
                도구 8개
              </Link>{" "}
              모두 사용 가능.
            </p>
          </li>
          <li className="rounded border border-border bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-accent">05</p>
            <p className="mt-2 break-keep text-pretty font-display text-[15px] font-bold leading-snug">
              시리즈 학습 트랙
            </p>
            <p className="mt-1 break-keep font-serif-body text-[12px] leading-[1.5] text-fg-muted">
              월가의 전설 × 크립토 — 100편 시리즈로 시스템 구축.
            </p>
          </li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/about"
            className="text-meta font-medium text-accent hover:text-accent-hover"
          >
            이 사이트가 약속하는 것 →
          </Link>
          <span className="text-meta text-fg-muted">·</span>
          <Link
            href="/category/basics"
            className="text-meta text-fg-muted hover:text-accent"
          >
            입문 트랙 시작하기
          </Link>
          <span className="text-meta text-fg-muted">·</span>
          <Link
            href="/subscribe"
            className="text-meta text-fg-muted hover:text-accent"
          >
            주간 브리핑 받기
          </Link>
        </div>
      </div>
    </section>
  );
}
