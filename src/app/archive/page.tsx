import type { Metadata } from "next";
import ArchiveExplorer from "@/components/archive-explorer";

export const metadata: Metadata = {
  title: "Archive",
  description: "Browse Cupertino oral histories by person, place, era, and topic.",
};

export default function ArchivePage() {
  return (
    <main className="archive-page">
      <div className="archive-page-inner">
        <div className="archive-page-meta">
          <span>The Full Archive</span>
          <span>Filter · Search · Browse</span>
        </div>

        <h1 className="archive-h1">
          Every story, <span className="archive-accent">searchable</span>.
        </h1>

        <p className="archive-lead">
          Filter the oral-history collection, search by person, place, year, or
          topic, and open any entry to read the complete story.
        </p>

        <ArchiveExplorer />
      </div>
    </main>
  );
}
