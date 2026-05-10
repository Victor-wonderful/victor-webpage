import { getAdminUser } from "@/lib/admin/auth";
import { listMembers } from "@/lib/admin/members";
import { MembersTable } from "@/components/admin/members-table";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const user = await getAdminUser();
  if (!user) return null;

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const search = (sp.q ?? "").trim();

  const result = await listMembers({ page, pageSize: 20, search });

  return (
    <div className="mt-8">
      <h2 className="font-display text-2xl font-bold tracking-tight">All Members</h2>
      <MembersTable result={result} search={search} />
    </div>
  );
}
