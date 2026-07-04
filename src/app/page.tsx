import Link from "next/link";

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="home-page">

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="hero-meta">
          <span>A Community History of Cupertino, California</span>
          <span>July 2, 2026</span>
        </div>

        <h1>
          The voices we kept,{" "}
          <span className="hero-accent">and the ones we almost lost.</span>
        </h1>

        <div className="hero-body">
          <p className="hero-copy">
            Before the office parks and the freeways, this valley was apricot orchards,
            ranch land, and family farms. <strong>Cupertino Voices</strong> gathers the
            people, places, and memories that built the city — through oral histories,
            photographs, and short documentaries told by the families who lived them.
          </p>

          <aside className="hero-summary">
            <div>
              <span className="hero-summary-label">Span</span>
              <span className="hero-summary-value">1850 — Present</span>
            </div>
            <div>
              <span className="hero-summary-label">Format</span>
              <span className="hero-summary-value">Video, audio, photo, document</span>
            </div>
            <div>
              <span className="hero-summary-label">Status</span>
              <span className="hero-summary-value">In active collection</span>
            </div>
            <div>
              <span className="hero-summary-label">Access</span>
              <span className="hero-summary-value">Free for the public, always</span>
            </div>
          </aside>
        </div>

        <div className="hero-actions">
          <Link href="/story" className="button button-primary">
            Read our story <ArrowRight />
          </Link>
          <Link href="/map" className="button button-secondary">
            Explore the map <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ── On This Day ── */}
      <section className="on-this-day">
        <div className="otd-inner">
          <div className="otd-date-block">
            On This Day
            <span className="otd-date">July 2</span>
          </div>
          <div className="otd-story">
            <span className="otd-year">1898 — in Cupertino&apos;s history</span>
            <span className="otd-text">
              A French wine-merchant&apos;s estate at the crossroads of Stevens Creek
              Road gave its name — Cupertino — to the surrounding community of orchard
              farmers.
            </span>
          </div>
          <Link href="/timeline" className="button button-ghost">
            Next <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ── Four Ways In ── */}
      <section className="ways-in">
        <div className="section-header-row">
          <span className="section-label">Four Ways In</span>
          <h2>Find Cupertino&apos;s history <em>your way</em>.</h2>
        </div>
        <div className="ways-list">
          <Link href="/story" className="ways-row">
            <span className="ways-tag">Long read</span>
            <span className="ways-title">The <em>story</em> of Cupertino, told decade by decade</span>
            <span className="ways-desc">A narrative history</span>
            <span className="ways-action">Read <ArrowRight /></span>
          </Link>
          <Link href="/timeline" className="ways-row">
            <span className="ways-tag">1776 — Now</span>
            <span className="ways-title">An interactive <em>timeline</em> of major events</span>
            <span className="ways-desc">Scroll the years</span>
            <span className="ways-action">Explore <ArrowRight /></span>
          </Link>
          <Link href="/map" className="ways-row">
            <span className="ways-tag">6 places</span>
            <span className="ways-title">A <em>map</em> with before-and-after photographs</span>
            <span className="ways-desc">Then &amp; now</span>
            <span className="ways-action">View <ArrowRight /></span>
          </Link>
          <Link href="/archive" className="ways-row">
            <span className="ways-tag">Growing</span>
            <span className="ways-title">The full <em>archive</em> of oral histories &amp; photographs</span>
            <span className="ways-desc">Searchable, filterable</span>
            <span className="ways-action">Browse <ArrowRight /></span>
          </Link>
        </div>
      </section>

      {/* ── Featured Stories ── */}
      <section className="featured-stories">
        <div className="section-header-row">
          <span className="section-label">Featured Stories</span>
          <h2>From the <em>collection</em>.</h2>
        </div>
        <div className="story-list">
          <article className="story-row">
            <span className="story-year">1962—Now</span>
            <span className="story-title">Six decades on Stelling Road</span>
            <span className="story-author">— Placeholder Family</span>
            <span className="story-type-badge story-type-active">Video <ArrowRight /></span>
          </article>
          <article className="story-row">
            <span className="story-year">1967—1995</span>
            <span className="story-title">The De Anza years</span>
            <span className="story-author">— Placeholder Narrator</span>
            <span className="story-type-badge story-type-active">Audio <ArrowRight /></span>
          </article>
          <article className="story-row">
            <span className="story-year">1972—1989</span>
            <span className="story-title">Saturdays at the farm</span>
            <span className="story-author">— Placeholder Contributor</span>
            <span className="story-type-badge story-type-active">Video <ArrowRight /></span>
          </article>
          <article className="story-row">
            <span className="story-year">1940s—2020s</span>
            <span className="story-title">Main Street, year by year</span>
            <span className="story-author">— Composite Archive</span>
            <span className="story-type-badge">Photo Series <ArrowRight /></span>
          </article>
          <article className="story-row">
            <span className="story-year">1934—1948</span>
            <span className="story-title">Letters from the orchard</span>
            <span className="story-author">— Estate of placeholder</span>
            <span className="story-type-badge">Letters <ArrowRight /></span>
          </article>
        </div>
        <div className="stories-cta">
          <Link href="/archive" className="button button-secondary">
            View all stories <ArrowRight />
          </Link>
        </div>
      </section>

    </main>
  );
}
