import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesUrl = new URL("../src/app/globals.css", import.meta.url);
const explorerUrl = new URL(
  "../src/components/archive-explorer.tsx",
  import.meta.url,
);

test("reserves the root scrollbar gutter while preserving modal scroll lock", async () => {
  const [styles, explorer] = await Promise.all([
    readFile(stylesUrl, "utf8"),
    readFile(explorerUrl, "utf8"),
  ]);

  const htmlRule = styles.match(/html\s*\{(?<body>[^}]*)\}/s);
  assert.ok(htmlRule?.groups?.body);
  assert.match(htmlRule.groups.body, /scrollbar-gutter:\s*stable;/);

  assert.match(
    explorer,
    /const previousOverflow = document\.body\.style\.overflow;/,
  );
  assert.match(explorer, /document\.body\.style\.overflow = "hidden";/);
  assert.match(
    explorer,
    /document\.body\.style\.overflow = previousOverflow;/,
  );
  assert.doesNotMatch(explorer, /paddingRight|position = "fixed"/);
});

test("darkens the reserved root gutter while a story modal exists", async () => {
  const styles = await readFile(stylesUrl, "utf8");
  const modalCanvasRule = styles.match(
    /html:has\(\.story-modal-overlay\),\s*html:has\(\.archive-modal-overlay\)\s*\{(?<body>[^}]*)\}/s,
  );

  assert.ok(modalCanvasRule?.groups?.body);
  assert.match(
    modalCanvasRule.groups.body,
    /background-color:\s*color-mix\(\s*in srgb,\s*var\(--surface\) 30%,\s*rgb\(33 28 21\) 70%\s*\);/s,
  );
});
