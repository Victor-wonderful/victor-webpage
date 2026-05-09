import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "프로젝트 검증 체크리스트 — 방법론·근거",
  description:
    "Victor Alpha 프로젝트 검증 체크리스트 35문항 7축의 출처와 근거. a16z, Messari, Token Terminal, Paradigm, Polychain 등 기관 프레임의 합성·압축본.",
};

export default function MethodologyPage() {
  return (
    <article className="container-prose mt-12 mb-24">
      <Link
        href="/tools/project-checklist"
        className="text-meta text-fg-muted hover:text-accent"
      >
        ← 체크리스트로 돌아가기
      </Link>

      <p className="mt-6 text-eyebrow text-accent">Methodology</p>
      <h1 className="mt-3 break-keep font-display text-[40px] font-extrabold leading-[1.2] md:text-[48px] md:leading-[1.15]">
        체크리스트 35문항의 근거
      </h1>
      <p className="mt-2 font-mono text-meta text-fg-muted">
        v1.1 · 2026-05-08 · 7 axes · 35 questions
      </p>

      <p className="mt-6 break-keep font-serif-body text-[17px] leading-[1.75] text-fg">
        본 체크리스트는 <strong>단일 권위 소스에서 그대로 가져온 것이 아니라</strong>,
        주요 크립토 VC와 리서치 기관의 공개 프레임을 합성·압축한 결과입니다. 각
        축이 어디서 왔는지, 임계값의 근거는 무엇인지 솔직히 공개합니다.
      </p>

      {/* Sources ─────────────────────────────────────── */}
      <section className="mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          1차 참고 프레임
        </h2>
        <ul className="mt-6 space-y-5 break-keep font-serif-body text-[16px] leading-[1.7] text-fg">
          <li>
            <p>
              <strong>a16z crypto</strong> —{" "}
              <a
                href="https://a16zcrypto.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                a16zcrypto.com
              </a>
            </p>
            <p className="mt-1 text-[15px] text-fg-muted">
              <em>How to Win the Future</em> (Chris Dixon),{" "}
              <em>Token Launch Best Practices</em> (Miles Jennings, Eddy
              Lazzarin), <em>Tokenomics for Crypto Founders</em>. Founder/Team
              비중·베스팅 임계값의 사실상 표준.
            </p>
          </li>
          <li>
            <p>
              <strong>Messari Pro Research</strong> —{" "}
              <a
                href="https://messari.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                messari.io
              </a>
            </p>
            <p className="mt-1 text-[15px] text-fg-muted">
              Pro Report 표준 구조(Investment Thesis · Token Model · Financial
              Statements · Governance · Risk Factors)가 본 체크리스트 정성
              평가의 골격입니다.
            </p>
          </li>
          <li>
            <p>
              <strong>Token Terminal</strong> —{" "}
              <a
                href="https://tokenterminal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                tokenterminal.com
              </a>
            </p>
            <p className="mt-1 text-[15px] text-fg-muted">
              P/F·P/S·NVT·Fee-to-Revenue 같은 정량 비율 표준. <em>정량 지표</em>{" "}
              축 5문항의 직접 근거.
            </p>
          </li>
          <li>
            <p>
              <strong>Paradigm Research</strong> —{" "}
              <a
                href="https://www.paradigm.xyz/research"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                paradigm.xyz/research
              </a>
            </p>
            <p className="mt-1 text-[15px] text-fg-muted">
              메커니즘 디자인 게임이론 분석. <em>Ethereum is a Dark Forest</em>{" "}
              (MEV), Uniswap V3 백서 등. 메커니즘·실효성 축의 기준점.
            </p>
          </li>
          <li>
            <p>
              <strong>Multicoin Capital</strong> —{" "}
              <a
                href="https://multicoin.capital"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                multicoin.capital
              </a>
            </p>
            <p className="mt-1 text-[15px] text-fg-muted">
              <em>Mega Thesis</em>: Programmable Money / Open Finance / Web3.
              Network Value Capture·Monetary Premium 평가축.
            </p>
          </li>
          <li>
            <p>
              <strong>Polychain · Pantera · Dragonfly</strong>
            </p>
            <p className="mt-1 text-[15px] text-fg-muted">
              펀더 트랙 레코드·코어 팀 다양성·VC 라인업 평가 기준. 각 펀드의
              포트폴리오 회사 공시 자료에서 패턴 추출.
            </p>
          </li>
          <li>
            <p>
              <strong>BlockScience · Token Engineering Commons</strong> —{" "}
              <a
                href="https://block.science"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                block.science
              </a>
            </p>
            <p className="mt-1 text-[15px] text-fg-muted">
              Cadcad 시뮬레이션·메커니즘 수학적 검증. 메커니즘 buzzword vs
              실작동 구분 기준.
            </p>
          </li>
          <li>
            <p>
              <strong>L2Beat · DefiLlama · CertiK · Trail of Bits ·
              SlowMist</strong>
            </p>
            <p className="mt-1 text-[15px] text-fg-muted">
              온체인 데이터·보안 감사 표준. 외부 감사 보고서·TVL·시퀀서 리스크
              평가의 1차 자료.
            </p>
          </li>
          <li>
            <p>
              <strong>한국 자본시장법 · 특정금융정보법</strong>
            </p>
            <p className="mt-1 text-[15px] text-fg-muted">
              한국 거주자 대상 영업 시 회색지대 평가. 규제·리스크 공시 축의 한국
              특수 항목.
            </p>
          </li>
        </ul>
      </section>

      {/* Threshold rationale ─────────────────────────── */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          주요 임계값의 근거
        </h2>

        <div className="mt-6 space-y-6 break-keep font-serif-body text-[16px] leading-[1.75] text-fg">
          <div>
            <h3 className="font-display text-xl font-bold">
              Founder/Team 합산 25% 이하
            </h3>
            <p className="mt-2 text-fg-muted">
              근거: a16z <em>Token Launch Best Practices</em>, 2022~2024 메이저
              토큰(BTC·ETH·SOL·UNI·AAVE) 데이터에서 인사이더 합산 25% 미만이
              장기 회복력과 양의 상관. 휴리스틱이며 정량 백테스트 결과는 아님.
            </p>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold">
              Founder 베스팅 6개월 클리프 + 36개월+ 선형
            </h3>
            <p className="mt-2 text-fg-muted">
              근거: 2022 cliff 대란(Wonderland·Solend 등) 이후 업계 사실상 표준.
              Polygon·Arbitrum·Optimism 같은 메이저 L2의 실제 베스팅 일정과
              일치.
            </p>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold">P/F · 시총/TVL 범위</h3>
            <p className="mt-2 text-fg-muted">
              근거: Token Terminal 2024~2026 섹터별 평균 데이터. L1 P/F ~30~80배,
              DeFi P/F ~10~30배. 시총/TVL 1~3배 범위는 DefiLlama가 발표하는
              섹터 평균에 기반.
            </p>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold">
              FDV / 시총 3배 이내
            </h3>
            <p className="mt-2 text-fg-muted">
              근거: 2024 &ldquo;Low Float, High FDV&rdquo; 이슈 이후 업계 논의.
              FDV 대비 유통률 1/3 이상이 시장 흡수력 기준점이라는 관찰. Maven
              11·Multicoin·DeFiance 등 다수 펀드의 공개 코멘트 종합.
            </p>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold">
              Top 10 지갑 30% 이하
            </h3>
            <p className="mt-2 text-fg-muted">
              근거: Etherscan/Solscan Holders 통계의 일반 분포. 거래소·브릿지
              컨트랙트는 제외. 30% 초과는 디플레이 위험 + 거버넌스 집중 신호.
            </p>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold">
              일평균 거래량 / 시총 ≥ 2%
            </h3>
            <p className="mt-2 text-fg-muted">
              근거: CoinGecko 메이저 토큰의 평균 회전율. 2% 미만이면 슬리피지
              비용이 P/F·NVT 비율을 의미 있게 깎습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Limitations ─────────────────────────────────── */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          이 프레임의 한계
        </h2>
        <ul className="mt-6 space-y-4 break-keep font-serif-body text-[16px] leading-[1.7] text-fg">
          <li>
            <strong>정량 백테스트 부재.</strong> 35문항 점수와 1년 후 가격 사이의
            회귀분석을 한 적 없습니다. 합리적 휴리스틱의 조합이며, 정밀 모델이
            아닙니다.
          </li>
          <li>
            <strong>임계값이 일률적.</strong> Layer 1·Layer 2·DeFi·RWA·Memecoin을
            같은 기준(25%·30%)으로 평가합니다. 자산 클래스별 분기 기준은 v2에서
            도입 예정.
          </li>
          <li>
            <strong>Yes/No 이분법.</strong> &ldquo;거의 충족&rdquo;과 &ldquo;완전
            미충족&rdquo;이 같은 No로 처리됩니다. 0~3점 가중치 도입은 v2 검토
            중.
          </li>
          <li>
            <strong>5축 가중 동등.</strong> 메커니즘·실효성이 토크노믹스보다 더
            결정적일 수 있는데 1점=1점으로 동일 처리. 축 가중치 도입은 데스크
            경험 검증 후 적용 예정.
          </li>
          <li>
            <strong>시간 축 누락.</strong> TGE 직전과 1년 후는 같은 항목이라도
            의미가 다른데 시점 보정 없음. 케이스별 해석 권장.
          </li>
          <li>
            <strong>Comparable analysis 없음.</strong> 동일 섹터 평균 대비
            상대값을 자동 보여주지 않습니다. 사용자가 같은 프레임으로 3개 이상
            적용해 비교해야 의미가 누적됩니다.
          </li>
        </ul>
      </section>

      {/* Versioning ───────────────────────────────────── */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          버전 이력
        </h2>
        <ul className="mt-6 space-y-3 break-keep font-mono text-[14px] leading-[1.7] text-fg">
          <li>
            <strong>v1.1</strong> — 2026-05-08 · 정량 지표 5문항 + 펀더 트랙 5문항
            추가 (25 → 35). 등급 기준 % 비례로 자동 조정.
          </li>
          <li>
            <strong>v1.0</strong> — 2026-05-08 · 5축 25문항 초기 공개.
          </li>
        </ul>
      </section>

      {/* Disclaimer */}
      <section className="mt-12 rounded-md border border-border bg-surface p-5">
        <p className="text-eyebrow text-accent">Disclaimer</p>
        <p className="mt-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
          본 프레임과 등급 산출은 정보·교육·자가 평가 목적이며, 투자 자문이
          아닙니다. 외부 기관 자료 인용은 해당 기관의 입장을 대변하지 않으며
          본 사이트의 자체 해석입니다. 모든 투자 결정과 결과는 본인의 책임입니다.
        </p>
      </section>

      <div className="mt-12">
        <Link
          href="/tools/project-checklist"
          className="rounded-full border border-ink px-5 py-2.5 text-pill text-fg hover:border-accent hover:text-accent"
        >
          ← 체크리스트로
        </Link>
      </div>
    </article>
  );
}
