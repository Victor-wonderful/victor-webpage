/**
 * Structured-data (JSON-LD) builders for SEO rich results.
 * Pure functions — return plain objects to be serialized by <JsonLd>.
 * Schema.org types: WebSite, Organization, BlogPosting, BreadcrumbList.
 */
import { SITE } from "@/lib/site";
import type { Post } from "@/lib/posts";

/** Site-wide identity graph — emit once in the root layout. */
export function siteJsonLd(): object[] {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "ko-KR",
    publisher: { "@id": `${SITE.url}/#organization` },
  };
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  };
  return [website, organization];
}

/** Article rich result for a single blog post. */
export function blogPostingJsonLd(
  post: Post,
  opts: { url: string; imageUrl: string; sectionLabel: string },
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "ko-KR",
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    url: opts.url,
    image: [opts.imageUrl],
    articleSection: opts.sectionLabel,
    keywords: post.tags?.length ? post.tags.join(", ") : undefined,
    author: { "@type": "Person", name: SITE.author },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
    },
  };
}

/** Breadcrumb trail rich result. */
export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
