import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const datasetUrl = new URL("../src/data/cupertino-facts.ts", import.meta.url);
const carouselUrl = new URL(
  "../src/lib/cupertino-fact-carousel.ts",
  import.meta.url,
);
const componentUrl = new URL(
  "../src/components/otd-section.tsx",
  import.meta.url,
);
const pageUrl = new URL("../src/app/page.tsx", import.meta.url);
const stylesUrl = new URL("../src/app/globals.css", import.meta.url);

const SAMPLE_FACTS = [
  {
    id: "alpha",
    year: "1900",
    category: "History",
    text: "Alpha fact.",
    sourceLabel: "Source A",
    sourceUrl: "https://example.com/a",
  },
  {
    id: "bravo",
    year: "1950",
    category: "Education",
    text: "Bravo fact.",
    sourceLabel: "Source B",
    sourceUrl: "https://example.com/b",
  },
  {
    id: "charlie",
    year: "2000",
    category: "Technology",
    text: "Charlie fact.",
    sourceLabel: "Source C",
    sourceUrl: "https://example.com/c",
  },
];

async function fileExists(url) {
  try {
    await access(url);
    return true;
  } catch {
    return false;
  }
}

async function loadCarouselModule() {
  assert.equal(
    await fileExists(carouselUrl),
    true,
    "src/lib/cupertino-fact-carousel.ts must implement the shuffled deck",
  );

  return import(carouselUrl.href);
}

test("ships the supplied curated institutional Cupertino facts", async () => {
  assert.equal(
    await fileExists(datasetUrl),
    true,
    "src/data/cupertino-facts.ts must contain the supplied facts",
  );

  const {
    CUPERTINO_FACTS,
    CUPERTINO_FACT_COUNT,
    validateCupertinoFacts,
  } = await import(datasetUrl.href);

  assert.equal(CUPERTINO_FACT_COUNT, 138);
  assert.equal(CUPERTINO_FACTS.length, 138);
  assert.equal(new Set(CUPERTINO_FACTS.map((fact) => fact.id)).size, 138);
  assert.equal(new Set(CUPERTINO_FACTS.map((fact) => fact.text)).size, 138);
  assert.doesNotThrow(() => validateCupertinoFacts());

  for (const fact of CUPERTINO_FACTS) {
    assert.match(fact.id, /^[a-z0-9-]+$/);
    assert.ok(fact.year);
    assert.ok(fact.category);
    assert.ok(fact.text);
    assert.ok(fact.sourceLabel);
    assert.match(fact.sourceUrl, /^https?:\/\//);
    assert.doesNotMatch(
      `${fact.text} ${fact.sourceLabel}`,
      /YPSI|oral[- ]history|transcribed interview/i,
    );
  }
});

test("Fisher-Yates returns every fact ID exactly once", async () => {
  const { shuffleFactIds } = await loadCarouselModule();
  const { CUPERTINO_FACTS } = await import(datasetUrl.href);
  const ids = shuffleFactIds(CUPERTINO_FACTS, undefined, () => 0);

  assert.equal(ids.length, CUPERTINO_FACTS.length);
  assert.deepEqual(
    [...ids].sort(),
    CUPERTINO_FACTS.map((fact) => fact.id).sort(),
  );
});

test("each full supplied-fact cycle is unique and the next cycle starts differently", async () => {
  const {
    advanceFactCarousel,
    createFactCarouselState,
    getActiveFactId,
  } = await loadCarouselModule();
  const { CUPERTINO_FACTS } = await import(datasetUrl.href);
  let state = createFactCarouselState(CUPERTINO_FACTS, () => 0);

  assert.ok(state);

  const firstCycle = [getActiveFactId(state)];

  for (let index = 1; index < CUPERTINO_FACTS.length; index += 1) {
    state = advanceFactCarousel(state, CUPERTINO_FACTS, () => 0);
    firstCycle.push(getActiveFactId(state));
  }

  assert.equal(firstCycle.length, CUPERTINO_FACTS.length);
  assert.equal(new Set(firstCycle).size, CUPERTINO_FACTS.length);

  const finalId = getActiveFactId(state);
  state = advanceFactCarousel(state, CUPERTINO_FACTS, () => 0);

  assert.notEqual(getActiveFactId(state), finalId);

  const secondCycle = [getActiveFactId(state)];

  for (let index = 1; index < CUPERTINO_FACTS.length; index += 1) {
    state = advanceFactCarousel(state, CUPERTINO_FACTS, () => 0);
    secondCycle.push(getActiveFactId(state));
  }

  assert.equal(secondCycle.length, CUPERTINO_FACTS.length);
  assert.equal(new Set(secondCycle).size, CUPERTINO_FACTS.length);
});

test("back then forward follows existing viewing history without consuming the deck", async () => {
  const {
    advanceFactCarousel,
    createFactCarouselState,
    getActiveFactId,
    retreatFactCarousel,
  } = await loadCarouselModule();
  let state = createFactCarouselState(SAMPLE_FACTS, () => 0);

  assert.ok(state);

  state = advanceFactCarousel(state, SAMPLE_FACTS, () => 0);
  state = advanceFactCarousel(state, SAMPLE_FACTS, () => 0);

  const latestId = getActiveFactId(state);
  const historyLength = state.historyIds.length;
  const remainingIds = [...state.remainingIds];

  state = retreatFactCarousel(state);
  assert.notEqual(getActiveFactId(state), latestId);

  state = advanceFactCarousel(state, SAMPLE_FACTS, () => 0);
  assert.equal(getActiveFactId(state), latestId);
  assert.equal(state.historyIds.length, historyLength);
  assert.deepEqual(state.remainingIds, remainingIds);
});

test("stored state ignores removed IDs and corrupted storage falls back safely", async () => {
  const { parseStoredFactCarouselState } = await loadCarouselModule();
  const restored = parseStoredFactCarouselState(
    JSON.stringify({
      remainingIds: ["bravo", "removed", "bravo"],
      historyIds: ["removed", "alpha", "charlie"],
      historyIndex: 2,
      cycleSeenIds: ["alpha", "removed", "charlie", "alpha"],
    }),
    SAMPLE_FACTS,
  );

  assert.deepEqual(restored, {
    remainingIds: ["bravo"],
    historyIds: ["alpha", "charlie"],
    historyIndex: 1,
    cycleSeenIds: ["alpha", "charlie"],
  });
  assert.equal(
    parseStoredFactCarouselState("{not-json", SAMPLE_FACTS),
    null,
  );
  assert.equal(
    parseStoredFactCarouselState(
      JSON.stringify({
        remainingIds: [],
        historyIds: ["removed"],
        historyIndex: 0,
      }),
      SAMPLE_FACTS,
    ),
    null,
  );
  assert.equal(
    parseStoredFactCarouselState(
      JSON.stringify({
        remainingIds: ["alpha", "charlie"],
        historyIds: ["alpha", "bravo"],
        historyIndex: 1,
        cycleSeenIds: ["alpha", "bravo"],
      }),
      SAMPLE_FACTS,
    ),
    null,
  );
  assert.equal(
    parseStoredFactCarouselState(
      JSON.stringify({
        remainingIds: ["bravo"],
        historyIds: ["alpha", "bravo", "charlie"],
        historyIndex: 2,
        cycleSeenIds: ["alpha", "charlie"],
      }),
      SAMPLE_FACTS,
    ),
    null,
  );
  assert.equal(
    parseStoredFactCarouselState(
      JSON.stringify({
        remainingIds: ["bravo"],
        historyIds: ["alpha", "alpha", "charlie"],
        historyIndex: 2,
        cycleSeenIds: ["alpha", "charlie"],
      }),
      SAMPLE_FACTS,
    ),
    null,
  );
});

test("empty datasets produce a safe empty state", async () => {
  const { createFactCarouselState, shuffleFactIds } =
    await loadCarouselModule();

  assert.deepEqual(shuffleFactIds([]), []);
  assert.equal(createFactCarouselState([]), null);
});

test("component uses session history, accessible arrows, and directional animation", async () => {
  const [component, page] = await Promise.all([
    readFile(componentUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  assert.match(component, /CUPERTINO_FACTS/);
  assert.match(component, /sessionStorage\.getItem/);
  assert.match(component, /sessionStorage\.setItem/);
  assert.match(component, /cupertino-fact-carousel-state-v1/);
  assert.match(component, /aria-label="Show previous Cupertino fact"/);
  assert.match(component, /aria-label="Show next Cupertino fact"/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /aria-atomic="true"/);
  assert.match(component, /fact-slide-exit-left/);
  assert.match(component, /fact-slide-enter-right/);
  assert.match(component, /fact-slide-exit-right/);
  assert.match(component, /fact-slide-enter-left/);
  assert.match(component, /prefers-reduced-motion/);
  assert.match(component, /disabled=\{historyIndex === 0\}/);
  assert.match(component, /aria-disabled=\{isAnimating \|\| undefined\}/);
  assert.match(component, /CUPERTINO_FACTS\.length === 0/);
  assert.match(component, /CUPERTINO_FACTS\.length <= 1/);
  assert.doesNotMatch(
    component,
    /new Date|dayOffset|getDateKey|formatDisplayDate|setInterval|On This Day|Show the next calendar day/,
  );
  assert.doesNotMatch(component, />\s*Next\s*</);
  assert.match(page, /className="fact-spotlight"/);
  assert.doesNotMatch(page, /className="on-this-day"/);
  assert.doesNotMatch(page, /July 2, 2026/);
});

test("reserves the tallest supplied fact height across carousel navigation", async () => {
  const [component, styles] = await Promise.all([
    readFile(componentUrl, "utf8"),
    readFile(stylesUrl, "utf8"),
  ]);

  assert.match(
    component,
    /function FactContentSizeProbes\(\)[\s\S]*CUPERTINO_FACTS\.map\(/,
  );
  assert.match(component, /className="fact-content-stage"/);
  assert.match(
    component,
    /className="fact-content fact-content-sizer"[\s\S]*aria-hidden="true"/,
  );
  assert.equal(
    component.match(/<FactContentSizeProbes \/>/g)?.length,
    3,
    "empty, loading, and active states should use one stable content stage",
  );
  assert.match(
    styles,
    /\.fact-content-stage\s*\{[^}]*display:\s*grid;/s,
  );
  assert.match(
    styles,
    /\.fact-content-stage\s*>\s*\.fact-content\s*\{[^}]*grid-area:\s*1\s*\/\s*1;/s,
  );
  assert.match(
    styles,
    /\.fact-content-sizer\s*\{[^}]*visibility:\s*hidden;[^}]*pointer-events:\s*none;/s,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*700px\)[\s\S]*\.fact-content-stage\s*\{[^}]*grid-area:\s*content;/s,
  );
});

test("carousel CSS provides responsive arrows, stable height, and reduced motion", async () => {
  const styles = await readFile(stylesUrl, "utf8");

  assert.match(
    styles,
    /\.fact-carousel\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*44px minmax\(0,\s*1fr\) 44px;/s,
  );
  assert.match(
    styles,
    /\.fact-carousel\s*\{[^}]*padding:\s*1\.7rem 2\.4rem;/s,
  );
  assert.match(
    styles,
    /\.fact-arrow\s*\{[^}]*min-width:\s*44px;[^}]*min-height:\s*44px;/s,
  );
  assert.match(styles, /\.fact-arrow\[aria-disabled="true"\]/);
  assert.match(
    styles,
    /\.fact-content\s*\{[^}]*min-height:\s*6\.3rem;/s,
  );
  assert.match(styles, /\.fact-spotlight\s*\{[^}]*max-width:\s*1200px;/s);

  for (const animation of [
    "fact-exit-left",
    "fact-enter-right",
    "fact-exit-right",
    "fact-enter-left",
  ]) {
    assert.match(styles, new RegExp(`@keyframes ${animation}`));
  }

  assert.match(
    styles,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*animation-duration:\s*1ms;/,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*700px\)[\s\S]*\.fact-carousel\s*\{[^}]*grid-template-areas:/s,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*700px\)[\s\S]*\.fact-carousel\s*\{[^}]*padding:\s*1\.4rem 2rem;/s,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*700px\)[\s\S]*\.fact-content\s*\{[^}]*min-height:\s*9\.8rem;/s,
  );
});
