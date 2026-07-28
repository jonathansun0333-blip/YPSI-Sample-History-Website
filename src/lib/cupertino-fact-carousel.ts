import type { CupertinoFact } from "@/data/cupertino-facts";

export interface FactCarouselState {
  remainingIds: string[];
  cycleSeenIds: string[];
  historyIds: string[];
  historyIndex: number;
}

type RandomSource = () => number;

export function shuffleFactIds(
  facts: readonly CupertinoFact[],
  previousFactId?: string,
  random: RandomSource = Math.random,
): string[] {
  const shuffledIds = facts.map((fact) => fact.id);

  for (let index = shuffledIds.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffledIds[index], shuffledIds[randomIndex]] = [
      shuffledIds[randomIndex],
      shuffledIds[index],
    ];
  }

  if (
    previousFactId &&
    shuffledIds.length > 1 &&
    shuffledIds[0] === previousFactId
  ) {
    [shuffledIds[0], shuffledIds[1]] = [
      shuffledIds[1],
      shuffledIds[0],
    ];
  }

  return shuffledIds;
}

export function createFactCarouselState(
  facts: readonly CupertinoFact[],
  random: RandomSource = Math.random,
): FactCarouselState | null {
  const [firstId, ...remainingIds] = shuffleFactIds(
    facts,
    undefined,
    random,
  );

  if (!firstId) return null;

  return {
    remainingIds,
    cycleSeenIds: [firstId],
    historyIds: [firstId],
    historyIndex: 0,
  };
}

export function getActiveFactId(
  state: FactCarouselState,
): string | undefined {
  return state.historyIds[state.historyIndex];
}

export function advanceFactCarousel(
  state: FactCarouselState,
  facts: readonly CupertinoFact[],
  random: RandomSource = Math.random,
): FactCarouselState {
  if (facts.length <= 1) return state;

  if (state.historyIndex < state.historyIds.length - 1) {
    return {
      ...state,
      historyIndex: state.historyIndex + 1,
    };
  }

  const currentId = getActiveFactId(state);
  const startsNewCycle = state.remainingIds.length === 0;
  const availableIds =
    !startsNewCycle
      ? state.remainingIds
      : shuffleFactIds(facts, currentId, random);
  const [nextId, ...remainingIds] = availableIds;

  if (!nextId) return state;

  return {
    remainingIds,
    cycleSeenIds: startsNewCycle
      ? [nextId]
      : [...state.cycleSeenIds, nextId],
    historyIds: [...state.historyIds, nextId],
    historyIndex: state.historyIds.length,
  };
}

export function retreatFactCarousel(
  state: FactCarouselState,
): FactCarouselState {
  return {
    ...state,
    historyIndex: Math.max(0, state.historyIndex - 1),
  };
}

export function parseStoredFactCarouselState(
  serialized: string,
  facts: readonly CupertinoFact[],
): FactCarouselState | null {
  try {
    const value: unknown = JSON.parse(serialized);

    if (
      typeof value !== "object" ||
      value === null ||
      !("remainingIds" in value) ||
      !("cycleSeenIds" in value) ||
      !("historyIds" in value) ||
      !("historyIndex" in value) ||
      !Array.isArray(value.remainingIds) ||
      !Array.isArray(value.cycleSeenIds) ||
      !Array.isArray(value.historyIds) ||
      !Number.isInteger(value.historyIndex)
    ) {
      return null;
    }

    const validIds = new Set(facts.map((fact) => fact.id));
    const originalHistoryIndex = Math.min(
      Math.max(0, value.historyIndex as number),
      Math.max(0, value.historyIds.length - 1),
    );
    const historyIds: string[] = [];
    let historyIndex = -1;

    value.historyIds.forEach((id, index) => {
      if (typeof id !== "string" || !validIds.has(id)) return;

      historyIds.push(id);
      if (index <= originalHistoryIndex) {
        historyIndex = historyIds.length - 1;
      }
    });

    if (historyIds.length === 0) return null;

    if (historyIndex < 0) historyIndex = 0;

    const remainingIds = Array.from(
      new Set(
        value.remainingIds.filter(
          (id): id is string =>
            typeof id === "string" && validIds.has(id),
        ),
      ),
    );
    const cycleSeenIds = Array.from(
      new Set(
        value.cycleSeenIds.filter(
          (id): id is string =>
            typeof id === "string" && validIds.has(id),
        ),
      ),
    );
    const cycleSeenSet = new Set(cycleSeenIds);
    const hasOverlap = remainingIds.some((id) => cycleSeenSet.has(id));
    const coversEveryFact =
      remainingIds.length + cycleSeenIds.length === validIds.size;
    const latestHistoryId = historyIds[historyIds.length - 1];
    const cycleHistoryStart = historyIds.length - cycleSeenIds.length;
    const matchesLatestHistory =
      cycleHistoryStart >= 0 &&
      cycleSeenIds.every(
        (id, index) => historyIds[cycleHistoryStart + index] === id,
      );
    const repeatsAtCycleBoundary =
      cycleHistoryStart > 0 &&
      historyIds[cycleHistoryStart - 1] === cycleSeenIds[0];

    if (
      cycleSeenIds.length === 0 ||
      hasOverlap ||
      !coversEveryFact ||
      !cycleSeenSet.has(latestHistoryId) ||
      !matchesLatestHistory ||
      repeatsAtCycleBoundary
    ) {
      return null;
    }

    return {
      remainingIds,
      cycleSeenIds,
      historyIds,
      historyIndex,
    };
  } catch {
    return null;
  }
}
