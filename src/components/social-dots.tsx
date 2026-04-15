import Link from "next/link";
import { cn } from "@/lib/cn";

type Item = { href: string; label: string; icon: React.ReactNode };

const ITEMS: Item[] = [
  {
    href: "https://twitter.com",
    label: "Twitter",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
        <path d="M18.244 2H21l-6.49 7.41L22 22h-6.844l-4.78-6.262L4.8 22H2l6.948-7.93L2 2h7.018l4.31 5.71L18.244 2zm-1.2 18h1.59L7.05 4H5.36l11.685 16z" />
      </svg>
    ),
  },
  {
    href: "/rss.xml",
    label: "RSS",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
        <path d="M5 3a16 16 0 0116 16h-3A13 13 0 005 6V3zm0 7a9 9 0 019 9h-3a6 6 0 00-6-6v-3zm1 7a2 2 0 110 4 2 2 0 010-4z" />
      </svg>
    ),
  },
  {
    href: "/subscribe",
    label: "Newsletter",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
        <path d="M3 7l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
      </svg>
    ),
  },
];

export function SocialDots({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {ITEMS.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-label={item.label}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover"
          >
            {item.icon}
          </Link>
        </li>
      ))}
    </ul>
  );
}
