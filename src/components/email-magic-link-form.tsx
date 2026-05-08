"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function EmailMagicLinkForm({
  redirectTo = "/",
}: {
  redirectTo?: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일 주소를 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        shouldCreateUser: true,
      },
    });
    if (otpError) {
      setError(otpError.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="rounded-md border border-accent/30 bg-accent/5 p-4">
        <p className="font-serif-body text-base font-bold">
          📧 이메일을 확인해 주세요
        </p>
        <p className="mt-1 text-meta text-fg-muted">
          <strong>{email}</strong> 으로 로그인 링크를 보냈습니다.
          메일에 있는 링크를 클릭하면 자동 로그인됩니다.
        </p>
        <p className="mt-2 text-meta text-fg-muted">
          ※ 메일이 안 보이면 스팸함을 확인해 주세요.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label htmlFor="magic-email" className="sr-only">
        이메일 주소
      </label>
      <input
        id="magic-email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com (네이버·카카오·회사 메일 모두 가능)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        className="rounded-md border border-ink/30 bg-bg px-4 py-3 font-serif-body text-base placeholder:text-fg-muted/70 focus:border-accent focus:outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-md border border-ink/30 bg-bg px-5 py-3 font-serif-body text-base font-medium transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "발송 중…" : "이메일로 로그인 링크 받기"}
      </button>
      {error && (
        <p className="text-meta text-down" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
