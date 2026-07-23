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
  assert.match(imageMarkup, /width=\{28\}/);
  assert.match(imageMarkup, /height=\{28\}/);
  assert.match(imageMarkup, /unoptimized/);
  assert.match(header, /className="site-brand-text">Cupertino Voices<\/span>/);
  assert.doesNotMatch(header, /<span className="brand-mark"/);

  const imageRule = styles.match(/\.brand-mark-image\s*\{(?<body>[^}]*)\}/s);
  assert.ok(imageRule?.groups?.body);
  assert.match(imageRule.groups.body, /width:\s*1\.75rem;/);
  assert.match(imageRule.groups.body, /height:\s*1\.75rem;/);
  assert.match(imageRule.groups.body, /object-fit:\s*contain;/);
  assert.doesNotMatch(styles, /\.brand-mark\s*\{/);
});

test("does not retain static-image types for the removed PNG import", async () => {
  await assert.rejects(stat(imageTypesUrl), { code: "ENOENT" });
});
