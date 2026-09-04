"use client";

import { useEffect, useRef, useState } from "react";

import { isEngagementEnabled, supabase } from "@/lib/supabase";

/**
 * Comments on a single interview.
 *
 * Moderation model: a submission is inserted with `approved = false` and is
 * invisible to everyone until a moderator approves it in the Supabase
 * dashboard. Row Level Security enforces this — the public read policy only
 * returns approved rows — so an unapproved comment is not merely hidden in the
 * UI, it is never sent to the browser. See docs/supabase-setup.md.
 *
 * This matters more than usual here: the archive publishes named people's
 * personal memories, and an unmoderated comment box under someone's oral
 * history is a liability to that person, not just to the project.
 */

type Comment = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

type InterviewCommentsProps = {
  /** Slug of the interview being discussed; scopes the thread. */
  slug: string;
};

const MAX_BODY_LENGTH = 2000;
const MAX_NAME_LENGTH = 80;

/**
 * Minimum seconds between the form rendering and a submission being accepted.
 * A human reading an interview and writing a response takes longer than this;
 * a bot that fills and posts instantly does not.
 */
const MIN_SECONDS_BEFORE_SUBMIT = 4;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function InterviewComments({ slug }: InterviewCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  /** Honeypot: hidden from people, irresistible to naive bots. */
  const [website, setWebsite] = useState("");
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadComments() {
      const { data, error } = await supabase!
        .from("comments")
        .select("id, author_name, body, created_at")
        .eq("interview_slug", slug)
        .order("created_at", { ascending: true });

      if (cancelled) return;

      // RLS already filters to approved rows; an error here means the table or
      // policies are missing, which is a setup problem, not a visitor problem.
      if (error) console.error("Failed to load comments:", error.message);
      setComments(data ?? []);
      setIsLoading(false);
    }

    loadComments();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Rendering nothing is deliberate: before Supabase is configured the site
  // should look finished, not broken.
  if (!isEngagementEnabled) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();
    const trimmedBody = body.trim();

    if (!trimmedName || !trimmedBody) {
      setErrorMessage("Please add your name and a message.");
      return;
    }
    if (trimmedBody.length > MAX_BODY_LENGTH) {
      setErrorMessage(`Please keep your message under ${MAX_BODY_LENGTH} characters.`);
      return;
    }

    const secondsOnForm = (Date.now() - mountedAt.current) / 1000;
    // Both spam checks report success rather than an error: telling a bot why
    // it failed just teaches whoever wrote it how to get past the check.
    if (website || secondsOnForm < MIN_SECONDS_BEFORE_SUBMIT) {
      setStatus("sent");
      return;
    }

    setStatus("sending");

    const { error } = await supabase!.from("comments").insert({
      interview_slug: slug,
      author_name: trimmedName.slice(0, MAX_NAME_LENGTH),
      body: trimmedBody.slice(0, MAX_BODY_LENGTH),
      approved: false,
    });

    if (error) {
      console.error("Failed to submit comment:", error.message);
      setErrorMessage("Something went wrong. Please try again in a moment.");
      setStatus("error");
      return;
    }

    setStatus("sent");
    setName("");
    setBody("");
  }

  return (
    <section className="interview-comments" aria-labelledby="comments-heading">
      <h2 id="comments-heading">Responses</h2>

      {isLoading ? (
        <p className="comments-empty">Loading responses…</p>
      ) : comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment">
              <p className="comment-meta">
                <strong>{comment.author_name}</strong>
                <span> · {formatDate(comment.created_at)}</span>
              </p>
              <p className="comment-body">{comment.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="comments-empty">
          No responses yet. If this story reminds you of something, add it below.
        </p>
      )}

      {status === "sent" ? (
        <p className="comment-success" role="status">
          Thank you — your response has been sent for review and will appear here
          once a moderator approves it.
        </p>
      ) : (
        <form className="comment-form" onSubmit={handleSubmit}>
          <label htmlFor="comment-name">Your name</label>
          <input
            id="comment-name"
            type="text"
            value={name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="comment-body">Your response</label>
          <textarea
            id="comment-body"
            value={body}
            rows={5}
            maxLength={MAX_BODY_LENGTH}
            onChange={(event) => setBody(event.target.value)}
            placeholder="A memory this brought back, or something you can add…"
            required
          />

          {/* Honeypot. Hidden visually and from assistive tech; never filled by
              a person, so anything arriving with it set is discarded. */}
          <div className="comment-honeypot" aria-hidden="true">
            <label htmlFor="comment-website">Leave this field empty</label>
            <input
              id="comment-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>

          {errorMessage ? (
            <p className="comment-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="button button-primary"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send response"}
          </button>

          <p className="comment-note">
            Responses are reviewed by a moderator before they appear.
          </p>
        </form>
      )}
    </section>
  );
}
