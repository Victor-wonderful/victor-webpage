import type { PostAttachment } from "@/lib/posts";

export type ResolvedAttachment = {
  label: string;
  description?: string;
  url: string | null;
  filename?: string;
  size?: number;
  extension?: string;
  mimeType?: string;
};

export function resolveAttachment(a: PostAttachment): ResolvedAttachment {
  const asset = a.file?.asset;
  return {
    label: a.label,
    description: a.description,
    url: asset?.url ?? null,
    filename: asset?.originalFilename,
    size: asset?.size,
    extension: asset?.extension,
    mimeType: asset?.mimeType,
  };
}

/** Format a byte size to a human-friendly string. */
export function formatBytes(bytes: number | undefined): string {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
