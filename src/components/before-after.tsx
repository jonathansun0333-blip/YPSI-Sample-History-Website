"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { withBasePath } from "../lib/asset-path";

interface Scene {
  id: string;
  label: string;
  beforeYear: string;
  afterYear: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  beforeDescription: string;
  afterDescription: string;
  caption: string;
  beforeObjectFit?: "cover" | "contain";
  afterObjectFit?: "cover" | "contain";
  beforeObjectPosition?: string;
  afterObjectPosition?: string;
}

const SCENES: readonly Scene[] = [
  {
    id: "stevens-creek-blvd-1955",
    label: "Stevens Creek Boulevard · 1955 ↔ 2026",
    beforeYear: "1955",
    afterYear: "2026",
    beforeImage: "/images/before-after/stevens-creek-blvd-1955.jpg",
    afterImage: "/images/before-after/stevens-creek-blvd-2026.jpg",
    beforeAlt:
      "A 1955 street-level view of Stevens Creek Boulevard with a two-lane road, roadside businesses, utility poles, and western hills.",
    afterAlt:
      "A 2026 aerial view of Stevens Creek Boulevard and De Anza with a wide intersection, offices, commercial buildings, and neighborhoods.",
    beforeDescription:
      "A 1955 street-level view of Stevens Creek Boulevard, showing a two-lane road, roadside businesses, utility poles, and the western hills in the distance.",
    afterDescription:
      "A 2026 aerial view of the Stevens Creek Boulevard and De Anza area, now occupied by a wide intersection, offices, commercial buildings, and dense surrounding neighborhoods.",
    caption:
      "Stevens Creek Boulevard at the De Anza intersection — once a two-lane road between apricot orchards, now the city’s commercial spine.",
    beforeObjectFit: "contain",
    afterObjectFit: "cover",
  },
  {
    id: "blackberry-farm-1970",
    label: "Blackberry Farm · 1970 ↔ 2026",
    beforeYear: "1970",
    afterYear: "2026",
    beforeImage: "/images/before-after/blackberry-farm-1970.jpg",
    afterImage: "/images/before-after/blackberry-farm-2026.jpg",
    beforeAlt:
      "An archival aerial view of Blackberry Farm around 1970 with rural buildings, fields, and wooded foothills.",
    afterAlt:
      "Blackberry Farm in 2026 with its recreation lawn and swimming-pool area.",
    beforeDescription:
      "An archival aerial view of Blackberry Farm around 1970, showing its original rural buildings, fields, and wooded foothills.",
    afterDescription:
      "Blackberry Farm in 2026, showing the present-day recreation lawn and swimming-pool area.",
    caption:
      "Blackberry Farm Resort along Stevens Creek — a beloved retreat for generations of Bay Area families. The grounds have been preserved as a city park.",
    beforeObjectFit: "contain",
    afterObjectFit: "contain",
  },
  {
    id: "de-anza-original-crossroads-1880s",
    label: "De Anza Original Crossroads · 1880s ↔ 2026",
    beforeYear: "1880s",
    afterYear: "2026",
    beforeImage:
      "/images/before-after/de-anza-original-crossroads-1880s.jpg",
    afterImage:
      "/images/before-after/de-anza-original-crossroads-2026.jpg",
    beforeAlt:
      "An archival view of Cupertino’s original crossroads with an unpaved road, orchards, rural buildings, and horse-drawn travel.",
    afterAlt:
      "The De Anza corridor in 2026 with a signalized street, commercial development, and protected bicycle infrastructure.",
    beforeDescription:
      "An archival view of Cupertino’s original crossroads, with an unpaved road, orchards, rural buildings, and horse-drawn travel.",
    afterDescription:
      "The corridor in 2026, showing a modern signalized street, commercial development, and protected bicycle infrastructure.",
    caption:
      "The original crossroads at the heart of the Cupertino settlement — now surrounded by commercial development, but still near the geographic center of the city.",
    beforeObjectFit: "contain",
    afterObjectFit: "cover",
  },
  {
    id: "stevens-creek-de-anza-1948",
    label: "Stevens Creek & De Anza · 1948 ↔ 2026",
    beforeYear: "1948",
    afterYear: "2026",
    beforeImage: "/images/before-after/stevens-creek-de-anza-1948.jpg",
    afterImage: "/images/before-after/stevens-creek-de-anza-2026.jpg",
    beforeAlt:
      "A 1948 aerial photograph of Stevens Creek Road and De Anza Boulevard surrounded by orchards and open land.",
    afterAlt:
      "A 2026 aerial photograph of the Stevens Creek and De Anza intersection after suburban and commercial development.",
    beforeDescription:
      "A 1948 aerial photograph of Stevens Creek Road and De Anza Boulevard when the crossroads was surrounded mainly by orchards and open land.",
    afterDescription:
      "A 2026 aerial photograph of the same intersection after extensive suburban, transportation, and commercial development.",
    caption:
      "The intersection transformed from an orchard crossroads into one of Cupertino’s principal commercial and transportation junctions.",
    beforeObjectFit: "contain",
    afterObjectFit: "cover",
  },
  {
    id: "monta-vista-1960s",
    label: "Monta Vista High School · 1960s ↔ 2026",
    beforeYear: "1960s",
    afterYear: "2026",
    beforeImage: "/images/before-after/monta-vista-1960s.jpg",
    afterImage: "/images/before-after/monta-vista-2026.jpg",
    beforeAlt:
      "A 1960s view of Monta Vista High School’s central courtyard with students around the original campus buildings.",
    afterAlt:
      "The Monta Vista High School courtyard in 2026 with mature landscaping and an active campus.",
    beforeDescription:
      "A 1960s-era view of Monta Vista High School’s central courtyard, with students gathered around the original campus buildings.",
    afterDescription:
      "The Monta Vista High School courtyard in 2026, showing mature landscaping and the campus still in active use.",
    caption:
      "Founded in 1969 in Cupertino, Monta Vista High School became a defining educational institution within the high-achieving, technology-driven culture of Silicon Valley.",
    beforeObjectFit: "contain",
    afterObjectFit: "contain",
  },
  {
    id: "de-anza-college-1967",
    label: "De Anza College · 1967 ↔ 2026",
    beforeYear: "1967",
    afterYear: "2026",
    beforeImage: "/images/before-after/de-anza-college-1967.jpg",
    afterImage: "/images/before-after/de-anza-college-2026.jpg",
    beforeAlt:
      "An archival view of De Anza College around its 1967 opening with early campus buildings and a central gathering space.",
    afterAlt:
      "A 2026 aerial view of De Anza College with campus buildings, athletic fields, and surrounding Cupertino neighborhoods.",
    beforeDescription:
      "An archival view of De Anza College around its 1967 opening, showing the early campus buildings and central gathering space.",
    afterDescription:
      "A 2026 aerial view of De Anza College, including its campus buildings, athletic fields, and surrounding Cupertino neighborhoods.",
    caption:
      "De Anza College was established in 1967 and named after Spanish explorer Juan Bautista de Anza. It is a public community college in Cupertino, widely recognized for its vibrant campus life and for student transfers to the University of California and California State University systems.",
    beforeObjectFit: "contain",
    afterObjectFit: "contain",
  },
  {
    id: "mcclellan-ranch-historic",
    label: "McClellan Ranch Preserve · Historic ↔ 2026",
    beforeYear: "Historic",
    afterYear: "2026",
    beforeImage: "/images/before-after/mcclellan-ranch-historic.jpg",
    afterImage: "/images/before-after/mcclellan-ranch-2026.jpg",
    beforeAlt:
      "An archival photograph of the historic McClellan ranch house and its residents.",
    afterAlt:
      "McClellan Ranch Preserve in 2026 with preserved red ranch buildings, open space, and native landscaping.",
    beforeDescription:
      "An archival photograph of the historic McClellan ranch house and its residents.",
    afterDescription:
      "McClellan Ranch Preserve in 2026, with preserved red ranch buildings, open space, and native landscaping.",
    caption:
      "Dating back to the 1870s, McClellan Ranch Preserve is an 18-acre natural preserve in Cupertino. Today, it protects historic ranch structures while serving as an environmental education hub, a scenic area of the Stevens Creek Trail, and a sanctuary for local birdwatching.",
    beforeObjectFit: "cover",
    afterObjectFit: "contain",
  },
];

const SLIDER_KEYBOARD_STEP = 5;

function clampSlider(value: number) {
  return Math.max(0, Math.min(100, value));
}

export default function BeforeAfter() {
  const [activeSceneId, setActiveSceneId] = useState(SCENES[0].id);
  const [sliderPct, setSliderPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const scene =
    SCENES.find((candidate) => candidate.id === activeSceneId) ?? SCENES[0];

  const selectScene = useCallback((sceneId: string) => {
    if (!SCENES.some((candidate) => candidate.id === sceneId)) return;
    setActiveSceneId(sceneId);
    setSliderPct(50);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const sceneId = (event as CustomEvent<string>).detail;
      const selectedScene = SCENES.find((candidate) => candidate.id === sceneId);
      if (selectedScene) selectScene(selectedScene.id);
    };

    window.addEventListener("cv:select-ba-scene", handler);
    return () => window.removeEventListener("cv:select-ba-scene", handler);
  }, [selectScene]);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0) return;
    setSliderPct(
      clampSlider(((clientX - rect.left) / rect.width) * 100),
    );
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateSlider(event.clientX);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) updateSlider(event.clientX);
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowLeft" ? -1 : 1;
    setSliderPct((value) =>
      clampSlider(value + direction * SLIDER_KEYBOARD_STEP),
    );
  };

  return (
    <>
      <div
        className="ba-selector"
        role="tablist"
        aria-label="Choose a Cupertino before-and-after scene"
      >
        {SCENES.map((candidate) => {
          const isActive = candidate.id === scene.id;
          return (
            <button
              key={candidate.id}
              type="button"
              className={`ba-btn${isActive ? " ba-btn-active" : ""}`}
              role="tab"
              aria-selected={isActive}
              aria-controls="ba-panel"
              onClick={() => selectScene(candidate.id)}
            >
              {candidate.label}
            </button>
          );
        })}
      </div>

      <div id="ba-panel" role="tabpanel">
        <div
          ref={containerRef}
          className="ba-widget"
          role="slider"
          tabIndex={0}
          aria-label={`Compare ${scene.label}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sliderPct)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onKeyDown={onKeyDown}
        >
          <div className="ba-before">
            <Image
              className="ba-image"
              src={withBasePath(scene.beforeImage)}
              alt={scene.beforeAlt}
              fill
              sizes="(max-width: 700px) 100vw, 1136px"
              draggable={false}
              style={{
                objectFit: scene.beforeObjectFit ?? "cover",
                objectPosition: scene.beforeObjectPosition ?? "center",
                pointerEvents: "none",
              }}
            />
          </div>

          <div
            className="ba-after"
            style={{ clipPath: `inset(0 0 0 ${sliderPct}%)` }}
          >
            <Image
              className="ba-image"
              src={withBasePath(scene.afterImage)}
              alt={scene.afterAlt}
              fill
              sizes="(max-width: 700px) 100vw, 1136px"
              draggable={false}
              style={{
                objectFit: scene.afterObjectFit ?? "cover",
                objectPosition: scene.afterObjectPosition ?? "center",
                pointerEvents: "none",
              }}
            />
          </div>

          <div className="ba-label ba-label-before">
            Before · {scene.beforeYear}
          </div>
          <div className="ba-label ba-label-after">
            After · {scene.afterYear}
          </div>

          <div
            className="ba-divider"
            style={{ left: `${sliderPct}%` }}
            aria-hidden="true"
          >
            <div className="ba-handle">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 7l-4 5 4 5" />
                <path d="M16 7l4 5-4 5" />
                <path d="M4 12h16" />
              </svg>
            </div>
          </div>
        </div>

        <div className="ba-descriptions">
          <section className="ba-description">
            <h3>Before · {scene.beforeYear}</h3>
            <p>{scene.beforeDescription}</p>
          </section>
          <section className="ba-description">
            <h3>After · {scene.afterYear}</h3>
            <p>{scene.afterDescription}</p>
          </section>
        </div>

        <p className="ba-caption">{scene.caption}</p>
      </div>
    </>
  );
}
