"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CATEGORIES } from "@/lib/categories";
import { signupWithEmail, type SignupActionState } from "@/lib/auth-signup";

export function SignupForm() {
  const [state, setState] = useState<SignupActionState | undefined>(undefined);
  const [pending, startTransition] = useTransition();

  const [optIn, setOptIn] = useState(true); // default ON — premium research is the main value prop
  const [channel, setChannel] = useState<"phone" | "telegram" | "">("telegram");
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [age, setAge] = useState(false);
  const allRequiredChecked = terms && privacy && age;

  if (state?.ok) {
    return (
      <div className="rounded-md border border-accent/30 bg-accent/5 p-6">
        <p className="font-serif-body text-base font-bold">
          📧 인증 메일을 보냈습니다
        </p>
        <p className="mt-2 text-meta text-fg-muted">
          <strong>{state.email}</strong> 로 가입 인증 메일을 발송했습니다.
          메일의 링크를 클릭하셔야 가입이 완료됩니다. 그 다음부터는 입력하신
          비밀번호로 바로 로그인하실 수 있습니다.
        </p>
        <p className="mt-2 text-meta text-fg-muted">
          ※ 메일이 안 보이면 스팸함 / 프로모션 탭을 확인해 주세요.
        </p>
      </div>
    );
  }

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const next = await signupWithEmail(state, fd);
          setState(next);
        })
      }
      className="flex flex-col gap-6"
    >
      {/* 닉네임 */}
      <div>
        <label htmlFor="signup-nickname" className="block text-sm font-medium">
          닉네임 <span className="text-accent">*</span>
        </label>
        <input
          id="signup-nickname"
          name="display_name"
          required
          minLength={2}
          maxLength={16}
          placeholder="댓글에 표시될 이름"
          className="mt-2 w-full rounded-md border border-ink/30 bg-bg px-4 py-3 font-serif-body text-base placeholder:text-fg-muted/70 focus:border-accent focus:outline-none"
        />
        <p className="mt-1 text-meta text-fg-muted">2~16자.</p>
      </div>

      {/* 이메일 */}
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium">
          이메일 <span className="text-accent">*</span>
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="mt-2 w-full rounded-md border border-ink/30 bg-bg px-4 py-3 font-serif-body text-base placeholder:text-fg-muted/70 focus:border-accent focus:outline-none"
        />
        <p className="mt-1 text-meta text-fg-muted">
          가입 인증 메일 발송용. 향후 로그인에도 사용됩니다.
        </p>
      </div>

      {/* 비밀번호 */}
      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium">
          비밀번호 <span className="text-accent">*</span>
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          placeholder="8자 이상"
          className="mt-2 w-full rounded-md border border-ink/30 bg-bg px-4 py-3 font-serif-body text-base placeholder:text-fg-muted/70 focus:border-accent focus:outline-none"
        />
        <p className="mt-1 text-meta text-fg-muted">
          8~72자. 영문·숫자·특수문자 조합을 권장합니다.
        </p>
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
              className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-bg px-3 py-2 text-sm"
            >
              <input type="checkbox" name="interests" value={c.slug} />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Alpha Research — 항상 노출, 채널 선택까지 보임 */}
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

        {/* 채널 선택은 항상 노출 — 가치 전달과 정보 일관성 */}
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
              <label className="block text-sm font-medium">
                텔레그램 아이디
              </label>
              <input
                name="telegram_handle"
                placeholder="@your_telegram"
                disabled={!optIn}
                className="mt-2 w-full rounded-md border border-ink/30 bg-bg px-3 py-2 disabled:opacity-50"
              />
              <p className="mt-1 text-meta text-fg-muted">
                @를 빼고 입력해도 됩니다. Victor Alpha 봇이 1:1 메시지로 발송합니다.
              </p>
            </div>
          )}

          {channel === "phone" && (
            <div>
              <label className="block text-sm font-medium">휴대폰 번호</label>
              <input
                name="phone"
                inputMode="tel"
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
      </div>

      {/* 약관 */}
      <fieldset className="space-y-3 rounded-md border border-border bg-bg p-4">
        <legend className="px-1 text-eyebrow text-fg-muted">약관 동의</legend>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="terms"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            <span className="text-accent">[필수]</span>{" "}
            <Link href="/terms" target="_blank" className="underline hover:text-accent">
              이용약관
            </Link>
            에 동의합니다.
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="privacy"
            checked={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            <span className="text-accent">[필수]</span>{" "}
            <Link href="/privacy" target="_blank" className="underline hover:text-accent">
              개인정보처리방침
            </Link>
            에 동의합니다.
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="age"
            checked={age}
            onChange={(e) => setAge(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            <span className="text-accent">[필수]</span> 본인은 만 14세 이상입니다.
          </span>
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={pending || !allRequiredChecked}
        className="rounded-md bg-accent px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "발송 중…" : "가입 인증 메일 받기"}
      </button>

      {state?.error && (
        <p
          className="rounded-md border border-down/30 bg-down/10 px-4 py-2 text-meta text-down"
          role="alert"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}
