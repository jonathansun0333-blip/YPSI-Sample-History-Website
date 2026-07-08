"use client";

import { useState } from "react";

interface OTDEvent {
  year: string;
  text: string;
}

const EVENTS: OTDEvent[] = [
  {
    year: "1776",
    text: "The De Anza expedition crossed the valley that would one day take its name, mapping land that had been Tamien Ohlone territory for thousands of years.",
  },
  {
    year: "1850",
    text: "California became the 31st U.S. state, opening the door to a wave of settlers — including French, Italian, and Portuguese immigrants — into what was then ranchero land.",
  },
  {
    year: "1898",
    text: "A French wine-merchant's estate at the crossroads of Stevens Creek Road gave its name — Cupertino — to the surrounding community of orchard farmers.",
  },
  {
    year: "1924",
    text: "The original Blackberry Farm Resort opened along Stevens Creek, becoming a beloved summer destination for generations of Bay Area families.",
  },
  {
    year: "1955",
    text: "Cupertino was incorporated as a city on October 10, with a population of about 2,500. Most residents still farmed apricots or worked the canneries.",
  },
  {
    year: "1967",
    text: "De Anza College opened its doors on the former Beaulieu Vineyard ranch — its first classes meeting in temporary buildings amid the old grapevines.",
  },
  {
    year: "1977",
    text: "Apple Computer moved its headquarters to Cupertino, occupying a small office at 20863 Stevens Creek Boulevard.",
  },
  {
    year: "1993",
    text: "Apple's 'Infinite Loop' campus opened on the former site of an apricot orchard, becoming the city's most recognized address.",
  },
  {
    year: "2017",
    text: "Apple Park — the ring-shaped \"spaceship\" campus — opened on land that had grown apricots within living memory of many Cupertino residents.",
  },
];

function RefreshIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

export default function OTDSection() {
  const [index, setIndex] = useState(0);

  const event = EVENTS[index];

  function handleNext() {
    setIndex((i) => (i + 1) % EVENTS.length);
  }

  return (
    <div className="otd-inner">
      <div className="otd-date-block">
        On This Day
        <span className="otd-date">July 7</span>
      </div>
      <div className="otd-story">
        <span className="otd-year">{event.year} — in Cupertino&apos;s history</span>
        <span className="otd-text">{event.text}</span>
      </div>
      <button type="button" className="button button-ghost" onClick={handleNext}>
        Next <RefreshIcon />
      </button>
    </div>
  );
}
