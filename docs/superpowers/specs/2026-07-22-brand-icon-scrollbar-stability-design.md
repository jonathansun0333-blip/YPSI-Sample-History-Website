# Brand Icon and Archive Scrollbar Stability Design

## Goal

Use the newly supplied Cupertino Voices image consistently as the site favicon and compact header mark, and prevent the Archive page from shifting horizontally when a story dialog locks background scrolling.

## Source Asset

- Source: `C:\Users\kchen\Downloads\image1.png`
- Dimensions: 658 by 652 pixels
- File size: 122,972 bytes
- SHA-256: `D61AD30068B74EBE4FA87A3F02630DCF3109872554B2EF89467FD328A75A65D5`

The source image must be copied without visual editing or generated replacements.

## Brand Treatment

The new image replaces `src/app/icon.png`, allowing the Next.js App Router to serve it as the favicon.

The same image becomes a compact, decorative brand mark in the top-left site header:

- replace only the existing orange dot;
- preserve the adjacent “Cupertino Voices” text and home link;
- render the image in a 28-pixel-square box with its aspect ratio preserved;
- use empty alternative text because the adjacent visible brand text supplies the accessible name;
- preserve the current header height, navigation alignment, responsive behavior, and light/dark themes.

The old circular `.brand-mark` element and styling will be removed. The replacement image will use a dedicated `.brand-mark-image` class.

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

- `src/app/icon.png`
- `src/components/site-header.tsx`
- `src/app/globals.css`
- focused tests under `tests/`

The Archive records, search/filter behavior, dialog content, navigation labels, footer, other page content, package files, and the user’s uncommitted `src/components/contribute-form.tsx` change are out of scope.

## Verification

Automated tests will verify:

- `src/app/icon.png` exactly matches the new source image;
- the old orange-dot element is replaced by the image-based header mark;
- the visible “Cupertino Voices” text remains;
- the root stylesheet reserves a stable scrollbar gutter;
- the existing Archive body scroll lock remains intact.

Browser verification will confirm:

- the favicon response uses the new image;
- the compact header mark is readable and aligned on desktop and mobile in light and dark themes;
- the header navigation remains on one line at the current desktop breakpoint;
- opening and closing an Archive story does not change measured page/header alignment;
- background scrolling is still locked while the dialog is open;
- dialog keyboard behavior and focus return still work;
- no runtime errors or framework error overlay appears.

## Acceptance Criteria

1. The new 658 by 652 image is the site favicon.
2. The same image replaces only the top-left orange dot and sits beside the unchanged “Cupertino Voices” text.
3. Opening an Archive story does not cause horizontal page movement in browsers with classic scrollbars.
4. Background scrolling remains disabled while the dialog is open.
5. Existing responsive, theme, navigation, Archive, and accessibility behavior remains intact.
6. The user’s unrelated uncommitted work is preserved and unstaged.
