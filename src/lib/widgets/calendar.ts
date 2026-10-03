// Macro calendar — manually curated. Update monthly.
// Event types we track: FOMC, CPI, PPI, Unemployment (NFP/실업률/주간 청구건수)
//
// All times in KST (Asia/Seoul). Dates are ISO with +09:00.
// Sources for scheduling: BLS release schedule, FOMC official meeting calendar.

export type MacroEvent = {
  /** ISO datetime in KST, e.g. 2026-05-13T21:30:00+09:00 */
  startsAt: string;
  /** Korean label */
  title: string;
  /** Short type tag */
  kind: "FOMC" | "CPI" | "PPI" | "고용" | "PCE" | "경기";
  /** Impact level */
  impact: "high" | "med";
  /** Optional consensus / previous note */
  note?: string;
};

// Edit this list each month. Last updated: 2026-10-03 (adds Oct–Dec 2026 events).
// 9/17 이후 일정이 없어 홈 위젯이 2주간 빈 칸으로 노출됐다(10/3 발견). 남은 일정이
// RUNWAY_WARN_DAYS 이하로 줄면 서버 로그 경고 + daily-brief 경고가 뜬다.
// Date sources (2026-10-03 확인): BLS schedule — 고용 10/2·11/6·12/4, CPI 10/14·11/10·12/10,
// PPI 10/15·11/13·12/15 / BEA schedule — PCE(개인소득·지출) 10/29·11/25·12/23 /
// FOMC official calendar — 10/27~28, 12/8~9(점도표 포함).
// Times: 미국 서머타임 종료 11/1(일) 기준으로 KST 환산이 바뀐다.
//   ~10/31 (EDT): 8:30 AM ET = 21:30 KST · 2:00 PM ET = 익일 03:00 KST
//   11/1~ (EST): 8:30 AM ET = 22:30 KST · 2:00 PM ET = 익일 04:00 KST
export const MACRO_EVENTS: MacroEvent[] = [
  {
    startsAt: "2026-07-02T21:30:00+09:00",
    title: "美 6월 비농업 고용 · 실업률 (NFP)",
    kind: "고용",
    impact: "high",
    note: "독립기념일 휴장 앞두고 하루 앞당김 · 예상 +10만~11.5만 / 실업률 4.3%",
  },
  {
    startsAt: "2026-07-09T21:30:00+09:00",
    title: "美 주간 신규 실업수당 청구건수",
    kind: "고용",
    impact: "med",
  },
  {
    startsAt: "2026-07-14T21:30:00+09:00",
    title: "美 6월 소비자물가지수 (CPI)",
    kind: "CPI",
    impact: "high",
  },
  {
    startsAt: "2026-07-15T21:30:00+09:00",
    title: "美 6월 생산자물가지수 (PPI)",
    kind: "PPI",
    impact: "med",
  },
  {
    startsAt: "2026-07-16T21:30:00+09:00",
    title: "美 주간 신규 실업수당 청구건수",
    kind: "고용",
    impact: "med",
  },
  {
    startsAt: "2026-07-23T21:30:00+09:00",
    title: "美 주간 신규 실업수당 청구건수",
    kind: "고용",
    impact: "med",
  },
  {
    startsAt: "2026-07-30T03:00:00+09:00",
    title: "FOMC 7월 금리 결정",
    kind: "FOMC",
    impact: "high",
    note: "7/29 14:00 ET 발표 · 점도표 없음 (SEP는 3·6·9·12월만)",
  },
  {
    startsAt: "2026-08-07T21:30:00+09:00",
    title: "美 7월 비농업 고용 · 실업률 (NFP)",
    kind: "고용",
    impact: "high",
  },
  {
    startsAt: "2026-08-12T21:30:00+09:00",
    title: "美 7월 소비자물가지수 (CPI)",
    kind: "CPI",
    impact: "high",
  },
  {
    startsAt: "2026-08-13T21:30:00+09:00",
    title: "美 7월 생산자물가지수 (PPI)",
    kind: "PPI",
    impact: "med",
  },
  {
    startsAt: "2026-08-17T21:30:00+09:00",
    title: "美 8월 엠파이어스테이트 제조업지수",
    kind: "경기",
    impact: "med",
  },
  {
    startsAt: "2026-08-19T03:00:00+09:00",
    title: "7월 FOMC 의사록",
    kind: "FOMC",
    impact: "high",
    note: "7/29 회의 · 반대표 3인의 인상 주장 강도가 잭슨홀 언어의 하한선을 정한다",
  },
  {
    startsAt: "2026-08-20T21:30:00+09:00",
    title: "美 주간 신규 실업수당 청구건수",
    kind: "고용",
    impact: "med",
  },
  {
    startsAt: "2026-08-21T21:30:00+09:00",
    title: "美 필라델피아 연은 제조업 · 8월 플래시 PMI",
    kind: "경기",
    impact: "med",
    note: "같은 날 잭슨홀 심포지엄 개시",
  },
  {
    startsAt: "2026-08-26T21:30:00+09:00",
    title: "美 7월 개인소비지출 물가 (PCE)",
    kind: "PCE",
    impact: "high",
    note: "7월 PPI 근원(식품·에너지·무역서비스 제외)이 +0.4%로 안 식은 게 부담",
  },
  {
    startsAt: "2026-08-27T21:30:00+09:00",
    title: "美 주간 신규 실업수당 청구건수",
    kind: "고용",
    impact: "med",
  },
  {
    startsAt: "2026-08-28T23:00:00+09:00",
    title: "잭슨홀 — 워시 의장 첫 기조연설",
    kind: "FOMC",
    impact: "high",
    note: "취임 후 첫 잭슨홀 · 정확한 연설 시각은 프로그램 공개 시 갱신",
  },
  {
    startsAt: "2026-09-04T21:30:00+09:00",
    title: "美 8월 비농업 고용 · 실업률 (NFP)",
    kind: "고용",
    impact: "high",
  },
  {
    startsAt: "2026-09-17T03:00:00+09:00",
    title: "FOMC 9월 금리 결정",
    kind: "FOMC",
    impact: "high",
    note: "9/16 14:00 ET 발표 · 점도표(SEP) 포함",
  },
  {
    startsAt: "2026-10-14T21:30:00+09:00",
    title: "美 9월 소비자물가지수 (CPI)",
    kind: "CPI",
    impact: "high",
  },
  {
    startsAt: "2026-10-15T21:30:00+09:00",
    title: "美 9월 생산자물가지수 (PPI)",
    kind: "PPI",
    impact: "med",
  },
  {
    startsAt: "2026-10-29T03:00:00+09:00",
    title: "FOMC 10월 금리 결정",
    kind: "FOMC",
    impact: "high",
    note: "10/28 14:00 ET 발표 · 점도표 없음",
  },
  {
    startsAt: "2026-10-29T21:30:00+09:00",
    title: "美 9월 개인소비지출 물가 (PCE)",
    kind: "PCE",
    impact: "high",
  },
  {
    startsAt: "2026-11-06T22:30:00+09:00",
    title: "美 10월 비농업 고용 · 실업률 (NFP)",
    kind: "고용",
    impact: "high",
    note: "서머타임 종료 — 이날부터 22:30 KST",
  },
  {
    startsAt: "2026-11-10T22:30:00+09:00",
    title: "美 10월 소비자물가지수 (CPI)",
    kind: "CPI",
    impact: "high",
  },
  {
    startsAt: "2026-11-13T22:30:00+09:00",
    title: "美 10월 생산자물가지수 (PPI)",
    kind: "PPI",
    impact: "med",
  },
  {
    startsAt: "2026-11-25T22:30:00+09:00",
    title: "美 10월 개인소비지출 물가 (PCE)",
    kind: "PCE",
    impact: "high",
    note: "추수감사절 연휴 직전",
  },
  {
    startsAt: "2026-12-04T22:30:00+09:00",
    title: "美 11월 비농업 고용 · 실업률 (NFP)",
    kind: "고용",
    impact: "high",
  },
  {
    startsAt: "2026-12-10T04:00:00+09:00",
    title: "FOMC 12월 금리 결정",
    kind: "FOMC",
    impact: "high",
    note: "12/9 14:00 ET 발표 · 점도표(SEP) 포함",
  },
  {
    startsAt: "2026-12-10T22:30:00+09:00",
    title: "美 11월 소비자물가지수 (CPI)",
    kind: "CPI",
    impact: "high",
  },
  {
    startsAt: "2026-12-15T22:30:00+09:00",
    title: "美 11월 생산자물가지수 (PPI)",
    kind: "PPI",
    impact: "med",
  },
  {
    startsAt: "2026-12-23T22:30:00+09:00",
    title: "美 11월 개인소비지출 물가 (PCE)",
    kind: "PCE",
    impact: "high",
  },
];

export type UpcomingEvent = MacroEvent & {
  daysUntil: number; // 0 = today, positive = future
  hourStr: string; // "21:30" KST
  dateStr: string; // "5월 13일 (화)"
};

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DOW = ["일", "월", "화", "수", "목", "금", "토"];

function nowKstStartOfDayMs(): number {
  const nowUtc = Date.now();
  const kstNow = nowUtc + KST_OFFSET_MS;
  return Math.floor(kstNow / 86_400_000) * 86_400_000;
}

/** 남은 일정이 이 일수 이하이면 갱신 경고를 낸다. */
export const RUNWAY_WARN_DAYS = 14;

/** 마지막 등록 일정까지 남은 일수(KST 기준). 음수면 이미 다 지났다. */
export function macroCalendarRunwayDays(): number {
  const lastMs = Math.max(...MACRO_EVENTS.map((e) => new Date(e.startsAt).getTime()));
  const lastDay = Math.floor((lastMs + KST_OFFSET_MS) / 86_400_000) * 86_400_000;
  return Math.round((lastDay - nowKstStartOfDayMs()) / 86_400_000);
}

export function getUpcomingMacroEvents(limit = 6): UpcomingEvent[] {
  const todayKstMs = nowKstStartOfDayMs();
  const runway = macroCalendarRunwayDays();
  if (runway <= RUNWAY_WARN_DAYS) {
    console.warn(
      `[macro-calendar] 남은 일정 ${runway}일 — src/lib/widgets/calendar.ts 갱신 필요`,
    );
  }
  return MACRO_EVENTS.map((e) => {
    const eventMs = new Date(e.startsAt).getTime();
    const eventKstMs = eventMs + KST_OFFSET_MS;
    const eventDay = Math.floor(eventKstMs / 86_400_000) * 86_400_000;
    const daysUntil = Math.round((eventDay - todayKstMs) / 86_400_000);
    const d = new Date(eventMs);
    // Format in KST
    const kst = new Date(d.getTime() + KST_OFFSET_MS);
    const month = kst.getUTCMonth() + 1;
    const day = kst.getUTCDate();
    const dow = DOW[kst.getUTCDay()];
    const hh = String(kst.getUTCHours()).padStart(2, "0");
    const mm = String(kst.getUTCMinutes()).padStart(2, "0");
    return {
      ...e,
      daysUntil,
      hourStr: `${hh}:${mm}`,
      dateStr: `${month}월 ${day}일 (${dow})`,
    };
  })
    .filter((e) => e.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, limit);
}
