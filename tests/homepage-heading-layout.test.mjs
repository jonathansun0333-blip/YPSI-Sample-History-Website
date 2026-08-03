import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesUrl = new URL("../src/app/globals.css", import.meta.url);

test("the Four Ways In heading stays on one line outside the mobile layout", async () => {
  const styles = await readFile(stylesUrl, "utf8");
  const desktopRule = styles.match(
    /@media\s*\(min-width:\s*701px\)\s*\{\s*\.ways-in \.section-header-row h2\s*\{(?<body>[^}]*)\}/s,
  );

  assert.ok(desktopRule, "expected a desktop-only rule for the Four Ways In heading");
  assert.match(desktopRule.groups.body, /max-width:\s*none\s*;/);
  assert.match(desktopRule.groups.body, /white-space:\s*nowrap\s*;/);
});
