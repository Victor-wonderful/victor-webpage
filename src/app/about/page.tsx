import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Victor Alpha — 트레이딩 운영체제",
  description:
    "유튜브 시그널을 졸업하고 자기 시스템을 만들고 싶은 한국 리테일 트레이더를 위한 트레이딩 운영체제.",
};

export default function AboutPage() {
  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">About</p>
      <h1 className="mt-3 break-keep text-pretty font-display text-[44px] font-extrabold leading-[1.2] md:text-[56px] md:leading-[1.15]">
        <span className="block">매일 1개의 신호,</span>
        <span className="block">매주 1개의 셋업,</span>
        <span className="block">매월 1단계 성장.</span>
      </h1>
      <p className="mt-6 break-keep text-pretty font-serif-body text-xl italic text-fg-muted">
        Victor Alpha는 한국 리테일 트레이더의 트레이딩 운영체제입니다. 매번 매매 전·후에
        점검하는 &lsquo;트레이딩 데스크&rsquo;를 지향합니다.
      </p>

      {/* WHO ─────────────────────────────────────────────── */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-display text-3xl font-extrabold tracking-tighter">
          누가 이 사이트를 봐야 하나
        </h2>
        <ul className="mt-6 space-y-3 break-keep font-serif-body text-[17px] leading-[1.75] text-fg">
          <li>
            <strong>유튜브·텔레그램 시그널 따라 매매하다 잃어본 사람.</strong> 정보를 더 받는 게
            아니라 자기 결정 프레임을 만들고 싶은 분.
          </li>
          <li>
            <strong>1~3년차 리테일 트레이더.</strong> 입문은 떼었는데 시스템이 없어 매번 같은
            실수를 반복하는 분.
          </li>
          <li>
            <strong>자본 2,000만~5억원 규모.</strong> 한 번의 손실이 회복 가능하지만, 한 번의
            방심이 1년을 후퇴시킬 수 있는 구간.
          </li>
          <li>
            <strong>책 한 권은 읽을 사람.</strong> 30초 콘텐츠가 아닌, 매주 30분 깊이를 받아들일
            준비가 된 분.
          </li>
        </ul>
        <p className="mt-6 break-keep font-serif-body text-[15px] leading-[1.7] text-fg-muted">
          완전 초보라면 <Link href="/category/basics" className="text-accent underline">입문 트랙</Link>
          부터, 전문 트레이더라면 보조 채널로 활용하시면 됩니다.
        </p>
      </section>

      {/* PROMISES ─────────────────────────────────────────── */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-display text-3xl font-extrabold tracking-tighter">
          이 사이트가 약속하는 것
        </h2>
        <ol className="mt-6 space-y-6 break-keep font-serif-body text-[17px] leading-[1.75] text-fg">
          <li>
            <p>
              <span className="font-mono text-[12px] uppercase tracking-wider text-accent">
                01
              </span>
              <strong className="ml-2 font-display text-xl">매일 1개 시장 신호</strong>
            </p>
            <p className="mt-2 text-fg-muted">
              하루 한 페이지로 끝나는 시장 코멘트. BTC·ETH·코스피 흐름 + 봐야 할 레벨 + 다음
              결정을 위한 한 줄. 정보 폭탄이 아닌 한 결정.
            </p>
          </li>
          <li>
            <p>
              <span className="font-mono text-[12px] uppercase tracking-wider text-accent">
                02
              </span>
              <strong className="ml-2 font-display text-xl">
                좋은 프로젝트 가려보는 법
              </strong>
            </p>
            <p className="mt-2 text-fg-muted">
              트레이딩이든 투자든 결국 &ldquo;무엇을 살까&rdquo;가 먼저입니다. 백서·토크노믹스·
              베스팅 일정·메커니즘 실효성을 같은 프레임으로 정량 분해해 좋은 프로젝트와
              위험한 프로젝트를 가려보는 노하우. 한국 미디어가 거의 다루지 않는 영역.
            </p>
            <p className="mt-2 text-[14px] text-fg-muted">
              →{" "}
              <a
                href="/tools/project-checklist"
                className="text-accent underline"
              >
                프로젝트 검증 체크리스트 35문항
              </a>{" "}
              (사용 가능) · 정기 시리즈 <em>프로젝트 X-ray</em> 발행 중
            </p>
          </li>
          <li>
            <p>
              <span className="font-mono text-[12px] uppercase tracking-wider text-accent">
                03
              </span>
              <strong className="ml-2 font-display text-xl">검증된 셋업 라이브러리</strong>
            </p>
            <p className="mt-2 text-fg-muted">
              추세추종·평균회귀·돌파 셋업과 Pine Script 코드. 모든 셋업에 백테스트 수치(승률·MDD)
              공개. &ldquo;어디서 들었는데&rdquo;가 아닌 데이터로 검증된 것만.
            </p>
          </li>
          <li>
            <p>
              <span className="font-mono text-[12px] uppercase tracking-wider text-accent">
                04
              </span>
              <strong className="ml-2 font-display text-xl">자기 진단 도구</strong>
              <span className="ml-2 rounded-full border border-up/40 bg-up/10 px-2 py-0.5 text-[11px] text-up">
                8개 모두 사용 가능
              </span>
            </p>
            <p className="mt-2 text-fg-muted">
              포지션 사이징 계산기, R:R + 손익분기 승률 계산기, 복리 수익률·손실
              회복 계산기, 진입 전 체크리스트 10문항, 프로젝트 검증 체크리스트
              35문항, FOMO·복수매매 감정 진단, 매매 일지 템플릿, 주간 트레이딩
              플랜 — 모두 사용 가능. 글이 아닌 도구를 가져갑니다.
            </p>
            <p className="mt-2 text-[14px] text-fg-muted">
              →{" "}
              <a href="/tools" className="text-accent underline">
                도구함 열기
              </a>
            </p>
          </li>
          <li>
            <p>
              <span className="font-mono text-[12px] uppercase tracking-wider text-accent">
                05
              </span>
              <strong className="ml-2 font-display text-xl">시리즈 학습 트랙</strong>
            </p>
            <p className="mt-2 text-fg-muted">
              <em>월가의 전설 × 크립토</em> — Livermore·Soros·Tudor Jones·Dalio·Druckenmiller의
              원칙을 암호화폐에 적용하는 100편 시리즈. 매주 화·목 발행, 약 12개월 트랙.
            </p>
          </li>
        </ol>

        <div className="mt-8 rounded-md border-l-4 border-accent bg-surface-warm p-5">
          <p className="text-eyebrow text-accent">Victor의 분석 시각</p>
          <p className="mt-2 break-keep font-serif-body text-[15px] leading-[1.7] text-fg">
            기관 데스크에서 자산을 평가할 때 쓰는 프레임을 한국 리테일도 쓸 수 있게 풉니다.
            &ldquo;이 토큰 좋다더라&rdquo;가 아니라 <strong>토크노믹스·메커니즘·리스크를
            같은 프레임으로 매번 분해</strong>하는 습관 — 이게 차별점입니다.
          </p>
        </div>
      </section>

      {/* WHAT WE DON'T DO ─────────────────────────────────── */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-display text-3xl font-extrabold tracking-tighter">
          이 사이트가 약속하지 <em>않는</em> 것
        </h2>
        <p className="mt-4 break-keep font-serif-body text-[15px] leading-[1.7] text-fg-muted">
          무엇을 안 하는지가 무엇을 하는지보다 중요합니다.
        </p>
        <ul className="mt-6 space-y-3 break-keep font-serif-body text-[17px] leading-[1.75] text-fg">
          <li>
            <strong>특정 코인 매수 추천을 하지 않습니다.</strong> 토큰 픽 카드와 분석 글은
            &lsquo;관전 포인트&rsquo;와 &lsquo;트리거&rsquo;를 제시합니다. 매수·매도 결정은
            본인이 합니다.
          </li>
          <li>
            <strong>&ldquo;10배 수익&rdquo; 콘텐츠를 만들지 않습니다.</strong> 그런 글은 인터넷에
            이미 차고 넘칩니다. 살아남는 법이 먼저, 수익은 그 다음.
          </li>
          <li>
            <strong>실시간 단타 시그널을 보내지 않습니다.</strong> 시그널방·리딩방이 아닙니다.
          </li>
          <li>
            <strong>인플루언서·프로젝트 광고를 받지 않습니다.</strong> 분석은 독립적이어야
            가치가 있습니다.
          </li>
          <li>
            <strong>코인니스·코인텔레그래프를 카피하지 않습니다.</strong> 빠른 뉴스는 다른 곳이
            낫습니다. 여기는 &lsquo;뉴스를 어떻게 해석할지&rsquo;를 다룹니다.
          </li>
        </ul>
      </section>

      {/* AUTHOR ───────────────────────────────────────────── */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-display text-3xl font-extrabold tracking-tighter">
          누가 쓰나요
        </h2>

        <p className="mt-6 break-keep font-serif-body text-[17px] leading-[1.75] text-fg">
          <strong>Victor</strong> —{" "}
          <a
            href="https://titantrading.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            Titan Trading
          </a>{" "}
          (titantrading.io) <strong>파운더</strong>.
        </p>

        <ul className="mt-5 space-y-2 break-keep font-serif-body text-[16px] leading-[1.7] text-fg">
          <li>
            <strong>전통 금융 파생상품 딜러</strong> — 수년간 옵션·선물 등 파생상품 데스크에서
            기관 트레이딩 실무 수행.
          </li>
          <li>
            <strong>10여 년 프롭 트레이더</strong> — 자기 자본 기반의 디스크리셔너리 + 시스템
            트레이딩 경력.
          </li>
          <li>
            <strong>5년간 Titan Trading 설립·운영</strong> — 트레이딩 알고리즘과 퀀트 시스템
            연구·구축. 리스크 관리·백테스트·자동매매 인프라 직접 설계.
          </li>
        </ul>

        <p className="mt-6 break-keep font-serif-body text-[17px] leading-[1.75] text-fg">
          전통 금융에서 검증된 원칙을 암호화폐와 한국 시장에 어떻게 적용해야 하는지,
          알고리즘 설계자의 시선으로 풀어 씁니다. 화려한 수익률 인증 대신
          <strong> 시스템·리스크 관리·반복 가능한 프로세스</strong>를 다룹니다.
        </p>

        <p className="mt-4 break-keep font-serif-body text-[17px] leading-[1.75] text-fg">
          이 블로그는 그 과정에서 정리한 매매 노트, 셋업 라이브러리, 체크리스트를 공유하는
          공간입니다. 데스크에서 쌓은 경험을, 같은 길을 시작하는 한국 리테일 트레이더에게.
        </p>

        <div className="mt-6 inline-flex items-center gap-3 rounded-md border border-border bg-surface-warm px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
            Founder
          </p>
          <a
            href="https://titantrading.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[15px] font-bold tracking-tight hover:text-accent"
          >
            Titan Trading ↗
          </a>
        </div>
      </section>

      {/* CTA ──────────────────────────────────────────────── */}
      <section className="mt-14 rounded-md border border-border bg-surface-warm p-8">
        <p className="text-eyebrow text-accent">Get Started</p>
        <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tighter">
          어디서 시작하면 좋을까요
        </h3>
        <ul className="mt-5 space-y-3 break-keep font-serif-body text-[16px] leading-[1.7] text-fg">
          <li>
            <strong>처음이라면</strong> →{" "}
            <Link href="/category/basics" className="text-accent underline">
              입문 트랙 (월가의 전설 × 크립토 시리즈)
            </Link>
          </li>
          <li>
            <strong>당장 매매에 쓰고 싶다면</strong> →{" "}
            <Link href="/category/strategy" className="text-accent underline">
              검증된 트레이딩 전략
            </Link>
          </li>
          <li>
            <strong>매일 시장 톤만 받고 싶다면</strong> →{" "}
            <Link href="/category/market" className="text-accent underline">
              주간마켓인사이트
            </Link>
          </li>
          <li>
            <strong>이번 주 핵심을 메일로</strong> →{" "}
            <Link href="/subscribe" className="text-accent underline">
              주간 브리핑 구독하기
            </Link>
          </li>
        </ul>
      </section>

      {/* DISCLAIMER ───────────────────────────────────────── */}
      <section className="mt-12 rounded-md border border-border bg-surface p-6">
        <p className="text-eyebrow text-accent">Disclaimer</p>
        <p className="mt-3 break-keep font-serif-body text-[15px] leading-[1.6] text-fg-muted">
          본 블로그의 모든 글은 정보 제공·분석 목적이며, 특정 종목·토큰의 매수·매도 추천이
          아닙니다. 투자 결정과 그에 따른 결과는 본인의 책임입니다. 본 사이트는 금융투자업·
          투자자문업으로 등록된 서비스가 아닙니다.
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
          주간 브리핑 받기
        </Link>
      </div>
    </article>
  );
}
