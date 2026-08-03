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

  assert.match(
    about,
    /className="about-contribute" id="cv-contribute"[\s\S]*id="cv-contribute-volunteer"[\s\S]*id="cv-contribute-contact"/,
  );
  assert.match(
    styles,
    /\.about-contribute\s*\{[^}]*position:\s*relative;/s,
  );
  assert.match(styles, /:root\s*\{[^}]*--site-header-clearance:\s*6rem;/s);
  assert.match(
    styles,
    /\.about-contribute,\s*\.about-contribute-anchor\s*\{[^}]*scroll-margin-top:\s*var\(--site-header-clearance\);/s,
  );
  assert.match(
    styles,
    /\.about-contribute-anchor\s*\{[^}]*position:\s*absolute;[^}]*top:\s*0;[^}]*left:\s*0;[^}]*width:\s*0;[^}]*height:\s*0;/s,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*800px\)[\s\S]*:root\s*\{[^}]*--site-header-clearance:\s*8\.25rem;/s,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*540px\)[\s\S]*:root\s*\{[^}]*--site-header-clearance:\s*14\.5rem;/s,
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

test("submission type options exactly match the Google Form choices", async () => {
  const form = await readFile(formUrl, "utf8");
  const options = [...form.matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)]
    .map(([, value, label]) => ({ value, label }));

  assert.deepEqual(options, [
    {
      value: "An oral history interview",
      label: "An oral history interview",
    },
    {
      value: "Photographs or Documents",
      label: "Photographs or Documents",
    },
    { value: "A story", label: "A story" },
    { value: "I want to volunteer", label: "I want to volunteer" },
    { value: "Something else", label: "Something else" },
  ]);
});

test("submission opens the prefilled Google Form in a new tab", async () => {
  const form = await readFile(formUrl, "utf8");

  assert.match(
    form,
    /window\.open\(destination\.toString\(\), "_blank", "noopener,noreferrer"\)/,
  );
  assert.doesNotMatch(form, /window\.location\.assign/);
});
