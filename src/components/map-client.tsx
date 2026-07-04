"use client";

import { useEffect, useRef, useState } from "react";

interface Location {
  id: number;
  name: string;
  years: string;
  lat: number;
  lng: number;
  popupDesc: string;
}

const LOCATIONS: Location[] = [
  {
    id: 1,
    name: "Stevens Creek & De Anza",
    years: "1955 — 2026",
    lat: 37.3249,
    lng: -122.036,
    popupDesc: "The main commercial crossroads of modern Cupertino.",
  },
  {
    id: 2,
    name: "Blackberry Farm",
    years: "1924 — Present",
    lat: 37.3222,
    lng: -122.0542,
    popupDesc: "A beloved resort and park along Stevens Creek since 1924.",
  },
  {
    id: 3,
    name: "De Anza College",
    years: "1967 — Present",
    lat: 37.3196,
    lng: -122.0353,
    popupDesc: "Opened in 1967 on the grounds of the old Beaulieu estate.",
  },
  {
    id: 4,
    name: "Monta Vista High School",
    years: "1962 — Present",
    lat: 37.3101,
    lng: -122.0652,
    popupDesc: "One of the oldest and most storied schools in the city.",
  },
  {
    id: 5,
    name: "Original Crossroads",
    years: "1880s — Now",
    lat: 37.322,
    lng: -122.0421,
    popupDesc: "The historic heart of the Cupertino settlement.",
  },
  {
    id: 6,
    name: "McClellan Ranch Preserve",
    years: "1850s — Present",
    lat: 37.3035,
    lng: -122.0527,
    popupDesc: "A working ranch turned nature preserve in the city's south.",
  },
];

export default function MapClient() {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersRef = useRef<Map<number, unknown>>(new Map());
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    if (!mapElRef.current || mapInstanceRef.current) return;

    // Load Leaflet CSS
    const cssId = "leaflet-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    let cancelled = false;

    import("leaflet").then((mod) => {
      if (cancelled || !mapElRef.current || mapInstanceRef.current) return;

      const L = mod.default;

      const map = L.map(mapElRef.current, {
        center: [37.323, -122.032],
        zoom: 13,
        zoomControl: false,
      });

      // CARTO light tiles (matching legacy)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap, © CARTO",
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Zoom control top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Custom rust-colored circular markers
      for (const loc of LOCATIONS) {
        const icon = L.divIcon({
          className: "cv-pin",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          popupAnchor: [0, -12],
        });

        const popup = L.popup({ className: "cv-popup" }).setContent(`
          <div class="cv-pop-title">${loc.name}</div>
          <div class="cv-pop-year">${loc.years}</div>
          <div class="cv-pop-desc">${loc.popupDesc}</div>
        `);

        const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map).bindPopup(popup);

        marker.on("click", () => setActiveId(loc.id));

        markersRef.current.set(loc.id, marker);
      }

      mapInstanceRef.current = map;
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove(): void }).remove();
        mapInstanceRef.current = null;
        markersRef.current.clear();
      }
    };
  }, []);

  function flyTo(loc: Location) {
    setActiveId(loc.id);
    const map = mapInstanceRef.current as { flyTo(latlng: [number, number], zoom: number): void } | null;
    const marker = markersRef.current.get(loc.id) as { openPopup(): void } | undefined;
    if (map) {
      map.flyTo([loc.lat, loc.lng], 15);
      setTimeout(() => marker?.openPopup(), 600);
    }
  }

  return (
    <div className="map-layout">
      {/* Leaflet map */}
      <div ref={mapElRef} className="map-canvas" />

      {/* Sidebar */}
      <aside className="map-sidebar">
        <div className="map-sidebar-header">
          <div className="map-sidebar-title">Pinned Locations</div>
          <div className="map-sidebar-sub">Click to fly to map</div>
        </div>
        <ul className="map-location-list">
          {LOCATIONS.map((loc) => (
            <li
              key={loc.id}
              className={`map-location-item${activeId === loc.id ? " map-location-active" : ""}`}
              onClick={() => flyTo(loc)}
            >
              <h4 className="map-location-name">{loc.name}</h4>
              <span className="map-location-years">{loc.years}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

