import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const iconUrl = new URL("../src/app/icon.svg", import.meta.url);
const oldPngUrl = new URL("../src/app/icon.png", import.meta.url);
const oldFaviconUrl = new URL("../src/app/favicon.ico", import.meta.url);

test("uses the supplied SVG as the sole favicon source", async () => {
  const icon = await readFile(iconUrl);
  const markup = icon.toString("utf8");

  assert.equal(icon.length, 47_135);
  assert.equal(
    createHash("sha256").update(icon).digest("hex"),
    "9e653a8fe83ea0ac8e296ab3d41a7769f2af9302271bdde1e8d7eb1239eec624",
  );
  assert.match(markup, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(
    markup,
    /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 658 652" width="658" height="652">/,
  );
  await assert.rejects(stat(oldPngUrl), { code: "ENOENT" });
  await assert.rejects(stat(oldFaviconUrl), { code: "ENOENT" });
});
