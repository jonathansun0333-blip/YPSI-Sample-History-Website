# Modal Gutter and Double Brand Icon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Darken the reserved scrollbar gutter with the modal scrim and double the header mark to 56 by 56 pixels without fixed-header or responsive regressions.

**Architecture:** Paint the root canvas with the same 70% scrim composite whenever an existing story overlay is present, leaving the current stable gutter and body scroll lock unchanged. Use a real 56-pixel Next Image/CSS box and offset its extra height with compact vertical header padding; tighten only the existing intermediate-width inline padding.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, native CSS, Node built-in test runner, agent-browser or local Chromium CDP.

## Global Constraints

- Keep `scrollbar-gutter: stable` and the existing `document.body.style.overflow = "hidden"` lock/restoration.
- Use CSS root state via `:has`; do not add modal-state JavaScript, padding compensation, fixed-body positioning, or background scrolling.
- Match the current `rgba(33, 28, 21, 0.7)` scrim with `color-mix(in srgb, var(--surface) 30%, rgb(33 28 21) 70%)`.
- Change the mark from exactly 28 by 28 pixels to exactly 56 by 56 pixels in both Next Image attributes and CSS.
- Preserve empty alternative text, the visible “Cupertino Voices” label, and the home link.
- Keep the fixed header below the existing 74-pixel page offset at widths above the 800-pixel column breakpoint.
- Keep navigation labels, theme control, 800-pixel column breakpoint, routes, Archive records/content, modal panel, focus behavior, and package files unchanged.
- Preserve the exact favicon asset, `.gitattributes` protection, and SVG hash.
- Do not modify or stage the user’s existing `src/components/contribute-form.tsx` change.
- The existing lint baseline is one theme-effect error and three unrelated warnings; do not refactor those files.

---

### Task 1: Paint the reserved modal gutter

**Files:**
- Modify: `tests/archive-scroll-stability.test.mjs`
- Modify: `src/app/globals.css:62-70`

**Interfaces:**
- Consumes: Root `scrollbar-gutter: stable`, `--surface`, `.story-modal-overlay`, and `.archive-modal-overlay`.
- Produces: A root modal-state background matching the existing 70% scrim composite.
- Preserves: Existing overlay background, modal DOM, body scroll lock, close animation, and scrollbar reservation.

- [ ] **Step 1: Add the failing root-canvas contract**

Append to `tests/archive-scroll-stability.test.mjs`:

```js
test("darkens the reserved root gutter while a story modal exists", async () => {
  const styles = await readFile(stylesUrl, "utf8");
  const modalCanvasRule = styles.match(
    /html:has\(\.story-modal-overlay\),\s*html:has\(\.archive-modal-overlay\)\s*\{(?<body>[^}]*)\}/s,
  );

  assert.ok(modalCanvasRule?.groups?.body);
  assert.match(
    modalCanvasRule.groups.body,
    /background-color:\s*color-mix\(\s*in srgb,\s*var\(--surface\) 30%,\s*rgb\(33 28 21\) 70%\s*\);/s,
  );
});
```

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/archive-scroll-stability.test.mjs
```

Expected: one pass and one failure because the root modal-state rule is absent.

- [ ] **Step 3: Add the minimal root-canvas rule**

Add after the base `html` rule:

```css
html:has(.story-modal-overlay),
html:has(.archive-modal-overlay) {
  background-color: color-mix(
    in srgb,
    var(--surface) 30%,
    rgb(33 28 21) 70%
  );
}
```

- [ ] **Step 4: Run focused tests and verify GREEN**

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/archive-scroll-stability.test.mjs tests/archive-ui-contract.test.mjs
```

Expected: all focused tests pass.

---

### Task 2: Double the brand mark while preserving header geometry

**Files:**
- Modify: `tests/site-brand.test.mjs`
- Modify: `src/components/site-header.tsx:39-48`
- Modify: `src/app/globals.css:99-175,919-923`

**Interfaces:**
- Consumes: `/icon.svg`, `.brand-mark-image`, fixed `.site-header`, 74-pixel page offsets, the 801-to-900 compact rule, and max-540 inline padding.
- Produces: A true 56-by-56-pixel mark within a fixed header that remains below 74 pixels above the column breakpoint.
- Preserves: Link semantics, title copy, icon aspect ratio, navigation, themes, and existing breakpoints.

- [ ] **Step 1: Update the header contracts for the doubled mark**

In `tests/site-brand.test.mjs`, change the image assertions to:

```js
assert.match(imageMarkup, /width=\{56\}/);
assert.match(imageMarkup, /height=\{56\}/);
```

Change the CSS size assertions to:

```js
assert.match(imageRule.groups.body, /width:\s*3\.5rem;/);
assert.match(imageRule.groups.body, /height:\s*3\.5rem;/);
```

Add:

```js
const headerRule = styles.match(/\.site-header\s*\{(?<body>[^}]*)\}/s);
assert.ok(headerRule?.groups?.body);
assert.match(headerRule.groups.body, /padding:\s*0\.25rem 2rem;/);
```

Update the intermediate-width assertion from `padding-inline: 20px` to:

```js
padding-inline:\s*12px;
```

Add a max-540 contract:

```js
const smallQuery = "@media (max-width: 540px)";
const smallStart = styles.indexOf(smallQuery);
assert.notEqual(smallStart, -1);
const smallRemainder = styles.slice(smallStart);
const smallNextMedia = smallRemainder.indexOf("\n@media", smallQuery.length);
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
```

- [ ] **Step 2: Run the focused contract and verify RED**

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/site-brand.test.mjs
```

Expected: failures for the old 28-pixel markup, 1.75rem CSS size, base padding, intermediate padding, and small-screen shorthand.

- [ ] **Step 3: Implement the minimal doubled-mark geometry**

In `src/components/site-header.tsx`, use:

```tsx
width={56}
height={56}
```

Update base CSS:

```css
.site-header {
  /* existing declarations */
  padding: 0.25rem 2rem;
}

.brand-mark-image {
  width: 3.5rem;
  height: 3.5rem;
  object-fit: contain;
  display: block;
  flex: 0 0 auto;
}
```

In the 801-to-900 rule:

```css
padding-inline: 12px;
```

In the max-540 rule:

```css
.site-header {
  padding-inline: 20px;
}
```

- [ ] **Step 4: Run the focused and full automated gates**

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/site-brand.test.mjs tests/archive-scroll-stability.test.mjs
& 'C:\Program Files\nodejs\node.exe' --test tests/*.test.mjs
& 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
& 'C:\Program Files\nodejs\npm.cmd' run build
git diff --check
```

Expected: 23 total Node tests pass, TypeScript and build exit 0, and the task diff is clean.

---

### Task 3: Verify the live modal gutter and responsive header

**Files:**
- Verify: `src/app/globals.css`
- Verify: `src/components/site-header.tsx`
- Verify: `src/components/archive-explorer.tsx`
- Verify: `src/app/icon.svg`

**Interfaces:**
- Consumes: Tasks 1 and 2.
- Produces: Runtime evidence for visual matching, geometry, interactions, and regression safety.

- [ ] **Step 1: Start the isolated worktree server**

Use port 3001 when free. Do not inspect, stop, or replace the user’s port-3000 process.

- [ ] **Step 2: Verify desktop modal gutter in both themes**

At 1440 by 1000 in light and dark themes:

- open an Archive story;
- confirm the overlay right edge stops before the reserved gutter;
- sample the gutter/root canvas and verify it equals the computed 70% scrim composite;
- confirm there is no visibly light strip;
- confirm body overflow is `hidden`;
- record `.site-brand` and `.archive-page-inner` left positions before/open and verify they do not change;
- close with Escape and verify overflow restoration and focus return.

Capture an open-modal screenshot in each theme.

- [ ] **Step 3: Verify doubled mark and header geometry**

At 801, 820, 834, 850, 870, 900, and 1440 pixels wide:

- `.brand-mark-image` renders 56 by 56 pixels;
- `.site-header` height is below 74 pixels;
- Archive content begins at or below the header bottom;
- navigation and theme control remain on one row;
- no positive horizontal overflow exists.

At 800 and 390 pixels wide, confirm the existing column/mobile layouts remain usable, the mark is 56 by 56, controls remain visible, and no positive horizontal overflow exists.

- [ ] **Step 4: Verify content, errors, and scope**

Confirm 12 Archive cards, no framework overlay, no browser errors, exact favicon hash, unchanged body scroll-lock source, and no task diff in `src/components/contribute-form.tsx` or package files.

- [ ] **Step 5: Clean up and commit**

Close the browser, stop only the isolated server, then commit:

```powershell
git add -- tests/archive-scroll-stability.test.mjs tests/site-brand.test.mjs src/app/globals.css src/components/site-header.tsx
git commit -m "fix: align modal gutter and enlarge brand icon"
```
