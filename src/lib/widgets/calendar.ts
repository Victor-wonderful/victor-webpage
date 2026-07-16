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
  kind: "FOMC" | "CPI" | "PPI" | "고용";
  /** Impact level */
  impact: "high" | "med";
  /** Optional consensus / previous note */
  note?: string;
};

// Edit this list each month. Last updated: 2026-07-16 (adds Aug–Sep 2026 events).
// Date sources: BLS release schedule (7월 CPI=8/12 수, 7월 PPI=8/13 목, 8월 고용=9/4 금),
// FOMC official calendar (9월 회의 9/15~16, 결정 9/16 14:00 ET, 점도표 포함).
// Times: 8:30 AM ET (EDT, UTC-4) = 21:30 KST · 2:00 PM ET = 익일 03:00 KST.
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
    startsAt: "2026-08-20T21:30:00+09:00",
    title: "美 주간 신규 실업수당 청구건수",
    kind: "고용",
    impact: "med",
  },
  {
    startsAt: "2026-08-27T21:30:00+09:00",
    title: "美 주간 신규 실업수당 청구건수",
    kind: "고용",
    impact: "med",
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

export function getUpcomingMacroEvents(limit = 6): UpcomingEvent[] {
  const todayKstMs = nowKstStartOfDayMs();
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
