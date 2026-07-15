"use client";

import React from "react";

export default function ContributeForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("about-name") as HTMLInputElement).value;
    const shareType = (form.elements.namedItem("about-type") as HTMLSelectElement).value;
    const message = (form.elements.namedItem("about-message") as HTMLTextAreaElement).value;
    const subject = encodeURIComponent(`${shareType} - ${name}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:cupertinovoices@gmail.com?subject=${subject}&body=${body}`;
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
