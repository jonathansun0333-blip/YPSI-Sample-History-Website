# Archive Content and Favicon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all placeholder archive records with the 12 PDF-backed oral histories, preserve the existing archive interaction and styling, and replace the browser favicon with the supplied image.

**Architecture:** Store the typed source-of-truth records in `src/data/archive-entries.ts`, keep search/filter behavior in a small pure helper, and update the existing `ArchiveExplorer` to render cards and the existing modal from that data. Archive-only CSS supports the finalized metadata and accessibility; Next.js App Router metadata serves the supplied PNG favicon.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, native CSS, Node 24 built-in test runner, npm, agent-browser.

## Global Constraints

- Treat `C:\Users\kchen\Downloads\Cupertino Oral Histories.pdf` as the sole source of archive facts and copy.
- Preserve the PDF's names, titles, durations, summaries, eras, categories, story text, capitalization, curly apostrophes, middle dots, and dash characters.
- Keep exactly 12 records in PDF order and keep the four multi-interview records as single `Audio Collection` entries.
- Do not invent media URLs, players, audio, quotations, dates, names, or descriptions.
- Preserve the existing route, grid, modal architecture, typography, palette, spacing, responsive behavior, light/dark themes, and sharp-corner system.
- Do not modify navigation, header branding, homepage, About page, footer, other routes, or global typography.
- Do not modify or stage the user's existing change in `src/components/contribute-form.tsx`.
- Use the existing npm package manager and do not regenerate `package-lock.json` unnecessarily.
- The explicit PDF punctuation requirements override the taste skill's general dash restriction.

---

### Task 1: Add the typed PDF-backed archive records

**Files:**
- Create: `tests/archive-entries.test.mjs`
- Create: `src/data/archive-entries.ts`

**Interfaces:**
- Produces: `ArchiveEntry`, `ARCHIVE_ENTRIES`, and `ARCHIVE_CATEGORIES` for the filter helper and `ArchiveExplorer`.
- Preserves: The exact 12-entry order and all source-backed fields required by the approved spec.

- [ ] **Step 1: Write the failing archive data contract test**

Create `tests/archive-entries.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";

import {
  ARCHIVE_CATEGORIES,
  ARCHIVE_ENTRIES,
} from "../src/data/archive-entries.ts";

const EXPECTED_TITLES = [
  "Vallco Before the Demolition",
  "Growing Up on Cupertino’s Trails",
  "From Taiwan to a Second Home",
  "Apple Park: From Proposal to Landmark",
  "Cherry Blossom Festival and Belonging",
  "Closing the Digital and Generational Divide",
  "Building for West Valley Community Services",
  "Biking to the Library with My Son",
  "A Childhood Summer at the Library Fountains",
  "The Library Fish Tank",
  "The Cost of Staying in Cupertino",
  "A City Chosen for Its Schools",
];

const EXPECTED_CATEGORIES = [
  "local history",
  "childhood",
  "immigration",
  "technology",
  "community events",
  "volunteering",
  "youth service",
  "family",
  "library",
  "housing",
  "education",
];

test("contains the 12 PDF records in source order", () => {
  assert.equal(ARCHIVE_ENTRIES.length, 12);
  assert.deepEqual(
    ARCHIVE_ENTRIES.map((entry) => entry.title),
    EXPECTED_TITLES,
  );
});

test("contains complete, non-placeholder source fields", () => {
  const slugs = new Set();

  for (const entry of ARCHIVE_ENTRIES) {
    assert.match(entry.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(slugs.has(entry.slug), false);
    slugs.add(entry.slug);

    for (const field of [
      entry.mediaType,
      entry.duration,
      entry.title,
      entry.narrators,
      entry.metadata,
      entry.summary,
      entry.era,
      entry.category,
      entry.story,
    ]) {
      assert.equal(field.trim().length > 0, true);
      assert.doesNotMatch(field, /placeholder|awaiting contribution/i);
    }
  }
});

test("preserves the PDF category set", () => {
  assert.deepEqual(ARCHIVE_CATEGORIES, EXPECTED_CATEGORIES);
  assert.deepEqual(
    [...new Set(ARCHIVE_ENTRIES.map((entry) => entry.category))],
    EXPECTED_CATEGORIES,
  );
});

test("preserves audio collections and approximate durations", () => {
  const collections = ARCHIVE_ENTRIES.filter(
    (entry) => entry.mediaType === "Audio Collection",
  );

  assert.deepEqual(
    collections.map(({ title, duration }) => ({ title, duration })),
    [
      { title: "Vallco Before the Demolition", duration: "~6:00" },
      { title: "The Library Fish Tank", duration: "~6:00" },
      { title: "The Cost of Staying in Cupertino", duration: "~11:00" },
      { title: "A City Chosen for Its Schools", duration: "~9:00" },
    ],
  );
});
```

- [ ] **Step 2: Run the data test and confirm it fails because the module does not exist**

Run:

```powershell
node --test tests/archive-entries.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/data/archive-entries.ts`.

- [ ] **Step 3: Add the complete typed archive data**

Create `src/data/archive-entries.ts`:

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

export const ARCHIVE_ENTRIES: ArchiveEntry[] = [
  {
    slug: "vallco-before-the-demolition",
    mediaType: "Audio Collection",
    duration: "~6:00",
    title: "Vallco Before the Demolition",
    narrators: "Jonathan Hwang and Long Jiao",
    metadata: "audio collection · ~6:00 oral history · YPSI interviews",
    summary:
      "Two residents remember Vallco Mall as a place for arcade games, movies, shopping, family outings, and ordinary errands before its demolition.",
    era: "Early 1980s—2021",
    category: "local history",
    story:
      "Jonathan Hwang grew up in Cupertino from the early 1980s through the late 1990s. He remembers Vallco Mall’s Tilt arcade, where children could play video games, collect tickets, and spend time with friends. Long Jiao later visited Vallco to shop, purchase household appliances, watch movies, and spend time with his family. He witnessed the mall’s purchase and demolition and reflected on the years in which the property remained undeveloped. Together, their memories preserve Vallco not simply as a commercial center, but as an important part of everyday life in Cupertino.",
  },
  {
    slug: "growing-up-on-cupertinos-trails",
    mediaType: "Audio",
    duration: "3:29",
    title: "Growing Up on Cupertino’s Trails",
    narrators: "Jonathan Hwang",
    metadata: "audio · 3:29 oral history · interviewed by Uriah Chen",
    summary:
      "A former resident remembers Cupertino schools, neighborhood bike rides, mountain trails, Vallco Mall, and returning to the city with his daughter.",
    era: "Early 1980s—Late 1990s",
    category: "childhood",
    story:
      "Jonathan Hwang attended Regnart Elementary School, Kennedy Junior High School, and Monta Vista High School while growing up in Cupertino. His childhood memories include biking around his neighborhood, exploring nearby mountain-bike trails, and visiting the Tilt arcade at Vallco Mall. Years later, he returned to the Cupertino Library with his daughter, connecting his own childhood with hers. He describes Cupertino as a place where nature, schools, technology, friendship, and family life exist close together.",
  },
  {
    slug: "from-taiwan-to-a-second-home",
    mediaType: "Audio",
    duration: "3:18",
    title: "From Taiwan to a Second Home",
    narrators: "Amy Su",
    metadata: "audio · 3:18 oral history · interviewed by Uriah Chen",
    summary:
      "Amy Su reflects on immigrating from Taipei in 1997 and on three generations of her family volunteering in Cupertino.",
    era: "1997—Now",
    category: "immigration",
    story:
      "Amy Su’s family moved from Taiwan to the United States in 1997 after her father’s job was transferred. Coming from Taipei, she initially found Cupertino surprisingly quiet and rural, with businesses closing much earlier than the street markets she knew in Taiwan. Over time, she watched the city become more developed, diverse, and academically competitive. Cupertino became her family’s second home. Her parents, siblings, children, and Amy herself participated in food-bank outreach, nursing-home visits, Chinese school, community events, and Asian American organizations. She encourages immigrants to listen patiently to different perspectives and contribute to the community they now share.",
  },
  {
    slug: "apple-park-from-proposal-to-landmark",
    mediaType: "Audio",
    duration: "2:17",
    title: "Apple Park: From Proposal to Landmark",
    narrators: "Dajao",
    metadata: "audio · 2:17 oral history · interviewed by Uriah Chen",
    summary:
      "A Cupertino worker reflects on seeing Apple Park completed after the project was introduced to the city government.",
    era: "2013—Now",
    category: "technology",
    story:
      "Dajao has commuted from Santa Clara to work in Cupertino since 2013. One of his strongest memories is visiting Apple Park after its construction was completed. He connects the finished campus with Steve Jobs’s earlier presentation of the project to the Cupertino City Council and sees the building as the product of years of planning and collective effort. For him, Apple Park represents Cupertino’s relationship with technology, employment, civic decision-making, and large-scale urban development.",
  },
  {
    slug: "cherry-blossom-festival-and-belonging",
    mediaType: "Audio",
    duration: "1:42",
    title: "Cherry Blossom Festival and Belonging",
    narrators: "Michelle Kim",
    metadata: "audio · 1:42 oral history · interviewed by Uriah Chen",
    summary:
      "A family’s first visit to Cupertino’s Cherry Blossom Festival helped them see the city as a place where different cultures could gather and belong.",
    era: "2012—Now",
    category: "community events",
    story:
      "Before Michelle Kim’s family moved to Cupertino, they attended the city’s Cherry Blossom Festival around 2012 or 2013. They were excited to find a nearby cultural festival rather than traveling to San Francisco. Her family explored booths, watched performances, and enjoyed food and snacks together. The experience became an annual family tradition whenever they were able to attend. Michelle describes community as more than living near one another: it means looking out for and caring for people beyond one’s own household.",
  },
  {
    slug: "closing-the-digital-and-generational-divide",
    mediaType: "Audio",
    duration: "2:41",
    title: "Closing the Digital and Generational Divide",
    narrators: "Phil Sun",
    metadata: "audio · 2:41 oral history · interviewed by Uriah Chen",
    summary:
      "Phil Sun proposes a nonprofit through which young people and seniors could teach one another and build relationships through technology.",
    era: "2025—Now",
    category: "volunteering",
    story:
      "Inspired by Cupertino’s students, seniors, educators, and technology professionals, Phil Sun began planning a nonprofit in 2025. His idea is to pair children with older adults so that young people can help seniors learn to use cellphones, artificial intelligence, and other digital tools. At the same time, the program would create opportunities for both generations to learn from one another. Phil sees the project as a way to address both the digital divide and the generational divide while strengthening relationships among neighbors.",
  },
  {
    slug: "building-for-west-valley-community-services",
    mediaType: "Audio",
    duration: "1:59",
    title: "Building for West Valley Community Services",
    narrators: "Garrett Kai",
    metadata: "audio · 1:59 oral history · interviewed by Uriah Chen",
    summary:
      "An Eagle Scout describes constructing new communication boards for a Cupertino nonprofit serving residents in need.",
    era: "May—August 2025",
    category: "youth service",
    story:
      "Garrett Kai completed an Eagle Scout project for West Valley Community Services, a nonprofit that provides services such as food assistance and support for unhoused and underprivileged residents. From early May through the middle of August, he built five boards for the organization’s facilities. The project included three enclosed sliding-door bulletin boards and two magnetic whiteboards, along with new lobby lettering and decorations. His work created practical spaces where the organization could display information and communicate with the people it serves.",
  },
  {
    slug: "biking-to-the-library-with-my-son",
    mediaType: "Audio",
    duration: "1:56",
    title: "Biking to the Library with My Son",
    narrators: "David Ranslan",
    metadata: "audio · 1:56 oral history · interviewed by William Zhang",
    summary:
      "A father remembers weekly library visits and bicycle rides with his son while reflecting on the cost of raising a family in Cupertino.",
    era: "2020—Now",
    category: "family",
    story:
      "David Ranslan has lived in Cupertino since 2020. His family visits the Cupertino Library approximately once a week and also spends time at Barnhart Park and Wilson Park. His favorite memory is riding bicycles to the library with his son, Seneca. The routine represents what he values about Cupertino as a place for families: accessible public spaces, parks, and opportunities to spend time together. At the same time, he wishes the city were less expensive and more financially accessible to families.",
  },
  {
    slug: "a-childhood-summer-at-the-library-fountains",
    mediaType: "Audio",
    duration: "1:22",
    title: "A Childhood Summer at the Library Fountains",
    narrators: "Hannie Du",
    metadata: "audio · 1:22 oral history · interviewed by Uriah Chen",
    summary:
      "A lifelong resident recalls cooling off in the fountains outside the Cupertino Library on a hot summer day.",
    era: "2000s—2010s",
    category: "childhood",
    story:
      "Hannie Du was born in Cupertino and grew up surrounded by the city’s trees, mild weather, and public spaces. One of her clearest memories is of visiting the Cupertino Library with her mother during a hot summer day. She played in the fountains outside the building, where the water offered relief from the heat. The brief moment became a lasting childhood memory and illustrates how an ordinary public feature can become part of a resident’s personal history.",
  },
  {
    slug: "the-library-fish-tank",
    mediaType: "Audio Collection",
    duration: "~6:00",
    title: "The Library Fish Tank",
    narrators: "Tony Fei, Jonathan Hwang, Yona Lee, and Cupertino families",
    metadata:
      "audio collection · multiple interviews oral history · YPSI interviews",
    summary:
      "Several families remember the Cupertino Library aquarium as a childhood destination and a familiar part of their visits.",
    era: "2000s—2020s",
    category: "library",
    story:
      "Across several interviews, the library’s fish tank appears repeatedly in family memories. Tony Fei remembers bringing his baby to see it before it was removed. Jonathan Hwang returned to the library because his daughter enjoyed the fish tank. Yona Lee remembers completing summer math work with her daughter beside the aquarium before visiting the neighboring coffee shop. These stories show how a small feature inside a public building became part of family routines, childhood outings, educational experiences, and residents’ memories of a changing library.",
  },
  {
    slug: "the-cost-of-staying-in-cupertino",
    mediaType: "Audio Collection",
    duration: "~11:00",
    title: "The Cost of Staying in Cupertino",
    narrators: "Peter Choo, Nicole Fan, David Ranslan, Kai Kunurat, and Ben Dong",
    metadata:
      "audio collection · multiple interviews oral history · YPSI interviews",
    summary:
      "Residents and workers describe a city they value but increasingly struggle to afford.",
    era: "2000s—Now",
    category: "housing",
    story:
      "Peter Choo has worked in Cupertino for approximately 25 years but lives in Sunnyvale. He argues that the city needs more housing for middle-income employees who work nearby. David Ranslan calls Cupertino a strong place for families but wishes it were less expensive. Kai Kunurat describes the city as comfortable, livable, and community-oriented despite its high cost. Ben Dong remembers housing already being expensive when he purchased a home. Lifelong resident Nicole Fan has watched many peers move away or leave the region, leaving fewer young adults able to remain in the community where they grew up. Together, the interviews reveal the tension between Cupertino’s quality of life and the difficulty of continuing to live there.",
  },
  {
    slug: "a-city-chosen-for-its-schools",
    mediaType: "Audio Collection",
    duration: "~9:00",
    title: "A City Chosen for Its Schools",
    narrators: "Michael Hung, Zhao Han Xu, Phil Sun, and Cupertino parents",
    metadata:
      "audio collection · multiple interviews oral history · YPSI interviews",
    summary:
      "Parents explain how schools, libraries, study spaces, and enrichment programs shaped their decisions to move to Cupertino.",
    era: "2000s—Now",
    category: "education",
    story:
      "Education is one of the most frequently stated reasons families moved to Cupertino. Michael Hung’s family purchased a home near a strong high school in approximately 2022. Zhao Han Xu moved for his children’s education and was immediately impressed by the libraries, parks, community center, study rooms, and children’s activities. Phil Sun was similarly drawn to the local high schools and educational culture. A 25-year resident observed that after-school and enrichment organizations have become much more common over time. Together, these interviews show how public schools and the wider educational ecosystem influence Cupertino’s housing choices, migration patterns, family routines, and community identity.",
  },
];

export const ARCHIVE_CATEGORIES = [
  "local history",
  "childhood",
  "immigration",
  "technology",
  "community events",
  "volunteering",
  "youth service",
  "family",
  "library",
  "housing",
  "education",
];
```

- [ ] **Step 4: Run the data test and confirm it passes**

Run:

```powershell
node --test tests/archive-entries.test.mjs
```

Expected: 4 tests pass, 0 fail.

- [ ] **Step 5: Commit the data contract and records**

```powershell
git add -- tests/archive-entries.test.mjs src/data/archive-entries.ts
git commit -m "feat: add finalized archive records"
```

---

### Task 2: Add case-insensitive category filtering and full-content search

**Files:**
- Create: `tests/archive-filter.test.mjs`
- Create: `src/lib/filter-archive-entries.ts`

**Interfaces:**
- Consumes: `ArchiveEntry` and `ARCHIVE_ENTRIES` from `src/data/archive-entries.ts`.
- Produces: `filterArchiveEntries(entries, activeFilter, query): ArchiveEntry[]` for `ArchiveExplorer`.

- [ ] **Step 1: Write the failing filter and search tests**

Create `tests/archive-filter.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";

import { ARCHIVE_ENTRIES } from "../src/data/archive-entries.ts";
import { filterArchiveEntries } from "../src/lib/filter-archive-entries.ts";

test("filters categories case-insensitively", () => {
  assert.deepEqual(
    filterArchiveEntries(ARCHIVE_ENTRIES, "CHILDHOOD", "").map(
      (entry) => entry.title,
    ),
    [
      "Growing Up on Cupertino’s Trails",
      "A Childhood Summer at the Library Fountains",
    ],
  );
});

test("searches title, narrator, summary, category, era, metadata, and story", () => {
  const expectations = new Map([
    ["Vallco", "Vallco Before the Demolition"],
    ["library", "The Library Fish Tank"],
    ["Apple", "Apple Park: From Proposal to Landmark"],
    ["Taiwan", "From Taiwan to a Second Home"],
    ["housing", "The Cost of Staying in Cupertino"],
    ["schools", "A City Chosen for Its Schools"],
    ["William Zhang", "Biking to the Library with My Son"],
    ["May—August 2025", "Building for West Valley Community Services"],
  ]);

  for (const [query, expectedTitle] of expectations) {
    const titles = filterArchiveEntries(
      ARCHIVE_ENTRIES,
      "All",
      query,
    ).map((entry) => entry.title);
    assert.equal(titles.includes(expectedTitle), true, query);
  }
});

test("combines category and search constraints", () => {
  assert.deepEqual(
    filterArchiveEntries(ARCHIVE_ENTRIES, "library", "families").map(
      (entry) => entry.title,
    ),
    ["The Library Fish Tank"],
  );
});

test("returns no records when nothing matches", () => {
  assert.deepEqual(
    filterArchiveEntries(ARCHIVE_ENTRIES, "All", "no-such-record"),
    [],
  );
});
```

- [ ] **Step 2: Run the filter test and confirm it fails because the helper does not exist**

Run:

```powershell
node --test tests/archive-filter.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/lib/filter-archive-entries.ts`.

- [ ] **Step 3: Implement the pure filter helper**

Create `src/lib/filter-archive-entries.ts`:

```ts
import type { ArchiveEntry } from "@/data/archive-entries";

export function filterArchiveEntries(
  entries: ArchiveEntry[],
  activeFilter: string,
  query: string,
): ArchiveEntry[] {
  const normalizedFilter = activeFilter.trim().toLowerCase();
  const normalizedQuery = query.trim().toLowerCase();

  return entries.filter((entry) => {
    const matchesFilter =
      normalizedFilter === "all" ||
      entry.category.toLowerCase() === normalizedFilter;

    const searchableText = [
      entry.title,
      entry.narrators,
      entry.metadata,
      entry.summary,
      entry.era,
      entry.category,
      entry.story,
    ]
      .join(" ")
      .toLowerCase();

    return (
      matchesFilter &&
      (normalizedQuery.length === 0 || searchableText.includes(normalizedQuery))
    );
  });
}
```

- [ ] **Step 4: Run both data-layer tests and confirm they pass**

Run:

```powershell
node --test tests/archive-entries.test.mjs tests/archive-filter.test.mjs
```

Expected: 8 tests pass, 0 fail.

- [ ] **Step 5: Commit the search/filter helper**

```powershell
git add -- tests/archive-filter.test.mjs src/lib/filter-archive-entries.ts
git commit -m "feat: add archive search and category filtering"
```

---

### Task 3: Replace the placeholder archive UI and modal content

**Files:**
- Create: `tests/archive-ui-contract.test.mjs`
- Modify: `src/app/archive/page.tsx`
- Modify: `src/components/archive-explorer.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `ARCHIVE_ENTRIES`, `ARCHIVE_CATEGORIES`, `ArchiveEntry`, and `filterArchiveEntries`.
- Produces: The existing `/archive` grid and modal populated solely from finalized PDF content.

- [ ] **Step 1: Write the failing archive UI contract tests**

Create `tests/archive-ui-contract.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../src/components/archive-explorer.tsx",
  import.meta.url,
);
const pagePath = new URL("../src/app/archive/page.tsx", import.meta.url);

test("archive page and explorer contain no placeholder story language", async () => {
  const source = `${await readFile(componentPath, "utf8")}\n${await readFile(pagePath, "utf8")}`;
  assert.doesNotMatch(
    source,
    /Six decades on Stelling Road|Awaiting contribution|This is a placeholder entry|placeholder layout/i,
  );
});

test("explorer uses finalized data, pure filtering, semantic cards, and full stories", async () => {
  const source = await readFile(componentPath, "utf8");
  assert.match(source, /ARCHIVE_ENTRIES/);
  assert.match(source, /ARCHIVE_CATEGORIES/);
  assert.match(source, /filterArchiveEntries/);
  assert.match(source, /className="archive-card"/);
  assert.match(source, /<button/);
  assert.match(source, /openItem\.story/);
  assert.match(source, /event\.key === "Escape"/);
  assert.doesNotMatch(source, /<audio|audioUrl|ModalPlaceholderIcon/);
});
```

- [ ] **Step 2: Run the UI contract test and confirm it fails on placeholder content**

Run:

```powershell
node --test tests/archive-ui-contract.test.mjs
```

Expected: FAIL because placeholder titles and modal language still exist.

- [ ] **Step 3: Update the archive page introduction**

Replace `src/app/archive/page.tsx` with:

```tsx
import type { Metadata } from "next";
import ArchiveExplorer from "@/components/archive-explorer";

export const metadata: Metadata = {
  title: "Archive",
  description: "Browse Cupertino oral histories by person, place, era, and topic.",
};

export default function ArchivePage() {
  return (
    <main className="archive-page">
      <div className="archive-page-inner">
        <div className="archive-page-meta">
          <span>The Full Archive</span>
          <span>Filter · Search · Browse</span>
        </div>

        <h1 className="archive-h1">
          Every story, <span className="archive-accent">searchable</span>.
        </h1>

        <p className="archive-lead">
          Filter the oral-history collection, search by person, place, year, or
          topic, and open any entry to read the complete story.
        </p>

        <ArchiveExplorer />
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Replace the explorer with finalized cards and the accessible existing modal**

Replace `src/components/archive-explorer.tsx` with:

```tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ARCHIVE_CATEGORIES,
  ARCHIVE_ENTRIES,
  type ArchiveEntry,
} from "@/data/archive-entries";
import { filterArchiveEntries } from "@/lib/filter-archive-entries";

const FILTERS = ["All", ...ARCHIVE_CATEGORIES];

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function ArchiveExplorer() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [openItem, setOpenItem] = useState<ArchiveEntry | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setOpenItem(null);
      setIsClosing(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    }, 200);
  }, [isClosing]);

  useEffect(() => {
    if (!openItem) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, openItem]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const filtered = useMemo(
    () => filterArchiveEntries(ARCHIVE_ENTRIES, activeFilter, query),
    [activeFilter, query],
  );

  function handleOpen(
    item: ArchiveEntry,
    trigger: HTMLButtonElement,
  ) {
    triggerRef.current = trigger;
    setOpenItem(item);
  }

  return (
    <>
      <div className="archive-controls">
        <div className="archive-filter-row" aria-label="Filter archive by category">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`archive-filter-btn${
                activeFilter === filter ? " archive-filter-active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="archive-search-wrap">
          <span className="archive-search-icon" aria-hidden="true">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            className="archive-search-input"
            type="search"
            value={query}
            placeholder="search by person, place, year…"
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search the archive"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="archive-grid">
          {filtered.map((item) => (
            <button
              key={item.slug}
              type="button"
              className="archive-card"
              onClick={(event) => handleOpen(item, event.currentTarget)}
              aria-label={`Open ${item.title} by ${item.narrators}`}
            >
              <div className="card-img-area">
                <span className="card-badge">
                  {item.mediaType} · {item.duration}
                </span>
                <div className="card-source-panel">
                  <span className="card-source-format">{item.mediaType}</span>
                  <span className="card-source-duration">{item.duration}</span>
                  <span className="card-source-kind">Oral history</span>
                </div>
              </div>

              <div className="card-body">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-narrators">— {item.narrators}</p>
                <p className="card-metadata">{item.metadata}</p>
                <p className="card-desc">{item.summary}</p>
                <div className="card-footer">
                  <span>Era · {item.era}</span>
                  <span>Category · {item.category}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="archive-empty" role="status">
          <h2>No archive entries found.</h2>
          <p>Try another category or search term.</p>
        </div>
      )}

      {openItem && (
        <div
          className={`archive-modal-overlay${isClosing ? " is-closing" : ""}`}
          onClick={handleClose}
        >
          <div
            className="archive-modal-panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-modal-title"
            aria-describedby="archive-modal-summary"
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="archive-modal-close"
              onClick={handleClose}
              aria-label="Close archive story"
            >
              <CloseIcon />
            </button>

            <div className="archive-modal-badge">
              {openItem.mediaType} · {openItem.duration}
            </div>
            <h2 id="archive-modal-title" className="archive-modal-title">
              {openItem.title}
            </h2>
            <p className="archive-modal-author">— {openItem.narrators}</p>
            <p className="archive-modal-metadata">{openItem.metadata}</p>

            <div className="archive-modal-body">
              <p id="archive-modal-summary" className="archive-modal-desc">
                {openItem.summary}
              </p>
              <p className="archive-modal-meta">
                Era · {openItem.era} &nbsp;/&nbsp; Category · {openItem.category}
              </p>
              <div className="archive-modal-story">
                <h3>Full story</h3>
                <p>{openItem.story}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 5: Add archive-specific styles without changing shared site styling**

In `src/app/globals.css`, retain the existing archive section and update/add these archive selectors:

```css
.archive-filter-btn:focus-visible,
.archive-search-input:focus-visible,
.archive-card:focus-visible,
.archive-modal-close:focus-visible {
  outline: 2px solid var(--rust);
  outline-offset: 3px;
}

.archive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2.5rem 2rem;
  margin-bottom: 5rem;
}

.archive-card {
  appearance: none;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s;
}

.archive-card:hover {
  transform: translateY(-3px);
}

.archive-card:active {
  transform: translateY(-1px);
}

.card-img-area {
  aspect-ratio: 5 / 4;
  position: relative;
  border: 1px solid var(--line);
  background: var(--surface-deep);
  display: flex;
  align-items: flex-end;
  padding: 1.15rem;
  margin-bottom: 1rem;
  overflow: hidden;
}

.card-img-area::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0 62%, rgba(166, 67, 34, 0.08));
  pointer-events: none;
}

.card-badge {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
  background: var(--surface);
  padding: 0.3rem 0.6rem;
  font-family: 'Archivo', sans-serif;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink);
}

.card-source-panel {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 0.15rem;
}

.card-source-format {
  font-family: 'Newsreader', serif;
  font-size: 1.45rem;
  line-height: 1;
  color: var(--ink);
}

.card-source-duration,
.card-source-kind,
.card-metadata {
  font-family: 'Archivo', sans-serif;
}

.card-source-duration {
  font-size: 0.95rem;
  color: var(--rust);
}

.card-source-kind {
  margin-top: 0.35rem;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-mute);
}

.card-narrators {
  margin: 0 0 0.65rem;
  font-family: 'Newsreader', serif;
  font-size: 0.98rem;
  line-height: 1.35;
  color: var(--ink-soft);
}

.card-metadata {
  margin: 0 0 0.7rem;
  font-size: 0.64rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.04em;
  text-transform: lowercase;
  color: var(--ink-mute);
  overflow-wrap: anywhere;
}

.card-footer {
  margin-top: auto;
  font-family: 'Archivo', sans-serif;
  font-size: 0.62rem;
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: 0.04em;
  text-transform: none;
  color: var(--ink-mute);
  display: grid;
  gap: 0.25rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--line);
}

.archive-empty {
  min-height: 280px;
  display: grid;
  align-content: center;
  justify-items: start;
  margin-bottom: 5rem;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.archive-empty h2 {
  margin: 0 0 0.4rem;
  font-family: 'Newsreader', serif;
  font-size: 1.7rem;
  font-weight: 400;
}

.archive-empty p {
  margin: 0;
  color: var(--ink-soft);
}

.archive-modal-metadata {
  margin: -0.75rem 0 1.5rem;
  font-family: 'Archivo', sans-serif;
  font-size: 0.68rem;
  line-height: 1.55;
  letter-spacing: 0.05em;
  text-transform: lowercase;
  color: var(--ink-mute);
}

.archive-modal-story {
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
}

.archive-modal-story h3 {
  margin: 0 0 0.75rem;
  font-family: 'Archivo', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rust);
}

.archive-modal-story p {
  margin: 0;
  color: var(--ink);
  font-family: 'Newsreader', serif;
  font-size: 1.08rem;
  line-height: 1.7;
}

@media (max-width: 700px) {
  .archive-controls {
    align-items: stretch;
  }

  .archive-search-wrap,
  .archive-search-input {
    width: 100%;
    max-width: none;
  }

  .archive-grid {
    grid-template-columns: 1fr;
    gap: 2.25rem;
  }

  .archive-modal-overlay {
    align-items: flex-end;
    padding: 0;
  }

  .archive-modal-panel {
    max-height: 92dvh;
    padding: 2.5rem 1.25rem 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .archive-card,
  .archive-modal-overlay,
  .archive-modal-overlay.is-closing {
    animation: none;
    transition: none;
  }

  .archive-card:hover,
  .archive-card:active {
    transform: none;
  }
}
```

Remove the now-unused archive-specific placeholder selectors and JSX while preserving any grouped `.story-modal-*` rules still used by other routes.

- [ ] **Step 6: Run the archive data, filter, and UI contract tests**

Run:

```powershell
node --test tests/archive-entries.test.mjs tests/archive-filter.test.mjs tests/archive-ui-contract.test.mjs
```

Expected: 10 tests pass, 0 fail.

- [ ] **Step 7: Run static checks for this task**

Run:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
& 'C:\Program Files\nodejs\npm.cmd' run lint
```

Expected: both commands exit 0 with no new archive errors.

- [ ] **Step 8: Commit the archive UI**

```powershell
git add -- tests/archive-ui-contract.test.mjs src/app/archive/page.tsx src/components/archive-explorer.tsx src/app/globals.css
git commit -m "feat: replace archive placeholders with oral histories"
```

---

### Task 4: Replace the favicon with the supplied PNG

**Files:**
- Create: `tests/favicon.test.mjs`
- Create: `src/app/icon.png`
- Delete: `src/app/favicon.ico`

**Interfaces:**
- Consumes: `C:\Users\kchen\Downloads\image.png`.
- Produces: A single Next.js App Router favicon source at `src/app/icon.png`.

- [ ] **Step 1: Write the failing favicon contract test**

Create `tests/favicon.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const iconUrl = new URL("../src/app/icon.png", import.meta.url);
const oldFaviconUrl = new URL("../src/app/favicon.ico", import.meta.url);

test("uses the supplied 960 by 720 PNG as the sole favicon source", async () => {
  const icon = await readFile(iconUrl);
  assert.deepEqual([...icon.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(icon.readUInt32BE(16), 960);
  assert.equal(icon.readUInt32BE(20), 720);
  await assert.rejects(stat(oldFaviconUrl), { code: "ENOENT" });
});
```

- [ ] **Step 2: Run the favicon test and confirm it fails**

Run:

```powershell
node --test tests/favicon.test.mjs
```

Expected: FAIL because `src/app/icon.png` does not exist and `favicon.ico` still does.

- [ ] **Step 3: Verify the exact favicon targets before changing binary files**

Run:

```powershell
Get-Item -LiteralPath 'C:\Users\kchen\Downloads\image.png'
Get-Item -LiteralPath 'F:\Personal\Code\YPSI\YPSI-Sample-History-Website\src\app\favicon.ico'
```

Expected: both exact files exist; the source PNG is 149999 bytes.

- [ ] **Step 4: Copy the supplied PNG and remove the old favicon**

Run:

```powershell
Copy-Item -LiteralPath 'C:\Users\kchen\Downloads\image.png' -Destination 'F:\Personal\Code\YPSI\YPSI-Sample-History-Website\src\app\icon.png'
Remove-Item -LiteralPath 'F:\Personal\Code\YPSI\YPSI-Sample-History-Website\src\app\favicon.ico'
```

Expected: `src/app/icon.png` is an exact copy of the supplied file and the old ICO no longer exists.

- [ ] **Step 5: Run the favicon contract test**

Run:

```powershell
node --test tests/favicon.test.mjs
```

Expected: 1 test passes, 0 fail.

- [ ] **Step 6: Commit only the favicon replacement and its test**

```powershell
git add -- tests/favicon.test.mjs src/app/icon.png src/app/favicon.ico
git commit -m "feat: replace site favicon"
```

---

### Task 5: Run full validation and manually verify every archive interaction

**Files:**
- Verify: `src/data/archive-entries.ts`
- Verify: `src/lib/filter-archive-entries.ts`
- Verify: `src/components/archive-explorer.tsx`
- Verify: `src/app/archive/page.tsx`
- Verify: `src/app/globals.css`
- Verify: `src/app/icon.png`
- Verify: `tests/*.test.mjs`

**Interfaces:**
- Consumes: The complete implementation from Tasks 1-4.
- Produces: Evidence that content, accessibility, filtering, search, build output, responsiveness, themes, and favicon behavior satisfy the approved specification.

- [ ] **Step 1: Run every Node contract test**

Run:

```powershell
node --test tests/archive-entries.test.mjs tests/archive-filter.test.mjs tests/archive-ui-contract.test.mjs tests/favicon.test.mjs
```

Expected: 11 tests pass, 0 fail.

- [ ] **Step 2: Confirm no deleted placeholder content remains in the archive implementation**

Run:

```powershell
rg -n -i "Six decades on Stelling Road|The De Anza years|Stevens Creek, before the freeway|original town charter|Saturdays at the farm|Three generations, one kitchen|Main Street, year by year|Monta Vista then|Letters from the orchard|first Apple campus|store on Pasita|Lunar New Year, 1985|awaiting contribution|placeholder entry|placeholder layout" src/app/archive src/components/archive-explorer.tsx src/data/archive-entries.ts
```

Expected: no matches and `rg` exits 1 because the forbidden content is absent.

- [ ] **Step 3: Run TypeScript, lint, and the production build**

Run:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
& 'C:\Program Files\nodejs\npm.cmd' run lint
& 'C:\Program Files\nodejs\npm.cmd' run build
```

Expected: all commands exit 0. The build exports `/archive/` and includes the new icon asset.

- [ ] **Step 4: Verify the archive in a desktop browser**

Run:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi open 'http://localhost:3000/archive/'
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi wait --load networkidle
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi set viewport 1440 1000
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi snapshot -i
```

Expected: 12 archive card buttons appear in PDF order, category buttons and search are present, and no placeholder title or placeholder copy is visible.

- [ ] **Step 5: Test required searches and the no-results state**

For each of `Vallco`, `library`, `Apple`, `Taiwan`, `housing`, and `schools`, fill the search field, resnapshot, and confirm the expected record is present. Then search `no-such-record` and confirm `No archive entries found.` appears.

Run this interaction pattern with a semantic label locator, then resnapshot after each DOM update:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi find label 'Search the archive' fill 'Vallco'
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi snapshot -i
```

Expected: each required query includes its source-backed record; the unmatched query shows the empty state.

- [ ] **Step 6: Test every category filter**

Clear the search and click each of the 11 category buttons, refreshing element references after each click.

Expected counts:

- local history: 1
- childhood: 2
- immigration: 1
- technology: 1
- community events: 1
- volunteering: 1
- youth service: 1
- family: 1
- library: 1
- housing: 1
- education: 1

- [ ] **Step 7: Open every record and verify complete story content**

Select `All`, open each of the 12 cards one at a time, and confirm the modal contains its title, narrator line, secondary metadata, summary, era, category, `Full story` heading, and complete story paragraph. Close each modal with Escape and confirm focus returns to the triggering card.

Expected: all 12 modal checks pass; no media player, placeholder panel, awaiting-contribution text, or broken media appears.

- [ ] **Step 8: Verify mobile, dark mode, and favicon behavior**

Run:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi set viewport 390 844
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi reload
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi screenshot --full
```

Expected: single-column cards, full-width search, wrapping filters, and a bottom-aligned scrollable modal fit without horizontal overflow. Toggle dark mode and confirm readable controls, cards, modal, and focus states. Inspect the document icon link or network requests and confirm the PNG favicon is served.

- [ ] **Step 9: Run the taste pre-flight checks that apply to this preservation update**

Confirm:

- Design read and dial values match the approved spec.
- One existing light/dark token system, rust accent, and sharp-radius system remain consistent.
- Buttons, inputs, and focus states have readable contrast.
- Desktop navigation remains on one line and unchanged.
- Motion is limited to feedback/state transitions and honors reduced motion.
- No fake media, fake audio controls, decorative image labels, decorative status dots, or unrelated visual patterns were introduced.
- All visible copy was re-read against the PDF. The required dash characters remain because the source-fidelity requirement explicitly overrides the general dash ban.

- [ ] **Step 10: Inspect the final diff and working tree**

Run:

```powershell
git diff --check
git status --short
git diff --stat HEAD~4..HEAD
```

Expected: no whitespace errors; archive/favicons/tests/docs are the only task files committed; `src/components/contribute-form.tsx` remains the user's separate uncommitted modification.

- [ ] **Step 11: Close the browser automation session**

Run:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes agent-browser --session ypsi close
```

Expected: the `ypsi` browser session closes successfully.
