"use client";

import { memo, useEffect, useRef, useState } from "react";

import {
  CUPERTINO_FACTS,
  type CupertinoFact,
} from "@/data/cupertino-facts";
import {
  advanceFactCarousel,
  createFactCarouselState,
  getActiveFactId,
  parseStoredFactCarouselState,
  retreatFactCarousel,
  type FactCarouselState,
} from "@/lib/cupertino-fact-carousel";

const FACT_CAROUSEL_STORAGE_KEY = "cupertino-fact-carousel-state-v1";
const EXIT_DURATION_MS = 220;
const ENTER_DURATION_MS = 280;

type Direction = "left" | "right";
type AnimationPhase = "idle" | "exiting" | "entering";

interface AnimationState {
  direction: Direction;
  phase: AnimationPhase;
}

const FACTS_BY_ID = new Map<string, CupertinoFact>(
  CUPERTINO_FACTS.map((fact) => [fact.id, fact]),
);

function ArrowIcon({ direction }: { direction: Direction }) {
  const points =
    direction === "left" ? "10 6 4 12 10 18" : "14 6 20 12 14 18";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points={points} />
      <path d={direction === "left" ? "M4 12h16" : "M20 12H4"} />
    </svg>
  );
}

function getAnimationClass({
  direction,
  phase,
}: AnimationState): string {
  if (phase === "idle") return "";
  if (phase === "exiting") {
    return direction === "right"
      ? "fact-slide-exit-left"
      : "fact-slide-exit-right";
  }

  return direction === "right"
    ? "fact-slide-enter-right"
    : "fact-slide-enter-left";
}

const FactContentSizeProbes = memo(function FactContentSizeProbes() {
  return CUPERTINO_FACTS.map((fact) => (
    <div
      key={`size-probe-${fact.id}`}
      className="fact-content fact-content-sizer"
      aria-hidden="true"
    >
      <span className="fact-eyebrow">Did you know?</span>
      <span className="fact-meta">
        {fact.year} — {fact.category}
      </span>
      <span className="fact-text">{fact.text}</span>
    </div>
  ));
});

export default function OTDSection() {
  const [carouselState, setCarouselState] =
    useState<FactCarouselState | null>(null);
  const [animation, setAnimation] = useState<AnimationState>({
    direction: "right",
    phase: "idle",
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerIds = useRef<number[]>([]);
  const animationLock = useRef(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      let restoredState: FactCarouselState | null = null;

      try {
        const storedState = window.sessionStorage.getItem(
          FACT_CAROUSEL_STORAGE_KEY,
        );

        if (storedState) {
          restoredState = parseStoredFactCarouselState(
            storedState,
            CUPERTINO_FACTS,
          );
        }
      } catch {
        restoredState = null;
      }

      setCarouselState(
        restoredState ?? createFactCarouselState(CUPERTINO_FACTS),
      );
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!carouselState) return;

    try {
      window.sessionStorage.setItem(
        FACT_CAROUSEL_STORAGE_KEY,
        JSON.stringify(carouselState),
      );
    } catch {
      // Storage can be unavailable in privacy modes; the carousel still works.
    }
  }, [carouselState]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () =>
      setPrefersReducedMotion(mediaQuery.matches);
    const frameId = window.requestAnimationFrame(updatePreference);

    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      window.cancelAnimationFrame(frameId);
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(
    () => () => {
      timerIds.current.forEach((timerId) => window.clearTimeout(timerId));
      animationLock.current = false;
    },
    [],
  );

  const isAnimating = animation.phase !== "idle";
  const historyIndex = carouselState?.historyIndex ?? 0;
  const activeFactId = carouselState
    ? getActiveFactId(carouselState)
    : undefined;
  const activeFact = activeFactId
    ? FACTS_BY_ID.get(activeFactId)
    : undefined;

  function startNavigation(direction: Direction) {
    if (!carouselState || animationLock.current) return;
    if (direction === "left" && carouselState.historyIndex === 0) return;
    if (direction === "right" && CUPERTINO_FACTS.length <= 1) return;

    animationLock.current = true;
    setAnimation({ direction, phase: "exiting" });

    const exitDuration = prefersReducedMotion ? 1 : EXIT_DURATION_MS;
    const enterDuration = prefersReducedMotion ? 1 : ENTER_DURATION_MS;
    const exitTimerId = window.setTimeout(() => {
      setCarouselState((current) => {
        if (!current) return current;

        return direction === "right"
          ? advanceFactCarousel(current, CUPERTINO_FACTS)
          : retreatFactCarousel(current);
      });
      setAnimation({ direction, phase: "entering" });

      const enterTimerId = window.setTimeout(() => {
        animationLock.current = false;
        setAnimation({ direction, phase: "idle" });
      }, enterDuration);

      timerIds.current.push(enterTimerId);
    }, exitDuration);

    timerIds.current.push(exitTimerId);
  }

  if (CUPERTINO_FACTS.length === 0) {
    return (
      <div className="fact-carousel">
        <button
          type="button"
          className="fact-arrow fact-arrow-left"
          aria-label="Show previous Cupertino fact"
          disabled
        >
          <ArrowIcon direction="left" />
        </button>

        <div className="fact-content-stage">
          <div
            className="fact-content"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="fact-eyebrow">Did you know?</span>
            <span className="fact-meta">History archive unavailable</span>
            <span className="fact-text">
              No Cupertino facts are available right now.
            </span>
          </div>
          <FactContentSizeProbes />
        </div>

        <button
          type="button"
          className="fact-arrow fact-arrow-right"
          aria-label="Show next Cupertino fact"
          disabled
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    );
  }

  if (!carouselState || !activeFact) {
    return (
      <div className="fact-carousel" aria-busy="true">
        <button
          type="button"
          className="fact-arrow fact-arrow-left"
          aria-label="Show previous Cupertino fact"
          disabled
        >
          <ArrowIcon direction="left" />
        </button>

        <div className="fact-content-stage">
          <div className="fact-content">
            <span className="fact-eyebrow">Did you know?</span>
            <span className="fact-meta">Loading Cupertino history</span>
            <span className="fact-text">
              Preparing a fact from the city&apos;s history.
            </span>
          </div>
          <FactContentSizeProbes />
        </div>

        <button
          type="button"
          className="fact-arrow fact-arrow-right"
          aria-label="Show next Cupertino fact"
          disabled
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    );
  }

  return (
    <div className="fact-carousel">
      <button
        type="button"
        className="fact-arrow fact-arrow-left"
        onClick={() => startNavigation("left")}
        aria-label="Show previous Cupertino fact"
        aria-disabled={isAnimating || undefined}
        disabled={historyIndex === 0}
      >
        <ArrowIcon direction="left" />
      </button>

      <div className="fact-content-stage">
        <div
          className={`fact-content fact-slide ${getAnimationClass(animation)}`}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="fact-eyebrow">Did you know?</span>
          <span className="fact-meta">
            {activeFact.year} — {activeFact.category}
          </span>
          <span className="fact-text">{activeFact.text}</span>
        </div>
        <FactContentSizeProbes />
      </div>

      <button
        type="button"
        className="fact-arrow fact-arrow-right"
        onClick={() => startNavigation("right")}
        aria-label="Show next Cupertino fact"
        aria-disabled={isAnimating || undefined}
        disabled={CUPERTINO_FACTS.length <= 1}
      >
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
}
