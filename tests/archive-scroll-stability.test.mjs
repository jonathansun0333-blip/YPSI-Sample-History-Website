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
