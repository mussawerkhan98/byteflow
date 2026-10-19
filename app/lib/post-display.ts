/**
 * Filling in the three fields a post can be saved without.
 *
 * `date`, `read_time` and `excerpt` are typed by hand in the admin panel, and
 * a post saved without them renders a card with a blank line where the date
 * should be and no summary at all. None of those three can be derived from
 * nothing, but all three can be derived from what the post already has: when
 * it was created, and its own content.
 *
 * Anything typed in the admin wins. These only fill a field left empty, so a
 * hand-written excerpt or a corrected date is never overwritten.
 *
 * Kept free of the database so it can be tested on its own.
 */

/** Roughly what an adult reads per minute in a second language. */
const WORDS_PER_MINUTE = 220;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&nbsp;": " ",
  "&mdash;": "—",
  "&ndash;": "–",
  "&hellip;": "…",
};

/**
 * The readable words in a post, whether its content is HTML or the plain
 * paragraphs the editor also accepts.
 */
export function plainText(content: string): string {
  if (!content) return "";
  return (
    content
      // Script and style hold code, not prose, so drop them with their contents.
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      // A block tag is a word boundary; without this "end.</p><p>Next" joins up.
      .replace(/<\/?(p|div|br|li|h[1-6]|tr|td|blockquote)\b[^>]*>/gi, " ")
      .replace(/<[^>]+>/g, "")
      .replace(
        /&[a-z]+;|&#x?[0-9a-f]+;/gi,
        (m) => ENTITIES[m.toLowerCase()] ?? " ",
      )
      .replace(/\s+/g, " ")
      .trim()
  );
}

/** "7 min read", never "0 min read". */
export function readingTime(content: string): string {
  const words = plainText(content).split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

/**
 * "Oct 4, 2026" — the shape the posts with a date already use, so a filled-in
 * card and a derived one read the same.
 *
 * Built from the UTC parts rather than toLocaleDateString: the site renders on
 * servers in one zone and is read in another, and a date is not worth a
 * day-boundary bug.
 */
export function formatDate(value: string): string {
  if (!value) return "";
  const at = new Date(
    value.includes("T") ? value : value.replace(" ", "T") + "Z",
  );
  if (Number.isNaN(at.getTime())) return "";
  return `${MONTHS[at.getUTCMonth()]} ${at.getUTCDate()}, ${at.getUTCFullYear()}`;
}

/**
 * The opening of a post, cut to a whole word. Prefers to stop at the end of a
 * sentence when one falls in range, so the summary reads as a finished thought
 * rather than a snipped line.
 */
export function summarize(content: string, limit = 180): string {
  const text = plainText(content);
  if (text.length <= limit) return text;

  const window = text.slice(0, limit + 1);

  // Ending on a finished sentence reads as deliberate rather than cut off, so
  // prefer the last one that fits - but only if it uses most of the space. A
  // post opening "What is IT AMC?" would otherwise have that question as its
  // entire blurb while 160 characters of the answer went unused.
  const sentence = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("? "),
    window.lastIndexOf("! "),
  );
  if (sentence + 1 >= limit * 0.6) return window.slice(0, sentence + 1).trim();

  // Otherwise the cut lands mid-sentence and the ellipsis says so. Trailing
  // punctuation goes first: "backups,..." reads as a typo.
  const space = window.lastIndexOf(" ");
  const cut = window.slice(0, space > 0 ? space : limit).trim();
  return cut.replace(/[,;:.\u2014\u2013-]+$/, "") + "\u2026";
}

export type PostDisplayInput = {
  date?: string | null;
  read_time?: string | null;
  excerpt?: string | null;
  content?: string | null;
  created_at?: string | null;
};

/** The three fields as they should be shown, filling only what is blank. */
export function postDisplay(post: PostDisplayInput) {
  const content = post.content ?? "";
  return {
    date: post.date?.trim() || formatDate(post.created_at ?? ""),
    read_time: post.read_time?.trim() || readingTime(content),
    excerpt: post.excerpt?.trim() || summarize(content),
  };
}
