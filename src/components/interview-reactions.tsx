"use client";

import { useCallback, useEffect, useState } from "react";

import {
  isEngagementEnabled,
  REACTIONS,
  supabase,
  type ReactionKey,
} from "@/lib/supabase";

/**
 * Reaction buttons for a single interview.
 *
 * Unlike comments, reactions publish immediately — there is nothing to
 * moderate in a counter. Abuse is limited by recording one reaction per
 * visitor per interview in localStorage, which is a courtesy rail rather than
 * real enforcement: anyone can clear storage. That tradeoff is deliberate.
 * Real enforcement needs either accounts (a login wall this audience should
 * not have to pass) or IP logging (personal data an oral history project has
 * no business collecting to count emoji).
 */

type InterviewReactionsProps = {
  slug: string;
};

type Counts = Partial<Record<ReactionKey, number>>;

function storageKey(slug: string) {
  return `cupertino-voices:reacted:${slug}`;
}

export default function InterviewReactions({ slug }: InterviewReactionsProps) {
  const [counts, setCounts] = useState<Counts>({});
  const [myReaction, setMyReaction] = useState<ReactionKey | null>(null);

  const loadCounts = useCallback(async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("reaction_counts")
      .select("reaction, count")
      .eq("interview_slug", slug);

    if (error) {
      console.error("Failed to load reactions:", error.message);
      return;
    }

    const next: Counts = {};
    for (const row of data ?? []) {
      next[row.reaction as ReactionKey] = Number(row.count);
    }
    setCounts(next);
  }, [slug]);

  useEffect(() => {
    // Restoring the visitor's previous reaction happens here rather than in its
    // own effect so the update lands after an await. Reading localStorage during
    // render would also risk a hydration mismatch: the static HTML is built
    // without any visitor's storage.
    async function restoreAndLoad() {
      await loadCounts();

      try {
        const stored = window.localStorage.getItem(storageKey(slug));
        if (stored) setMyReaction(stored as ReactionKey);
      } catch {
        // Private browsing or blocked storage: the visitor simply is not
        // remembered between visits.
      }
    }

    restoreAndLoad();
  }, [loadCounts, slug]);

  if (!isEngagementEnabled) return null;

  async function react(reaction: ReactionKey) {
    if (myReaction) return;

    // Optimistic: the visitor sees their reaction land immediately, and a
    // failed write is corrected by the refetch below.
    setCounts((previous) => ({
      ...previous,
      [reaction]: (previous[reaction] ?? 0) + 1,
    }));
    setMyReaction(reaction);

    try {
      window.localStorage.setItem(storageKey(slug), reaction);
    } catch {
      // Not being able to remember the choice is not worth failing the write.
    }

    const { error } = await supabase!
      .from("reactions")
      .insert({ interview_slug: slug, reaction });

    if (error) console.error("Failed to save reaction:", error.message);
    loadCounts();
  }

  return (
    <section className="interview-reactions" aria-labelledby="reactions-heading">
      <h2 id="reactions-heading" className="reactions-heading">
        Did this story reach you?
      </h2>

      <div className="reactions-row">
        {REACTIONS.map(({ key, emoji, label }) => {
          const isMine = myReaction === key;
          return (
            <button
              key={key}
              type="button"
              className={`reaction-button${isMine ? " reaction-button-active" : ""}`}
              onClick={() => react(key)}
              disabled={Boolean(myReaction)}
              aria-pressed={isMine}
              aria-label={`${label}${counts[key] ? ` (${counts[key]})` : ""}`}
            >
              <span aria-hidden="true">{emoji}</span>
              <span className="reaction-label">{label}</span>
              {counts[key] ? (
                <span className="reaction-count">{counts[key]}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {myReaction ? (
        <p className="reactions-thanks" role="status">
          Thanks for letting us know.
        </p>
      ) : null}
    </section>
  );
}
