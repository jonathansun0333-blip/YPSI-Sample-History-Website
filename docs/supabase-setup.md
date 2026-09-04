# Comments and reactions: Supabase setup

The site is a static export on GitHub Pages, so it has no server and no
database of its own. Visitor comments and reactions are stored in Supabase.

**Until the two environment variables below are set, the comment and reaction
sections render nothing at all.** The site builds and deploys normally without
them, so this setup can wait and nothing looks broken in the meantime.

## 1. Create the project

1. Sign up at <https://supabase.com> and create a project. The free tier is
   ample for this site: it covers 500 MB of database and 50,000 monthly active
   users, against an archive of a dozen interviews.
2. From **Project Settings → API**, copy the **Project URL** and the **anon
   public** key.

> **Never copy the `service_role` key into this project.** It bypasses all the
> security policies below. The `anon` key is designed to be public and shipped
> in the browser bundle; the `service_role` key is not.

## 2. Create the tables

Open **SQL Editor** in the Supabase dashboard and run this once:

```sql
-- Visitor comments. Nothing is public until a moderator approves it.
create table public.comments (
  id             uuid primary key default gen_random_uuid(),
  interview_slug text        not null,
  author_name    text        not null check (char_length(author_name) between 1 and 80),
  body           text        not null check (char_length(body) between 1 and 2000),
  approved       boolean     not null default false,
  created_at     timestamptz not null default now()
);

create index comments_slug_approved_idx
  on public.comments (interview_slug, approved);

-- One row per reaction. Aggregated for display by the view below.
create table public.reactions (
  id             uuid primary key default gen_random_uuid(),
  interview_slug text        not null,
  reaction       text        not null check (reaction in ('moving','remember','learned','thanks')),
  created_at     timestamptz not null default now()
);

create index reactions_slug_idx on public.reactions (interview_slug);

-- The site reads counts, never individual reaction rows.
create view public.reaction_counts as
  select interview_slug, reaction, count(*)::int as count
  from public.reactions
  group by interview_slug, reaction;
```

## 3. Lock it down with Row Level Security

This is the part that makes a public API key safe. Run it in the same editor:

```sql
alter table public.comments  enable row level security;
alter table public.reactions enable row level security;

-- Anyone may READ a comment, but only if it has been approved. An unapproved
-- comment is never sent to a browser, so moderation is enforced by the
-- database rather than by the UI.
create policy "approved comments are public"
  on public.comments for select
  using (approved = true);

-- Anyone may SUBMIT a comment, but only as unapproved. The `approved = false`
-- check stops a crafted request from self-approving.
create policy "anyone may submit a pending comment"
  on public.comments for insert
  with check (approved = false);

-- No public update or delete policy exists, so visitors cannot edit or remove
-- comments — including their own. Moderators work in the dashboard.

create policy "reaction counts are public"
  on public.reactions for select using (true);

create policy "anyone may react"
  on public.reactions for insert with check (true);
```

Confirm the **Authentication → Policies** page shows RLS enabled on both
tables. If it is off, the anon key can read and write everything.

## 4. Point the site at the project

Locally, create `.env.local` in the repo root (already git-ignored):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For the deployed site, add both as **repository secrets** under
*Settings → Secrets and variables → Actions*, then expose them to the build
step in `.github/workflows/deploy.yml`:

```yaml
      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

`NEXT_PUBLIC_*` values are inlined into the browser bundle at build time. That
is correct for the anon key and the reason the RLS policies above are doing the
real work.

## 5. Moderating

Open **Table Editor → comments**, read the pending rows, and flip `approved` to
`true` on the ones to publish. Approved comments appear on the next page load —
no rebuild or deploy needed.

To decline a comment, leave it unapproved or delete the row.

Consider turning on email notifications (**Database → Webhooks**, or a Supabase
scheduled function) so pending comments do not sit unseen.

## Spam protection

Three layers, none of which asks a visitor to log in or solve a puzzle:

1. **Moderation.** Nothing is public until a person approves it, so spam that
   gets through is never seen by visitors.
2. **A honeypot field.** Hidden off-screen and from assistive technology; a
   person never fills it, so a submission that sets it is silently discarded.
3. **A minimum time on form.** A submission arriving within four seconds of the
   page rendering is discarded, which stops scripted posts.

Both automated checks report success to the sender. Telling a bot why it failed
only helps whoever wrote it.

If spam ever becomes a real burden, add Cloudflare Turnstile — it is free and
invisible to most visitors — before considering anything that puts a login or a
captcha between a resident and their own memories.

## Why not a comment service?

- **Giscus / Utterances** require every commenter to have a GitHub account.
  Much of this audience is older residents sharing memories.
- **Disqus** carries advertising and third-party tracking, which is
  inappropriate on a page holding a named person's oral history.
- **Netlify / Formspree** handle submission but provide no way to display an
  approved thread back on the page without a rebuild per comment.
