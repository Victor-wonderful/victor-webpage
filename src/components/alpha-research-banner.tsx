"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DISMISS_KEY = "va_alpha_research_banner_dismissed_at";
const DISMISS_DAYS = 7;

/**
 * Top-of-page banner shown to logged-in users who haven't subscribed to
 * Alpha Research yet. Dismiss state lives in localStorage with a 7-day TTL.
 *
 * Renders nothing until the dismiss check runs in the browser to avoid
 * flicker for users who already dismissed it.
 */
export function AlphaResearchBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const ageMs = Date.now() - Number(dismissedAt);
        if (ageMs < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
      }
    } catch {
      // localStorage unavailable — show the banner anyway.
    }
    setShow(true);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setShow(false);
  };

  return (
    <div className="border-b border-accent/30 bg-accent/10 px-4 py-3">
      <div className="container-page flex flex-wrap items-center gap-3">
        <p className="flex-1 text-meta">
          <span className="text-eyebrow text-accent">
            Members Only · Premium Research
          </span>
          <span className="ml-3 font-medium">Alpha Research 구독을 시작해 보세요</span>
          <span className="ml-2 text-fg-muted">
            — 회원 전용 리서치를 텔레그램 또는 휴대폰으로 받아보실 수 있습니다.
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/subscribe"
            className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-1.5 text-meta font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            구독 신청 →
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label="배너 닫기"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-accent/10 hover:text-fg"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
