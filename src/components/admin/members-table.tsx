import Link from "next/link";
import type { MemberListResult } from "@/lib/admin/members";
import { formatDate } from "@/lib/format";

function buildHref(page: number, search: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (search) params.set("q", search);
  const qs = params.toString();
  return qs ? `/admin/members?${qs}` : "/admin/members";
}

export function MembersTable({
  result,
  search,
}: {
  result: MemberListResult;
  search: string;
}) {
  const { rows, page, totalPages, total } = result;

  return (
    <section className="mt-8">
      <form className="mb-4 flex gap-2" method="get">
        <input
          name="q"
          defaultValue={search}
          placeholder="닉네임 검색"
          className="flex-1 rounded-md border border-border bg-surface-warm px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm text-white hover:bg-accent-hover"
        >
          검색
        </button>
        {search && (
          <Link
            href="/admin/members"
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-surface-warm"
          >
            초기화
          </Link>
        )}
      </form>

      <p className="text-meta text-fg-muted">
        총 {total.toLocaleString("ko-KR")}명 · {page} / {totalPages} 페이지
      </p>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-md border border-border bg-surface-warm p-5 text-meta text-fg-muted">
          조건에 맞는 회원이 없습니다.
        </p>
      ) : (
        <div className="mt-4 -mx-4 overflow-x-auto md:mx-0">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-meta text-fg-muted">
                <th className="px-4 py-3 font-medium">회원</th>
                <th className="px-3 py-3 font-medium">이메일</th>
                <th className="px-3 py-3 font-medium">가입일</th>
                <th className="px-2 py-3 text-right font-medium">💬</th>
                <th className="px-2 py-3 text-right font-medium">❤</th>
                <th className="px-2 py-3 text-right font-medium">🔖</th>
                <th className="px-3 py-3 font-medium">뉴스레터</th>
                <th className="px-3 py-3 font-medium">최근 활동</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border align-top hover:bg-surface-warm"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {r.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.avatar_url}
                          alt=""
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-border" aria-hidden />
                      )}
                      <span className="font-medium">
                        {r.display_name ?? r.id.slice(0, 8)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-fg-muted">
                    {r.email ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-fg-muted">
                    {formatDate(r.created_at)}
                  </td>
                  <td className="px-2 py-3 text-right tabular-nums">
                    {r.comments}
                  </td>
                  <td className="px-2 py-3 text-right tabular-nums">{r.likes}</td>
                  <td className="px-2 py-3 text-right tabular-nums">
                    {r.bookmarks}
                  </td>
                  <td className="px-3 py-3 text-meta">
                    {r.newsletter_opt_in ? (
                      <span>
                        <span className="text-fg-muted">
                          {r.newsletter_channel === "phone" ? "📱 " : "✈️ "}
                        </span>
                        {r.newsletter_channel === "phone"
                          ? r.phone ?? "—"
                          : r.telegram_handle ?? "—"}
                      </span>
                    ) : (
                      <span className="text-fg-muted">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-meta text-fg-muted">
                    {r.last_activity ? formatDate(r.last_activity) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between">
          {page > 1 ? (
            <Link
              href={buildHref(page - 1, search)}
              className="rounded-md border border-border px-3 py-2 text-meta hover:bg-surface-warm"
            >
              ← 이전
            </Link>
          ) : (
            <span />
          )}
          {page < totalPages ? (
            <Link
              href={buildHref(page + 1, search)}
              className="rounded-md border border-border px-3 py-2 text-meta hover:bg-surface-warm"
            >
              다음 →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </section>
  );
}
