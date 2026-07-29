# Footer Contribution Links

## Goal

Turn the footer's “Contribute a Story,” “Volunteer,” and “Contact” labels into
links that open the About page at the “Have a story worth keeping?” section
with the appropriate “What would you like to share?” selection.

## Navigation Contract

- “Contribute a Story” links to `/about#cv-contribute` and keeps the existing
  default selection, “An oral history interview.”
- “Volunteer” links to `/about#cv-contribute-volunteer` and selects “I want to
  volunteer.”
- “Contact” links to `/about#cv-contribute-contact` and selects “Something
  else.”
- All three hashes scroll to the same contribution panel.
- The links must work from every route because the shared root layout owns the
  footer.

## Form Behavior

- The submission type select becomes controlled by React state.
- Its initial server-rendered/default value remains “An oral history
  interview.”
- On the client, the form maps the current location hash to the requested
  selection.
- The form listens for `hashchange` so links clicked while already on the About
  page and browser back/forward navigation update the selection.
- Unknown or missing hashes fall back to “An oral history interview.”
- A visitor may still manually change the selection after navigation.

## Scrolling and Presentation

- Keep `id="cv-contribute"` on the contribution panel.
- Add zero-height anchor targets for the volunteer and contact hashes at the
  top of the same panel.
- Apply the same scroll margin to all three targets so the fixed site header
  does not obscure the section.
- Do not change the footer's columns, visual styling, form fields, wording, or
  Google Form submission destination.

## Platform Constraints

- Use native anchors with the existing `withBasePath` helper so production
  base-path handling remains compatible with the GitHub Pages static export.
- Do not route these three same-page hash changes through Next.js `Link`.
  Next.js 16.2.10's segment-cache navigation can retain the previous fragment
  in `route.canonicalUrl` and append the requested fragment, producing an
  invalid compounded hash after a second footer click.
- Use URL hashes rather than storage or query parameters so the destinations
  remain bookmarkable and require no server-side or Suspense-dependent state.
- Add no dependencies.

## Verification

- Add an automated contract test for the three exact footer destinations, the
  three selection outcomes, the controlled select, the hash-change listener,
  and the shared anchor position.
- Run the focused test, full test suite, lint, TypeScript, production build,
  and `git diff --check`.
- In a browser, verify each footer link from a non-About route and verify
  same-page switching on the About route, including scroll position and the
  selected option.
