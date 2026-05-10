import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/admin")}`);
  }

  return (
    <div className="container-page mt-10 mb-24">
      <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-eyebrow text-accent">Operator Dashboard</p>
          <h1 className="mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-tighter md:text-[44px]">
            Admin
          </h1>
        </div>
        <nav className="flex gap-4 text-meta">
          <Link href="/admin" className="hover:text-accent">
            Overview
          </Link>
          <Link href="/admin/members" className="hover:text-accent">
            Members
          </Link>
          <Link
            href="/studio"
            className="hover:text-accent"
            target="_blank"
            rel="noreferrer"
          >
            Studio ↗
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
