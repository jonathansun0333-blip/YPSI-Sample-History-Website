# Modal Gutter Transition Design

## Goal

Make the reserved right scrollbar gutter fade with the story modal backdrop when a story opens and closes, while preserving the stable gutter and existing body scroll lock.

## Root Cause

The root canvas currently darkens whenever it contains either modal overlay. During close, the overlay remains mounted with `is-closing` for 200 milliseconds, so the root stays fully dark while the overlay fades away. Only after unmount does the root begin its separate 350-millisecond transition to transparent. This makes the right gutter visibly lag behind the rest of the page.

## Selected Design

The root canvas will use the same timing and state boundaries as the overlay:

- the non-closing modal state darkens the root over the overlay's 250-millisecond fade-in;
- the `is-closing` modal state immediately returns the root to transparent over the overlay's 200-millisecond fade-out;
- after the overlay unmounts, the root remains transparent, so there is no second transition;
- reduced-motion mode disables the root transition together with the existing Archive modal animation.

The root remains the owner of `scrollbar-gutter: stable`. The existing `color-mix` continues to match the 70% modal scrim over the active light or dark surface. No component state, event handling, scroll-lock code, or modal timing changes are needed.

## Scope

Expected implementation files:

- `src/app/globals.css`
- `tests/archive-scroll-stability.test.mjs`

The modal components, Archive content, header, icon, favicon, package files, and the user's existing `src/components/contribute-form.tsx` edit are out of scope.

## Verification

Automated contracts will verify:

- the root transition uses 250 milliseconds for opening;
- only non-closing overlays select the dark root color;
- closing overlays select transparent with a 200-millisecond transition;
- reduced-motion mode disables the root transition;
- stable gutter reservation and body overflow lock/restoration remain unchanged.

Browser verification will sample the gutter during open and close. The root color must start changing immediately in both directions, reach the dark composite with the opening overlay, reach transparent with the closing overlay, and remain transparent after unmount. The page must retain 12 Archive cards, a 15-pixel reserved gutter, focus return, and an error-free console.

## Acceptance Criteria

1. The gutter darkens progressively while the story overlay fades in.
2. The gutter starts returning to the original page background as soon as the overlay begins fading out.
3. No delayed second gutter transition occurs after the overlay unmounts.
4. Light theme, dark theme, stable layout, scroll lock, Escape close, and focus return remain intact.
5. Reduced-motion preferences remain respected.
6. The unrelated `contribute-form.tsx` working-tree change remains unstaged and untouched.
