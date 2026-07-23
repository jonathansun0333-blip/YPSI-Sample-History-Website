# Modal Gutter Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize the reserved scrollbar gutter's color transition with the story modal's 250-millisecond fade-in and 200-millisecond fade-out.

**Architecture:** Keep the root `html` element as the gutter canvas and use modal lifecycle selectors already exposed in the DOM. A non-closing overlay selects the dark scrim composite, while an `is-closing` overlay selects transparent immediately; state-specific transition durations match the existing overlay keyframes.

**Tech Stack:** Next.js 16, React 19, native CSS, Node built-in test runner, agent-browser.

## Global Constraints

- Keep `scrollbar-gutter: stable`.
- Keep the existing body overflow lock and restoration unchanged.
- Keep the exact 70% scrim composite in light and dark themes.
- Do not add component state, DOM classes, JavaScript event handling, or scrollbar compensation.
- Match the existing overlay timing: 250 milliseconds on open and 200 milliseconds on close.
- Disable the root transition under `prefers-reduced-motion: reduce`.
- Do not modify or stage the user's existing `src/components/contribute-form.tsx` change.

---

### Task 1: Synchronize the root gutter transition

**Files:**
- Modify: `tests/archive-scroll-stability.test.mjs`
- Modify: `src/app/globals.css:62-84,1765-1771`

**Interfaces:**
- Consumes: `.story-modal-overlay`, `.archive-modal-overlay`, `.is-closing`, `--surface`, and the existing modal keyframe durations.
- Produces: Root background-color transitions that begin with each modal lifecycle phase.
- Preserves: Root gutter reservation, body scroll lock, modal DOM, and focus behavior.

- [ ] **Step 1: Write the failing transition contract**

Update the modal canvas test to require:

```js
assert.match(htmlRule.groups.body, /transition:\s*background-color 0\.25s ease;/);
assert.match(
  styles,
  /html:has\(\.story-modal-overlay:not\(\.is-closing\)\),\s*html:has\(\.archive-modal-overlay:not\(\.is-closing\)\)/s,
);
assert.match(
  styles,
  /html:has\(\.story-modal-overlay\.is-closing\),\s*html:has\(\.archive-modal-overlay\.is-closing\)\s*\{[^}]*background-color:\s*transparent;[^}]*transition-duration:\s*0\.2s;/s,
);
```

Also require the reduced-motion query to include `html` with `transition: none`.

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/archive-scroll-stability.test.mjs
```

Expected: the transition test fails because the dark selector includes closing overlays, the root uses the global 350-millisecond transition, and no closing or reduced-motion root rule exists.

- [ ] **Step 3: Implement the minimal CSS lifecycle**

Use:

```css
html {
  scroll-behavior: smooth;
  scrollbar-gutter: stable;
  transition: background-color 0.25s ease;
}

html:has(.story-modal-overlay:not(.is-closing)),
html:has(.archive-modal-overlay:not(.is-closing)) {
  background-color: color-mix(
    in srgb,
    var(--surface) 30%,
    rgb(33 28 21) 70%
  );
}

html:has(.story-modal-overlay.is-closing),
html:has(.archive-modal-overlay.is-closing) {
  background-color: transparent;
  transition-duration: 0.2s;
}
```

Add `html` to the reduced-motion transition reset.

- [ ] **Step 4: Run focused and full automated checks**

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/archive-scroll-stability.test.mjs
& 'C:\Program Files\nodejs\node.exe' --test tests/*.test.mjs
& 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
& 'C:\Program Files\nodejs\npm.cmd' run build
git diff --check
```

Expected: 23 tests pass, TypeScript and the production build exit 0, and the focused task diff is clean.

- [ ] **Step 5: Verify live timing and interactions**

At `http://localhost:3000/archive/`, sample root and overlay styles during opening and closing in light and dark themes. Confirm the root changes during the 250-millisecond opening phase, becomes transparent during the 200-millisecond closing phase, remains transparent after unmount, retains a 15-pixel reserved gutter, restores focus and body overflow, and reports no browser errors.

- [ ] **Step 6: Commit only focused files**

```powershell
git add -- src/app/globals.css tests/archive-scroll-stability.test.mjs docs/superpowers/specs/2026-07-23-modal-gutter-transition-design.md docs/superpowers/plans/2026-07-23-modal-gutter-transition.md
git commit -m "fix: synchronize modal gutter transition"
```
