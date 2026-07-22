import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../src/components/archive-explorer.tsx",
  import.meta.url,
);
const pagePath = new URL("../src/app/archive/page.tsx", import.meta.url);

test("archive page and explorer contain no placeholder story language", async () => {
  const source = `${await readFile(componentPath, "utf8")}\n${await readFile(pagePath, "utf8")}`;
  assert.doesNotMatch(
    source,
    /Six decades on Stelling Road|Awaiting contribution|This is a placeholder entry|placeholder layout/i,
  );
});

test("explorer uses finalized data, pure filtering, semantic cards, and full stories", async () => {
  const source = await readFile(componentPath, "utf8");
  assert.match(source, /ARCHIVE_ENTRIES/);
  assert.match(source, /ARCHIVE_CATEGORIES/);
  assert.match(source, /filterArchiveEntries/);
  assert.match(source, /className="archive-card"/);
  assert.match(source, /<button/);
  assert.match(source, /openItem\.story/);
  assert.match(source, /event\.key === "Escape"/);
  assert.doesNotMatch(source, /<audio|audioUrl|ModalPlaceholderIcon/);
});
