"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginWithPassword, type LoginActionState } from "@/lib/auth-login";

export function EmailLoginForm({
  redirectTo = "/",
}: {
  redirectTo?: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<LoginActionState | undefined>();
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const next = await loginWithPassword(state, fd);
          setState(next);
          if (next.ok) {
            router.push(redirectTo);
            router.refresh();
          }
        })
      }
      className="flex flex-col gap-3"
    >
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium">
          이메일
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="가입한 이메일 주소"
          className="mt-2 w-full rounded-md border border-ink/30 bg-bg px-4 py-3 font-serif-body text-base placeholder:text-fg-muted/70 focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="login-password" className="block text-sm font-medium">
            비밀번호
          </label>
          <Link
            href="/forgot-password"
            className="text-meta text-accent hover:underline"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-md border border-ink/30 bg-bg px-4 py-3 font-serif-body text-base focus:border-accent focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "로그인 중…" : "로그인"}
      </button>

      {state?.error && (
        <div className="rounded-md border border-down/30 bg-down/10 p-3 text-meta text-down" role="alert">
          {state.error}
          {state.hint === "use_reset" && (
            <p className="mt-2">
              <Link href="/forgot-password" className="underline">
                비밀번호 재설정 →
              </Link>
            </p>
          )}
        </div>
      )}
    </form>
  );
}
