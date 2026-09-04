"use client";

import { useState } from "react";

import { TIMELINE_EVENTS as EVENTS } from "@/data/timeline-events";


const MIN_YEAR = EVENTS[0]?.year ?? 0;
const MAX_YEAR = EVENTS[EVENTS.length - 1]?.year ?? MIN_YEAR;
const YEAR_SPAN = Math.max(1, MAX_YEAR - MIN_YEAR);
const YEAR_MARKERS = [MIN_YEAR, 1850, 1900, 1950, 2000, MAX_YEAR].filter(
  (year, markerIndex, markerYears) =>
    year >= MIN_YEAR &&
    year <= MAX_YEAR &&
    markerYears.indexOf(year) === markerIndex,
);

const YEAR_SIZER = EVENTS.reduce(
  (widestLabel, currentEvent) =>
    currentEvent.yearLabel.length > widestLabel.length
      ? currentEvent.yearLabel
      : widestLabel,
  EVENTS[0]?.yearLabel ?? "",
);

function yearToProgress(year: number) {
  return ((year - MIN_YEAR) / YEAR_SPAN) * 100;
}

function findNearestEventIndex(year: number) {
  return EVENTS.reduce((nearestIndex, currentEvent, currentIndex) => {
    const nearestDistance = Math.abs(EVENTS[nearestIndex].year - year);
    const currentDistance = Math.abs(currentEvent.year - year);
    return currentDistance < nearestDistance ? currentIndex : nearestIndex;
  }, 0);
}

export default function TimelineExplorer() {
  const [index, setIndex] = useState(0);
  const event = EVENTS[index] ?? EVENTS[0];
  const progress = yearToProgress(event.year);

  const handleScrubChange = (selectedYear: number) => {
    setIndex(findNearestEventIndex(selectedYear));
  };

  return (
    <div className="tl-explorer">
      {/* Scrubber row */}
      <div className="tl-scrub-row">
        <div className="tl-year-big" aria-hidden="true">
          <span className="tl-year-sizer">{YEAR_SIZER}</span>
          <span className="tl-year-vis">{event.yearLabel}</span>
        </div>
        <div className="tl-scrub-track">
          <div className="tl-line-row">
            <div className="tl-track-line">
              <div className="tl-track-fill" style={{ width: `${progress}%` }} />
              {EVENTS.map((timelineEvent, eventIndex) => (
                <span
                  key={`${timelineEvent.yearLabel}-${timelineEvent.title}`}
                  className={`tl-track-notch${eventIndex === index ? " is-active" : ""}`}
                  style={{ left: `${yearToProgress(timelineEvent.year)}%` }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <input
              type="range"
              className="tl-scrub"
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
              value={event.year}
              onChange={(e) => handleScrubChange(Number(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setIndex((currentIndex) =>
                    Math.min(EVENTS.length - 1, currentIndex + 1),
                  );
                }

                if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  e.preventDefault();
                  setIndex((currentIndex) => Math.max(0, currentIndex - 1));
                }

                if (e.key === "Home") {
                  e.preventDefault();
                  setIndex(0);
                }

                if (e.key === "End") {
                  e.preventDefault();
                  setIndex(EVENTS.length - 1);
                }
              }}
              aria-label="Select a timeline event"
            />
          </div>
          <div className="tl-year-labels">
            {YEAR_MARKERS.map((yearMarker, markerIndex) => {
              const isFirst = markerIndex === 0;
              const isLast = markerIndex === YEAR_MARKERS.length - 1;
              const transform = isFirst
                ? "translateX(0)"
                : isLast
                  ? "translateX(-100%)"
                  : "translateX(-50%)";

              return (
                <span
                  key={yearMarker}
                  style={{
                    left: `${yearToProgress(yearMarker)}%`,
                    transform,
                  }}
                >
                  {yearMarker}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event card */}
      <div className="tl-card" aria-live="polite">
        <div className="tl-card-left">
          <div className="tl-card-year">{event.yearLabel}</div>
          <div className="tl-card-era">{event.era}</div>
        </div>
        <div className="tl-card-mid">
          <h3 className="tl-card-title">{event.title}</h3>
          <p className="tl-card-desc">{event.description}</p>
        </div>
        <div className="tl-card-right">
          <span className="tl-meta-label">Where</span>
          <span className="tl-meta-value">{event.where}</span>
          <div className="tl-meta-lookup">
            <span className="tl-meta-label">Look up</span>
            <span className="tl-meta-value">{event.lookUp}</span>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="tl-nav">
        <button
          className="tl-nav-btn"
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          aria-label="Previous event"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          className="tl-nav-btn"
          type="button"
          disabled={index === EVENTS.length - 1}
          onClick={() => setIndex((i) => Math.min(EVENTS.length - 1, i + 1))}
          aria-label="Next event"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}