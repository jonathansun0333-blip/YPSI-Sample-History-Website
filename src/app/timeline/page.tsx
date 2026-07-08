import type { Metadata } from "next";
import TimelineExplorer from "@/components/timeline-explorer";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Explore major events in Cupertino history.",
};

export default function TimelinePage() {
  return (
    <div className="tl-page">
      <div className="tl-page-inner">
        <div className="tl-eyebrow">
          <span>Interactive Timeline</span>
          <span>14 events · 250 years</span>
        </div>
        <h1 className="tl-h1">
          Cupertino, <span className="tl-h1-accent">year by year</span>.
        </h1>
        <p className="tl-lead">
          Drag the slider or use the arrows to move through Cupertino&apos;s
          history. Each event includes the date, what happened, and what part
          of the city it changed.
        </p>
        <TimelineExplorer />
      </div>
    </div>
  );
}