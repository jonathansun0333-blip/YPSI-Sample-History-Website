import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "From Ohlone homeland to Silicon Valley — Cupertino's transformation across two centuries, told in five chapters.",
};

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

export default function StoryPage() {
  return (
    <main className="story-page">
      <div className="story-page-inner">

        {/* ── Page meta row ── */}
        <div className="story-page-meta">
          <span>A Narrative History</span>
          <span>Read time · ~8 min</span>
        </div>

        {/* ── Headline ── */}
        <h1 className="story-page-h1">
          The story of <span className="story-accent">Cupertino</span>.
        </h1>

        {/* ── Lead ── */}
        <p className="story-page-lead">
          From Ohlone homeland to apricot capital to the world&apos;s address
          for Silicon Valley — Cupertino&apos;s transformation across two
          centuries, told in five chapters.
        </p>

        {/* ── Chapter I ── */}
        <div className="chapter-block chapter-block-first">
          <div className="chapter-label">
            Chapter I
            <span className="chapter-era">Before</span>
          </div>
          <div className="chapter-body">
            <h3 className="chapter-title">
              The valley before <em>the maps</em>.
            </h3>
            <p className="chapter-text">
              For thousands of years before any place here had a written name,
              this land was home to the <strong>Tamien Ohlone</strong>, who
              lived along the creek that would one day be called Stevens. They
              fished its waters, tended the oak groves, and traveled the trails
              that European maps would later straighten into roads.
            </p>
            <p className="chapter-text">
              When the Spanish arrived in 1776 with the De Anza expedition, they
              crossed a valley they described as wooded, watered, and improbably
              green. The mission system that followed disrupted Ohlone life
              profoundly. The land that is now Cupertino was carved into ranchos
              — Rancho Quito and Rancho San Antonio — long before it would be
              carved into city blocks.
            </p>
          </div>
        </div>

        {/* ── Chapter II ── */}
        <div className="chapter-block">
          <div className="chapter-label">
            Chapter II
            <span className="chapter-era">1850s — 1900</span>
          </div>
          <div className="chapter-body">
            <h3 className="chapter-title">
              A creek, a crossroads, a name.
            </h3>
            <p className="chapter-text">
              The valley filled in with settlers after California statehood. A
              French immigrant named <strong>Elisha Stephens</strong> — yes,
              that Stevens — gave his name to the creek (with a spelling change
              along the way). At a small crossroads where Stevens Creek Road met
              Saich Way, a wine merchant named John T. Doyle named his estate
              &ldquo;Cupertino&rdquo; after a Spanish friar who had blessed the
              original De Anza expedition.
            </p>
            <p className="chapter-text">
              The name spread. A blacksmith shop, a hotel, a post office. By the
              1890s, &ldquo;Cupertino&rdquo; referred to a community of farmers
              — French, Italian, Portuguese — growing grapes, prunes, and the
              apricots that would define the place for the next half-century.
            </p>
          </div>
        </div>

        {/* ── Chapter III ── */}
        <div className="chapter-block">
          <div className="chapter-label">
            Chapter III
            <span className="chapter-era">1900 — 1955</span>
          </div>
          <div className="chapter-body">
            <h3 className="chapter-title">
              The orchard <em>years</em>.
            </h3>
            <p className="chapter-text">
              By the early 1900s, the Santa Clara Valley was already known as
              the &ldquo;Valley of Heart&apos;s Delight&rdquo; — and Cupertino
              was at its center. <strong>Apricot orchards</strong> stretched
              horizon to horizon. Families like the Maisches, the Stocklmeirs,
              and the Saichs ran the farms; seasonal workers, many from the
              Philippines, Japan, and Mexico, came for the harvest.
            </p>
            <p className="chapter-text">
              The Blackberry Farm Resort opened in 1924. The Cali Brothers feed
              mill rose near the railroad tracks. The community had schools,
              churches, a Grange hall — but no city government. Cupertino was
              still, on paper, just a corner of unincorporated Santa Clara
              County.
            </p>
            <p className="chapter-text">
              That changed when neighboring San Jose, hungry for tax base, began
              annexing land at an aggressive clip in the early 1950s. To stay
              independent, Cupertino&apos;s farmers and shopkeepers gathered,
              organized, and voted.
            </p>
          </div>
        </div>

        {/* ── Chapter IV ── */}
        <div className="chapter-block">
          <div className="chapter-label">
            Chapter IV
            <span className="chapter-era">1955 — 1990</span>
          </div>
          <div className="chapter-body">
            <h3 className="chapter-title">
              From orchard to <em>chip fab</em>.
            </h3>
            <p className="chapter-text">
              Cupertino was incorporated as a city on{" "}
              <strong>October 10, 1955</strong>, with a population of about
              2,500. The next thirty-five years were the most transformative in
              its history.
            </p>
            <p className="chapter-text">
              De Anza College opened on the old Beaulieu ranch in 1967. Vallco
              Park, the city&apos;s first major commercial development, broke
              ground. The orchards came down one by one — replaced by housing
              tracts for the engineers flooding into the South Bay to work at
              Hewlett-Packard, Fairchild, and a new company called Intel just up
              the road.
            </p>
            <p className="chapter-text">
              In 1976, a quiet computer company called Apple Computer was founded
              in nearby Los Altos. It moved to Cupertino in 1977. By the late
              1980s, Apple&apos;s &ldquo;Infinite Loop&rdquo; campus was the
              city&apos;s largest employer. The orchard era was over; Cupertino
              had become a Silicon Valley city.
            </p>
          </div>
        </div>

        {/* ── Chapter V ── */}
        <div className="chapter-block">
          <div className="chapter-label">
            Chapter V
            <span className="chapter-era">1990 — Now</span>
          </div>
          <div className="chapter-body">
            <h3 className="chapter-title">
              The city of the world we know.
            </h3>
            <p className="chapter-text">
              The Cupertino of the past three decades is a city of{" "}
              <strong>extraordinary global reach</strong> — and extraordinary
              local change. The arrival of immigrants from across Asia,
              particularly from Taiwan, India, and mainland China, has rebuilt
              the city&apos;s cultural life. Its public schools became some of
              the most competitive in the country. Apple Park, the spaceship
              campus, opened in 2017 down the road from where the apricots once
              grew.
            </p>
            <p className="chapter-text">
              Today, Cupertino is famous around the world for a company that
              doesn&apos;t print its city&apos;s name on most of its products.
              Most Cupertino residents have never lived in an orchard. But the
              families who remember the old days still walk these streets — and
              their stories, gathered here, are how we keep the city&apos;s full
              history alive.
            </p>
            <p className="chapter-text">
              This is what{" "}
              <em className="chapter-brand">Cupertino Voices</em> exists to do:
              not to preserve a nostalgia, but to keep the chain unbroken
              between everyone who has called this place home.
            </p>
          </div>
        </div>

        {/* ── CTAs ── */}
        <div className="story-cta">
          <Link href="/timeline" className="button button-primary">
            See the timeline <ArrowRight />
          </Link>
          <Link href="/archive" className="button button-secondary">
            Browse the archive <ArrowRight />
          </Link>
        </div>

      </div>
    </main>
  );
}
