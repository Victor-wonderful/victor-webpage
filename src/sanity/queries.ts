/**
 * GROQ queries — Sanity equivalents of lib/posts.ts mock functions.
 *
 * Cast to plain string: Sanity v7's client.fetch infers param shape from
 * the query string, but template-literal interpolation (POST_PROJECTION)
 * breaks that inference. Plain string falls back to the loose overload.
 *
 * Field names mirror our existing Post type so page code does not change.
 */

const groq = (s: string): string => s;

export const POST_PROJECTION = /* groq */ `
  "slug": slug.current,
  title,
  summary,
  content,
  "publishedAt": publishedAt,
  tags,
  "category": category->slug.current,
  meta,
  coverImage{
    "asset": asset->{ _id, url },
    alt
  },
  bodyImages[]{
    "asset": asset->{ _id, url },
    alt
  },
  attachments[]{
    label,
    description,
    "file": {
      "asset": file.asset->{ _id, url, originalFilename, size, extension, mimeType }
    }
  }
`;

export const allPostsQuery = groq(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    ${POST_PROJECTION}
  }
`);

export const allPostsPageQuery = groq(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [$start...$end] {
    ${POST_PROJECTION}
  }
`);

export const allPostsCountQuery = groq(`
  count(*[_type == "post" && defined(slug.current)])
`);

export const editorialQuery = groq(`
  *[_type == "editorial"][0]{
    editorNote, editorNoteAuthor, sentenceOfTheDay, updatedAt
  }
`);

export const tokenPicksQuery = groq(`
  *[_type == "tokenPick" && active == true] | order(order asc, _updatedAt desc) {
    _id, name, ticker, sector, stance, thesis,
    "logoUrl": logo.asset->url,
    externalLink, updatedAt, disclaimer
  }
`);

export const activePollQuery = groq(`
  *[_type == "poll" && active == true
    && (!defined(startsAt) || startsAt <= now())
    && (!defined(endsAt)   || endsAt   >= now())
  ] | order(_updatedAt desc) [0] {
    _id,
    question,
    "slug": slug.current,
    options,
    startsAt,
    endsAt,
    context
  }
`);

export const postBySlugQuery = groq(`
  *[_type == "post" && slug.current == $slug][0] {
    ${POST_PROJECTION}
  }
`);

export const allSlugsQuery = groq(`
  *[_type == "post" && defined(slug.current)][].slug.current
`);

export const postsByCategoryQuery = groq(`
  *[_type == "post" && category->slug.current == $category] | order(publishedAt desc) {
    ${POST_PROJECTION}
  }
`);

export const postsByCategoryPageQuery = groq(`
  *[_type == "post" && category->slug.current == $category] | order(publishedAt desc) [$start...$end] {
    ${POST_PROJECTION}
  }
`);

export const postsByCategoryCountQuery = groq(`
  count(*[_type == "post" && category->slug.current == $category])
`);

export const postsByTagQuery = groq(`
  *[_type == "post" && $tag in tags] | order(publishedAt desc) {
    ${POST_PROJECTION}
  }
`);

// --- Admin dashboard queries -------------------------------------------------

export const recentPostsForAdminQuery = groq(`
  *[_type == "post" && defined(slug.current) && publishedAt <= now()]
    | order(publishedAt desc)[0...$limit] {
      _id,
      title,
      "slug": slug.current,
      "category": category->slug.current,
      publishedAt,
      telegramSentAt,
      telegramMessageId
    }
`);

export const scheduledPostsQuery = groq(`
  *[_type == "post"
    && defined(publishedAt)
    && publishedAt > now()
    && publishedAt < dateTime(now()) + 60*60*24*$days]
    | order(publishedAt asc) {
      _id,
      title,
      "slug": slug.current,
      "category": category->slug.current,
      publishedAt
    }
`);

export const draftsListQuery = groq(`
  *[_type == "post" && _id in path("drafts.**")]
    | order(_updatedAt desc)[0...$limit] {
      _id,
      title,
      "slug": slug.current,
      "category": category->slug.current,
      _updatedAt
    }
`);

export const draftsCountQuery = groq(`
  count(*[_type == "post" && _id in path("drafts.**")])
`);
