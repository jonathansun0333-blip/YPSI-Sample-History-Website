"use client";

import { useMemo, useState } from "react";

interface ArchiveItem {
  id: number;
  badge: string;
  type: string;
  tags: string[];
  typeLabel: string;
  season: string;
  title: string;
  desc: string;
  contributor: string;
  yearRange: string;
}

const ITEMS: ArchiveItem[] = [
  { id: 1,  badge: "Video · 18:42",  type: "Video",      tags: ["Family"],            typeLabel: "VIDEO · 1962—NOW",       season: "Spring 2026",   title: "Six decades on Stelling Road",      desc: "A multi-generational family on apricot harvests, the bakery on the corner, and the morning the bulldozers arrived.", contributor: "Placeholder Family",        yearRange: "1962—Now"       },
  { id: 2,  badge: "Audio · 24:10",  type: "Audio",      tags: [],                    typeLabel: "AUDIO · 1967—1995",      season: "Oral History",  title: "The De Anza years",                 desc: "A founding faculty member on building a community college from former ranch land.",                                    contributor: "Placeholder Narrator",      yearRange: "1967—1995"      },
  { id: 3,  badge: "Photograph",     type: "Photograph", tags: [],                    typeLabel: "PHOTO · 1949",           season: "1949",          title: "Stevens Creek, before the freeway", desc: "A black-and-white from 1949, donated by a fourth-generation Cupertino resident.",                                     contributor: "Donated by family",         yearRange: "1949"           },
  { id: 4,  badge: "Document",       type: "Document",   tags: [],                    typeLabel: "DOC · 1955",             season: "Historical",    title: "The original town charter",         desc: "Cupertino's 1955 incorporation papers, scanned from city records.",                                                   contributor: "City of Cupertino",         yearRange: "1955"           },
  { id: 5,  badge: "Video · 7:21",   type: "Video",      tags: [],                    typeLabel: "VIDEO · 1972—1989",      season: "Short Doc",     title: "Saturdays at the farm",             desc: "A short documentary on Blackberry Farm — the swim parties, the picnics, the meaning of summer.",                      contributor: "Placeholder Contributor",   yearRange: "1972—1989"      },
  { id: 6,  badge: "Audio · 41:08",  type: "Audio",      tags: ["Family"],            typeLabel: "AUDIO · 1940s—2020s",    season: "Roundtable",    title: "Three generations, one kitchen",    desc: "A grandmother, mother, and daughter — same kitchen table, three Cupertinos.",                                         contributor: "Placeholder Family",        yearRange: "1940s—2020s"    },
  { id: 7,  badge: "Photo Series",   type: "Photograph", tags: [],                    typeLabel: "PHOTO · 1940s—2020s",    season: "Series",        title: "Main Street, year by year",         desc: "A photographic walk down Stevens Creek Boulevard, decade by decade, assembled from family albums.",                   contributor: "Composite Archive",         yearRange: "1940s—2020s"    },
  { id: 8,  badge: "Video · 12:33",  type: "Video",      tags: ["School"],            typeLabel: "VIDEO · 1962—PRESENT",   season: "Interview",     title: "Monta Vista then",                  desc: "Alumni return to walk the halls they remember — and the ones they no longer recognize.",                               contributor: "Class of 1980",             yearRange: "1962—Present"   },
  { id: 9,  badge: "Letters",        type: "Document",   tags: ["Family"],            typeLabel: "LETTERS · 1934—1948",    season: "Family Papers", title: "Letters from the orchard",          desc: "Correspondence between an orchard owner and his daughter, preserved in a shoebox for seventy years.",                  contributor: "Estate of placeholder",     yearRange: "1934—1948"      },
  { id: 10, badge: "Photograph",     type: "Photograph", tags: ["Business"],          typeLabel: "PHOTO · 1977—1988",      season: "Industrial",    title: "The first Apple campus",            desc: "The Infinite Loop site captured before it had a name everyone would know.",                                           contributor: "Placeholder contributor",   yearRange: "1977—1988"      },
  { id: 11, badge: "Audio · 19:55",  type: "Audio",      tags: ["Business", "Family"],typeLabel: "AUDIO · 1960s—1985",     season: "Oral History",  title: "My family's store on Pasita",       desc: "The corner grocery that served three generations of one neighborhood.",                                                contributor: "Placeholder Narrator",      yearRange: "1960s—1985"     },
  { id: 12, badge: "Video · 9:14",   type: "Video",      tags: ["Family"],            typeLabel: "VIDEO · 1985",           season: "Home Video",    title: "Lunar New Year, 1985",              desc: "A digitized home movie shared by a Cupertino family who arrived from Taiwan in 1979.",                                 contributor: "Donated by family",         yearRange: "1985"           },
];

const FILTERS = ["All", "Video", "Audio", "Photograph", "Document", "Family", "Business", "School"];

function PlaceholderIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m21 16-5-5L5 20" />
    </svg>
  );
}

export default function ArchiveExplorer() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ITEMS.filter((item) => {
      const matchesFilter =
        activeFilter === "All" ||
        item.type === activeFilter ||
        item.tags.includes(activeFilter);
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.contributor.toLowerCase().includes(q) ||
        item.yearRange.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  return (
    <>
      {/* Controls bar */}
      <div className="archive-controls">
        <div className="archive-filter-row">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`archive-filter-btn${activeFilter === f ? " archive-filter-active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="archive-search-wrap">
          <span className="archive-search-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            className="archive-search-input"
            type="search"
            value={query}
            placeholder="search by name, place, year\u2026"
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the archive"
          />
        </div>
      </div>

      {/* Card grid */}
      <div className="archive-grid">
        {filtered.map((item) => (
          <article key={item.id} className="archive-card">
            {/* Image placeholder */}
            <div className="card-img-area">
              <span className="card-badge">{item.badge}</span>
              <span className="card-placeholder">
                <PlaceholderIcon />
                <span className="card-type-label">{item.typeLabel}</span>
              </span>
            </div>

            {/* Card body */}
            <div className="card-body">
              <div className="card-season">{item.season}</div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.desc}</p>
              <div className="card-footer">
                <span>{item.contributor}</span>
                <span>{item.yearRange}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
