# Brand Icon and Archive Scrollbar Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the favicon and header dot with the newly supplied Cupertino Voices image, then eliminate Archive modal layout shift by reserving the root scrollbar gutter.

**Architecture:** Keep `src/app/icon.png` as the single source used by Next.js file-based favicon metadata and import that same static asset into `SiteHeader` through `next/image`. Preserve the existing body scroll lock and add `scrollbar-gutter: stable` to the root `html` rule so classic scrollbar space remains reserved while a story dialog is open.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, native CSS, Node 24 built-in test runner, `next/image`, npm, agent-browser.

## Global Constraints

- Treat `C:\Users\kchen\Downloads\image1.png` as the exact source asset.
- The source is a 658 by 652 PNG, 122,972 bytes, SHA-256 `D61AD30068B74EBE4FA87A3F02630DCF3109872554B2EF89467FD328A75A65D5`.
- Copy the source without visual editing or generated replacements.
- Replace only the orange header dot; preserve the visible “Cupertino Voices” text and its home link.
- Render the header image in a 28-pixel-square box with its aspect ratio preserved.
- Preserve the current header height, desktop navigation alignment, responsive behavior, and light/dark themes.
- Preserve the existing Archive body scroll lock, dialog semantics, focus behavior, animation, and content.
- Use CSS `scrollbar-gutter: stable`; do not add JavaScript padding compensation, fixed-body positioning, or background-scroll behavior.
- Do not modify Archive records, filters, search, dialog copy, navigation labels, footer, package files, or unrelated routes.
- Do not modify or stage the user’s existing `src/components/contribute-form.tsx` change.
- Use the existing npm package manager and do not regenerate `package-lock.json`.
- The existing repository-wide lint failure in `src/components/site-header.tsx` at the theme initialization effect is baseline behavior; do not refactor that unrelated logic in this task.

---

### Task 1: Replace the favicon and header dot with the new image

**Files:**
- Modify: `tests/favicon.test.mjs`
- Create: `tests/site-brand.test.mjs`
- Modify: `src/app/icon.png`
- Modify: `src/components/site-header.tsx:3-4,37-40`
- Modify: `src/app/globals.css:117-140`

**Interfaces:**
- Consumes: The exact PNG at `C:\Users\kchen\Downloads\image1.png`.
- Produces: `src/app/icon.png` as the Next.js favicon and `brandMark` static import used by `SiteHeader`.
- Preserves: The `.site-brand` link, `.site-brand-text`, and visible “Cupertino Voices” label.

- [ ] **Step 1: Update the favicon test and add the failing header-brand contract**

Replace `tests/favicon.test.mjs` with:

```js
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const iconUrl = new URL("../src/app/icon.png", import.meta.url);
const oldFaviconUrl = new URL("../src/app/favicon.ico", import.meta.url);

test("uses the supplied 658 by 652 PNG as the sole favicon source", async () => {
  const icon = await readFile(iconUrl);

  assert.deepEqual(
    [...icon.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
  );
  assert.equal(icon.length, 122_972);
  assert.equal(icon.readUInt32BE(16), 658);
  assert.equal(icon.readUInt32BE(20), 652);
  assert.equal(
    createHash("sha256").update(icon).digest("hex"),
    "d61ad30068b74ebe4fa87a3f02630dcf3109872554b2ef89467fd328a75a65d5",
  );
  await assert.rejects(stat(oldFaviconUrl), { code: "ENOENT" });
});
```

Create `tests/site-brand.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const headerUrl = new URL("../src/components/site-header.tsx", import.meta.url);
const stylesUrl = new URL("../src/app/globals.css", import.meta.url);

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
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/favicon.test.mjs tests/site-brand.test.mjs
```

Expected: FAIL because `src/app/icon.png` is still the old 960 by 720 image and `SiteHeader` still renders the `.brand-mark` span.

- [ ] **Step 3: Verify and copy the exact binary asset**

Run:

```powershell
$source = 'C:\Users\kchen\Downloads\image1.png'
$destination = 'F:\Personal\Code\YPSI\YPSI-Sample-History-Website\.worktrees\brand-icon-scrollbar-stability\src\app\icon.png'

Get-Item -LiteralPath $source
Get-FileHash -Algorithm SHA256 -LiteralPath $source
Copy-Item -LiteralPath $source -Destination $destination
Get-FileHash -Algorithm SHA256 -LiteralPath $destination
```

Expected: source and destination are both 122,972 bytes with SHA-256 `D61AD30068B74EBE4FA87A3F02630DCF3109872554B2EF89467FD328A75A65D5`.

- [ ] **Step 4: Replace the dot markup with the image**

In `src/components/site-header.tsx`, add these imports:

```tsx
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import brandMark from "@/app/icon.png";
```

Replace the current `.brand-mark` span inside the brand link with:

```tsx
<Image
  src={brandMark}
  alt=""
  className="brand-mark-image"
  width={28}
  height={28}
  priority
/>
```

Keep this existing adjacent text unchanged:

```tsx
<span className="site-brand-text">Cupertino Voices</span>
```

- [ ] **Step 5: Replace the orange-dot CSS with compact image sizing**

In `src/app/globals.css`, delete:

```css
.brand-mark {
  width: 0.56rem;
  height: 0.56rem;
  background: var(--rust);
  border-radius: 50%;
  display: inline-block;
}
```

Add:

```css
.brand-mark-image {
  width: 1.75rem;
  height: 1.75rem;
  object-fit: contain;
  display: block;
  flex: 0 0 auto;
}
```

- [ ] **Step 6: Run focused tests and static checks**

Run:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/favicon.test.mjs tests/site-brand.test.mjs
& 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
& 'C:\Program Files\nodejs\npx.cmd' eslint src/components/site-header.tsx
```

Expected:

- both focused tests pass;
- TypeScript exits 0;
- ESLint reports only the documented baseline `react-hooks/set-state-in-effect` error in the untouched theme initialization effect and no new error from the image change.

- [ ] **Step 7: Commit the brand asset and header change**

```powershell
git add -- tests/favicon.test.mjs tests/site-brand.test.mjs src/app/icon.png src/components/site-header.tsx src/app/globals.css
git commit -m "feat: update site brand icon"
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

Expected: both commands exit 0; the build includes `/archive` and `/icon.png`.

- [ ] **Step 6: Commit the scrollbar-stability change**

```powershell
git add -- tests/archive-scroll-stability.test.mjs src/app/globals.css
git commit -m "fix: stabilize archive modal scrollbar"
```

---

### Task 3: Run complete automated and browser verification

**Files:**
- Verify: `src/app/icon.png`
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

- the icon link is `image/png` with `sizes="658x652"`;
- `/icon.png` returns HTTP 200, 122,972 bytes, and the specified SHA-256;
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
