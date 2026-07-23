# Modal Gutter and Double Brand Icon Design

## Goal

Make the reserved scrollbar gutter visually join the dark modal scrim, and double the top-left Cupertino Voices mark from 28 by 28 pixels to 56 by 56 pixels without causing fixed-header overlap or responsive wrapping regressions.

## Modal Gutter

The root `html` element owns the `scrollbar-gutter: stable` space. The fixed Archive overlay ends at the scrollable viewport edge, so the reserved gutter continues showing the light root canvas while the rest of the page is darkened.

The selected solution paints the root canvas whenever either existing story overlay is present:

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

This matches the existing `rgba(33, 28, 21, 0.7)` scrim composited over the current light or dark `--surface`. It requires no new component state, DOM class toggling, scrollbar compensation, or change to the existing body scroll lock. The existing global background-color transition softens entry and exit.

## Double Brand Icon

The header mark becomes a true 56-by-56-pixel image:

- Next Image `width` and `height` become `56`;
- `.brand-mark-image` becomes `3.5rem` square;
- empty alternative text remains because the adjacent “Cupertino Voices” text names the home link.

To keep the fixed header below the existing 74-pixel page offset, base vertical padding changes from `1rem` to `0.25rem` while horizontal padding remains `2rem`. At widths up to 540 pixels, the existing rule changes from full padding replacement to `padding-inline: 20px`, preserving the compact vertical padding.

The wider mark adds 28 pixels to the brand row. The existing 801-to-900-pixel compact rule therefore reduces inline header padding from 20 to 12 pixels. Navigation labels, the theme control, the 800-pixel column breakpoint, and page offsets remain unchanged.

## Scope

Expected implementation files:

- `src/components/site-header.tsx`
- `src/app/globals.css`
- `tests/site-brand.test.mjs`
- `tests/archive-scroll-stability.test.mjs`

The favicon asset and hash, Archive content, modal panel layout, focus behavior, scroll locking, navigation labels, route content, package files, and the user’s existing `src/components/contribute-form.tsx` edit are out of scope.

## Verification

Automated contracts will verify:

- the header image uses 56-by-56 intrinsic layout dimensions;
- its CSS box is `3.5rem` square;
- base header vertical padding is `0.25rem`;
- the intermediate rule uses 12-pixel inline padding;
- the small-screen rule preserves base vertical padding;
- the root modal-state selector paints the exact 70% scrim composite;
- `scrollbar-gutter: stable` and body overflow lock/restoration remain.

Browser verification will confirm:

- the right gutter matches the darkened modal background in light and dark themes;
- opening and closing a story still preserves horizontal positions and body scroll locking;
- the header mark renders 56 by 56 pixels;
- the fixed header stays below 74 pixels at 801, 820, 834, 850, 870, 900, and 1440 pixels;
- the existing 800-pixel column layout and 390-pixel mobile layout remain usable without positive horizontal overflow;
- all 12 Archive cards, Escape close, focus return, themes, and error-free rendering remain intact.

## Acceptance Criteria

1. No light scrollbar-gutter strip remains while a story modal is open.
2. The top-left mark is exactly twice its prior rendered width and height: 56 by 56 pixels.
3. The mark remains beside the unchanged “Cupertino Voices” home link.
4. The header does not cover page content or introduce intermediate-width wrapping.
5. Existing modal scroll lock, layout stability, keyboard behavior, themes, navigation, and Archive content remain intact.
6. The unrelated `contribute-form.tsx` working-tree change remains unstaged and untouched.
