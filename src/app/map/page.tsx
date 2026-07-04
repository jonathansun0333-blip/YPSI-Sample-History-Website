import type { Metadata } from "next";
import MapClientLoader from "../../components/map-client-loader";

export const metadata: Metadata = {
  title: "Interactive Map",
  description: "Explore historic places across Cupertino.",
};

export default function MapPage() {
  return (
    <main className="map-page">
      <div className="map-page-inner">
        <div className="map-page-meta">
          <span>Interactive Map</span>
          <span>6 places · Then &amp; now</span>
        </div>

        <h1 className="map-page-h1">
          Then &amp; <span className="map-page-accent">now</span>.
        </h1>

        <p className="map-page-lead">
          Pin by pin, we are mapping the Cupertino that was — and showing how
          it became the one we know. Click any pin or list entry to fly to that
          place.
        </p>

        <MapClientLoader />
      </div>
    </main>
  );
}