# Brand Icon and Archive Scrollbar Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the favicon and header dot with the newly supplied Cupertino Voices image, then eliminate Archive modal layout shift by reserving the root scrollbar gutter.

**Architecture:** Keep `src/app/icon.svg` as the single source used by Next.js file-based favicon metadata and render that same URL in `SiteHeader` through an unoptimized `next/image`. Preserve the existing body scroll lock and add `scrollbar-gutter: stable` to the root `html` rule so classic scrollbar space remains reserved while a story dialog is open. Keep the fixed header on one row from 801 through 900 pixels with a narrowly scoped compact-spacing media rule.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, native CSS, Node 24 built-in test runner, `next/image`, npm, agent-browser.

## Global Constraints

- Treat `C:\Users\kchen\Downloads\image1.svg` as the exact source asset.
- The source is an SVG with a 658 by 652 viewport, 47,135 bytes, SHA-256 `9E653A8FE83EA0AC8E296AB3D41A7769F2AF9302271BDDE1E8D7EB1239EEC624`.
- Copy the source without visual editing or generated replacements.
- Keep `src/app/icon.svg` as the sole favicon source; remove `src/app/icon.png`.
- Mark `src/app/icon.svg` as `-text` in the repository `.gitattributes` so Windows `core.autocrlf` checkouts preserve the exact approved bytes and SHA-256.
- Replace only the orange header dot; preserve the visible “Cupertino Voices” text and its home link.
- Render the header image in a 28-pixel-square box with its aspect ratio preserved.
- Render the header source as `/icon.svg` through `next/image` with `unoptimized`; do not add an SVG loader, inline path duplication, or a second asset copy.
- Preserve the current header height, desktop navigation alignment, responsive behavior, and light/dark themes.
- From 801 through 900 pixels, keep the 28-pixel mark, navigation, and theme control on one row by using 20-pixel inline header padding, a 1rem horizontal header gap, and 1rem right-side/navigation gaps.
- Do not move the 800-pixel column breakpoint, shrink the approved mark, hide controls, change navigation labels, or add a route-specific page offset.
- Preserve the existing Archive body scroll lock, dialog semantics, focus behavior, animation, and content.
- Use CSS `scrollbar-gutter: stable`; do not add JavaScript padding compensation, fixed-body positioning, or background-scroll behavior.
- Do not modify Archive records, filters, search, dialog copy, navigation labels, footer, package files, or unrelated routes.
- Do not modify or stage the user’s existing `src/components/contribute-form.tsx` change.
- Use the existing npm package manager and do not regenerate `package-lock.json`.
- Remove the obsolete PNG static import and the temporary `src/types/next-image.d.ts` declaration.
- The existing repository-wide lint failure in `src/components/site-header.tsx` at the theme initialization effect is baseline behavior; do not refactor that unrelated logic in this task.

---

### Task 1: Replace the favicon and header dot with the approved SVG

**Files:**
- Modify: `tests/favicon.test.mjs`
- Modify: `tests/site-brand.test.mjs`
- Create: `src/app/icon.svg`
- Delete: `src/app/icon.png`
- Delete: `src/types/next-image.d.ts`
- Modify: `src/components/site-header.tsx:3-8,39-51`
- Verify: `src/app/globals.css:117-142`

**Interfaces:**
- Consumes: The exact SVG at `C:\Users\kchen\Downloads\image1.svg`.
- Produces: `src/app/icon.svg` as the sole Next.js favicon and `/icon.svg` as the header image URL.
- Preserves: The `.site-brand` home link, `.site-brand-text`, visible “Cupertino Voices” label, and 28-pixel `.brand-mark-image` box.

- [ ] **Step 1: Update the favicon and header-brand contracts for SVG**

Replace `tests/favicon.test.mjs` with:

```js
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const iconUrl = new URL("../src/app/icon.svg", import.meta.url);
const oldPngUrl = new URL("../src/app/icon.png", import.meta.url);
const oldFaviconUrl = new URL("../src/app/favicon.ico", import.meta.url);

test("uses the supplied SVG as the sole favicon source", async () => {
  const icon = await readFile(iconUrl);
  const markup = icon.toString("utf8");

  assert.equal(icon.length, 47_135);
  assert.equal(
    createHash("sha256").update(icon).digest("hex"),
    "9e653a8fe83ea0ac8e296ab3d41a7769f2af9302271bdde1e8d7eb1239eec624",
  );
  assert.match(markup, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(
    markup,
    /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 658 652" width="658" height="652">/,
  );
  await assert.rejects(stat(oldPngUrl), { code: "ENOENT" });
  await assert.rejects(stat(oldFaviconUrl), { code: "ENOENT" });
});
```

Update `tests/site-brand.test.mjs` so the header assertions are:

```js
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
```

Keep the existing `.brand-mark-image` CSS assertions in that test. Add:

```js
const imageTypesUrl = new URL(
  "../src/types/next-image.d.ts",
  import.meta.url,
);
await assert.rejects(stat(imageTypesUrl), { code: "ENOENT" });
```

Update its import to:

```js
import { readFile, stat } from "node:fs/promises";
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/favicon.test.mjs tests/site-brand.test.mjs
```

Expected: FAIL because `src/app/icon.svg` does not exist, `src/app/icon.png` and `src/types/next-image.d.ts` still exist, and the header still imports the PNG.

- [ ] **Step 3: Copy the exact SVG and remove superseded PNG artifacts**

Run:

```powershell
$source = 'C:\Users\kchen\Downloads\image1.svg'
$destination = 'F:\Personal\Code\YPSI\YPSI-Sample-History-Website\.worktrees\brand-icon-scrollbar-stability\src\app\icon.svg'
$oldPng = 'F:\Personal\Code\YPSI\YPSI-Sample-History-Website\.worktrees\brand-icon-scrollbar-stability\src\app\icon.png'
$oldTypes = 'F:\Personal\Code\YPSI\YPSI-Sample-History-Website\.worktrees\brand-icon-scrollbar-stability\src\types\next-image.d.ts'

Get-Item -LiteralPath $source
Get-FileHash -Algorithm SHA256 -LiteralPath $source
Get-Item -LiteralPath $oldPng,$oldTypes
Copy-Item -LiteralPath $source -Destination $destination
Remove-Item -LiteralPath $oldPng,$oldTypes
Get-Item -LiteralPath $destination
Get-FileHash -Algorithm SHA256 -LiteralPath $destination
```

Expected: source and destination are both 47,135 bytes with SHA-256 `9E653A8FE83EA0AC8E296AB3D41A7769F2AF9302271BDDE1E8D7EB1239EEC624`; the two exact obsolete files are removed.

- [ ] **Step 4: Render the favicon URL as the compact header image**

Keep the standard import:

```tsx
import Image from "next/image";
```

Delete:

```tsx
import brandMark from "@/app/icon.png";
```

Render:

```tsx
<Image
  src="/icon.svg"
  alt=""
  className="brand-mark-image"
  width={28}
  height={28}
  priority
  unoptimized
/>
```

Keep this existing adjacent text unchanged:

```tsx
<span className="site-brand-text">Cupertino Voices</span>
```

- [ ] **Step 5: Verify compact image sizing remains exact**

Keep this existing rule in `src/app/globals.css`:

```css
.brand-mark-image {
  width: 1.75rem;
  height: 1.75rem;
  object-fit: contain;
  display: block;
  flex: 0 0 auto;
}
```

Confirm no `.brand-mark` orange-dot rule exists.

- [ ] **Step 6: Run focused tests and static checks**

Run:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/favicon.test.mjs tests/site-brand.test.mjs
& 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
& 'C:\Program Files\nodejs\npx.cmd' eslint src/components/site-header.tsx
```

Expected:

- both focused tests pass;
- TypeScript exits 0 without the deleted PNG declaration;
- ESLint reports only the documented baseline `react-hooks/set-state-in-effect` error in the untouched theme initialization effect and no new error from the SVG change.

- [ ] **Step 7: Commit the final SVG brand asset**

```powershell
git add -- tests/favicon.test.mjs tests/site-brand.test.mjs src/app/icon.svg src/app/icon.png src/types/next-image.d.ts src/components/site-header.tsx
git commit -m "feat: use svg site brand icon"
```

---

### Task 2: Reserve the scrollbar gutter during Archive modal scroll lock

**Files:**
- Create: `tests/archive-scroll-stability.test.mjs`
- Modify: `src/app/globals.css:62-64`
- Verify: `src/components/archive-explorer.tsx:52-94`

**Interfaces:**
- Consumes: The root `html` stylesheet rule and existing Archive body scroll-lock effect.
- Produces: A root `scrollbar-gutter: stable` declaration.
- Preserves: `document.body.style.overflow = "hidden"` and exact restoration of the prior inline overflow value.

- [ ] **Step 1: Write the failing scrollbar-stability contract**

Create `tests/archive-scroll-stability.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesUrl = new URL("../src/app/globals.css", import.meta.url);
const explorerUrl = new URL(
  "../src/components/archive-explorer.tsx",
  import.meta.url,
);

test("reserves the root scrollbar gutter while preserving modal scroll lock", async () => {
  const [styles, explorer] = await Promise.all([
    readFile(stylesUrl, "utf8"),
    readFile(explorerUrl, "utf8"),
  ]);

  const htmlRule = styles.match(/html\s*\{(?<body>[^}]*)\}/s);
  assert.ok(htmlRule?.groups?.body);
  assert.match(htmlRule.groups.body, /scrollbar-gutter:\s*stable;/);

  assert.match(
    explorer,
    /const previousOverflow = document\.body\.style\.overflow;/,
  );
  assert.match(explorer, /document\.body\.style\.overflow = "hidden";/);
  assert.match(
    explorer,
    /document\.body\.style\.overflow = previousOverflow;/,
  );
  assert.doesNotMatch(explorer, /paddingRight|position = "fixed"/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/archive-scroll-stability.test.mjs
```

Expected: FAIL because the root `html` rule does not yet declare `scrollbar-gutter: stable`.

- [ ] **Step 3: Add the minimal CSS fix**

Update the existing root rule in `src/app/globals.css` to:

```css
html {
  scroll-behavior: smooth;
  scrollbar-gutter: stable;
}
```

Do not change the Archive component’s scroll-lock effect.

- [ ] **Step 4: Run the focused and Archive regression suites**

Run:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/archive-scroll-stability.test.mjs tests/archive-ui-contract.test.mjs tests/archive-contrast.test.mjs
```

Expected: all tests pass.

- [ ] **Step 5: Run TypeScript and the production build**

Run:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
& 'C:\Program Files\nodejs\npm.cmd' run build
```

Expected: both commands exit 0; the build includes `/archive` and the SVG favicon metadata route.

- [ ] **Step 6: Commit the scrollbar-stability change**

```powershell
git add -- tests/archive-scroll-stability.test.mjs src/app/globals.css
git commit -m "fix: stabilize archive modal scrollbar"
```

---

### Task 3: Run complete automated and browser verification

**Files:**
- Verify: `src/app/icon.svg`
- Verify absent: `src/app/icon.png`
- Verify absent: `src/types/next-image.d.ts`
- Verify: `src/components/site-header.tsx`
- Verify: `src/app/globals.css`
- Verify: `src/components/archive-explorer.tsx`
- Verify: `tests/*.test.mjs`

**Interfaces:**
- Consumes: The complete implementation from Tasks 1 and 2.
- Produces: Evidence that the new branding and scrollbar behavior work without regressions.

- [ ] **Step 1: Run the full focused Node test suite**

Run:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/archive-entries.test.mjs tests/archive-filter.test.mjs tests/archive-ui-contract.test.mjs tests/archive-contrast.test.mjs tests/archive-scroll-stability.test.mjs tests/favicon.test.mjs tests/site-brand.test.mjs
```

Expected: all tests pass with zero failures.

- [ ] **Step 2: Run static and production checks**

Run:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
& 'C:\Program Files\nodejs\npm.cmd' run lint
& 'C:\Program Files\nodejs\npm.cmd' run build
```

Expected:

- TypeScript and build exit 0;
- repository-wide lint reproduces only the approved baseline theme-effect error in `src/components/site-header.tsx` plus the existing unrelated warnings, with no new task-caused error.

- [ ] **Step 3: Start and verify the isolated development server**

Start the worktree on a free port, using 3001 when available:

```powershell
Start-Process -FilePath 'C:\Program Files\nodejs\npm.cmd' `
  -ArgumentList 'run','dev','--','--port','3001' `
  -WorkingDirectory 'F:\Personal\Code\YPSI\YPSI-Sample-History-Website\.worktrees\brand-icon-scrollbar-stability' `
  -WindowStyle Hidden `
  -RedirectStandardOutput "$env:TEMP\ypsi-brand-scroll.stdout.log" `
  -RedirectStandardError "$env:TEMP\ypsi-brand-scroll.stderr.log"
```

Open and inspect the Archive:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi-brand-scroll open 'http://localhost:3001/archive/'
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi-brand-scroll wait --load networkidle
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi-brand-scroll set viewport 1440 1000
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi-brand-scroll snapshot -i
```

Expected: the page has meaningful content, 12 Archive cards, the new header image beside “Cupertino Voices,” and no framework overlay or browser error.

- [ ] **Step 4: Verify favicon and compact header rendering**

In the browser, confirm:

- the icon link points to `/icon.svg`, has type `image/svg+xml`, and uses SVG-compatible sizing metadata such as `sizes="any"`;
- `/icon.svg` returns HTTP 200, 47,135 bytes, and SHA-256 `9E653A8FE83EA0AC8E296AB3D41A7769F2AF9302271BDDE1E8D7EB1239EEC624`;
- `/icon.png` does not resolve successfully, proving the superseded favicon is absent;
- `.brand-mark-image` has natural dimensions 658 by 652;
- its rendered box is 28 by 28 pixels;
- `.site-brand-text` still reads “Cupertino Voices”;
- desktop navigation items share one row.

Repeat at 390 by 844 and confirm the header remains usable without horizontal page overflow.

- [ ] **Step 5: Verify the Archive no longer shifts when a dialog opens**

At 1440 by 1000:

1. Record the left positions of `.site-brand` and `.archive-page-inner`.
2. Confirm `getComputedStyle(document.documentElement).scrollbarGutter` is `stable`.
3. Open “Vallco Before the Demolition.”
4. Record the same left positions again.
5. Confirm both values are unchanged.
6. Confirm `getComputedStyle(document.body).overflow` is `hidden`.
7. Press Escape.
8. Confirm focus returns to the triggering card and body overflow is restored.

Expected: the modal opens without horizontal page/header movement and background scroll remains locked.

- [ ] **Step 6: Verify themes, errors, and final scope**

Confirm:

- the compact mark remains visible in light and dark themes;
- there is no Next.js error overlay and `agent-browser errors` is empty;
- `git diff --check` exits 0;
- only the favicon, header, root CSS, tests, spec, and plan are in task history;
- `src/components/contribute-form.tsx` and package files have no task-branch diff.

- [ ] **Step 7: Close the browser session and stop the isolated server**

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi-brand-scroll close
```

Stop only the exact development-server process started in Step 3.

---

### Task 4: Keep the fixed header stable at intermediate tablet widths

**Files:**
- Modify: `tests/site-brand.test.mjs`
- Modify: `src/app/globals.css:170-190`

**Interfaces:**
- Consumes: The existing fixed `.site-header`, non-wrapping `.site-brand`, wrapping `.site-header-right`, 28-pixel `.brand-mark-image`, and 800-pixel column breakpoint.
- Produces: A compact-spacing rule active only from 801 through 900 pixels.
- Preserves: The approved mark size, all navigation/theme controls, the 74-pixel page offset, the 800-pixel column layout, themes, and route content.

- [ ] **Step 1: Add the failing intermediate-header CSS contract**

Append to `tests/site-brand.test.mjs`:

```js
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
    /\.site-header\s*\{[^}]*gap:\s*1\.2rem 1rem;[^}]*padding-inline:\s*20px;/s,
  );
  assert.match(
    rule,
    /\.site-header-right,\s*\.site-header-right nav\s*\{[^}]*gap:\s*1rem;/s,
  );
  assert.doesNotMatch(rule, /\.brand-mark-image\s*\{/);
});
```

- [ ] **Step 2: Run the focused contract and verify RED**

Run:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/site-brand.test.mjs
```

Expected: FAIL because the 801-to-900-pixel compact-spacing media rule does not exist.

- [ ] **Step 3: Add the minimal compact-spacing rule**

Add to `src/app/globals.css` after the base header controls:

```css
@media (min-width: 801px) and (max-width: 900px) {
  .site-header {
    gap: 1.2rem 1rem;
    padding-inline: 20px;
  }

  .site-header-right,
  .site-header-right nav {
    gap: 1rem;
  }
}
```

Do not change the `.brand-mark-image`, `.story-page`, `.about-page`, `.archive-page`, `.map-page`, or existing `@media (max-width: 800px)` rules.

- [ ] **Step 4: Run focused and complete automated checks**

Run:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/site-brand.test.mjs
& 'C:\Program Files\nodejs\node.exe' --test tests/*.test.mjs
& 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
& 'C:\Program Files\nodejs\npm.cmd' run lint
& 'C:\Program Files\nodejs\npm.cmd' run build
```

Expected:

- the focused and full Node suites pass;
- TypeScript and production build exit 0;
- lint reproduces only the approved baseline theme-effect error plus the three existing unrelated warnings.

- [ ] **Step 5: Verify the intermediate range in a live browser**

Start the isolated worktree on port 3001 and measure the Archive route at widths 801, 820, 834, 850, 870, and 900 pixels, all at 1000 pixels high.

At every width, verify:

- `.site-header` height is less than 74 pixels;
- `.archive-page-inner` top is at least the header bottom;
- the navigation and `.theme-toggle` share one row;
- `.brand-mark-image` remains 28 by 28 pixels;
- horizontal page overflow is not positive;
- the page has 12 Archive cards and no framework overlay or browser errors.

Also re-check at 800 pixels that the existing column breakpoint remains active and the header controls remain usable.

- [ ] **Step 6: Commit the tablet-header correction**

```powershell
git add -- tests/site-brand.test.mjs src/app/globals.css
git commit -m "fix: keep tablet header on one row"
```

---

### Task 5: Preserve the exact SVG bytes across Windows checkouts

**Files:**
- Create: `.gitattributes`
- Modify: `tests/favicon.test.mjs`

**Interfaces:**
- Consumes: The exact `src/app/icon.svg` Git blob and repository checkouts with `core.autocrlf=true`.
- Produces: A path-specific `-text` attribute that disables end-of-line conversion for the favicon.
- Preserves: The approved 47,135-byte SVG, SHA-256, rendering, header URL, and all unrelated text-file line-ending behavior.

- [ ] **Step 1: Add the failing checkout-protection contract**

Update `tests/favicon.test.mjs` to read the repository attributes:

```js
const attributesUrl = new URL("../.gitattributes", import.meta.url);
```

Add:

```js
test("prevents checkout filters from changing the SVG bytes", async () => {
  const attributes = await readFile(attributesUrl, "utf8");

  assert.match(attributes, /^src\/app\/icon\.svg -text$/m);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/favicon.test.mjs
```

Expected: FAIL with `ENOENT` because `.gitattributes` does not exist.

- [ ] **Step 3: Add the minimal path-specific attribute**

Create `.gitattributes` with exactly:

```gitattributes
src/app/icon.svg -text
```

Do not disable text normalization globally or change attributes for other SVG or text files.

- [ ] **Step 4: Run the focused and full automated checks**

Run:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/favicon.test.mjs
& 'C:\Program Files\nodejs\node.exe' --test tests/*.test.mjs
& 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
git diff --check
```

Expected: the focused and full suites pass, TypeScript exits 0, and the diff check is clean.

- [ ] **Step 5: Commit and verify a fresh Windows checkout**

```powershell
git add -- .gitattributes tests/favicon.test.mjs
git commit -m "fix: preserve svg bytes on checkout"
```

Create a temporary detached worktree from the committed head with the repository's `core.autocrlf=true`, then verify:

- `src/app/icon.svg` is 47,135 bytes;
- its SHA-256 is `9E653A8FE83EA0AC8E296AB3D41A7769F2AF9302271BDDE1E8D7EB1239EEC624`;
- `node --test tests/favicon.test.mjs` passes.

Remove only that exact temporary verification worktree with `git worktree remove` after the checks pass.
