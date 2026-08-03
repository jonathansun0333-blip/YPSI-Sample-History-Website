import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const scenes = [
  {
    id: "stevens-creek-blvd-1955",
    label: "Stevens Creek Boulevard · 1955 ↔ 2026",
    before: "stevens-creek-blvd-1955.jpg",
    after: "stevens-creek-blvd-2026.jpg",
    beforeDescription:
      "A 1955 street-level view of Stevens Creek Boulevard, showing a two-lane road, roadside businesses, utility poles, and the western hills in the distance.",
    afterDescription:
      "A 2026 aerial view of the Stevens Creek Boulevard and De Anza area, now occupied by a wide intersection, offices, commercial buildings, and dense surrounding neighborhoods.",
    caption:
      "Stevens Creek Boulevard at the De Anza intersection — once a two-lane road between apricot orchards, now the city’s commercial spine.",
  },
  {
    id: "blackberry-farm-1970",
    label: "Blackberry Farm · 1970 ↔ 2026",
    before: "blackberry-farm-1970.jpg",
    after: "blackberry-farm-2026.jpg",
    beforeDescription:
      "An archival aerial view of Blackberry Farm around 1970, showing its original rural buildings, fields, and wooded foothills.",
    afterDescription:
      "Blackberry Farm in 2026, showing the present-day recreation lawn and swimming-pool area.",
    caption:
      "Blackberry Farm Resort along Stevens Creek — a beloved retreat for generations of Bay Area families. The grounds have been preserved as a city park.",
  },
  {
    id: "de-anza-original-crossroads-1880s",
    label: "De Anza Original Crossroads · 1880s ↔ 2026",
    before: "de-anza-original-crossroads-1880s.jpg",
    after: "de-anza-original-crossroads-2026.jpg",
    beforeDescription:
      "An archival view of Cupertino’s original crossroads, with an unpaved road, orchards, rural buildings, and horse-drawn travel.",
    afterDescription:
      "The corridor in 2026, showing a modern signalized street, commercial development, and protected bicycle infrastructure.",
    caption:
      "The original crossroads at the heart of the Cupertino settlement — now surrounded by commercial development, but still near the geographic center of the city.",
  },
  {
    id: "stevens-creek-de-anza-1948",
    label: "Stevens Creek & De Anza · 1948 ↔ 2026",
    before: "stevens-creek-de-anza-1948.jpg",
    after: "stevens-creek-de-anza-2026.jpg",
    beforeDescription:
      "A 1948 aerial photograph of Stevens Creek Road and De Anza Boulevard when the crossroads was surrounded mainly by orchards and open land.",
    afterDescription:
      "A 2026 aerial photograph of the same intersection after extensive suburban, transportation, and commercial development.",
    caption:
      "The intersection transformed from an orchard crossroads into one of Cupertino’s principal commercial and transportation junctions.",
  },
  {
    id: "monta-vista-1960s",
    label: "Monta Vista High School · 1960s ↔ 2026",
    before: "monta-vista-1960s.jpg",
    after: "monta-vista-2026.jpg",
    beforeDescription:
      "A 1960s-era view of Monta Vista High School’s central courtyard, with students gathered around the original campus buildings.",
    afterDescription:
      "The Monta Vista High School courtyard in 2026, showing mature landscaping and the campus still in active use.",
    caption:
      "Founded in 1969 in Cupertino, Monta Vista High School became a defining educational institution within the high-achieving, technology-driven culture of Silicon Valley.",
  },
  {
    id: "de-anza-college-1967",
    label: "De Anza College · 1967 ↔ 2026",
    before: "de-anza-college-1967.jpg",
    after: "de-anza-college-2026.jpg",
    beforeDescription:
      "An archival view of De Anza College around its 1967 opening, showing the early campus buildings and central gathering space.",
    afterDescription:
      "A 2026 aerial view of De Anza College, including its campus buildings, athletic fields, and surrounding Cupertino neighborhoods.",
    caption:
      "De Anza College was established in 1967 and named after Spanish explorer Juan Bautista de Anza. It is a public community college in Cupertino, widely recognized for its vibrant campus life and for student transfers to the University of California and California State University systems.",
  },
  {
    id: "mcclellan-ranch-historic",
    label: "McClellan Ranch Preserve · Historic ↔ 2026",
    before: "mcclellan-ranch-historic.jpg",
    after: "mcclellan-ranch-2026.jpg",
    beforeDescription:
      "An archival photograph of the historic McClellan ranch house and its residents.",
    afterDescription:
      "McClellan Ranch Preserve in 2026, with preserved red ranch buildings, open space, and native landscaping.",
    caption:
      "Dating back to the 1870s, McClellan Ranch Preserve is an 18-acre natural preserve in Cupertino. Today, it protects historic ranch structures while serving as an environmental education hub, a scenic area of the Stevens Creek Trail, and a sanctuary for local birdwatching.",
  },
];

const expectedImageHashes = new Map([
  ["stevens-creek-blvd-1955.jpg", "42c51a8cd5afea70c1d37211062f9ae2b41785573b5d41256a261d1da854115c"],
  ["stevens-creek-blvd-2026.jpg", "a4d262be78cfa7a24f579e165b6a88702939f64f68b8ec005433e640b5bb5516"],
  ["blackberry-farm-1970.jpg", "43743f752aae1ea728144501a88a7404b911d952b83ba1f8e382a9dd66a47c8a"],
  ["blackberry-farm-2026.jpg", "23c5f9276de3c3566baae3cf004cbc5f7a4cc0418802646fb52d77413eb59def"],
  ["de-anza-original-crossroads-1880s.jpg", "affc4d8aab315262cc76f5bfb79b9edfff82222c48f8be348abb015ebbea9050"],
  ["de-anza-original-crossroads-2026.jpg", "2d2b88db1f56a1ec97da9761daf9ee41d1362b2331d675f01df1f630cd20d041"],
  ["stevens-creek-de-anza-1948.jpg", "a89cac6396ae56afcedee542d1b805bca9e67d838e228c80a72c40dc043645b2"],
  ["stevens-creek-de-anza-2026.jpg", "02984747e33c9600a7249878c1e03cf559cc5dcea641883f2eb68a5de66bd55a"],
  ["monta-vista-1960s.jpg", "7ec8921ec4710e902e2419db1dbff5c8209053cd848e1bfcad1b3447b19314b4"],
  ["monta-vista-2026.jpg", "3e2060f62d7f2d6e6480ee8deaa87a47a198f6f123e97b814f936fe4f9a8af85"],
  ["de-anza-college-1967.jpg", "3bba1e232bfaa6ff575638b9d32b9d28a7131c7af2bb77cadf9b7377dd0e4dab"],
  ["de-anza-college-2026.jpg", "c9f54dbfed5786abeb189ba9f2d9b116b40d0167327dd9e533c2e43f00c16b15"],
  ["mcclellan-ranch-historic.jpg", "0914ac09873a31b8b94bdfdb4e859e05c9a18f278f7c978cd2c82b022bdcab55"],
  ["mcclellan-ranch-2026.jpg", "5261cadb852d338b5cf4befd0faa76dba557675df1b281f090cfad9218d542de"],
]);

async function source(path) {
  return readFile(join(repoRoot, path), "utf8");
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

test("defines all seven scenes with the exact stable IDs, labels, paths, and copy", async () => {
  const component = await source("src/components/before-after.tsx");
  assert.equal((component.match(/^\s+id: "/gm) ?? []).length, 7);
  for (const scene of scenes) {
    assert.match(component, new RegExp(`id: "${scene.id}"`));
    assert(component.includes(`label: "${scene.label}"`));
    assert(component.includes(`/images/before-after/${scene.before}`));
    assert(component.includes(`/images/before-after/${scene.after}`));
    assert(component.includes(scene.beforeDescription));
    assert(component.includes(scene.afterDescription));
    assert(component.includes(scene.caption));
  }
});

test("renders real base-path-aware images and a fully accessible comparison", async () => {
  const component = await source("src/components/before-after.tsx");
  assert.match(component, /import Image from "next\/image"/);
  assert.match(component, /withBasePath\(scene\.beforeImage\)/);
  assert.match(component, /withBasePath\(scene\.afterImage\)/);
  assert.match(component, /draggable=\{false\}/);
  assert.match(component, /pointerEvents: "none"/);
  assert.match(component, /role="tablist"/);
  assert.equal((component.match(/role="tab"/g) ?? []).length, 1);
  assert.match(component, /aria-selected=\{isActive\}/);
  assert.match(component, /role="slider"/);
  assert.match(component, /aria-valuemin=\{0\}/);
  assert.match(component, /aria-valuemax=\{100\}/);
  assert.match(component, /aria-valuenow=\{Math\.round\(sliderPct\)\}/);
  assert.match(component, /SLIDER_KEYBOARD_STEP = 5/);
  assert.match(component, /event\.key !== "ArrowLeft" && event\.key !== "ArrowRight"/);
  assert.match(component, /onPointerDown=\{onPointerDown\}/);
  assert.match(component, /onPointerMove=\{onPointerMove\}/);
  assert.match(component, /setSliderPct\(50\)/);
  assert.match(component, /className="ba-descriptions"/);
  assert.doesNotMatch(component, /ba-placeholder-icon/);
});

test("map links all six locations by stable scene ID", async () => {
  const mapClient = await source("src/components/map-client.tsx");
  const expected = [
    ["Stevens Creek & De Anza", "stevens-creek-de-anza-1948"],
    ["Blackberry Farm", "blackberry-farm-1970"],
    ["De Anza College", "de-anza-college-1967"],
    ["Monta Vista High School", "monta-vista-1960s"],
    ["Original Crossroads", "de-anza-original-crossroads-1880s"],
    ["McClellan Ranch Preserve", "mcclellan-ranch-historic"],
  ];
  for (const [name, sceneId] of expected) {
    const locationLine = mapClient
      .split("\n")
      .find((line) => line.includes(`name: "${name}"`));
    assert(locationLine, `missing location ${name}`);
    assert(locationLine.includes(`baSceneId: "${sceneId}"`));
  }
  assert.match(mapClient, /data-scene-id="\$\{loc\.baSceneId\}"/);
  assert.match(mapClient, /CustomEvent\("cv:select-ba-scene", \{ detail: sceneId \}\)/);
  assert.doesNotMatch(mapClient, /baSceneIndex|data-idx/);
});

test("Stevens Creek map metadata matches its linked 1948 comparison", async () => {
  const mapClient = await source("src/components/map-client.tsx");
  const locationLine = mapClient
    .split("\n")
    .find((line) => line.includes('name: "Stevens Creek & De Anza"'));
  assert(locationLine);
  assert(locationLine.includes('years: "1948 — 2026"'));
  assert(locationLine.includes('baSceneId: "stevens-creek-de-anza-1948"'));
});

test("styles desktop and mobile layouts without changing the visual system", async () => {
  const css = await source("src/app/globals.css");
  assert.match(css, /\.ba-selector\s*\{[^}]*flex-wrap: wrap/s);
  assert.match(css, /\.ba-btn\s*\{[^}]*min-height: 44px/s);
  assert.match(css, /\.ba-widget\s*\{[^}]*touch-action: none/s);
  assert.match(css, /\.ba-image\s*\{[^}]*pointer-events: none/s);
  assert.match(css, /\.ba-descriptions\s*\{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*?\.ba-selector\s*\{[^}]*overflow-x: auto/s);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*?\.ba-btn\s*\{[^}]*flex: 0 0 auto/s);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*?\.ba-descriptions\s*\{[^}]*grid-template-columns: 1fr/s);
});

test("ships the fourteen supplied photographs under their correct scene filenames", async () => {
  for (const [targetName, expectedHash] of expectedImageHashes) {
    const copied = await readFile(
      join(repoRoot, "public/images/before-after", targetName),
    );
    assert.equal(sha256(copied), expectedHash, targetName);
  }
});
