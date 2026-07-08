import type { Metadata } from "next";
import ArchiveExplorer from "@/components/archive-explorer";

export const metadata: Metadata = {
  title: "Archive",
  description: "Browse stories, photographs, documents, and oral histories.",
};

export default function ArchivePage() {
  return (
    <main className="archive-page">
      <div className="archive-page-inner">

        {/* ── Meta row ── */}
        <div className="archive-page-meta">
          <span>The Full Archive</span>
          <span>Filter · Search · Browse</span>
        </div>

        {/* ── Headline ── */}
        <h1 className="archive-h1">
          Every story, <span className="archive-accent">searchable</span>.
        </h1>

        {/* ── Lead ── */}
        <p className="archive-lead">
          Filter by medium, search by name, place, or year. Each entry shows a
          placeholder layout until interviews and documents are added — click
          any card to see the full preview.
        </p>

        {/* ── Interactive explorer ── */}
        <ArchiveExplorer />

      </div>
    </main>
  );
}
