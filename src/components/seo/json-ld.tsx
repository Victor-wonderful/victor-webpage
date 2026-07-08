/**
 * Renders one or more JSON-LD structured-data blocks in a <script> tag.
 * Escapes "<" to prevent breaking out of the script element via post content.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
