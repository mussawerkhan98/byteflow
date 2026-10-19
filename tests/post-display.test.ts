import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  plainText,
  readingTime,
  formatDate,
  summarize,
  postDisplay,
} from "../app/lib/post-display";

// ── plainText ──────────────────────────────────────────────────────────────

test("plainText strips tags and keeps the prose", () => {
  assert.equal(plainText("<p>Hello <b>there</b></p>"), "Hello there");
});

test("plainText treats a block tag as a word boundary", () => {
  assert.equal(plainText("<p>end.</p><p>Next</p>"), "end. Next");
});

test("plainText drops script and style contents entirely", () => {
  assert.equal(
    plainText(
      "<p>Real</p><script>var a = 1 + 2;</script><style>.x{color:red}</style>",
    ),
    "Real",
  );
});

test("plainText decodes the entities that appear in prose", () => {
  assert.equal(
    plainText("Tom &amp; Jerry &mdash; &quot;hi&quot;"),
    'Tom & Jerry — "hi"',
  );
});

test("plainText leaves plain-text content alone", () => {
  assert.equal(plainText("No markup here"), "No markup here");
});

test("plainText collapses runs of whitespace", () => {
  assert.equal(plainText("a \n\n  b"), "a b");
});

test("plainText on empty input is empty", () => {
  assert.equal(plainText(""), "");
});

// ── readingTime ────────────────────────────────────────────────────────────

test("readingTime rounds to the nearest minute", () => {
  assert.equal(readingTime(Array(440).fill("word").join(" ")), "2 min read");
});

test("readingTime never reports zero minutes", () => {
  assert.equal(readingTime("Three words only"), "1 min read");
});

test("readingTime counts prose, not markup", () => {
  const prose = Array(220).fill("word").join(" ");
  assert.equal(
    readingTime(`<div class="a b c"><p id="x">${prose}</p></div>`),
    "1 min read",
  );
});

test("readingTime of empty content is still a minute, not an error", () => {
  assert.equal(readingTime(""), "1 min read");
});

// ── formatDate ─────────────────────────────────────────────────────────────

test("formatDate renders the shape the existing posts use", () => {
  assert.equal(formatDate("2026-10-04T09:30:00Z"), "Oct 4, 2026");
});

test("formatDate handles a SQL timestamp without a T", () => {
  assert.equal(formatDate("2026-01-03 12:43:57"), "Jan 3, 2026");
});

test("formatDate uses UTC, so a late-evening timestamp keeps its day", () => {
  assert.equal(formatDate("2026-03-31T23:30:00Z"), "Mar 31, 2026");
});

test("formatDate returns empty for junk rather than Invalid Date", () => {
  assert.equal(formatDate("not a date"), "");
  assert.equal(formatDate(""), "");
});

// ── summarize ──────────────────────────────────────────────────────────────

test("summarize returns short content unchanged and unellipsised", () => {
  assert.equal(summarize("Short enough."), "Short enough.");
});

test("summarize keeps reading past a short opening sentence", () => {
  // The sentence ends 40 characters in, far short of the 180 available. Taking
  // it alone would throw away most of the blurb, so the cut runs on instead.
  const text = "First sentence runs on for a while here. " + "word ".repeat(80);
  const out = summarize(text);
  assert.ok(out.length > 150, `gave up too early: ${out}`);
  assert.ok(out.endsWith("\u2026"), out);
});

test("summarize ends on a sentence when that uses most of the space", () => {
  const text = "A".repeat(60) + ". " + "B".repeat(60) + ". " + "C".repeat(200);
  const out = summarize(text);
  assert.ok(out.endsWith("."), out);
  assert.ok(!out.includes("\u2026"), "a whole sentence needs no ellipsis");
});

test("summarize cuts on a word boundary when no sentence end fits", () => {
  const out = summarize(Array(100).fill("word").join(" "));
  assert.ok(out.endsWith("…"), out);
  assert.ok(!out.includes("wor…"), "should not cut mid-word");
  assert.ok(out.length <= 182, `too long: ${out.length}`);
});

test("summarize works from HTML content", () => {
  assert.equal(summarize("<p>A tidy summary.</p>"), "A tidy summary.");
});

test("summarize respects a custom limit", () => {
  const out = summarize(Array(100).fill("word").join(" "), 20);
  assert.ok(out.length <= 22, `too long: ${out.length}`);
});

// ── postDisplay ────────────────────────────────────────────────────────────

test("postDisplay fills all three when the post has none of them", () => {
  const out = postDisplay({
    date: "",
    read_time: "",
    excerpt: "",
    content: "<p>Some words about IT support in Dubai.</p>",
    created_at: "2026-10-04 08:00:00",
  });
  assert.equal(out.date, "Oct 4, 2026");
  assert.equal(out.read_time, "1 min read");
  assert.equal(out.excerpt, "Some words about IT support in Dubai.");
});

test("postDisplay never overwrites what was typed in the admin", () => {
  const out = postDisplay({
    date: "Jan 3, 2026",
    read_time: "4 min read",
    excerpt: "Hand-written summary.",
    content: "<p>Totally different content.</p>",
    created_at: "2026-10-04 08:00:00",
  });
  assert.equal(out.date, "Jan 3, 2026");
  assert.equal(out.read_time, "4 min read");
  assert.equal(out.excerpt, "Hand-written summary.");
});

test("postDisplay treats a whitespace-only field as empty", () => {
  const out = postDisplay({
    date: "   ",
    read_time: "\t",
    excerpt: "  ",
    content: "<p>Fallback prose.</p>",
    created_at: "2026-10-04 08:00:00",
  });
  assert.equal(out.date, "Oct 4, 2026");
  assert.equal(out.read_time, "1 min read");
  assert.equal(out.excerpt, "Fallback prose.");
});

test("postDisplay survives null fields from the database", () => {
  const out = postDisplay({
    date: null,
    read_time: null,
    excerpt: null,
    content: null,
    created_at: null,
  });
  assert.equal(out.date, "");
  assert.equal(out.read_time, "1 min read");
  assert.equal(out.excerpt, "");
});

test("summarize returns whole sentences when they fill the space", () => {
  const out = summarize("Sentence number one is here. ".repeat(20));
  assert.ok(out.endsWith("."), out);
  assert.ok(!out.includes("\u2026"), "a complete sentence needs no ellipsis");
  assert.ok(out.length > 150, `too short: ${out.length}`);
});

test("summarize never puts an ellipsis straight after punctuation", () => {
  const out = summarize("word, ".repeat(200));
  assert.ok(out.endsWith("…"), out);
  assert.ok(!/[,;:.]…$/.test(out), `doubled punctuation: ${out}`);
});
