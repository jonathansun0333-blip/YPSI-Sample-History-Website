# Cupertino Voices

A community history archive for Cupertino, California. The site collects oral
history interviews from residents alongside photographs and historical records,
to preserve the city's culture and history before it is lost.

**Live site:** https://jonathansun0333-blip.github.io/YPSI-Sample-History-Website/

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Requires Node 20 or newer (CI builds on Node 20; Node 24 also works locally).

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build → static files in `out/` |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check without emitting |

## How the site is put together

Next.js App Router, TypeScript, and plain CSS. **No CSS framework and no UI
library** — styling is one hand-written stylesheet, `src/app/globals.css`.

The site is a **static export** (`output: "export"` in `next.config.ts`). Every
page is rendered to HTML at build time and served by GitHub Pages. This is the
single most important fact about the codebase, because it means:

- There is **no server and no database** at runtime.
- Anything needing a backend (comments, form submissions, search indexing,
  authentication) requires a third-party service or a serverless function. It
  cannot simply be added as an API route.
- `next/image` optimization is off; images are served as-is.

### Directory map

```
src/
  app/                    One folder per route (App Router)
    page.tsx              Home
    story/                Narrative history, told decade by decade
    timeline/             Interactive timeline of major events
    map/                  Leaflet map with before-and-after photos
    archive/              Searchable, filterable oral history archive
    about/                About the project
    globals.css           ALL styling for the site
    layout.tsx            Shared shell: fonts, header, metadata
  components/             React components, one concern per file
  data/                   Content as typed TypeScript data
  lib/                    Pure helper functions (no React, easily testable)
public/audio/archive/     Interview audio (.m4a)
docs/superpowers/         Design specs and implementation plans, by date
scripts/                  Build-time fixups
legacy/                   The original static HTML site, kept for reference
tests/                    Test fixtures and assets
```

### Where the content lives

Content is typed data, not a CMS. To change what the site says, edit these:

| File | Holds |
| --- | --- |
| `src/data/archive-entries.ts` | **Every interview.** The single source of truth for the archive. |
| `src/data/cupertino-facts.ts` | Facts for the home page carousel |
| `src/lib/featured-stories.ts` | Which interviews the home page promotes (a list of slugs) |
| `src/components/timeline-explorer.tsx` | Timeline events |
| `src/components/map-client.tsx` | Map locations and before/after photos |

## Common tasks

### Add an interview to the archive

1. Drop the audio in `public/audio/archive/` as `.m4a`.
2. Append an entry to `ARCHIVE_ENTRIES` in `src/data/archive-entries.ts`. The
   `ArchiveEntry` type at the top of that file lists every required field.
3. Give it a unique, URL-safe `slug` (lowercase, hyphens, no spaces).

It appears in the archive automatically — the explorer, the search, and the
category filters all read from that one array.

### Change the home page's featured stories

Edit `FEATURED_SLUGS` in `src/lib/featured-stories.ts`. That is the whole job.
Each slug must match an entry in `archive-entries.ts`; a slug that matches
nothing throws at build time rather than silently dropping the story.

Featured stories are *derived* from the archive on purpose. They used to be a
separate hand-written list, which drifted out of sync and ended up showing
invented placeholder names to real visitors.

### Comments and reactions

Interview pages carry visitor reactions and a moderated comment thread, backed
by Supabase because a static export has nowhere of its own to store them.

**These sections render nothing until `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` are set**, so the site builds and looks
finished on a fresh clone with no credentials. See
[`docs/supabase-setup.md`](docs/supabase-setup.md) for the schema, the Row
Level Security policies that make the public API key safe, and how to moderate.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes to GitHub Pages. **There is no staging environment — a push to `main`
goes live.** Work on a branch and open a pull request.

### The `basePath` trap

GitHub Pages serves the site from a subpath, so `next.config.ts` sets
`basePath` to `/YPSI-Sample-History-Website` in production and `""` in
development. Consequences:

- Reference internal links with `next/link` and a root-relative `href`
  (`/archive`). Next.js applies the base path for you.
- For assets referenced by hand — audio, images in raw `<img>` or CSS —
  wrap the path in `withBasePath()` from `src/lib/asset-path.ts`. Forgetting
  this is the classic bug here: it works locally and 404s in production.
- `scripts/fix-next-static-export-rsc-paths.mjs` runs after every build to
  patch base paths that the static exporter misses. If you change routing or
  `basePath`, check that script still holds.

## Conventions

- **One source of truth per fact.** Derive, don't restate. Counts shown in copy
  should come from the data (`ARCHIVE_ENTRIES.length`), not be typed as
  literals that quietly go stale.
- **Comment the *why*, not the *what*.** The code says what it does.
- **Fail loudly at build time** rather than degrading silently in front of a
  visitor.
- Run `npm run lint` and `npx tsc --noEmit` before opening a pull request.
- Larger features get a spec and a plan in `docs/superpowers/`, named
  `YYYY-MM-DD-short-title`. Follow the existing files as a template.

## Editorial and ethical notes

This is an oral history project, so the usual rules of the genre apply:

- Narrators consented to *this* project. Do not republish their words elsewhere,
  and do not add third-party stories to this archive without written permission
  from both the rights holder and the narrator.
- Attribute every narrator by name as they asked to be credited.
- Interviews are primary sources. Correct typos in the summary text; do not
  smooth out how someone actually speaks.
