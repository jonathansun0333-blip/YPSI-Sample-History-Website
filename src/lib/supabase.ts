import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for visitor engagement (comments and reactions).
 *
 * WHY A THIRD-PARTY SERVICE: this site is a static export served by GitHub
 * Pages (`output: "export"` in next.config.ts). There is no server at runtime,
 * so anything that stores what a visitor submits has to live outside the
 * build. See docs/supabase-setup.md for the schema and the one-time setup.
 *
 * SAFETY OF THE ANON KEY: the anon key below is published in the browser
 * bundle by design. It is not a secret. What protects the data is Row Level
 * Security in Supabase — the policies in docs/supabase-setup.md let the public
 * insert a pending comment and read only approved ones, and nothing else.
 * Never put the service-role key in this file; it bypasses RLS entirely.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Whether engagement features should render at all.
 *
 * The site must build and deploy cleanly before Supabase exists, so every
 * feature that depends on it checks this first and renders nothing when the
 * environment variables are absent. A contributor cloning the repo gets a
 * working site without needing any credentials.
 */
export const isEngagementEnabled = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isEngagementEnabled
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/** Reaction kinds a visitor can leave on an interview. */
export const REACTIONS = [
  { key: "moving", emoji: "💙", label: "Moving" },
  { key: "remember", emoji: "🏡", label: "I remember this" },
  { key: "learned", emoji: "💡", label: "Learned something" },
  { key: "thanks", emoji: "🙏", label: "Thank you" },
] as const;

export type ReactionKey = (typeof REACTIONS)[number]["key"];
