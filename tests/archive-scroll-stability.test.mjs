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

test("transitions the reserved root gutter with modal open and close", async () => {
  const styles = await readFile(stylesUrl, "utf8");
  const htmlRule = styles.match(/html\s*\{(?<body>[^}]*)\}/s);
  const modalCanvasRule = styles.match(
    /html:has\(\.story-modal-overlay:not\(\.is-closing\)\),\s*html:has\(\.archive-modal-overlay:not\(\.is-closing\)\)\s*\{(?<body>[^}]*)\}/s,
  );
  const closingCanvasRule = styles.match(
    /html:has\(\.story-modal-overlay\.is-closing\),\s*html:has\(\.archive-modal-overlay\.is-closing\)\s*\{(?<body>[^}]*)\}/s,
  );

  assert.ok(htmlRule?.groups?.body);
  assert.match(
    htmlRule.groups.body,
    /transition:\s*background-color 0\.25s ease;/,
  );
  assert.match(
    htmlRule.groups.body,
    /background-color:\s*var\(--surface\);/,
  );

  assert.ok(modalCanvasRule?.groups?.body);
  assert.match(
    modalCanvasRule.groups.body,
    /background-color:\s*color-mix\(\s*in srgb,\s*var\(--surface\) 30%,\s*rgb\(33 28 21\) 70%\s*\);/s,
  );

  assert.ok(closingCanvasRule?.groups?.body);
  assert.match(
    closingCanvasRule.groups.body,
    /background-color:\s*var\(--surface\);/,
  );
  assert.doesNotMatch(closingCanvasRule.groups.body, /transparent/);
  assert.match(
    closingCanvasRule.groups.body,
    /transition-duration:\s*0\.2s;/,
  );

  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)\s*\{\s*html,\s*\.archive-card-content,[^}]*\{[^}]*transition:\s*none;/s,
  );
});
