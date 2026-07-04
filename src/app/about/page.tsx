import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Cupertino Voices is a public archive of the people, places, and memories that built the city.",
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

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-page-inner">

        {/* Meta row */}
        <div className="about-page-meta">
          <span>About the Archive</span>
          <span>Community-sourced &middot; Free &amp; open</span>
        </div>

        {/* Headline */}
        <h1 className="about-h1">
          Built <span className="about-accent">together</span>. Kept{" "}
          <span className="about-accent">open</span>.
        </h1>

        {/* Body: text + stats */}
        <div className="about-body">
          <div className="about-text">
            <p>
              Cupertino Voices is a public archive of the people, places, and
              memories that built the city. It exists because so much of
              Cupertino&apos;s history is held not in books or museums, but in
              the photo albums, kitchen-table stories, and lived memory of the
              families who have called this valley home.
            </p>
            <p>
              The archive is community-sourced. Every interview, photograph, and
              document was contributed by a resident, family, or local
              institution. Everything in the collection is made freely available
              &mdash; for neighbors curious about their street, for descendants
              tracing their own family in the broader story, for students
              learning the city&apos;s past, and for researchers documenting it.
            </p>
            <p>
              We gather across generations: longtime residents who remember
              Stevens Creek as a creek, newcomers whose stories are no less
              Cupertino for being new, business owners, teachers, gardeners,
              children. The archive will never be finished, because the community
              never is.
            </p>
          </div>

          <div className="about-stats">
            <div className="stat-row">
              <div className="stat-num">~175</div>
              <div className="stat-label">Years of history</div>
            </div>
            <div className="stat-row">
              <div className="stat-num">14</div>
              <div className="stat-label">Timeline milestones</div>
            </div>
            <div className="stat-row">
              <div className="stat-num">12+</div>
              <div className="stat-label">Stories in collection</div>
            </div>
            <div className="stat-row stat-row-last">
              <div className="stat-num">&infin;</div>
              <div className="stat-label">Voices still to gather</div>
            </div>
          </div>
        </div>

        {/* Contribute panel */}
        <div className="about-contribute" id="cv-contribute">
          <div className="contribute-inner">
            <div className="contribute-copy">
              <h2 className="contribute-h2">
                Have a story <em>worth keeping?</em>
              </h2>
              <p className="contribute-body">
                If you&apos;ve lived in Cupertino &mdash; for a year or for
                sixty &mdash; we&apos;d love to hear from you. Share a
                photograph, sit for an interview, or point us toward someone
                whose story matters. Every submission is reviewed within two
                weeks.
              </p>
              <p className="contribute-contact">
                Or reach us directly:
                <br />
                <span className="contribute-email">
                  voices@cupertinoarchive.example
                </span>
              </p>
            </div>

            <form className="contribute-form" action="#">
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label" htmlFor="about-name">
                    Your Name
                  </label>
                  <input
                    id="about-name"
                    className="form-input"
                    type="text"
                    autoComplete="name"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="about-email">
                    Email
                  </label>
                  <input
                    id="about-email"
                    className="form-input"
                    type="email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="about-type">
                  What would you like to share?
                </label>
                <select id="about-type" className="form-select">
                  <option>An oral history interview</option>
                  <option>Photographs or documents</option>
                  <option>A family member&apos;s story</option>
                  <option>I want to volunteer</option>
                  <option>Something else</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="about-message">
                  Tell us a bit more
                </label>
                <textarea
                  id="about-message"
                  className="form-textarea"
                  placeholder="A short note about what you'd like to contribute — no need to share details yet."
                />
              </div>

              <button type="submit" className="form-submit">
                Send Submission{" "}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12h15" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}
