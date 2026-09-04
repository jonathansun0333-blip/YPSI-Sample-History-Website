-- Cupertino Voices — comments and reactions schema.
-- Paste this whole file into the Supabase SQL Editor and run it once.
-- Safe to re-run: every statement guards against already existing.
-- Full explanation in docs/supabase-setup.md.

-- ── Tables ────────────────────────────────────────────────────────────────

-- Visitor comments. Nothing is public until a moderator approves it.
create table if not exists public.comments (
  id             uuid primary key default gen_random_uuid(),
  interview_slug text        not null,
  author_name    text        not null check (char_length(author_name) between 1 and 80),
  body           text        not null check (char_length(body) between 1 and 2000),
  approved       boolean     not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists comments_slug_approved_idx
  on public.comments (interview_slug, approved);

-- One row per reaction; the site reads only the aggregated view below.
create table if not exists public.reactions (
  id             uuid primary key default gen_random_uuid(),
  interview_slug text        not null,
  reaction       text        not null check (reaction in ('moving','remember','learned','thanks')),
  created_at     timestamptz not null default now()
);

create index if not exists reactions_slug_idx
  on public.reactions (interview_slug);

create or replace view public.reaction_counts as
  select interview_slug, reaction, count(*)::int as count
  from public.reactions
  group by interview_slug, reaction;

-- ── Row Level Security ────────────────────────────────────────────────────
-- This is what makes a public API key safe. Without it, the anon key shipped
-- in the browser bundle could read and write everything.

alter table public.comments  enable row level security;
alter table public.reactions enable row level security;

drop policy if exists "approved comments are public" on public.comments;
create policy "approved comments are public"
  on public.comments for select
  using (approved = true);

-- Visitors may submit, but only as unapproved. The check stops a crafted
-- request from self-approving.
drop policy if exists "anyone may submit a pending comment" on public.comments;
create policy "anyone may submit a pending comment"
  on public.comments for insert
  with check (approved = false);

-- No update or delete policy is defined on purpose: visitors cannot edit or
-- remove comments, including their own. Moderators work in the dashboard.

drop policy if exists "reaction counts are public" on public.reactions;
create policy "reaction counts are public"
  on public.reactions for select using (true);

drop policy if exists "anyone may react" on public.reactions;
create policy "anyone may react"
  on public.reactions for insert with check (true);
