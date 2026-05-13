import Image from "next/image";
import { imageUrl } from "@/sanity/image";
import type { SanityImageRef } from "@/lib/posts";
import { EditorialImage } from "./editorial-image";
import { cn } from "@/lib/cn";

/**
 * Resolves a post's cover image with a clean fallback ladder:
 *   1. post.coverImage uploaded in Sanity Studio → render via next/image
 *      against the Sanity CDN with the right responsive sizes
 *   2. otherwise → EditorialImage placeholder (Unsplash-pool + ink tint)
 *
 * Use this anywhere a post needs a hero / card / wide cover. Avoids the
 * old bug where uploads in Studio were ignored and every post shared
 * the same deterministic placeholder.
 */

type Variant = "hero" | "card" | "wide";

const VARIANT_CONFIG: Record<
  Variant,
  { aspect: string; width: number; sizes: string }
> = {
  hero: {
    aspect: "aspect-[21/9]",
    width: 1600,
    sizes: "(min-width:1120px) 1120px, 100vw",
  },
  wide: {
    aspect: "aspect-[16/9]",
    width: 1200,
    sizes: "(min-width:1120px) 1120px, 100vw",
  },
  card: {
    aspect: "aspect-[4/3]",
    width: 720,
    sizes:
      "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
  },
};

export function PostCoverImage({
  post,
  variant = "card",
  priority = false,
  showCaption = true,
  alt,
  className,
}: {
  post: {
    slug: string;
    title: string;
    coverImage?: SanityImageRef;
  };
  variant?: Variant;
  priority?: boolean;
  showCaption?: boolean;
  alt?: string;
  className?: string;
}) {
  const cfg = VARIANT_CONFIG[variant];
  const cover = imageUrl(post.coverImage, cfg.width);

  if (cover) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden bg-ink",
          cfg.aspect,
          className,
        )}
      >
        <Image
          src={cover}
          alt={alt ?? post.coverImage?.alt ?? post.title ?? ""}
          fill
          sizes={cfg.sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <EditorialImage
      seed={post.slug}
      variant={variant}
      priority={priority}
      showCaption={showCaption}
      alt={alt ?? post.title}
      className={className}
    />
  );
}
