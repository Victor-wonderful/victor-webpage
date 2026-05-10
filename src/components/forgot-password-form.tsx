"use client";

import { useState, useTransition } from "react";
import {
  requestPasswordReset,
  type ForgotPasswordState,
} from "@/lib/auth-password-reset";

export function ForgotPasswordForm() {
  const [state, setState] = useState<ForgotPasswordState | undefined>();
  const [pending, startTransition] = useTransition();

  if (state?.ok) {
    return (
      <div className="rounded-md border border-accent/30 bg-accent/5 p-6">
        <p className="font-serif-body text-base font-bold">
          📧 재설정 메일을 보냈습니다
        </p>
        <p className="mt-2 text-meta text-fg-muted">
          <strong>{state.email}</strong> 로 비밀번호 재설정 링크를 발송했습니다.
          메일의 링크를 클릭하면 새 비밀번호를 설정하실 수 있습니다.
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
          const next = await requestPasswordReset(state, fd);
          setState(next);
        })
      }
      className="flex flex-col gap-3"
    >
      <label htmlFor="reset-email" className="block text-sm font-medium">
        이메일
      </label>
      <input
        id="reset-email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="가입한 이메일 주소"
        className="rounded-md border border-ink/30 bg-bg px-4 py-3 font-serif-body text-base placeholder:text-fg-muted/70 focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "발송 중…" : "재설정 링크 받기"}
      </button>
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
