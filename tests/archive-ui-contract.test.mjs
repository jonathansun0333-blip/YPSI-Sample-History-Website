import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../src/components/archive-explorer.tsx",
  import.meta.url,
);
const pagePath = new URL("../src/app/archive/page.tsx", import.meta.url);
const stylesPath = new URL("../src/app/globals.css", import.meta.url);

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
  assert.doesNotMatch(source, /audioUrl|ModalPlaceholderIcon/);

  const listing = source.slice(
    source.indexOf('<div className="archive-controls">'),
    source.indexOf("{openItem && ("),
  );
  assert.doesNotMatch(listing, /<audio|ArchiveAudioPlayer/);
});

test("cards use articles with dedicated native triggers and external headings", async () => {
  const source = await readFile(componentPath, "utf8");
  assert.match(source, /<article[\s\S]*?className="archive-card"/);
  assert.match(source, /className="archive-card-trigger"/);
  assert.match(source, /<h3 className="card-title">\{item\.title\}<\/h3>/);
  assert.doesNotMatch(
    source,
    /<button[^>]*className="archive-card"[^>]*>/,
  );
});

test("category controls expose a semantic filter group", async () => {
  const source = await readFile(componentPath, "utf8");
  assert.match(
    source,
    /className="archive-filter-row"[\s\S]*?role="group"[\s\S]*?aria-label="Filter archive by category"/,
  );
});

test("modal keeps Tab and Shift+Tab focus inside its panel", async () => {
  const source = await readFile(componentPath, "utf8");
  assert.match(source, /modalPanelRef/);
  assert.match(source, /event\.key === "Tab"/);
  assert.match(source, /event\.shiftKey/);
  assert.match(source, /querySelectorAll/);
  assert.match(source, /ref=\{modalPanelRef\}/);
  assert.match(source, /audio\[controls\]/);
});

test("archive metadata, eras, and categories preserve stored capitalization", async () => {
  const styles = await readFile(stylesPath, "utf8");
  assert.match(
    styles,
    /\.card-metadata\s*\{[^}]*text-transform:\s*none;/s,
  );
  assert.match(
    styles,
    /\.archive-modal-metadata\s*\{[^}]*text-transform:\s*none;/s,
  );
  assert.match(
    styles,
    /\.archive-modal-meta\s*\{[^}]*text-transform:\s*none;/s,
  );
});
