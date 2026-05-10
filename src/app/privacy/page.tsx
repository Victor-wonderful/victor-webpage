import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "Victor Alpha 개인정보처리방침.",
};

const EFFECTIVE_DATE = "2026-05-10";

export default function PrivacyPage() {
  return (
    <article className="container-prose mt-12 mb-24">
      <p className="text-eyebrow text-accent">Privacy Policy</p>
      <h1 className="mt-3 font-display text-[44px] font-extrabold leading-[1.05] tracking-tighter md:text-[56px]">
        개인정보처리방침
      </h1>
      <p className="mt-5 font-serif-body text-xl italic text-fg-muted">
        시행일: {EFFECTIVE_DATE}
      </p>

      <div className="prose-content mt-10 space-y-8 font-serif-body text-[17px] leading-[1.75]">
        <section>
          <p>
            Victor Alpha(이하 &ldquo;회사&rdquo;)는 「개인정보 보호법」 및
            「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관계 법령을
            준수하며, 이용자의 개인정보를 안전하게 보호하기 위해 다음과 같이
            개인정보처리방침을 수립·공개합니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">1. 수집하는 개인정보 항목</h2>
          <p className="mt-3">회사는 다음의 개인정보를 수집합니다.</p>

          <h3 className="mt-4 font-medium">가. 회원가입 시 (필수)</h3>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>이메일 주소</li>
            <li>OAuth 가입 시 제공자가 전달하는 식별자(예: Google 계정 ID)</li>
            <li>닉네임 (가입 직후 입력)</li>
            <li>약관 및 개인정보처리방침 동의 시각</li>
          </ul>

          <h3 className="mt-4 font-medium">
            나. 프리미엄 리서치(애널리스트 리포트·프로젝트 안내 등) 신청 시 (선택)
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>휴대폰 번호 또는 텔레그램 아이디 (둘 중 하나)</li>
            <li>관심 분야</li>
            <li>마케팅 정보 수신 동의 시각</li>
          </ul>

          <h3 className="mt-4 font-medium">다. 서비스 이용 과정에서 자동 생성</h3>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>접속 IP, 쿠키, 접속 일시, 서비스 이용 기록</li>
            <li>댓글·좋아요·북마크 등 활동 기록</li>
            <li>OAuth 제공자가 전달하는 프로필 사진(있는 경우)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">2. 개인정보의 수집·이용 목적</h2>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>회원 식별 및 본인 확인, 서비스 부정 이용 방지</li>
            <li>댓글·좋아요·북마크 기능 제공</li>
            <li>뉴스레터 발송 (신청자에 한함)</li>
            <li>서비스 이용 통계 분석 및 품질 개선</li>
            <li>법령상 의무 이행</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">3. 개인정보의 보유 및 이용 기간</h2>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              <strong>회원 정보:</strong> 회원 탈퇴 시까지. 단, 관계 법령에 따라
              보존이 필요한 경우 해당 기간 동안 보관.
            </li>
            <li>
              <strong>뉴스레터 수신 정보:</strong> 수신 거부 시 즉시 파기.
            </li>
            <li>
              <strong>서비스 이용 기록:</strong> 통신비밀보호법에 따라 최대 3개월.
            </li>
            <li>
              <strong>댓글 등 게시물:</strong> 회원 탈퇴 시 익명 처리 또는 삭제.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">4. 개인정보의 제3자 제공</h2>
          <p className="mt-3">
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만
            다음의 경우에는 예외로 합니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의하거나 수사 목적으로 법령에 정한 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">5. 개인정보 처리의 위탁</h2>
          <p className="mt-3">
            회사는 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁하고
            있습니다.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-meta">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-4 font-medium">수탁자</th>
                  <th className="py-2 pr-4 font-medium">위탁 업무</th>
                  <th className="py-2 font-medium">위치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2 pr-4">Supabase, Inc.</td>
                  <td className="py-2 pr-4">회원 인증, 데이터베이스 호스팅</td>
                  <td className="py-2">미국 / 한국(Seoul Region)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Vercel Inc.</td>
                  <td className="py-2 pr-4">웹사이트 호스팅, 로그 처리</td>
                  <td className="py-2">미국</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Sanity.io</td>
                  <td className="py-2 pr-4">콘텐츠(글) 저장 및 발행 시스템</td>
                  <td className="py-2">미국</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Telegram FZ-LLC</td>
                  <td className="py-2 pr-4">텔레그램 채널/봇을 통한 콘텐츠 발송</td>
                  <td className="py-2">UAE</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-meta text-fg-muted">
            회사는 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행
            목적 외 개인정보 처리 금지, 기술적·관리적 보호조치 등을 계약서에
            명시하고 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">6. 정보주체의 권리·의무 및 행사방법</h2>
          <p className="mt-3">
            이용자는 언제든지 다음의 권리를 행사할 수 있습니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>개인정보 열람·정정·삭제 요구 (회원 프로필 페이지에서 직접 가능)</li>
            <li>처리 정지 요구</li>
            <li>회원 탈퇴 (회원 설정에서 직접 가능)</li>
            <li>뉴스레터 수신 거부 (회원 프로필 또는 발송 메시지의 수신거부 링크)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">7. 개인정보의 안전성 확보 조치</h2>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>비밀번호를 사용하지 않는 매직링크·OAuth 기반 인증으로 비밀번호 유출 위험 최소화</li>
            <li>전송 구간 TLS(HTTPS) 암호화</li>
            <li>데이터베이스 Row-Level Security 적용 (이용자가 자신의 데이터만 조회·수정 가능)</li>
            <li>관리자 페이지 접근 IP 및 계정 화이트리스트 적용</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">8. 쿠키의 사용</h2>
          <p className="mt-3">
            서비스는 로그인 세션 유지 및 사용자 환경 설정을 위해 쿠키를
            사용합니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수
            있으며, 거부 시 일부 서비스 이용에 제한이 있을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">9. 개인정보 보호책임자</h2>
          <p className="mt-3">
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
            처리와 관련한 정보주체의 불만 처리 및 피해구제 등을 위해 아래와
            같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <ul className="mt-3 space-y-1">
            <li>성명: Victor Alpha 운영자</li>
            <li>연락처: cjstkdry@gmail.com</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">10. 권익침해 구제 방법</h2>
          <p className="mt-3">
            개인정보 침해로 인한 신고나 상담이 필요하신 경우 아래 기관에
            문의하실 수 있습니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>개인정보분쟁조정위원회 (privacy.go.kr · 1833-6972)</li>
            <li>개인정보침해신고센터 (privacy.kisa.or.kr · 118)</li>
            <li>대검찰청 사이버수사과 (spo.go.kr · 1301)</li>
            <li>경찰청 사이버수사국 (ecrm.cyber.go.kr · 182)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold tracking-tight">11. 개인정보처리방침의 변경</h2>
          <p className="mt-3">
            본 방침이 변경되는 경우 변경 사항을 시행 7일 전부터 서비스 내
            공지사항을 통해 고지합니다.
          </p>
        </section>

        <section className="border-t border-border pt-6 text-meta text-fg-muted">
          <p>본 개인정보처리방침은 {EFFECTIVE_DATE}부터 시행됩니다.</p>
        </section>
      </div>
    </article>
  );
}
