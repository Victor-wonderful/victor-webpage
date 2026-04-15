import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Victor
        </Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100">
            홈
          </Link>
          <Link href="/blog" className="hover:text-neutral-900 dark:hover:text-neutral-100">
            블로그
          </Link>
        </nav>
      </div>
    </header>
  );
}
