import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const layoutUrl = new URL("../src/app/layout.tsx", import.meta.url);
const aboutUrl = new URL("../src/app/about/page.tsx", import.meta.url);
const formUrl = new URL(
  "../src/components/contribute-form.tsx",
  import.meta.url,
);
const stylesUrl = new URL("../src/app/globals.css", import.meta.url);

test("footer contribution links target the About contribution panel", async () => {
  const layout = await readFile(layoutUrl, "utf8");

  assert.match(
    layout,
    /import \{ withBasePath \} from "@\/lib\/asset-path";/,
  );
  assert.match(
    layout,
    /<a href=\{withBasePath\("\/about\/#cv-contribute"\)\}>Contribute a Story<\/a>/,
  );
  assert.match(
    layout,
    /<a href=\{withBasePath\("\/about\/#cv-contribute-volunteer"\)\}>Volunteer<\/a>/,
  );
  assert.match(
    layout,
    /<a href=\{withBasePath\("\/about\/#cv-contribute-contact"\)\}>Contact<\/a>/,
  );
});

test("About contribution hashes share one panel position", async () => {
  const [about, styles] = await Promise.all([
    readFile(aboutUrl, "utf8"),
    readFile(stylesUrl, "utf8"),
  ]);

  assert.match(about, /className="about-contribute" id="cv-contribute"/);
  assert.match(about, /id="cv-contribute-volunteer"/);
  assert.match(about, /id="cv-contribute-contact"/);
  assert.match(
    styles,
    /\.about-contribute,\s*\.about-contribute-anchor\s*\{[^}]*scroll-margin-top:\s*6rem;/s,
  );
  assert.match(
    styles,
    /\.about-contribute-anchor\s*\{[^}]*display:\s*block;[^}]*height:\s*0;/s,
  );
});

test("submission type follows the current contribution hash", async () => {
  const form = await readFile(formUrl, "utf8");

  assert.match(
    form,
    /const DEFAULT_SUBMISSION_TYPE = "An oral history interview";/,
  );
  assert.match(
    form,
    /"#cv-contribute-volunteer": "I want to volunteer"/,
  );
  assert.match(
    form,
    /"#cv-contribute-contact": "Something else"/,
  );
  assert.match(
    form,
    /export function getSubmissionTypeForHash\(hash: string\)/,
  );
  assert.match(form, /window\.location\.hash/);
  assert.match(
    form,
    /window\.addEventListener\("hashchange", syncSubmissionType\)/,
  );
  assert.match(
    form,
    /window\.removeEventListener\("hashchange", syncSubmissionType\)/,
  );
  assert.match(
    form,
    /<select[\s\S]*value=\{submissionType\}[\s\S]*onChange=\{\(event\) => setSubmissionType\(event\.target\.value\)\}/,
  );
});
