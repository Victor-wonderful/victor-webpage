"use client";

import { useState, useTransition } from "react";
import {
  updateNewsletter,
  type NewsletterUpdateState,
} from "@/lib/profile";

type Defaults = {
  newsletter_opt_in: boolean;
  newsletter_channel: "phone" | "telegram" | "";
  phone: string;
  telegram_handle: string;
};

export function SubscribeForm({ defaults }: { defaults: Defaults }) {
  const [state, setState] = useState<NewsletterUpdateState | undefined>();
  const [pending, startTransition] = useTransition();

  const [optIn, setOptIn] = useState(
    defaults.newsletter_opt_in || !defaults.newsletter_channel,
  );
  const [channel, setChannel] = useState<"phone" | "telegram" | "">(
    defaults.newsletter_channel || "telegram",
  );

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const next = await updateNewsletter(state, fd);
          setState(next);
        })
      }
      className="space-y-5"
    >
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="newsletter_opt_in"
          checked={optIn}
          onChange={(e) => setOptIn(e.target.checked)}
          className="mt-1"
        />
        <span className="text-sm font-medium">
          네, Alpha Research를 구독하겠습니다.
        </span>
      </label>

      <div
        className={`space-y-4 border-t border-accent/20 pt-4 transition-opacity ${
          optIn ? "opacity-100" : "pointer-events-none opacity-40"
        }`}
      >
        <p className="text-meta font-medium">
          어디로 받으시겠어요? <span className="text-accent">*</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-bg px-3 py-2 text-sm">
            <input
              type="radio"
              name="newsletter_channel"
              value="telegram"
              checked={channel === "telegram"}
              onChange={() => setChannel("telegram")}
              disabled={!optIn}
            />
            <span>✈️ 텔레그램 (권장)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-bg px-3 py-2 text-sm">
            <input
              type="radio"
              name="newsletter_channel"
              value="phone"
              checked={channel === "phone"}
              onChange={() => setChannel("phone")}
              disabled={!optIn}
            />
            <span>📱 휴대폰</span>
          </label>
        </div>

        {channel === "telegram" && (
          <div>
            <label className="block text-sm font-medium">텔레그램 아이디</label>
            <input
              name="telegram_handle"
              defaultValue={defaults.telegram_handle}
              placeholder="@your_telegram"
              disabled={!optIn}
              className="mt-2 w-full rounded-md border border-ink/30 bg-bg px-3 py-2 disabled:opacity-50"
            />
            <p className="mt-1 text-meta text-fg-muted">
              @를 빼고 입력해도 됩니다.
            </p>
          </div>
        )}

        {channel === "phone" && (
          <div>
            <label className="block text-sm font-medium">휴대폰 번호</label>
            <input
              name="phone"
              inputMode="tel"
              defaultValue={defaults.phone}
              placeholder="010-1234-5678"
              disabled={!optIn}
              className="mt-2 w-full rounded-md border border-ink/30 bg-bg px-3 py-2 disabled:opacity-50"
            />
            <p className="mt-1 text-meta text-fg-muted">
              인증 절차는 없습니다. 정확하게 입력해 주세요.
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "저장 중…" : optIn ? "구독 신청 / 변경" : "구독 해제"}
      </button>

      {state?.ok && (
        <p className="rounded-md border border-accent/30 bg-accent/5 p-3 text-meta">
          ✅ 저장되었습니다.
        </p>
      )}
      {state?.error && (
        <p
          className="rounded-md border border-down/30 bg-down/10 p-3 text-meta text-down"
          role="alert"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}
