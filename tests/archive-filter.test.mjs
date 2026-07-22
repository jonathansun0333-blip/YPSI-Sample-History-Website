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
    ["May–August 2025", "Building for West Valley Community Services"],
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
