import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesPath = new URL("../src/app/globals.css", import.meta.url);

function ruleBody(styles, selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = styles.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`));
  assert.ok(match, `Missing CSS rule for ${selector}`);
  return match[1];
}

function declaration(rule, property) {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = rule.match(new RegExp(`${escapedProperty}\\s*:\\s*([^;]+);`));
  assert.ok(match, `Missing ${property} declaration`);
  return match[1].trim();
}

function relativeLuminance(hex) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first, second) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

test("dark archive focus and placeholder tokens meet contrast targets", async () => {
  const styles = await readFile(stylesPath, "utf8");
  const darkTheme = ruleBody(styles, "html.dark");
  const darkArchive = ruleBody(styles, "html.dark .archive-page");
  const focusColor = declaration(darkArchive, "--archive-focus");
  const placeholderColor = declaration(darkArchive, "--archive-placeholder");

  assert.match(focusColor, /^#[\da-f]{6}$/i);
  assert.match(placeholderColor, /^#[\da-f]{6}$/i);

  for (const surfaceToken of [
    "--surface",
    "--surface-2",
    "--surface-deep",
    "--panel",
  ]) {
    const surfaceColor = declaration(darkTheme, surfaceToken);
    assert.ok(
      contrastRatio(focusColor, surfaceColor) >= 3,
      `${focusColor} must contrast at least 3:1 with ${surfaceToken} ${surfaceColor}`,
    );
  }

  const pageSurface = declaration(darkTheme, "--surface");
  assert.ok(
    contrastRatio(placeholderColor, pageSurface) >= 4.5,
    `${placeholderColor} must contrast at least 4.5:1 with ${pageSurface}`,
  );

  assert.match(
    styles,
    /\.archive-filter-btn:focus-visible,\s*\.archive-search-input:focus-visible,\s*\.archive-card-trigger:focus-visible,\s*\.archive-modal-close:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--archive-focus\);/s,
  );

  const placeholderRule = ruleBody(styles, ".archive-search-input::placeholder");
  assert.equal(declaration(placeholderRule, "color"), "var(--archive-placeholder)");
  assert.equal(declaration(placeholderRule, "opacity"), "1");
});
