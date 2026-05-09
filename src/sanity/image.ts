import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

/** Build a CDN URL for a Sanity image asset reference. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/** Resolve a Sanity image reference shape to a CDN URL string. */
export function imageUrl(
  source:
    | { asset?: { _ref?: string; _id?: string; url?: string } }
    | undefined,
  width = 1600,
): string | null {
  if (!source?.asset) return null;
  // Prefer the resolved url, fall back to ref-based builder
  if (source.asset.url) return source.asset.url;
  if (source.asset._ref) {
    return urlFor(source as SanityImageSource)
      .width(width)
      .auto("format")
      .url();
  }
  return null;
}
