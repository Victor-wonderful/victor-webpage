import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "소개",
  description:
    "Victor Alpha는 한국 리테일 트레이더와 입문자를 위한 매거진형 트레이딩 블로그입니다.",
};

export default function AboutPage() {
  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">About</p>
      <h1 className="mt-3 font-display text-[44px] font-extrabold leading-[1.05] tracking-tighter md:text-[56px]">
        Victor Alpha
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        Pine Script로 시작하는 트레이딩 전략과 시장 인사이트, 토큰 트렌드 큐레이션.
      </p>

      <section className="mt-12 space-y-5 font-serif-body text-[18px] leading-[1.7] text-fg">
        <p>
          Victor Alpha는 한국 리테일 트레이더와 트레이딩 입문자를 위해 시작한
          매거진형 블로그입니다. 거래소 차트만 보고 결정하는 시기는 지났습니다.
          <strong>전략·코드·매크로·온체인</strong> 네 축에서 동시에 시장을 보는
          연습이 필요합니다.
        </p>
        <p>
          이 사이트는 매주 다음을 다룹니다.
        </p>
        <ul className="list-disc pl-6">
          <li>
            <strong>트레이딩 전략</strong> — 추세추종·평균회귀·돌파 셋업과 백테스트.
          </li>
          <li>
            <strong>Pine Script</strong> — 지표/전략 코드와 구현 노트.
          </li>
          <li>
            <strong>토큰 트렌드</strong> — 신규 상장·섹터별 자금 흐름.
          </li>
          <li>
            <strong>매크로·시장</strong> — FOMC·CPI·정책 해석과 자산별 시나리오.
          </li>
          <li>
            <strong>입문 가이드</strong> — 차트와 지표를 처음 보는 분들을 위해.
          </li>
        </ul>
      </section>

      <section className="mt-12 border-t border-border pt-10">
        <h2 className="font-display text-3xl font-extrabold tracking-tighter">
          누가 쓰나요
        </h2>
        <p className="mt-4 font-serif-body text-[18px] leading-[1.7] text-fg">
          Victor — Pine Script와 한국 시장을 함께 보는 리테일 트레이더 + AI 에이전트
          기반 백테스트 자동화에 관심이 많습니다. 본 블로그는 본인의 매매 노트와
          학습 기록을 정리한 공간입니다.
        </p>
      </section>

      <section className="mt-12 rounded-md border border-border bg-surface-warm p-6">
        <p className="text-eyebrow text-accent">Disclaimer</p>
        <p className="mt-3 font-serif-body text-[16px] leading-[1.6] text-fg-muted">
          본 블로그의 모든 글은 정보 제공·분석 목적이며, 특정 종목·토큰의 매수·매도
          추천이 아닙니다. 투자 결정과 그에 따른 결과는 본인의 책임입니다. 본 사이트는
          금융투자업·투자자문업으로 등록된 서비스가 아닙니다.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/blog"
          className="rounded-full border border-ink px-5 py-2.5 text-pill text-fg hover:border-accent hover:text-accent"
        >
          전체 글 보기
        </Link>
        <Link
          href="/subscribe"
          className="rounded-full bg-accent px-5 py-2.5 text-pill text-white hover:bg-accent-hover"
        >
          구독하기
        </Link>
      </div>
    </article>
  );
}
