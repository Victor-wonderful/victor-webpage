"use client";

import { useState, useTransition } from "react";
import { CATEGORIES } from "@/lib/categories";
import { submitWelcome, type WelcomeFormState } from "@/lib/profile";

type Defaults = {
  display_name: string;
  interests: string[];
  newsletter_opt_in: boolean;
  newsletter_channel: "phone" | "telegram" | "";
  phone: string;
  telegram_handle: string;
};

export function WelcomeForm({ defaults }: { defaults: Defaults }) {
  const [state, setState] = useState<WelcomeFormState | undefined>(undefined);
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
          const next = await submitWelcome(state, fd);
          setState(next);
        })
      }
      className="mt-8 space-y-8"
    >
      {/* 닉네임 */}
      <div>
        <label className="block text-sm font-medium">
          닉네임 <span className="text-accent">*</span>
        </label>
        <input
          name="display_name"
          defaultValue={defaults.display_name}
          required
          minLength={2}
          maxLength={16}
          placeholder="댓글에 표시될 이름"
          className="mt-2 w-full rounded-md border border-border bg-surface-warm px-3 py-2"
        />
        <p className="mt-1 text-meta text-fg-muted">2~16자.</p>
      </div>

      {/* 관심 분야 */}
      <div>
        <label className="block text-sm font-medium">
          관심 분야 <span className="text-fg-muted">(복수 선택)</span>
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <label
              key={c.slug}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-surface-warm px-3 py-2"
            >
              <input
                type="checkbox"
                name="interests"
                value={c.slug}
                defaultChecked={defaults.interests.includes(c.slug)}
              />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Alpha Research */}
      <div className="rounded-md border-2 border-accent/40 bg-accent/5 p-5">
        <div className="flex items-baseline justify-between">
          <p className="text-eyebrow text-accent">Members Only · Premium Research</p>
          <span className="text-meta text-fg-muted">선택 사항</span>
        </div>
        <h3 className="mt-2 font-display text-xl font-bold tracking-tight">
          Alpha Research 구독
        </h3>
        <p className="mt-2 text-meta leading-[1.7]">
          블로그에 공개되지 않는 <strong>회원 전용 리서치</strong>를
          신청하신 채널로 직접 전달해드립니다. 신규 프로젝트 소개,
          토큰 X-ray, 심층 시장 분석 등 엄선된 콘텐츠로 구성되며,
          주 1~2회 비정기로 발송됩니다.
        </p>

        <label className="mt-4 flex cursor-pointer items-start gap-3">
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
          className={`mt-4 space-y-4 border-t border-accent/20 pt-4 transition-opacity ${
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
                defaultValue={defaults.phone}
                placeholder="010-1234-5678"
                inputMode="tel"
                disabled={!optIn}
                className="mt-2 w-full rounded-md border border-ink/30 bg-bg px-3 py-2 disabled:opacity-50"
              />
              <p className="mt-1 text-meta text-fg-muted">
                인증 절차는 없습니다. 정확하게 입력해 주세요.
              </p>
            </div>
          )}
        </div>
      </div>

      {state?.error && (
        <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-accent px-5 py-3 text-pill text-white hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "저장 중..." : "시작하기"}
      </button>
    </form>
  );
}
