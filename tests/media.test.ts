import assert from "node:assert/strict";
import test from "node:test";
import { decodeDataUrl } from "../app/lib/media-data-url";

const PNG_1PX =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

test("unpacks a png data url", () => {
  const asset = decodeDataUrl(`data:image/png;base64,${PNG_1PX}`);
  assert.ok(asset);
  assert.equal(asset.mime, "image/png");
  // PNG magic number, so we know real bytes came back and not the text.
  assert.deepEqual([...asset.bytes.slice(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
});

test("unpacks an svg data url", () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg"/>';
  const asset = decodeDataUrl(
    `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`,
  );
  assert.ok(asset);
  assert.equal(asset.mime, "image/svg+xml");
  assert.equal(Buffer.from(asset.bytes).toString("utf8"), svg);
});

test("tolerates surrounding whitespace", () => {
  assert.ok(decodeDataUrl(`\n  data:image/png;base64,${PNG_1PX}  \n`));
});

test("the bytes survive a round trip unchanged", () => {
  const original = Buffer.from([0, 1, 2, 250, 251, 252, 253, 254, 255]);
  const asset = decodeDataUrl(
    `data:image/webp;base64,${original.toString("base64")}`,
  );
  assert.ok(asset);
  assert.deepEqual([...asset.bytes], [...original]);
});

for (const [name, value] of Object.entries({
  "a plain url": "/api/media/12",
  "an http url": "https://example.test/a.png",
  "an empty string": "",
  "a data url with no payload": "data:image/png;base64,",
  "a non-base64 data url": "data:image/svg+xml,<svg/>",
  "a type we do not serve": `data:text/html;base64,${Buffer.from("<h1>hi</h1>").toString("base64")}`,
  "a pdf": `data:application/pdf;base64,${PNG_1PX}`,
  "something that is not a url at all": "just some text",
})) {
  test(`refuses ${name}`, () => {
    assert.equal(decodeDataUrl(value), null);
  });
}

test("a migrated row holding a path is not mistaken for an image", () => {
  // After migration a content row holds "/api/media/7"; feeding that back in
  // must fail loudly rather than return empty bytes a browser would show as
  // a broken image.
  assert.equal(decodeDataUrl("/api/media/7"), null);
});
