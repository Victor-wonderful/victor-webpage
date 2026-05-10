import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "Victor Alpha 서비스 이용약관.",
};

const EFFECTIVE_DATE = "2026-05-10";

export default function TermsPage() {
  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Terms of Service</p>
      <h1 className="mt-3 font-display text-[32px] font-extrabold leading-[1.05] tracking-tighter md:text-[44px]">
        이용약관
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        시행일: {EFFECTIVE_DATE}
      </p>

      <div className="prose-content mt-10 space-y-8 font-serif-body text-[17px] leading-[1.75]">
        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">제1조 (목적)</h2>
          <p className="mt-3">
            본 약관은 Victor Alpha(이하 &ldquo;회사&rdquo;)가 운영하는 웹사이트(이하
            &ldquo;서비스&rdquo;)의 이용과 관련하여, 회사와 이용자(이하
            &ldquo;회원&rdquo;) 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">제2조 (정의)</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>
              &ldquo;서비스&rdquo;라 함은 회사가 제공하는 암호화폐·트레이딩 관련
              콘텐츠, 댓글·좋아요·북마크 기능, 뉴스레터, 토큰 픽 등 일체의
              온라인 서비스를 말합니다.
            </li>
            <li>
              &ldquo;회원&rdquo;이라 함은 본 약관에 동의하고 서비스에 가입하여
              로그인 후 서비스를 이용하는 자를 말합니다.
            </li>
            <li>
              &ldquo;콘텐츠&rdquo;라 함은 회사 또는 회원이 서비스 내에 게시한
              모든 글·이미지·코드·댓글 등을 말합니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">제3조 (약관의 효력 및 변경)</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>
              본 약관은 서비스 화면에 게시함으로써 효력을 발생합니다.
            </li>
            <li>
              회사는 관계 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며,
              개정 시 시행일 7일 전(회원에게 불리한 변경의 경우 30일 전)에
              서비스 내 공지 또는 이메일로 고지합니다.
            </li>
            <li>
              회원이 개정약관 시행일 이후에도 서비스를 계속 이용하는 경우,
              개정약관에 동의한 것으로 간주합니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">제4조 (회원가입)</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>
              회원가입은 회사가 정한 절차에 따라 본 약관 및 개인정보처리방침에
              동의하고 이메일 또는 소셜 계정(Google 등)을 통해 인증을 완료한
              때에 성립합니다.
            </li>
            <li>
              회원은 만 14세 이상이어야 하며, 만 14세 미만인 경우 가입할 수
              없습니다.
            </li>
            <li>
              회사는 다음 각 호에 해당하는 신청에 대해 가입을 거부하거나 사후에
              계정을 해지할 수 있습니다.
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>실명이 아니거나 타인의 정보를 도용한 경우</li>
                <li>허위 정보를 기재한 경우</li>
                <li>관계 법령 또는 본 약관에 따라 자격이 제한된 경우</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">제5조 (회원의 의무)</h2>
          <p className="mt-3">회원은 다음 행위를 하여서는 안 됩니다.</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>타인의 계정·이메일을 도용하거나 부정 사용하는 행위</li>
            <li>회사 또는 제3자의 지식재산권·명예·신용·재산권을 침해하는 행위</li>
            <li>음란·폭력적·차별적 내용을 게시하는 행위</li>
            <li>스팸·광고·자동화 도구를 이용한 부정 이용 행위</li>
            <li>관계 법령에 위배되는 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">제6조 (서비스의 제공 및 변경)</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>
              회사는 연중무휴 24시간 서비스를 제공하는 것을 원칙으로 하나,
              시스템 점검·천재지변·서비스 안정화 등의 사유로 일시 중단할 수
              있습니다.
            </li>
            <li>
              회사는 운영상·기술상 필요에 따라 서비스의 전부 또는 일부를 변경
              또는 중단할 수 있으며, 이로 인한 회원의 손해에 대해 회사가 고의
              또는 중대한 과실이 있는 경우를 제외하고 책임지지 않습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">제7조 (게시물의 관리)</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>
              회원이 작성한 댓글 등 게시물의 저작권은 회원에게 귀속됩니다. 다만
              회원은 회사에 해당 게시물을 서비스 운영·홍보·개선 목적에 한해
              사용할 수 있는 비독점적·무상의 라이선스를 부여합니다.
            </li>
            <li>
              회사는 다음 게시물에 대해 사전 통지 없이 삭제하거나 비공개
              처리할 수 있습니다.
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>본 약관 제5조의 의무를 위반한 게시물</li>
                <li>관계 법령에 위배되는 게시물</li>
                <li>제3자의 권리를 명백히 침해하는 게시물</li>
                <li>스팸·광고성 게시물</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="rounded-md border border-accent/30 bg-accent/5 p-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            제8조 (투자 정보 면책)
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>
              <strong>
                서비스에 게시된 모든 콘텐츠(시장 분석, 트레이딩 전략, Pine
                Script 코드, 토큰 픽, 백테스트 결과 등)는 정보 제공 목적의
                개인 의견이며, 어떠한 경우에도 매수·매도 권유, 투자 자문,
                금융 상품 추천이 아닙니다.
              </strong>
            </li>
            <li>
              암호화폐 및 디지털 자산은 가격 변동성이 매우 크고 전액 손실
              가능성이 있는 고위험 자산입니다. 모든 투자 결정은 회원 본인의
              판단과 책임 하에 이루어져야 합니다.
            </li>
            <li>
              회사는 자본시장과 금융투자업에 관한 법률에 따른 금융투자업자가
              아니며, 어떠한 형태의 자산 운용·투자 자문·투자 일임 서비스도
              제공하지 않습니다.
            </li>
            <li>
              과거의 백테스트 결과나 차트 분석은 미래 수익을 보장하지 않으며,
              실제 거래 시 슬리피지·수수료·심리적 요인 등으로 결과가 크게
              달라질 수 있습니다.
            </li>
            <li>
              회원이 서비스의 콘텐츠를 참고하여 행한 투자 결과로 발생한 손실에
              대해 회사는 일체의 책임을 지지 않습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">제9조 (회사의 면책)</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>
              회사는 천재지변, 통신장애, 정전, 해킹 등 불가항력적 사유로
              인해 서비스를 제공할 수 없는 경우 책임을 면합니다.
            </li>
            <li>
              회사는 회원의 귀책사유로 인한 서비스 이용 장애에 대해 책임을
              지지 않습니다.
            </li>
            <li>
              회원 간 또는 회원과 제3자 간에 서비스를 매개로 발생한 분쟁에
              대해 회사는 개입할 의무가 없으며, 그 결과에 대해 책임을 지지
              않습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">제10조 (계약 해지 및 탈퇴)</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>
              회원은 언제든지 회원 탈퇴를 신청할 수 있으며, 회사는 관계 법령에
              따라 즉시 처리합니다.
            </li>
            <li>
              회원 탈퇴 시 회원의 게시물(댓글 등)은 익명 처리되거나 삭제될 수
              있습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">제11조 (분쟁 해결 및 관할 법원)</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>본 약관은 대한민국 법령에 따라 해석됩니다.</li>
            <li>
              서비스 이용과 관련하여 회사와 회원 간에 분쟁이 발생할 경우, 양
              당사자는 분쟁의 원만한 해결을 위해 성실히 협의합니다.
            </li>
            <li>
              협의에도 불구하고 분쟁이 해결되지 않을 경우, 민사소송법상의 관할
              법원에 소를 제기할 수 있습니다.
            </li>
          </ol>
        </section>

        <section className="border-t border-border pt-6 text-meta text-fg-muted">
          <p>본 약관은 {EFFECTIVE_DATE}부터 시행됩니다.</p>
        </section>
      </div>
    </article>
  );
}
