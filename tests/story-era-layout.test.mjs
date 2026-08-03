import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesUrl = new URL("../src/app/globals.css", import.meta.url);

test("story chapter eras stay on one line", async () => {
  const styles = await readFile(stylesUrl, "utf8");
  const chapterEraRule = styles.match(/\.chapter-era\s*\{(?<body>[^}]*)\}/s);

  assert.ok(chapterEraRule, "expected a .chapter-era rule");
  assert.match(chapterEraRule.groups.body, /white-space:\s*nowrap\s*;/);
});
