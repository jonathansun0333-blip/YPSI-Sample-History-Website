import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const headerUrl = new URL("../src/components/site-header.tsx", import.meta.url);
const stylesUrl = new URL("../src/app/globals.css", import.meta.url);
const imageTypesUrl = new URL("../src/types/next-image.d.ts", import.meta.url);

test("uses the favicon image as the compact header mark", async () => {
  const [header, styles] = await Promise.all([
    readFile(headerUrl, "utf8"),
    readFile(stylesUrl, "utf8"),
  ]);

  assert.match(header, /import Image from "next\/image";/);
  assert.match(header, /import brandMark from "@\/app\/icon\.png";/);
  assert.match(
    header,
    /<Image[\s\S]*?src=\{brandMark\}[\s\S]*?alt=""[\s\S]*?className="brand-mark-image"[\s\S]*?\/>/,
  );
  assert.match(header, /className="site-brand-text">Cupertino Voices<\/span>/);
  assert.doesNotMatch(header, /<span className="brand-mark"/);

  const imageRule = styles.match(/\.brand-mark-image\s*\{(?<body>[^}]*)\}/s);
  assert.ok(imageRule?.groups?.body);
  assert.match(imageRule.groups.body, /width:\s*1\.75rem;/);
  assert.match(imageRule.groups.body, /height:\s*1\.75rem;/);
  assert.match(imageRule.groups.body, /object-fit:\s*contain;/);
  assert.doesNotMatch(styles, /\.brand-mark\s*\{/);
});

test("declares Next static-image types for the imported brand asset", async () => {
  const imageTypes = await readFile(imageTypesUrl, "utf8");

  assert.equal(
    imageTypes,
    '/// <reference types="next/image-types/global" />\n',
  );
});
