import { ARCHIVE_ENTRIES, type ArchiveEntry } from "@/data/archive-entries";

/**
 * Slugs of the archive entries promoted to the home page, in display order.
 *
 * ── HOW TO CHANGE WHAT THE HOME PAGE FEATURES ──────────────────────────────
 * Edit this list. Nothing else. Each string must match a `slug` in
 * `src/data/archive-entries.ts`, which is the single source of truth for every
 * interview on the site.
 *
 * Keep it to roughly four to six entries: the home page is a doorway into the
 * archive, not a second copy of it. Aim for a spread of eras and categories so
 * a first-time visitor sees the range of the collection, not five variations on
 * one theme.
 *
 * A slug listed here that no longer exists is reported by `npm run lint` via
 * the guard in `getFeaturedStories()` below, so a renamed entry fails loudly
 * instead of silently vanishing from the home page.
 */
const FEATURED_SLUGS = [
  "vallco-before-the-demolition",
  "from-taiwan-to-a-second-home",
  "the-cost-of-staying-in-cupertino",
  "a-city-chosen-for-its-schools",
  "the-library-fish-tank",
] as const;

/**
 * Resolves {@link FEATURED_SLUGS} to full archive entries, in listed order.
 *
 * Featured stories are deliberately *derived* from the archive rather than
 * written out again here. Before this, the home page held its own hand-written
 * copy of five invented stories, which drifted from the real collection and
 * showed placeholder names to visitors. Deriving them means an interview is
 * edited in exactly one place and the home page follows automatically.
 *
 * @throws If a slug has no matching archive entry — a typo or a renamed entry
 * should break the build, not quietly shrink the home page.
 */
export function getFeaturedStories(): ArchiveEntry[] {
  return FEATURED_SLUGS.map((slug) => {
    const entry = ARCHIVE_ENTRIES.find((item) => item.slug === slug);

    if (!entry) {
      throw new Error(
        `featured-stories: no archive entry with slug "${slug}". ` +
          `Fix the slug in src/lib/featured-stories.ts or restore the entry ` +
          `in src/data/archive-entries.ts.`,
      );
    }

    return entry;
  });
}
