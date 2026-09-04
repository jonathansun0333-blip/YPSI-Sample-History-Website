import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchiveAudioPlayer } from "@/components/archive-audio-player";
import InterviewComments from "@/components/interview-comments";
import InterviewReactions from "@/components/interview-reactions";
import { ARCHIVE_ENTRIES } from "@/data/archive-entries";

/**
 * A permanent page for one interview, at /archive/<slug>/.
 *
 * The archive explorer shows entries in a modal, which means a visitor cannot
 * link a friend to one story, a search engine cannot index it, and there is no
 * stable URL to hang per-interview discussion on. This route gives every
 * interview a real address; the modal remains as the quick-browse affordance.
 */

type InterviewPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Enumerates every interview URL at build time.
 *
 * Required by `output: "export"` in next.config.ts — a static export has no
 * server to render an unknown slug on demand, so every page must be listed
 * here. New entries in ARCHIVE_ENTRIES are picked up automatically.
 */
export function generateStaticParams() {
  return ARCHIVE_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: InterviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = ARCHIVE_ENTRIES.find((item) => item.slug === slug);

  if (!entry) return { title: "Interview not found" };

  return {
    title: entry.title,
    // Summaries are written for humans first; they double as the share preview.
    description: entry.summary,
    openGraph: {
      title: entry.title,
      description: entry.summary,
      type: "article",
    },
  };
}

function ArrowLeft() {
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
      <path d="M20 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  );
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { slug } = await params;
  const entry = ARCHIVE_ENTRIES.find((item) => item.slug === slug);

  if (!entry) notFound();

  return (
    <main className="archive-page">
      <div className="archive-page-inner">
        <Link href="/archive" className="button button-secondary">
          <ArrowLeft /> Back to the archive
        </Link>

        <div className="archive-modal-badge">
          {entry.mediaType} · {entry.duration}
        </div>

        <h1 className="archive-h1">{entry.title}</h1>
        <p className="archive-modal-author">— {entry.narrators}</p>
        <p className="archive-modal-metadata">{entry.metadata}</p>

        <div className="archive-modal-body">
          <p className="archive-lead">{entry.summary}</p>

          {entry.audioTracks?.length ? (
            <ArchiveAudioPlayer tracks={entry.audioTracks} />
          ) : null}

          <p className="archive-modal-meta">
            Era · {entry.era} &nbsp;/&nbsp; Category · {entry.category}
          </p>

          <div className="archive-modal-story">
            <h2>Full story</h2>
            <p>{entry.story}</p>
          </div>
        </div>

        <InterviewReactions slug={entry.slug} />
        <InterviewComments slug={entry.slug} />
      </div>
    </main>
  );
}
