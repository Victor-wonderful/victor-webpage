export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-neutral-200 py-8 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
      <div className="mx-auto max-w-3xl px-6">
        © {new Date().getFullYear()} Victor. All rights reserved.
      </div>
    </footer>
  );
}
