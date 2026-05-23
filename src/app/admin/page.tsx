import { getAdminUser } from "@/lib/admin/auth";
import {
  getDraftsCount,
  getEngagementCounts,
  getRecentComments,
  getRecentPostsForAdmin,
} from "@/lib/admin/stats";
import {
  getActivityRanking,
  getMemberKpis,
  getRecentSignups,
} from "@/lib/admin/members";
import { getCalendarSlots } from "@/lib/admin/calendar";
import { getTokenPicks } from "@/lib/editorial";
import { KpiCard } from "@/components/admin/kpi-card";
import { ContentCalendar } from "@/components/admin/content-calendar";
import { RecentPostsTable } from "@/components/admin/recent-posts-table";
import { RecentCommentsFeed } from "@/components/admin/recent-comments-feed";
import { RecentSignupsList } from "@/components/admin/recent-signups-list";
import { ActivityRanking } from "@/components/admin/activity-ranking";
import { TokenPicksStatus } from "@/components/admin/token-picks-status";
import { EvaluateTradeIdeasButton } from "@/components/admin/evaluate-trade-ideas-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  // Defense in depth — layout already redirects, but page-level guard prevents
  // accidental data leak if the layout is ever bypassed.
  const user = await getAdminUser();
  if (!user) return null;

  const [
    posts,
    draftsCount,
    calendar,
    picks,
    recentComments,
    memberKpis,
    recentSignups,
    activityRanking,
  ] = await Promise.all([
    getRecentPostsForAdmin(20),
    getDraftsCount(),
    getCalendarSlots({ days: 14, draftLimit: 20 }),
    getTokenPicks(),
    getRecentComments(5),
    getMemberKpis(),
    getRecentSignups(10),
    getActivityRanking(10),
  ]);

  const engagement = await getEngagementCounts(posts.map((p) => p.slug));

  return (
    <div className="mt-8">
      <h2 className="text-eyebrow text-fg-muted">콘텐츠</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="최근 발행" value={posts.length} hint="목록 기준 N" />
        <KpiCard label="Drafts" value={draftsCount} hint="미발행" />
        <KpiCard label="예약 발행" value={calendar.scheduled.length} hint="14일 이내" />
        <KpiCard label="활성 토큰픽" value={picks.length} />
      </div>

      <h2 className="mt-8 text-eyebrow text-fg-muted">회원</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <KpiCard label="총 회원" value={memberKpis.total} />
        <KpiCard label="7일 신규" value={memberKpis.newLast7d} />
        <KpiCard label="7일 활동" value={memberKpis.activeLast7d} hint="댓글·좋아요·북마크 1건+" />
      </div>

      <h2 className="mt-8 text-eyebrow text-fg-muted">뉴스레터 구독</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <KpiCard label="총 구독자" value={memberKpis.newsletterTotal} />
        <KpiCard label="휴대폰" value={memberKpis.newsletterPhone} hint="📱 SMS/알림톡" />
        <KpiCard label="텔레그램" value={memberKpis.newsletterTelegram} hint="✈️ 무료" />
      </div>

      <h2 className="mt-8 text-eyebrow text-fg-muted">운영 도구</h2>
      <EvaluateTradeIdeasButton />

      <ContentCalendar slots={calendar} />

      <RecentPostsTable posts={posts} engagement={engagement} />

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <RecentCommentsFeed comments={recentComments} />
        <RecentSignupsList signups={recentSignups} />
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <TokenPicksStatus picks={picks} />
        <ActivityRanking rows={activityRanking} />
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          href="/admin/members"
          className="rounded-md border border-border px-4 py-2 text-meta hover:bg-surface-warm"
        >
          전체 멤버 보기 →
        </Link>
      </div>
    </div>
  );
}
