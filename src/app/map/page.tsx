import type { Metadata } from "next";
import MapClientLoader from "../../components/map-client-loader";
import BeforeAfter from "../../components/before-after";

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
          place, and drag the slider below to travel between decades.
        </p>

        <MapClientLoader />

        <section id="cv-ba" className="map-ba-section">
          <div className="map-ba-header">
            <span className="map-ba-label">Before &amp; After</span>
            <h2 className="map-ba-h2">Travel between <em>eras</em>.</h2>
          </div>
          <BeforeAfter />
        </section>
      </div>
    </main>
  );
}