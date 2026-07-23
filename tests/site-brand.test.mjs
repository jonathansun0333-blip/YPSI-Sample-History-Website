import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const headerUrl = new URL("../src/components/site-header.tsx", import.meta.url);
const stylesUrl = new URL("../src/app/globals.css", import.meta.url);
const imageTypesUrl = new URL("../src/types/next-image.d.ts", import.meta.url);

test("uses the favicon image as the compact header mark", async () => {
  const [header, styles] = await Promise.all([
    readFile(headerUrl, "utf8"),
    readFile(stylesUrl, "utf8"),
  ]);

  const imageMarkup = header.match(/<Image[\s\S]*?\/>/)?.[0];
  assert.ok(imageMarkup);
  assert.match(header, /import Image from "next\/image";/);
  assert.doesNotMatch(header, /import brandMark from/);
  assert.match(imageMarkup, /src="\/icon\.svg"/);
  assert.match(imageMarkup, /alt=""/);
  assert.match(imageMarkup, /className="brand-mark-image"/);
  assert.match(imageMarkup, /width=\{56\}/);
  assert.match(imageMarkup, /height=\{56\}/);
  assert.match(imageMarkup, /unoptimized/);
  assert.match(header, /className="site-brand-text">Cupertino Voices<\/span>/);
  assert.doesNotMatch(header, /<span className="brand-mark"/);

  const imageRule = styles.match(/\.brand-mark-image\s*\{(?<body>[^}]*)\}/s);
  assert.ok(imageRule?.groups?.body);
  assert.match(imageRule.groups.body, /width:\s*3\.5rem;/);
  assert.match(imageRule.groups.body, /height:\s*3\.5rem;/);
  assert.match(imageRule.groups.body, /object-fit:\s*contain;/);
  assert.doesNotMatch(styles, /\.brand-mark\s*\{/);

  const headerRule = styles.match(/\.site-header\s*\{(?<body>[^}]*)\}/s);
  assert.ok(headerRule?.groups?.body);
  assert.match(headerRule.groups.body, /padding:\s*0\.25rem 2rem;/);
});

test("does not retain static-image types for the removed PNG import", async () => {
  await assert.rejects(stat(imageTypesUrl), { code: "ENOENT" });
});

test("compacts header spacing between 801 and 900 pixels", async () => {
  const styles = await readFile(stylesUrl, "utf8");
  const query = "@media (min-width: 801px) and (max-width: 900px)";
  const start = styles.indexOf(query);

  assert.notEqual(start, -1);

  const remainder = styles.slice(start);
  const nextMedia = remainder.indexOf("\n@media", query.length);
  const rule =
    nextMedia === -1 ? remainder : remainder.slice(0, nextMedia);

  assert.match(
    rule,
    /\.site-header\s*\{[^}]*gap:\s*1\.2rem 1rem;[^}]*padding-inline:\s*12px;/s,
  );
  assert.match(
    rule,
    /\.site-header-right,\s*\.site-header-right nav\s*\{[^}]*gap:\s*1rem;/s,
  );
  assert.doesNotMatch(rule, /\.brand-mark-image\s*\{/);

  const smallQuery = "@media (max-width: 540px)";
  const smallStart = styles.indexOf(smallQuery);
  assert.notEqual(smallStart, -1);
  const smallRemainder = styles.slice(smallStart);
  const smallNextMedia = smallRemainder.indexOf(
    "\n@media",
    smallQuery.length,
  );
  const smallRule =
    smallNextMedia === -1
      ? smallRemainder
      : smallRemainder.slice(0, smallNextMedia);
  assert.match(
    smallRule,
    /\.site-header\s*\{[^}]*padding-inline:\s*20px;/s,
  );
  assert.doesNotMatch(
    smallRule,
    /\.site-header\s*\{[^}]*padding:\s*1rem 20px;/s,
  );
});
