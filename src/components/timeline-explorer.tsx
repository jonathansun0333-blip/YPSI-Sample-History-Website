"use client";

import { useState } from "react";

const EVENTS = [
  {
    year: "1776",
    era: "Pre-history",
    title: "The De Anza expedition arrives",
    description: "Juan Bautista de Anza's Spanish expedition passed through the valley, mapping land that had been home to the Tamien Ohlone for thousands of years.",
    where: "The valley, broadly",
    lookUp: "Anza expedition diaries",
  },
  {
    year: "1850",
    era: "Statehood",
    title: "California becomes a state",
    description: "Statehood ushered in a wave of settlers — many of them French, Italian, and Portuguese — who would establish the orchards that defined the valley for a century.",
    where: "Santa Clara County",
    lookUp: "CA State Archives",
  },
  {
    year: "1870s",
    era: "Naming",
    title: "A name takes root: Cupertino",
    description: "A small community of farmers grew around the Stevens Creek crossroads. A French wine-merchant's estate gave the area its eventual name.",
    where: "Stevens Creek Rd. & Saich Way",
    lookUp: "Local newspapers",
  },
  {
    year: "1898",
    era: "Post Office",
    title: "Cupertino gets a post office",
    description: "The 'Cupertino' name was officially recognized when the U.S. Postal Service opened a branch — solidifying the community's identity beyond a railway stop.",
    where: "Old town center",
    lookUp: "USPS records",
  },
  {
    year: "1924",
    era: "Recreation",
    title: "Blackberry Farm opens",
    description: "The Blackberry Farm resort opened along the creek, becoming a beloved summer destination for Bay Area families for the next several decades.",
    where: "Blackberry Farm Park",
    lookUp: "Cupertino Historical Society",
  },
  {
    year: "1939",
    era: "Agriculture",
    title: "Peak of the 'Valley of Heart's Delight'",
    description: "Santa Clara Valley reached its peak as the world's largest fruit-producing region. Cupertino's apricot orchards stretched from the foothills to the rail line.",
    where: "Across the city",
    lookUp: "Census of Agriculture",
  },
  {
    year: "1955",
    era: "Incorporation",
    title: "Cupertino is incorporated as a city",
    description: "On October 10, residents voted to incorporate to fend off annexation by San Jose. The new city of about 2,500 residents covered roughly three square miles.",
    where: "Citywide",
    lookUp: "City of Cupertino archives",
  },
  {
    year: "1962",
    era: "Schools",
    title: "Monta Vista High School opens",
    description: "Built to serve the families flooding into new tract housing on former orchard land, Monta Vista would become a defining institution of Cupertino life.",
    where: "Foothill area",
    lookUp: "FUHSD records",
  },
  {
    year: "1967",
    era: "Education",
    title: "De Anza College opens",
    description: "The community college opened on the former Beaulieu Vineyard ranch. Its first classes met in temporary buildings amid the old grapevines.",
    where: "21250 Stevens Creek Blvd.",
    lookUp: "Foothill-De Anza District",
  },
  {
    year: "1977",
    era: "Industry",
    title: "Apple Computer moves to Cupertino",
    description: "The young company moved its headquarters into a small office at 20863 Stevens Creek Boulevard, marking the city's transition from orchards to chip fabs.",
    where: "Stevens Creek Blvd.",
    lookUp: "Apple corporate history",
  },
  {
    year: "1986",
    era: "Heritage",
    title: "Cupertino Historical Society founded",
    description: "A group of longtime residents established the historical society to preserve the photographs, documents, and oral histories of the rapidly changing city.",
    where: "Quinlan Community Center",
    lookUp: "CHS records",
  },
  {
    year: "1993",
    era: "Architecture",
    title: "Apple's Infinite Loop campus opens",
    description: "Built on land that had grown apricots a generation earlier, the campus became the most recognized address in the city for the next two decades.",
    where: "Infinite Loop",
    lookUp: "Apple corporate history",
  },
  {
    year: "2017",
    era: "Architecture",
    title: "Apple Park opens",
    description: "The ring-shaped \"spaceship\" campus opened on land that had been orchard within living memory. It would house tens of thousands of employees.",
    where: "Apple Park Way",
    lookUp: "Apple corporate history",
  },
  {
    year: "2026",
    era: "Today",
    title: "The archive continues",
    description: "Cupertino Voices launches as an open public archive of the community's history, gathering interviews, photographs, and documents from generations of residents.",
    where: "Online",
    lookUp: "This site",
  },
];

export default function TimelineExplorer() {
  const [index, setIndex] = useState(0);
  const event = EVENTS[index];
  const progress = (index / (EVENTS.length - 1)) * 100;

  return (
    <div className="tl-explorer">
      {/* Scrubber row */}
      <div className="tl-scrub-row">
        <div className="tl-year-big">{event.year}</div>
        <div className="tl-scrub-track">
          <div className="tl-track-line">
            <div className="tl-track-fill" style={{ width: `${progress}%` }} />
          </div>
          <input
            type="range"
            className="tl-scrub"
            min={0}
            max={EVENTS.length - 1}
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            aria-label="Select a timeline event"
          />
          <div className="tl-year-labels">
            <span>1776</span>
            <span>1850</span>
            <span>1900</span>
            <span>1950</span>
            <span>2000</span>
            <span>2026</span>
          </div>
        </div>
      </div>

      {/* Event card */}
      <div className="tl-card" aria-live="polite">
        <div className="tl-card-left">
          <div className="tl-card-year">{event.year}</div>
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