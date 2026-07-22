import assert from "node:assert/strict";
import test from "node:test";

import {
  ARCHIVE_CATEGORIES,
  ARCHIVE_ENTRIES,
} from "../src/data/archive-entries.ts";

const EXPECTED_TITLES = [
  "Vallco Before the Demolition",
  "Growing Up on Cupertino鈥檚 Trails",
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
