import type { Config } from "tailwindcss";

const withVar = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: withVar("--bg"),
        surface: withVar("--surface"),
        "surface-warm": withVar("--surface-warm"),
        ink: withVar("--ink"),
        "ink-soft": withVar("--ink-soft"),
        fg: withVar("--fg"),
        "fg-muted": withVar("--fg-muted"),
        border: withVar("--border"),
        accent: withVar("--accent"),
        "accent-hover": withVar("--accent-hover"),
        "accent-bg": withVar("--accent-bg"),
        up: withVar("--up"),
        down: withVar("--down"),
        warning: withVar("--warning"),
        info: withVar("--info"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "-apple-system", "Pretendard", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Consolas", "monospace"],
      },
      fontSize: {
        eyebrow: ["11px", { lineHeight: "1.2", letterSpacing: "0.22em", fontWeight: "700" }],
        meta: ["13px", { lineHeight: "1.5", fontWeight: "500" }],
        pill: ["13px", { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "600" }],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      maxWidth: {
        page: "1120px",
        prose: "720px",
      },
      letterSpacing: {
        // Korean-primary site: keep negative letter-spacing very mild.
        // Hangul (Pretendard) doesn't benefit from tight tracking the way
        // Latin display serifs do — values below were dialed down from
        // -0.03~-0.04em so site-wide headings stay legible in Korean.
        tightest: "-0.015em",
        tighter: "-0.01em",
        tight: "-0.005em",
      },
    },
  },
  plugins: [],
} satisfies Config;
