# Brand Icon and Archive Scrollbar Stability Design

## Goal

Use the newly supplied Cupertino Voices image consistently as the site favicon and compact header mark, and prevent the Archive page from shifting horizontally when a story dialog locks background scrolling.

## Source Asset

- Source: `C:\Users\kchen\Downloads\image1.svg`
- SVG viewport: 658 by 652
- File size: 47,135 bytes
- SHA-256: `9E653A8FE83EA0AC8E296AB3D41A7769F2AF9302271BDDE1E8D7EB1239EEC624`

The source image must be copied without visual editing or generated replacements.

## Brand Treatment

The source is copied to `src/app/icon.svg`, allowing the Next.js App Router to serve it as the sole favicon at `/icon.svg`. The superseded `src/app/icon.png` is removed.

The same image becomes a compact, decorative brand mark in the top-left site header:

- replace only the existing orange dot;
- preserve the adjacent “Cupertino Voices” text and home link;
- render the image in a 28-pixel-square box with its aspect ratio preserved;
- use empty alternative text because the adjacent visible brand text supplies the accessible name;
- preserve the current header height, navigation alignment, responsive behavior, and light/dark themes.

The old circular `.brand-mark` element and styling are removed. The replacement uses `next/image` with `src="/icon.svg"`, `unoptimized`, an empty alternative string, and the existing `.brand-mark-image` sizing class. A URL source avoids an SVG loader, inline path duplication, and a second asset copy.

## Intermediate-Width Header Stability

The 28-pixel mark makes the non-wrapping brand about 19 pixels wider than the original dot. The header's right-side controls may wrap, while the fixed header and page content retain a 74-pixel offset until the column layout begins at 800 pixels. Browser reproduction showed that this newly extends the two-row fixed-header state into widths where the original header remained one row.

The approved correction keeps the header on one row from 801 through 900 pixels by compacting horizontal spacing only:

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

The rule preserves the 28-pixel icon, navigation labels, theme control, fixed-header height, 74-pixel page offset, and existing column breakpoint. It does not hide controls, shrink the approved mark, or add route-specific offsets.

## Scrollbar Stability

The current Archive dialog sets `document.body.style.overflow = "hidden"` while open. In browsers with classic non-overlay scrollbars, that removes the viewport scrollbar and widens the available layout area, causing centered content and the fixed header to shift.

The approved solution is to reserve the root scrollbar gutter with CSS:

```css
html {
  scrollbar-gutter: stable;
}
```

The existing body scroll lock remains unchanged. Modern browsers reserve the scrollbar space when the dialog opens, so the page width stays stable while background scrolling remains disabled. On platforms with overlay scrollbars, the rule introduces no unnecessary gutter.

No JavaScript padding compensation, fixed-body positioning, or background-scroll behavior will be added.

## Scope

Expected implementation files:

- `src/app/icon.svg`
- remove `src/app/icon.png`
- remove the now-unneeded `src/types/next-image.d.ts`
- `src/components/site-header.tsx`
- `src/app/globals.css`
- focused tests under `tests/`

The Archive records, search/filter behavior, dialog content, navigation labels, footer, other page content, package files, and the user’s uncommitted `src/components/contribute-form.tsx` change are out of scope.

## Verification

Automated tests will verify:

- `src/app/icon.svg` exactly matches the new source image;
- the obsolete `src/app/icon.png`, its static import, and `src/types/next-image.d.ts` are absent;
- the old orange-dot element is replaced by the image-based header mark;
- the visible “Cupertino Voices” text remains;
- the 801-to-900-pixel compact-spacing rule is present;
- the root stylesheet reserves a stable scrollbar gutter;
- the existing Archive body scroll lock remains intact.

Browser verification will confirm:

- `/icon.svg` returns the exact source bytes with `image/svg+xml`;
- the compact header mark is readable and aligned on desktop and mobile in light and dark themes;
- the header navigation and theme control remain on one row at 801, 820, 834, 850, 870, and 900 pixels;
- the fixed header retains its single-row height and the Archive content remains below it throughout that intermediate range;
- opening and closing an Archive story does not change measured page/header alignment;
- background scrolling is still locked while the dialog is open;
- dialog keyboard behavior and focus return still work;
- no runtime errors or framework error overlay appears.

## Acceptance Criteria

1. The new SVG with a 658 by 652 viewport is the sole site favicon.
2. The same image replaces only the top-left orange dot and sits beside the unchanged “Cupertino Voices” text.
3. Opening an Archive story does not cause horizontal page movement in browsers with classic scrollbars.
4. Background scrolling remains disabled while the dialog is open.
5. Existing responsive, theme, navigation, Archive, and accessibility behavior remains intact.
6. The user’s unrelated uncommitted work is preserved and unstaged.
7. The fixed header remains one row without content overlap from 801 through 900 pixels.
