import Link from "next/link";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "xl";

const sizeClass: Record<Size, string> = {
  sm: "text-[28px] leading-none",
  md: "text-[56px] leading-[0.95]",
  xl: "text-[clamp(40px,9vw,96px)] leading-[0.95]",
};

export function WordMark({
  size = "md",
  asLink = false,
  className,
}: {
  size?: Size;
  asLink?: boolean;
  className?: string;
}) {
  const inner = (
    <span
      className={cn(
        "font-display font-black uppercase tracking-tightest",
        sizeClass[size],
        className,
      )}
    >
      VICTOR <span className="italic font-extrabold">ALPHA</span>
    </span>
  );
  if (asLink) {
    return (
      <Link href="/" aria-label="Victor Alpha — 홈" className="inline-block">
        {inner}
      </Link>
    );
  }
  return inner;
}
