"use client";

import { useState } from "react";

type TimelineEvent = {
  year: number;
  yearLabel: string;
  era: string;
  title: string;
  description: string;
  where: string;
  lookUp: string;
};

const EVENTS: TimelineEvent[] = [
  {
    year: 1776,
    yearLabel: "1776",
    era: "Exploration",
    title: "De Anza expedition arrives",
    description:
      "In 1776, Spanish explorer Juan Bautista de Anza passed through the Cupertino region during an expedition to settle California. A nearby creek was named \"Arroyo San Jose de Cupertino\" after Saint Joseph of Cupertino, which later inspired the city's name.",
    where: "Cupertino region",
    lookUp: "De Anza expedition records",
  },
  {
    year: 1850,
    yearLabel: "1850",
    era: "Statehood",
    title: "California becomes a state",
    description:
      "In 1850, California was established as a state. Following the Gold Rush and new statehood, many immigrants came to the area for its rich and fertile soil, and Cupertino remained a rural farming and ranching community often called the \"West Side.\"",
    where: "West Side of Santa Clara County",
    lookUp: "California statehood records",
  },
  {
    year: 1867,
    yearLabel: "1867",
    era: "Education",
    title: "Cupertino's first school",
    description:
      "Cupertino's first school, Lincoln School, opened its earliest school building and provided education to the small community of residents living there at the time.",
    where: "Lincoln School",
    lookUp: "Local school district history",
  },
  {
    year: 1870,
    yearLabel: "1870s",
    era: "Growth",
    title: "Cupertino progresses",
    description:
      "Many American and European immigrants established family farms, wineries, vineyards, and ranches, taking advantage of the fertile soil. The De Anza Boulevard and Stevens Creek Road intersection also began development and featured early community services.",
    where: "City crossroads and farm districts",
    lookUp: "Local agricultural records",
  },
  {
    year: 1898,
    yearLabel: "1898",
    era: "Identity",
    title: "Cupertino gets a post office",
    description:
      "The name \"Cupertino\" was officially adopted and changed from \"West Side\" when the U.S. Postal Service opened a branch, solidifying the community's identity beyond a railway stop.",
    where: "Post office branch",
    lookUp: "USPS records",
  },
  {
    year: 1917,
    yearLabel: "1917",
    era: "Education",
    title: "Cupertino Union School District is established",
    description:
      "Four local schools - San Antonio, Lincoln, Doyle, and Collins - came together to establish the Cupertino Union School District. The district began with four one-room school buildings.",
    where: "Cupertino Union School District",
    lookUp: "District foundation records",
  },
  {
    year: 1924,
    yearLabel: "1924",
    era: "Parks",
    title: "Stevens Creek County Park opens",
    description:
      "Stevens Creek County Park officially opened to the public after the acquisition of 400 acres, creating the first park in the Santa Clara County Parklands System.",
    where: "Stevens Creek County Park",
    lookUp: "Santa Clara County park records",
  },
  {
    year: 1939,
    yearLabel: "1939",
    era: "Agriculture & Industry",
    title: "Peak of the 'Valley of Heart's Delight'",
    description:
      "Cupertino reached its peak as part of the world's largest fruit-producing region with orchards of prunes, cherries, peaches, nuts, and other Mediterranean crops. A deep limestone quarry and industrial cement plants also began operation in the west hills.",
    where: "Citywide and west hills",
    lookUp: "Agricultural and industrial records",
  },
  {
    year: 1955,
    yearLabel: "1955",
    era: "Cityhood",
    title: "Cupertino is incorporated as a city",
    description:
      "On October 10, Cupertino officially became Santa Clara County's 13th city with around 2,000 residents and spanning roughly four miles. Local residents pushed for cityhood and won a close vote.",
    where: "Citywide",
    lookUp: "City incorporation archives",
  },
  {
    year: 1967,
    yearLabel: "1967",
    era: "Higher Education",
    title: "De Anza College opens",
    description:
      "The 112-acre campus opened on September 11 on the historic Charles Baldwin winery estate. Its contemporary mission style with adobe walls and red tile roofs helped transform Cupertino into a modern suburban community with an educational hub.",
    where: "De Anza College campus",
    lookUp: "Foothill-De Anza district records",
  },
  {
    year: 1969,
    yearLabel: "1969",
    era: "Schools",
    title: "Monta Vista High School opens",
    description:
      "Monta Vista High School opened in the fall with only 9th and 10th grade classes to reduce crowding at nearby Homestead High School. It later became one of California's top-ranked high schools.",
    where: "Foothill area",
    lookUp: "FUHSD records",
  },
  {
    year: 1977,
    yearLabel: "1977",
    era: "Technology",
    title: "Apple Computer moves to Cupertino",
    description:
      "The young company, Apple, moved its headquarters into a small office at 20863 Stevens Creek Boulevard, marking Cupertino's transition from orchards to technology and innovation.",
    where: "20863 Stevens Creek Boulevard",
    lookUp: "Apple corporate history",
  },
  {
    year: 1993,
    yearLabel: "1993",
    era: "Technology",
    title: "Apple Infinite Loop campus opens",
    description:
      "Apple moved to the Infinite Loop campus as its previous offices had become too scattered and small. Built on land that had grown apricots a generation earlier, it became Cupertino's most recognized address for the next two decades.",
    where: "Infinite Loop",
    lookUp: "Apple corporate history",
  },
  {
    year: 2004,
    yearLabel: "2004",
    era: "Community",
    title: "Current Cupertino Library opens",
    description:
      "The current 54,000-square-foot library at 10800 Torre Avenue opened in October. It serves as an educational and social center for the Cupertino community.",
    where: "10800 Torre Avenue",
    lookUp: "Santa Clara County Library records",
  },
  {
    year: 2017,
    yearLabel: "2017",
    era: "Technology",
    title: "Apple Park opens",
    description:
      "Apple employees began moving into a massive 175-acre circular \"spaceship\" campus that became Apple's main campus for headquarters logistics and day-to-day operations.",
    where: "Apple Park Way",
    lookUp: "Apple corporate history",
  },
];

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