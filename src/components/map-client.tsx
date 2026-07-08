"use client";

import { useEffect, useRef, useState } from "react";

interface Location {
  id: number;
  name: string;
  years: string;
  lat: number;
  lng: number;
  popupDesc: string;
  baSceneIndex?: number;
}

// Cupertino city boundary coordinates (lat, lng) extracted from official boundary data
const CUPERTINO_BOUNDARY: [number, number][] = [
  [37.33714,-122.04369],[37.334,-122.04369],[37.334,-122.04489],[37.33755,-122.04489],[37.33755,-122.05055],[37.3329,-122.0509],[37.33195,-122.0521],[37.33181,-122.05278],[37.33017,-122.05278],[37.33017,-122.05433],[37.3314,-122.05725],[37.33454,-122.05725],[37.33604,-122.05862],[37.33686,-122.05793],[37.33782,-122.05811],[37.33823,-122.05931],[37.33755,-122.05896],[37.33755,-122.06738],[37.33645,-122.06617],[37.33645,-122.0648],[37.33536,-122.06514],[37.33441,-122.06411],[37.33536,-122.06652],[37.3355,-122.06789],[37.33345,-122.06841],[37.33304,-122.06377],[37.33236,-122.06394],[37.33263,-122.06343],[37.33167,-122.0624],[37.3314,-122.0612],[37.33086,-122.06171],[37.33113,-122.06102],[37.33045,-122.06137],[37.33072,-122.06085],[37.33004,-122.06068],[37.32935,-122.05965],[37.32853,-122.06034],[37.32867,-122.06223],[37.32922,-122.06257],[37.32949,-122.06205],[37.3299,-122.06223],[37.33045,-122.0636],[37.33072,-122.06738],[37.33127,-122.0672],[37.3314,-122.06892],[37.33167,-122.06841],[37.33195,-122.06875],[37.33236,-122.06823],[37.33263,-122.06858],[37.33318,-122.06806],[37.33318,-122.06875],[37.33004,-122.06926],[37.32976,-122.06978],[37.33304,-122.07596],[37.33413,-122.07973],[37.33345,-122.07922],[37.33195,-122.08076],[37.33195,-122.08197],[37.33304,-122.08317],[37.33577,-122.08385],[37.33673,-122.08334],[37.33741,-122.08488],[37.3385,-122.08591],[37.33959,-122.08763],[37.34041,-122.08969],[37.33959,-122.09055],[37.33659,-122.09089],[37.3329,-122.08729],[37.33318,-122.08694],[37.33372,-122.08746],[37.33413,-122.08471],[37.3314,-122.08403],[37.33154,-122.08317],[37.33113,-122.08282],[37.32676,-122.08935],[37.32376,-122.08265],[37.32321,-122.07819],[37.32048,-122.08145],[37.3172,-122.07767],[37.31529,-122.07767],[37.31529,-122.08763],[37.3086,-122.08729],[37.3086,-122.07767],[37.30806,-122.07767],[37.30806,-122.09209],[37.30068,-122.09227],[37.30028,-122.06841],[37.29659,-122.06841],[37.29495,-122.06772],[37.29495,-122.06686],[37.29372,-122.06686],[37.29372,-122.06841],[37.27911,-122.06858],[37.27952,-122.06806],[37.27911,-122.06394],[37.28116,-122.06394],[37.27857,-122.05948],[37.2828,-122.05948],[37.28266,-122.06394],[37.29004,-122.06411],[37.29004,-122.05965],[37.29618,-122.05965],[37.29632,-122.05845],[37.29741,-122.05811],[37.29741,-122.05038],[37.29304,-122.04952],[37.29345,-122.04729],[37.29372,-122.04746],[37.294,-122.03218],[37.30205,-122.03218],[37.30191,-122.03304],[37.30232,-122.03304],[37.30382,-122.0351],[37.30382,-122.03424],[37.30492,-122.03424],[37.30492,-122.03339],[37.30601,-122.03339],[37.30601,-122.03304],[37.30942,-122.03304],[37.3101,-122.03424],[37.31229,-122.03424],[37.31229,-122.03167],[37.30956,-122.02171],[37.31079,-122.00781],[37.30956,-121.99614],[37.32034,-121.99579],[37.32062,-121.9994],[37.32103,-121.99991],[37.32007,-122.00283],[37.32307,-122.00335],[37.32307,-122.00472],[37.33413,-122.00472],[37.33413,-122.00249],[37.33782,-122.00249],[37.33768,-122.01656],[37.3329,-122.01656],[37.3329,-122.02],[37.33714,-122.02],[37.33714,-122.01965],[37.33768,-122.01965],[37.33768,-122.02171],[37.33714,-122.02171],[37.33714,-122.02223],[37.33768,-122.02223],[37.33755,-122.03047],[37.33823,-122.03047],[37.33823,-122.03253],[37.33946,-122.03253],[37.33946,-122.03682],[37.33755,-122.03682],[37.33755,-122.04369],
];

const LOCATIONS: Location[] = [
  { id: 1, name: "Stevens Creek & De Anza", years: "1955 — 2026", lat: 37.3249, lng: -122.036, popupDesc: "The city's main crossroads — once orchard country, now its commercial heart.", baSceneIndex: 0 },
  { id: 2, name: "Blackberry Farm", years: "1924 — Present", lat: 37.3222, lng: -122.0542, popupDesc: "A beloved resort and park along Stevens Creek since 1924.", baSceneIndex: 1 },
  { id: 3, name: "De Anza College", years: "1967 — Present", lat: 37.3196, lng: -122.0353, popupDesc: "Opened in 1967 on the grounds of the old Beaulieu estate." },
  { id: 4, name: "Monta Vista High School", years: "1962 — Present", lat: 37.3101, lng: -122.0652, popupDesc: "One of the oldest and most storied schools in the city." },
  { id: 5, name: "Original Crossroads", years: "1880s — Now", lat: 37.322, lng: -122.0421, popupDesc: "The historic heart of the Cupertino settlement.", baSceneIndex: 2 },
  { id: 6, name: "McClellan Ranch Preserve", years: "1850s — Present", lat: 37.3035, lng: -122.0527, popupDesc: "A working ranch turned nature preserve in the city's south." },
];

// Dark/light tile URL templates
const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK  = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

function isDark() {
  return document.documentElement.classList.contains("dark");
}

export default function MapClient() {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const tileLayerRef = useRef<unknown>(null);
  const markersRef = useRef<Map<number, unknown>>(new Map());
  const [activeId, setActiveId] = useState<number | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapElRef.current || mapInstanceRef.current) return;

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

      // Tile layer (respects current dark/light mode)
      const tileUrl = isDark() ? TILE_DARK : TILE_LIGHT;
      const tileLayer = L.tileLayer(tileUrl, {
        attribution: "© OpenStreetMap, © CARTO",
        subdomains: "abcd",
        maxZoom: 19,
        className: "cv-map-tiles",
      }).addTo(map);
      tileLayerRef.current = tileLayer;

      L.control.zoom({ position: "topright" }).addTo(map);

      // Cupertino city boundary polygon
      L.polygon(CUPERTINO_BOUNDARY, {
        color: "#9a3d18",
        weight: 2,
        dashArray: "6 5",
        fillColor: "#9a3d18",
        fillOpacity: 0.07,
        opacity: 0.7,
      }).addTo(map);

      // Markers
      for (const loc of LOCATIONS) {
        const icon = L.divIcon({ className: "cv-pin", iconSize: [14, 14], iconAnchor: [7, 7], popupAnchor: [0, -12] });
        const baLink = loc.baSceneIndex !== undefined
          ? `<span class="cv-popup-link" data-idx="${loc.baSceneIndex}">View before &amp; after →</span>`
          : "";
        const popup = L.popup({ className: "cv-popup" }).setContent(`
          <div class="cv-pop-title">${loc.name}</div>
          <div class="cv-pop-year">${loc.years}</div>
          <div class="cv-pop-desc">${loc.popupDesc}</div>
          ${baLink}
        `);
        const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map).bindPopup(popup);
        marker.on("click", () => setActiveId(loc.id));
        popup.on("add", () => {
          const link = popup.getElement()?.querySelector<HTMLElement>(".cv-popup-link");
          if (link) {
            link.addEventListener("click", () => {
              const idx = Number(link.dataset.idx ?? 0);
              window.dispatchEvent(new CustomEvent("cv:select-ba-scene", { detail: idx }));
              document.getElementById("cv-ba")?.scrollIntoView({ behavior: "smooth" });
            });
          }
        });
        markersRef.current.set(loc.id, marker);
      }

      mapInstanceRef.current = map;
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove(): void }).remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
        markersRef.current.clear();
      }
    };
  }, []);

  // Listen for dark mode changes and swap tile layer
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const tileLayer = tileLayerRef.current as { setUrl(url: string): void } | null;
      if (!tileLayer) return;
      tileLayer.setUrl(isDark() ? TILE_DARK : TILE_LIGHT);
    });
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
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
      <div ref={mapElRef} className="map-canvas" />
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

