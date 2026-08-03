"use client";

import React, { useEffect, useState } from "react";

const DEFAULT_SUBMISSION_TYPE = "An oral history interview";

const SUBMISSION_TYPE_BY_HASH: Readonly<Record<string, string>> = {
  "#cv-contribute-volunteer": "I want to volunteer",
  "#cv-contribute-contact": "Something else",
};

export function getSubmissionTypeForHash(hash: string) {
  return SUBMISSION_TYPE_BY_HASH[hash] ?? DEFAULT_SUBMISSION_TYPE;
}

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScunIVUmNf42QvpOZsToB8EgtYPHdTKMbDsZwJKJ8bmPbx1Kw/viewform";

const ENTRY = {
  name:           "entry.341071235",
  email:          "entry.1459037932",
  submissionType: "entry.137826919",
  message:        "entry.1090017431",
} as const;

export default function ContributeForm() {
  const [submissionType, setSubmissionType] = useState(
    DEFAULT_SUBMISSION_TYPE,
  );

  useEffect(() => {
    function syncSubmissionType() {
      setSubmissionType(getSubmissionTypeForHash(window.location.hash));
    }

    const frameId = window.requestAnimationFrame(syncSubmissionType);
    window.addEventListener("hashchange", syncSubmissionType);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("hashchange", syncSubmissionType);
    };
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (GOOGLE_FORM_URL.includes("REPLACE_WITH")) {
      console.error(
        "[ContributeForm] Google Form URL is not configured. Update GOOGLE_FORM_URL before deploying."
      );
      return;
    }

    const data = new FormData(e.currentTarget);
    const name           = (data.get("name")           as string ?? "").trim();
    const email          = (data.get("email")          as string ?? "").trim();
    const submissionType = (data.get("submissionType") as string ?? "").trim();
    const message        = (data.get("message")        as string ?? "").trim();

    const destination = new URL(GOOGLE_FORM_URL);
    destination.searchParams.set("usp", "pp_url");
    destination.searchParams.set(ENTRY.name,           name);
    destination.searchParams.set(ENTRY.email,          email);
    destination.searchParams.set(ENTRY.submissionType, submissionType);
    destination.searchParams.set(ENTRY.message,        message);

    window.open(destination.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="contribute-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="about-name">
            Your Name
          </label>
          <input
            id="about-name"
            name="name"
            className="form-input"
            type="text"
            autoComplete="name"
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="about-email">
            Email
          </label>
          <input
            id="about-email"
            name="email"
            className="form-input"
            type="email"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="about-type">
          What would you like to share?
        </label>
        <select
          id="about-type"
          name="submissionType"
          className="form-select"
          value={submissionType}
          onChange={(event) => setSubmissionType(event.target.value)}
          required
        >
          <option value="An oral history interview">An oral history interview</option>
          <option value="Photographs or Documents">Photographs or Documents</option>
          <option value="A story">A story</option>
          <option value="I want to volunteer">I want to volunteer</option>
          <option value="Something else">Something else</option>
        </select>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="about-message">
          Tell us a bit more
        </label>
        <textarea
          id="about-message"
          name="message"
          className="form-textarea"
          placeholder="A short note about what you'd like to contribute — no need to share details yet."
        />
      </div>

      <button type="submit" className="form-submit">
        Send Submission{" "}
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
      </button>
    </form>
  );
}
