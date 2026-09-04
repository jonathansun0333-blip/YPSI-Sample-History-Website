"use client";

import Link from "next/link";
import { useState } from "react";

import { ArchiveAudioPlayer } from "@/components/archive-audio-player";
import type { ArchiveEntry } from "@/data/archive-entries";

/**
 * The home page's "Featured Stories" list.
 *
 * Receives real entries from `getFeaturedStories()` (see
 * `src/lib/featured-stories.ts`) rather than defining its own. To change which
 * stories appear here, edit the slug list in that file — not this component.
 */
type FeaturedStoriesProps = {
  stories: ArchiveEntry[];
};

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ArrowRight() {
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
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export default function FeaturedStories({ stories }: FeaturedStoriesProps) {
  const [openStory, setOpenStory] = useState<ArchiveEntry | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  function handleClose() {
    setIsClosing(true);
    // Matches the 200ms fade-out on `.story-modal-overlay.is-closing` in
    // globals.css; unmounting sooner cuts the animation short.
    setTimeout(() => {
      setOpenStory(null);
      setIsClosing(false);
    }, 200);
  }

  return (
    <>
      <div className="story-list">
        {stories.map((story) => (
          <article
            key={story.slug}
            className="story-row"
            onClick={() => setOpenStory(story)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setOpenStory(story);
              }
            }}
          >
            <span className="story-year">{story.era}</span>
            <span className="story-title">{story.title}</span>
            <span className="story-author">— {story.narrators}</span>
            <span className="story-type-badge story-type-active">
              {story.mediaType} <ArrowRight />
            </span>
          </article>
        ))}
      </div>

      {/* Detail modal */}
      {openStory && (
        <div
          className={`story-modal-overlay${isClosing ? " is-closing" : ""}`}
          onClick={handleClose}
        >
          <div
            className="story-modal-panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="story-modal-title"
          >
            <button
              className="story-modal-close"
              onClick={handleClose}
              aria-label="Close"
            >
              <CloseIcon />
            </button>

            <div className="story-modal-badge">
              {openStory.mediaType} · {openStory.duration}
            </div>
            <h2 id="story-modal-title" className="story-modal-title">
              {openStory.title}
            </h2>
            <p className="story-modal-author">— {openStory.narrators}</p>

            {openStory.audioTracks?.length ? (
              <div className="story-modal-media">
                <ArchiveAudioPlayer tracks={openStory.audioTracks} />
              </div>
            ) : null}

            <div className="story-modal-body">
              <p className="story-modal-desc">{openStory.story}</p>
              <p className="story-modal-meta">
                Era · {openStory.era} &nbsp;/&nbsp; Category · {openStory.category}
              </p>
              <Link href="/archive" className="button button-secondary">
                Browse the full archive <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
