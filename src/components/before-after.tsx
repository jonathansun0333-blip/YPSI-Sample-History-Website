"use client";

import { useState, useRef, useCallback } from "react";

interface Scene {
  id: number;
  label: string;
  beforeYear: string;
  afterYear: string;
  caption: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    label: "Stevens Creek Blvd · 1955 ↔ 2026",
    beforeYear: "1955",
    afterYear: "2026",
    caption:
      "Stevens Creek Boulevard at the De Anza intersection — once a two-lane road between apricot orchards, now the city's commercial spine. Photographs will be sourced from the Cupertino Historical Society and community contributions.",
  },
  {
    id: 2,
    label: "Blackberry Farm · 1970 ↔ 2026",
    beforeYear: "1970",
    afterYear: "2026",
    caption:
      "Blackberry Farm Resort along Stevens Creek — a beloved retreat for generations of Bay Area families. The grounds have been preserved as a city park.",
  },
  {
    id: 3,
    label: "De Anza Crossroads · 1948 ↔ 2026",
    beforeYear: "1948",
    afterYear: "2026",
    caption:
      "The original crossroads at the heart of the Cupertino settlement — now surrounded by commercial development, but still the geographic center of the city.",
  },
];

export default function BeforeAfter() {
  const [activeScene, setActiveScene] = useState(0);
  const [sliderPct, setSliderPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const scene = SCENES[activeScene];

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPct(pct);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    updateSlider(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) updateSlider(e.clientX);
  };
  const onMouseUp = () => { dragging.current = false; };

  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    updateSlider(e.touches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (dragging.current) updateSlider(e.touches[0].clientX);
  };
  const onTouchEnd = () => { dragging.current = false; };

  return (
    <>
      {/* Scene selector buttons */}
      <div className="ba-selector">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            className={`ba-btn${i === activeScene ? " ba-btn-active" : ""}`}
            onClick={() => { setActiveScene(i); setSliderPct(50); }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Comparison widget */}
      <div
        ref={containerRef}
        className="ba-widget"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Before (left) */}
        <div className="ba-before">
          <span className="ba-placeholder-icon" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="3" y="4" width="18" height="16" rx="1.5" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="m21 16-5-5L5 20" />
            </svg>
            <span>Archival photograph · {scene.beforeYear}</span>
          </span>
        </div>

        {/* After (right, clipped) */}
        <div
          className="ba-after"
          style={{ clipPath: `inset(0 0 0 ${sliderPct}%)` }}
        >
          <span className="ba-placeholder-icon" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="3" y="4" width="18" height="16" rx="1.5" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="m21 16-5-5L5 20" />
            </svg>
            <span>Present day · {scene.afterYear}</span>
          </span>
        </div>

        {/* Corner labels */}
        <div className="ba-label ba-label-before">Before · {scene.beforeYear}</div>
        <div className="ba-label ba-label-after">After · {scene.afterYear}</div>

        {/* Divider + handle */}
        <div className="ba-divider" style={{ left: `${sliderPct}%` }}>
          <div className="ba-handle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 7l-4 5 4 5" />
              <path d="M16 7l4 5-4 5" />
              <path d="M4 12h16" />
            </svg>
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className="ba-caption">{scene.caption}</p>
    </>
  );
}
