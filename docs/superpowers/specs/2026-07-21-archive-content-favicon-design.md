# Archive Content and Favicon Design

## Objective

Replace every placeholder record on `/archive` with the 12 finalized oral-history records from `C:\Users\kchen\Downloads\Cupertino Oral Histories.pdf`, preserve the existing archive presentation and modal interaction, and use `C:\Users\kchen\Downloads\image.png` as the browser favicon.

The PDF is the source of truth. Names, titles, durations, punctuation, metadata, summaries, eras, categories, and full story text must not be invented or supplemented.

## Scope

This change is limited to:

- The archive page introduction.
- The archive data model and 12 records.
- Archive cards, filters, search, and the existing detail modal.
- Archive-specific styles needed for the finalized content and accessibility.
- The browser favicon.

Navigation, header branding, homepage, About page, footer, other routes, and global typography remain unchanged. The existing user modification in `src/components/contribute-form.tsx` is unrelated and must not be changed.

## Design Read

This is a preservation-focused editorial archive for a local-history audience. The design remains warm, restrained, and heritage-oriented, using the existing Newsreader and Archivo typography, rust accent, sharp geometry, light/dark theme tokens, and four-column desktop archive grid.

- `DESIGN_VARIANCE: 5`: Preserve the current offset editorial layout and responsive grid.
- `MOTION_INTENSITY: 3`: Keep the existing hover and modal transitions without adding decorative motion.
- `VISUAL_DENSITY: 5`: Present complete source metadata while keeping cards readable and aligned.
- Redesign mode: Preserve.

The explicit source-format requirement overrides the installed taste skill's general dash restriction. PDF punctuation, including em dashes, middle dots, curly apostrophes, and date-range dashes, remains intact.

## Existing Architecture

- `src/app/archive/page.tsx` renders the `/archive` shell, metadata, heading, lead text, and `ArchiveExplorer`.
- `src/components/archive-explorer.tsx` currently owns placeholder data, filters, search, cards, and the detail modal.
- `src/app/globals.css` contains the archive page, card, controls, modal, responsive, and theme styles.
- `src/app/favicon.ico` is the current browser icon.

The implementation will modify this architecture rather than creating a second archive system. Detail content will continue to use the existing modal, not new per-entry routes.

## Data Architecture

Create `src/data/archive-entries.ts` as the single source of archive content. It will export a typed `ARCHIVE_ENTRIES` array in the exact PDF order and an `ArchiveEntry` type with these fields:

```ts
export type ArchiveEntry = {
  slug: string;
  mediaType: "Audio" | "Audio Collection";
  duration: string;
  title: string;
  narrators: string;
  metadata: string;
  summary: string;
  era: string;
  category: string;
  story: string;
};
```

Slugs will be lowercase, URL-safe title derivatives. The collection contains exactly these records, in this order:

1. Vallco Before the Demolition
2. Growing Up on Cupertino’s Trails
3. From Taiwan to a Second Home
4. Apple Park: From Proposal to Landmark
5. Cherry Blossom Festival and Belonging
6. Closing the Digital and Generational Divide
7. Building for West Valley Community Services
8. Biking to the Library with My Son
9. A Childhood Summer at the Library Fountains
10. The Library Fish Tank
11. The Cost of Staying in Cupertino
12. A City Chosen for Its Schools

The four multi-interview entries remain single `Audio Collection` records and preserve their approximate durations:

- Vallco Before the Demolition: `~6:00`
- The Library Fish Tank: `~6:00`
- The Cost of Staying in Cupertino: `~11:00`
- A City Chosen for Its Schools: `~9:00`

No media URL or audio player is included because none was supplied.

## Archive Page Copy

The `/archive` introduction will stop describing the records as placeholders. It will explain that visitors can filter the oral-history collection, search by person, place, year, or topic, and open a record for the complete story.

The existing page title, meta row, overall layout, and metadata description remain structurally unchanged.

## Cards

Cards retain the existing responsive grid, visual proportions, typography, spacing, and hover movement. Each card exposes the PDF content in this order:

1. Media type and duration.
2. Title.
3. Narrator line prefixed by an em dash.
4. Secondary metadata.
5. Short description.
6. Era and category.

The current fake image icon and placeholder copy will be removed. The upper visual region becomes a quiet typographic oral-history source panel that communicates media type and duration without pretending playable media exists.

Each card will be a semantic `button` so Enter and Space activation work natively. Focus-visible styling will match the existing archive palette. Long titles, narrator groups, and metadata will wrap without overflow; flex layout keeps the era/category footer aligned after variable-length summaries.

## Filters and Search

The filter row contains `All` plus the 11 categories used by the PDF:

- local history
- childhood
- immigration
- technology
- community events
- volunteering
- youth service
- family
- library
- housing
- education

Displayed category labels remain lowercase to match the PDF. Internal comparisons normalize both values to lowercase.

Search is case-insensitive and matches:

- Title.
- Narrator names.
- Secondary metadata.
- Summary.
- Era.
- Category.
- Full story text.

The implementation will verify the terms `Vallco`, `library`, `Apple`, `Taiwan`, `housing`, and `schools` against the expected records. A clear empty state appears when no record matches.

## Detail Modal

The existing modal remains the sole detail interaction. It displays:

1. Media type and duration.
2. Title.
3. Narrator line.
4. Secondary metadata.
5. Summary.
6. Era and category.
7. Complete story text.

The placeholder media panel, awaiting-contribution language, and generic future-content note are removed. No fake player or broken media element is rendered.

Modal behavior includes:

- Close button.
- Overlay click to close.
- Escape key to close.
- Focus moved into the dialog when opened.
- Focus returned to the triggering card when closed.
- Page scrolling prevented while the dialog is open.
- Accessible dialog naming and keyboard-visible controls.

## Favicon

Copy the supplied `C:\Users\kchen\Downloads\image.png` into the App Router metadata convention as `src/app/icon.png`. Remove `src/app/favicon.ico` so browsers receive one unambiguous icon source. The supplied image content is not redrawn or used in the header; the existing red header mark and `Cupertino Voices` wordmark remain unchanged.

## Styling

Only archive-specific CSS will change. Adjustments support:

- The source panel replacing placeholder art.
- Narrator and metadata wrapping.
- Consistent card heights.
- Focus-visible card and close-button states.
- Story typography and readable modal spacing.
- A usable no-results state.
- Desktop, tablet, and mobile layouts.

Existing CSS variables, light/dark theme behavior, typography, rust accent, sharp corner system, and global layout remain intact.

## Validation

Use the existing npm package manager and do not regenerate `package-lock.json` unnecessarily.

Automated checks:

- Run ESLint with `npm run lint`.
- Run TypeScript with `npx tsc --noEmit`.
- Run the production export build with `npm run build`.
- Confirm repository searches find none of the removed placeholder titles or placeholder modal copy.

Browser checks at `http://localhost:3000/archive/`:

- Verify all 12 records appear in PDF order.
- Open all 12 cards and confirm each complete story is present.
- Test every category filter.
- Test the six required search terms and a no-results query.
- Verify card and modal keyboard behavior.
- Verify light and dark themes.
- Verify desktop and mobile widths.
- Verify the new favicon is requested and displayed.

## Completion Criteria

The change is complete when the archive contains only the 12 PDF-backed records, every card and modal field is source-grounded, filtering and search cover the required fields, no fake media or placeholder story content remains, the supplied favicon is active, automated checks pass, and browser verification passes at desktop and mobile widths.
