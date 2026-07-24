"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArchiveAudioPlayer } from "@/components/archive-audio-player";
import {
  ARCHIVE_CATEGORIES,
  ARCHIVE_ENTRIES,
  type ArchiveEntry,
} from "@/data/archive-entries";
import { filterArchiveEntries } from "@/lib/filter-archive-entries";

const FILTERS = ["All", ...ARCHIVE_CATEGORIES];
const MODAL_FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), audio[controls], [tabindex]:not([tabindex="-1"])';

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

export default function ArchiveExplorer() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [openItem, setOpenItem] = useState<ArchiveEntry | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalPanelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setOpenItem(null);
      setIsClosing(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    }, 200);
  }, [isClosing]);

  useEffect(() => {
    if (!openItem) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      if (event.key === "Tab") {
        const panel = modalPanelRef.current;
        const focusableElements = panel?.querySelectorAll<HTMLElement>(
          MODAL_FOCUSABLE_SELECTOR,
        );

        if (!panel || !focusableElements?.length) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (!panel.contains(document.activeElement)) {
          event.preventDefault();
          firstFocusable.focus();
        } else if (event.shiftKey && document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, openItem]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const filtered = useMemo(
    () => filterArchiveEntries(ARCHIVE_ENTRIES, activeFilter, query),
    [activeFilter, query],
  );

  function handleOpen(item: ArchiveEntry, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setOpenItem(item);
  }

  return (
    <>
      <div className="archive-controls">
        <div
          className="archive-filter-row"
          role="group"
          aria-label="Filter archive by category"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`archive-filter-btn${
                activeFilter === filter ? " archive-filter-active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="archive-search-wrap">
          <span className="archive-search-icon" aria-hidden="true">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            className="archive-search-input"
            type="search"
            value={query}
            placeholder="search by person, place, year…"
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search the archive"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="archive-grid">
          {filtered.map((item) => (
            <article
              key={item.slug}
              className="archive-card"
            >
              <button
                type="button"
                className="archive-card-trigger"
                onClick={(event) => handleOpen(item, event.currentTarget)}
                aria-label={`Open ${item.title} by ${item.narrators}`}
              />

              <div className="archive-card-content">
                <div className="card-img-area">
                  <span className="card-badge">
                    {item.mediaType} · {item.duration}
                  </span>
                  <div className="card-source-panel">
                    <span className="card-source-format">{item.mediaType}</span>
                    <span className="card-source-duration">{item.duration}</span>
                    <span className="card-source-kind">Oral history</span>
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-narrators">— {item.narrators}</p>
                  <p className="card-metadata">{item.metadata}</p>
                  <p className="card-desc">{item.summary}</p>
                  <div className="card-footer">
                    <span>Era · {item.era}</span>
                    <span>Category · {item.category}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="archive-empty" role="status">
          <h2>No archive entries found.</h2>
          <p>Try another category or search term.</p>
        </div>
      )}

      {openItem && (
        <div
          className={`archive-modal-overlay${isClosing ? " is-closing" : ""}`}
          onClick={handleClose}
        >
          <div
            ref={modalPanelRef}
            className="archive-modal-panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-modal-title"
            aria-describedby="archive-modal-summary"
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="archive-modal-close"
              onClick={handleClose}
              aria-label="Close archive story"
            >
              <CloseIcon />
            </button>

            <div className="archive-modal-badge">
              {openItem.mediaType} · {openItem.duration}
            </div>
            <h2 id="archive-modal-title" className="archive-modal-title">
              {openItem.title}
            </h2>
            <p className="archive-modal-author">— {openItem.narrators}</p>
            <p className="archive-modal-metadata">{openItem.metadata}</p>

            <div className="archive-modal-body">
              <p id="archive-modal-summary" className="archive-modal-desc">
                {openItem.summary}
              </p>
              {openItem.audioTracks?.length ? (
                <ArchiveAudioPlayer tracks={openItem.audioTracks} />
              ) : null}
              <p className="archive-modal-meta">
                Era · {openItem.era} &nbsp;/&nbsp; Category · {openItem.category}
              </p>
              <div className="archive-modal-story">
                <h3>Full story</h3>
                <p>{openItem.story}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
