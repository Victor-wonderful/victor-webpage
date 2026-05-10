"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  setNewPassword,
  type ResetPasswordState,
} from "@/lib/auth-password-reset";

export function ResetPasswordForm() {
  const router = useRouter();
  const [state, setState] = useState<ResetPasswordState | undefined>();
  const [pending, startTransition] = useTransition();

  if (state?.ok) {
    return (
      <div className="rounded-md border border-accent/30 bg-accent/5 p-6">
        <p className="font-serif-body text-base font-bold">
          ✅ 비밀번호가 변경되었습니다
        </p>
        <p className="mt-2 text-meta text-fg-muted">
          이제 새 비밀번호로 로그인하실 수 있습니다.
        </p>
        <button
          type="button"
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-accent px-5 py-2 text-base font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          홈으로 가기
        </button>
      </div>
    );
  }

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const next = await setNewPassword(state, fd);
          setState(next);
        })
      }
      className="flex flex-col gap-3"
    >
      <label htmlFor="new-password" className="block text-sm font-medium">
        새 비밀번호
      </label>
      <input
        id="new-password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={72}
        placeholder="8자 이상"
        className="rounded-md border border-ink/30 bg-bg px-4 py-3 font-serif-body text-base placeholder:text-fg-muted/70 focus:border-accent focus:outline-none"
      />

      <label htmlFor="new-password-confirm" className="mt-2 block text-sm font-medium">
        새 비밀번호 확인
      </label>
      <input
        id="new-password-confirm"
        name="password_confirm"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={72}
        placeholder="다시 한 번 입력"
        className="rounded-md border border-ink/30 bg-bg px-4 py-3 font-serif-body text-base placeholder:text-fg-muted/70 focus:border-accent focus:outline-none"
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "저장 중…" : "비밀번호 변경"}
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
