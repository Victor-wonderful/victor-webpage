/**
 * Sanity env. Public values are hardcoded as fallback because the hosted
 * Studio bundle (deployed via `sanity deploy`) does not have access to
 * Next.js env vars at build time. Both projectId and dataset are public.
 */

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "lyo2lw0j";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const apiVersion = "2024-10-01";

export const useCdn = false;
