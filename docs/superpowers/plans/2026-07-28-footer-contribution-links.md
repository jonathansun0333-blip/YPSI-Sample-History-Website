# Footer Contribution Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the shared footer's contribution links navigate to the About-page contribution panel with the intended submission type selected.

**Architecture:** Base-path-aware native anchors encode intent in three bookmarkable hashes without allowing the Next.js 16 segment cache to compound same-page fragments. The About page exposes three co-located anchor targets, while the client-side contribution form maps the current hash to controlled select state on initial hydration and every `hashchange`.

**Tech Stack:** Next.js 16, React 19, TypeScript, native CSS, Node built-in test runner.

## Global Constraints

- “Contribute a Story” keeps “An oral history interview” selected.
- “Volunteer” selects “I want to volunteer.”
- “Contact” selects “Something else.”
- All three destinations scroll to the “Have a story worth keeping?” panel.
- Keep the footer columns, form fields, wording, and Google Form submission destination unchanged.
- Preserve GitHub Pages base-path compatibility with the existing
  `withBasePath` helper.
- Use native anchors for these three targets so same-page hash changes replace
  the previous fragment.
- Keep all three targets on the panel's exact top edge.
- Reserve fixed-header clearance of `6rem` by default, `8.25rem` at 800px and
  below, and `14.5rem` at 540px and below.
- Unknown or missing hashes fall back to “An oral history interview.”
- Add no dependencies.

---

### Task 1: Add the footer-to-form navigation contract

**Files:**
- Create: `tests/footer-contribution-links.test.mjs`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/components/contribute-form.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: The shared `RootLayout` footer, the `#cv-contribute` panel, and the existing submission-type option values.
- Produces: `getSubmissionTypeForHash(hash: string): string`, three
  base-path-aware native footer anchors, and three co-located anchor targets.
- Preserves: Existing form submission behavior, manual select changes, footer layout, and GitHub Pages base-path handling.

- [ ] **Step 1: Write the failing navigation contract**

Create `tests/footer-contribution-links.test.mjs`:

```js
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
  assert.match(form, /window\.addEventListener\("hashchange", syncSubmissionType\)/);
  assert.match(
    form,
    /window\.removeEventListener\("hashchange", syncSubmissionType\)/,
  );
  assert.match(
    form,
    /<select[\s\S]*value=\{submissionType\}[\s\S]*onChange=\{\(event\) => setSubmissionType\(event\.target\.value\)\}/,
  );
});
```

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/footer-contribution-links.test.mjs
```

Expected: all three tests fail because the footer labels are not links, the
secondary anchors do not exist, and the select is uncontrolled.

- [ ] **Step 3: Implement the three shared footer links**

In `src/app/layout.tsx`, import `withBasePath` and replace the three plain
labels with native anchors:

```tsx
import { withBasePath } from "@/lib/asset-path";

<li>
  <a href={withBasePath("/about/#cv-contribute")}>Contribute a Story</a>
</li>
<li>
  <a href={withBasePath("/about/#cv-contribute-volunteer")}>Volunteer</a>
</li>
```

and:

```tsx
<li>
  <a href={withBasePath("/about/#cv-contribute-contact")}>Contact</a>
</li>
```

Native navigation is intentional here. Next.js 16.2.10 can concatenate the
existing and requested fragments when a prefetched same-route `Link` is clicked;
the browser's native anchor behavior replaces the fragment and emits the
`hashchange` event consumed by `ContributeForm`.

- [ ] **Step 4: Add co-located About-page anchors**

At the start of the existing `about-contribute` panel in
`src/app/about/page.tsx`, add:

```tsx
<span
  className="about-contribute-anchor"
  id="cv-contribute-volunteer"
  aria-hidden="true"
/>
<span
  className="about-contribute-anchor"
  id="cv-contribute-contact"
  aria-hidden="true"
/>
```

In `src/app/globals.css`, add:

```css
:root {
  --site-header-clearance: 6rem;
}

.about-contribute {
  position: relative;
}

.about-contribute,
.about-contribute-anchor {
  scroll-margin-top: var(--site-header-clearance);
}

.about-contribute-anchor {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}

@media (max-width: 800px) {
  :root {
    --site-header-clearance: 8.25rem;
  }
}

@media (max-width: 540px) {
  :root {
    --site-header-clearance: 14.5rem;
  }
}
```

- [ ] **Step 5: Synchronize the controlled select with URL hashes**

In `src/components/contribute-form.tsx`, update the React import and add the
hash mapping:

```tsx
import React, { useEffect, useState } from "react";

const DEFAULT_SUBMISSION_TYPE = "An oral history interview";

const SUBMISSION_TYPE_BY_HASH: Readonly<Record<string, string>> = {
  "#cv-contribute-volunteer": "I want to volunteer",
  "#cv-contribute-contact": "Something else",
};

export function getSubmissionTypeForHash(hash: string) {
  return SUBMISSION_TYPE_BY_HASH[hash] ?? DEFAULT_SUBMISSION_TYPE;
}
```

At the start of `ContributeForm`, initialize and synchronize state without a
synchronous mount-effect state update:

```tsx
const [submissionType, setSubmissionType] = useState(
  DEFAULT_SUBMISSION_TYPE,
);

useEffect(() => {
  function syncSubmissionType() {
    setSubmissionType(getSubmissionTypeForHash(window.location.hash));
  }

  const frameId = window.requestAnimationFrame(syncSubmissionType);
  window.addEventListener("hashchange", syncSubmissionType);

  return () => {
    window.cancelAnimationFrame(frameId);
    window.removeEventListener("hashchange", syncSubmissionType);
  };
}, []);
```

Make the existing select controlled:

```tsx
<select
  id="about-type"
  name="submissionType"
  className="form-select"
  value={submissionType}
  onChange={(event) => setSubmissionType(event.target.value)}
  required
>
```

- [ ] **Step 6: Run focused and full automated checks**

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/footer-contribution-links.test.mjs
& 'C:\Program Files\nodejs\node.exe' --test tests/*.test.mjs
& 'C:\Program Files\nodejs\npm.cmd' run lint
& 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
& 'C:\Program Files\nodejs\npm.cmd' run build
git diff --check
```

Expected: focused and full tests pass, lint has no new warnings, TypeScript and
the production static-export build exit 0, and the diff has no whitespace
errors.

- [ ] **Step 7: Verify navigation in a browser**

Start the production export locally and verify:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' serve out -l 4173
```

- From `/`, each footer link reaches the About contribution panel.
- “Contribute a Story” selects “An oral history interview.”
- “Volunteer” selects “I want to volunteer.”
- “Contact” selects “Something else.”
- On `/about`, switching among the three footer links updates the selection.
- Browser back/forward restores the selection matching the active hash.
- At 375, 540, 800, and 1280px widths, all three targets share the panel's
  exact top coordinate and the fixed header does not cover the contribution
  heading.
- Manual select changes and form submission remain functional.

- [ ] **Step 8: Commit the focused implementation**

```powershell
git add -- src/app/layout.tsx src/app/about/page.tsx src/components/contribute-form.tsx src/app/globals.css tests/footer-contribution-links.test.mjs docs/superpowers/specs/2026-07-28-footer-contribution-links-design.md docs/superpowers/plans/2026-07-28-footer-contribution-links.md
git commit -m "feat: link footer actions to contribution form"
```
