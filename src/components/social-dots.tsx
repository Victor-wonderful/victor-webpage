import Link from "next/link";
import { cn } from "@/lib/cn";

type Item = { href: string; label: string; icon: React.ReactNode };

const TELEGRAM_CHANNEL = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL;
const TELEGRAM_GROUP = process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL;

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
  ...(TELEGRAM_CHANNEL
    ? [
        {
          href: TELEGRAM_CHANNEL,
          label: "Telegram 채널",
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
            </svg>
          ),
        },
      ]
    : []),
  ...(TELEGRAM_GROUP
    ? [
        {
          href: TELEGRAM_GROUP,
          label: "Telegram 토론방",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          ),
        },
      ]
    : []),
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
