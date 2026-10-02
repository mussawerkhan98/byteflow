import type { JsonLd as JsonLdData } from '../lib/structured-data'

/**
 * Renders a JSON-LD graph into the page.
 *
 * `<` is escaped rather than left as-is: a stray `</script>` inside any CMS
 * value would otherwise end the script tag early and let the rest of that
 * value run as markup. The other two sequences are the same hazard in HTML
 * comment and CDATA form.
 */
export default function JsonLd({ data }: { data: JsonLdData | null }) {
  if (!data) return null
  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')

  return (
    <script
      type="application/ld+json"
      // The content is JSON we just serialised, with every character that
      // could close the tag already escaped above.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
