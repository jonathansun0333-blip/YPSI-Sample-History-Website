"use client";

import { useState } from "react";

interface Story {
  yearRange: string;
  title: string;
  author: string;
  badge: string;
  active: boolean;
  desc: string;
  category: string;
}

const STORIES: Story[] = [
  {
    yearRange: "1962—Now",
    title: "Six decades on Stelling Road",
    author: "Placeholder Family",
    badge: "Video",
    active: true,
    desc: "A multi-generational family on apricot harvests, the bakery on the corner, and the morning the bulldozers arrived.",
    category: "family",
  },
  {
    yearRange: "1967—1995",
    title: "The De Anza years",
    author: "Placeholder Narrator",
    badge: "Audio",
    active: true,
    desc: "A founding faculty member on building a community college from former ranch land.",
    category: "community",
  },
  {
    yearRange: "1972—1989",
    title: "Saturdays at the farm",
    author: "Placeholder Contributor",
    badge: "Video",
    active: true,
    desc: "A short documentary on Blackberry Farm — the swim parties, the picnics, the meaning of summer.",
    category: "community",
  },
  {
    yearRange: "1940s—2020s",
    title: "Main Street, year by year",
    author: "Composite Archive",
    badge: "Photo Series",
    active: false,
    desc: "A photographic walk down Stevens Creek Boulevard, decade by decade, assembled from family albums.",
    category: "archive",
  },
  {
    yearRange: "1934—1948",
    title: "Letters from the orchard",
    author: "Estate of placeholder",
    badge: "Letters",
    active: false,
    desc: "Correspondence between an orchard owner and his daughter, preserved in a shoebox for seventy years.",
    category: "family",
  },
];

function PlaceholderIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m21 16-5-5L5 20" />
    </svg>
  );
}

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

export default function FeaturedStories() {
  const [openStory, setOpenStory] = useState<Story | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setOpenStory(null);
      setIsClosing(false);
    }, 200);
  }

  return (
    <>
      <div className="story-list">
        {STORIES.map((story) => (
          <article
            key={story.title}
            className="story-row"
            onClick={() => setOpenStory(story)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setOpenStory(story)}
          >
            <span className="story-year">{story.yearRange}</span>
            <span className="story-title">{story.title}</span>
            <span className="story-author">— {story.author}</span>
            <span className={`story-type-badge${story.active ? " story-type-active" : ""}`}>
              {story.badge} <ArrowRight />
            </span>
          </article>
        ))}
      </div>

      {/* Detail modal */}
      {openStory && (
        <div className={`story-modal-overlay${isClosing ? " is-closing" : ""}`} onClick={handleClose}>
          <div
            className="story-modal-panel"
            onClick={(e) => e.stopPropagation()}
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
              {openStory.badge} · {openStory.yearRange}
            </div>
            <h2 id="story-modal-title" className="story-modal-title">
              {openStory.title}
            </h2>
            <p className="story-modal-author">— {openStory.author}</p>

            <div className="story-modal-media">
              <span className="story-modal-placeholder">
                <PlaceholderIcon />
                <span>{openStory.badge.toLowerCase()} placeholder · awaiting contribution</span>
              </span>
            </div>

            <div className="story-modal-body">
              <p className="story-modal-desc">{openStory.desc}</p>
              <p className="story-modal-meta">
                Era · {openStory.yearRange} &nbsp;/&nbsp; Category · {openStory.category}
              </p>
              <p className="story-modal-placeholder-note">
                This is a placeholder entry. Full story text, embedded media, transcript, and
                related items will appear here once the story is added to the archive.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
