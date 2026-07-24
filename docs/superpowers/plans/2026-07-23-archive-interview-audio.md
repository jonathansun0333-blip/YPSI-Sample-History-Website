# Archive Interview Audio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 19 unique local interview recordings as 23 ordered native audio players across all 12 Archive story detail modals.

**Architecture:** Archive data owns root-relative track metadata, a focused player component owns accessible native controls, and a shared `withBasePath` helper prefixes public assets for GitHub Pages. Drive recordings are committed once under `public/audio/archive/`; reused stories point to the same file.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, native HTML audio, native CSS, Node test runner, PowerShell, Chromium/agent-browser, GitHub Pages.

## Global Constraints

- Add audio only inside opened Archive story details, after the short summary and before Era / Category.
- Keep Archive listing cards unchanged.
- Store exactly 19 unique nonempty `.m4a` files under `public/audio/archive/`.
- Never use a Google Drive sharing URL as an audio source.
- Use root-relative paths in data and prefix them at render time with the existing production base path.
- Use native controls, `preload="metadata"`, no autoplay, and an `audio/mp4` source.
- Render “Audio recording” for one track and “Audio recordings” plus narrator labels for collections.
- Preserve exact story-to-track order and reuse the same local path without duplicate bytes.
- Preserve existing modal behavior, scroll lock, focus trap, responsive layout, light/dark themes, and Archive content.
- Use existing tokens and modal typography; do not add an unrelated card design.
- Report the Yona Lu / Yona Lee, Zhou / Zhao Han Xu, Gerit / Garrett Kai, and William label discrepancies.

---

### Task 1: Download and validate the 19 unique recordings

**Files:**
- Create: `public/audio/archive/*.m4a` (19 exact files)
- Create: `tests/archive-audio.test.mjs`

**Interfaces:**
- Consumes: Supplied Drive IDs and Drive-reported sizes.
- Produces: 19 stable local media files for Archive data and browser verification.

- [ ] **Step 1: Add the failing asset validation test**

Create `tests/archive-audio.test.mjs` with an `EXPECTED_AUDIO_FILES` map containing:

```js
const EXPECTED_AUDIO_FILES = {
  "amy-su.m4a": 1703040,
  "ben-dong.m4a": 1156840,
  "cupertino-25-year-resident.m4a": 1114366,
  "cupertino-parent-schools.m4a": 835014,
  "dajao.m4a": 1179420,
  "david-ranslan.m4a": 991247,
  "garrett-kai.m4a": 1044779,
  "hannie-du.m4a": 724231,
  "jonathan-hwang.m4a": 1776101,
  "kai-kunurat-family.m4a": 1283735,
  "long-jiao.m4a": 1557206,
  "michael-hung.m4a": 648586,
  "michelle-kim.m4a": 909099,
  "nicole-fan.m4a": 944037,
  "peter-choo.m4a": 1286708,
  "phil-sun.m4a": 1426804,
  "tony-fei.m4a": 732406,
  "yona-lee.m4a": 1128564,
  "zhao-han-xu.m4a": 755078,
};
```

The test must list `public/audio/archive/`, require exactly these sorted names, compare exact byte lengths, require `.m4a`, and assert bytes 4–7 equal `ftyp`.

- [ ] **Step 2: Run the asset test and verify RED**

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/archive-audio.test.mjs
```

Expected: failure because `public/audio/archive/` does not exist.

- [ ] **Step 3: Download each unique Drive file once**

Create `public/audio/archive/`, then download:

```powershell
$files = @(
  @{ Name='jonathan-hwang.m4a'; Id='12kHACAxaMDMMpiKLrpt3a94Ep5SUVpbh' },
  @{ Name='long-jiao.m4a'; Id='1HyqM5fRtkDXkXDanWAD7xB6FWdlJ2JhT' },
  @{ Name='amy-su.m4a'; Id='1d-txlgDr8ZNQfj8sb975faS0bHG18FPa' },
  @{ Name='dajao.m4a'; Id='1JM7rXcPWPy-buC6p9OkVzdHX88J41WrG' },
  @{ Name='michelle-kim.m4a'; Id='1mDSDe3tU5i2uzvPWDL5d2zc0z2yWkCYh' },
  @{ Name='phil-sun.m4a'; Id='1r8Ytv4iYn5IxlCFbJs_7yk7X0qKnklPO' },
  @{ Name='garrett-kai.m4a'; Id='18-P0gtEhXQBsdBB95TyN9T_Igt8Jce0D' },
  @{ Name='david-ranslan.m4a'; Id='1kE6Y82-9NR56KW-VmsigGO5PUCmXIF6s' },
  @{ Name='hannie-du.m4a'; Id='1UUk-XHb4k_xDv-u8YT3f9BmLQjUGAkfe' },
  @{ Name='tony-fei.m4a'; Id='17pqeVzYtdjogiji_rfD6ekddZjY432SZ' },
  @{ Name='yona-lee.m4a'; Id='12EjDF64hjbW6dT1t8tQTmy4fuIyYyQTw' },
  @{ Name='peter-choo.m4a'; Id='1VF1oHgMqCghjeXwXmLXig5FYGG6AqJU9' },
  @{ Name='nicole-fan.m4a'; Id='12O3Cf2Vdv0y6PnZRhvg5yvECy4ITOoWW' },
  @{ Name='kai-kunurat-family.m4a'; Id='1gU_f1V71qXrNhOAkkJQHQFjgc1Lg6CA8' },
  @{ Name='ben-dong.m4a'; Id='1j8CZVLqqbCTQjfhMMZBxdjAi7wpHyLyg' },
  @{ Name='michael-hung.m4a'; Id='1B6MxLm5m6HLC2ygfUHRP6JSX58E1KMmx' },
  @{ Name='zhao-han-xu.m4a'; Id='16cxaLaVRfu9BQOc3EGOSwUvnq8yvPwPY' },
  @{ Name='cupertino-25-year-resident.m4a'; Id='1YM2-8YlkueQriDJQMl8dANVo8hn2R5QY' },
  @{ Name='cupertino-parent-schools.m4a'; Id='1Ew2_udE_Y-YpZWGTHiNCGMiz23eFIeD4' }
)
```

For each item, call `https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t` and write to its exact target name.

- [ ] **Step 4: Run the asset test and verify GREEN**

Run the Task 1 test again. Expected: all 19 exact size and M4A signature checks pass.

- [ ] **Step 5: Commit the validated media**

```powershell
git add -- public/audio/archive tests/archive-audio.test.mjs
git commit -m "feat: add archive interview recordings"
```

---

### Task 2: Add the exact ordered audio data mapping

**Files:**
- Modify: `tests/archive-audio.test.mjs`
- Modify: `src/data/archive-entries.ts`

**Interfaces:**
- Produces: `ArchiveAudioTrack` and `ArchiveEntry.audioTracks?: ArchiveAudioTrack[]`.
- Consumes: Task 1 root-relative filenames.

- [ ] **Step 1: Add the failing mapping contract**

Import `ARCHIVE_ENTRIES` and assert the exact label/path pairs for all 12 slugs:

```js
{
  "vallco-before-the-demolition": [
    ["Jonathan Hwang", "/audio/archive/jonathan-hwang.m4a"],
    ["Long Jiao", "/audio/archive/long-jiao.m4a"],
  ],
  "growing-up-on-cupertinos-trails": [
    ["Jonathan Hwang", "/audio/archive/jonathan-hwang.m4a"],
  ],
  "from-taiwan-to-a-second-home": [
    ["Amy Su", "/audio/archive/amy-su.m4a"],
  ],
  "apple-park-from-proposal-to-landmark": [
    ["Dajao", "/audio/archive/dajao.m4a"],
  ],
  "cherry-blossom-festival-and-belonging": [
    ["Michelle Kim", "/audio/archive/michelle-kim.m4a"],
  ],
  "closing-the-digital-and-generational-divide": [
    ["Phil Sun", "/audio/archive/phil-sun.m4a"],
  ],
  "building-for-west-valley-community-services": [
    ["Garrett Kai", "/audio/archive/garrett-kai.m4a"],
  ],
  "biking-to-the-library-with-my-son": [
    ["David Ranslan", "/audio/archive/david-ranslan.m4a"],
  ],
  "a-childhood-summer-at-the-library-fountains": [
    ["Hannie Du", "/audio/archive/hannie-du.m4a"],
  ],
  "the-library-fish-tank": [
    ["Tony Fei", "/audio/archive/tony-fei.m4a"],
    ["Jonathan Hwang", "/audio/archive/jonathan-hwang.m4a"],
    ["Yona Lee", "/audio/archive/yona-lee.m4a"],
  ],
  "the-cost-of-staying-in-cupertino": [
    ["Peter Choo", "/audio/archive/peter-choo.m4a"],
    ["Nicole Fan", "/audio/archive/nicole-fan.m4a"],
    ["David Ranslan", "/audio/archive/david-ranslan.m4a"],
    ["Kai Kunurat and family", "/audio/archive/kai-kunurat-family.m4a"],
    ["Ben Dong", "/audio/archive/ben-dong.m4a"],
  ],
  "a-city-chosen-for-its-schools": [
    ["Michael Hung", "/audio/archive/michael-hung.m4a"],
    ["Zhao Han Xu", "/audio/archive/zhao-han-xu.m4a"],
    ["Phil Sun", "/audio/archive/phil-sun.m4a"],
    ["Long-time Cupertino resident", "/audio/archive/cupertino-25-year-resident.m4a"],
    ["Cupertino parent", "/audio/archive/cupertino-parent-schools.m4a"],
  ],
}
```

Also assert 23 total placements and 19 unique paths.

- [ ] **Step 2: Run the mapping test and verify RED**

Expected: failure because entries do not have `audioTracks`.

- [ ] **Step 3: Add the types and mappings**

Add:

```ts
export type ArchiveAudioTrack = {
  label: string;
  src: string;
};
```

Add `audioTracks?: ArchiveAudioTrack[]` to `ArchiveEntry`, then add the exact arrays from Step 1 to each entry.

- [ ] **Step 4: Run Archive data tests and verify GREEN**

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/archive-audio.test.mjs tests/archive-entries.test.mjs tests/archive-filter.test.mjs
```

- [ ] **Step 5: Commit the data model**

```powershell
git add -- src/data/archive-entries.ts tests/archive-audio.test.mjs
git commit -m "feat: map recordings to archive stories"
```

---

### Task 3: Render accessible, base-path-aware players in the modal

**Files:**
- Create: `src/lib/asset-path.ts`
- Create: `src/components/archive-audio-player.tsx`
- Modify: `src/components/archive-explorer.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `tests/archive-audio.test.mjs`
- Modify: `tests/archive-ui-contract.test.mjs`
- Modify: `tests/site-brand.test.mjs`

**Interfaces:**
- Produces: `withBasePath(path: string): string`.
- Produces: `ArchiveAudioPlayer({ tracks }: { tracks: ArchiveAudioTrack[] })`.
- Consumes: `ArchiveEntry.audioTracks`.

- [ ] **Step 1: Add failing component and placement contracts**

Require:

- `withBasePath` prefixes `NEXT_PUBLIC_BASE_PATH` and normalizes a missing leading slash;
- the player renders a labelled section, singular/plural heading, collection labels, native `controls`, `preload="metadata"`, `audio/mp4`, fallback text, and no `autoPlay`;
- each source uses `withBasePath(track.src)`;
- `ArchiveExplorer` renders the player after `archive-modal-desc` and before `archive-modal-meta`;
- listing-card markup before the modal contains no `<audio>`;
- `SiteHeader` uses `withBasePath("/icon.svg")`;
- remove the old contract that forbids audio entirely.

- [ ] **Step 2: Run focused tests and verify RED**

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/archive-audio.test.mjs tests/archive-ui-contract.test.mjs tests/site-brand.test.mjs
```

- [ ] **Step 3: Implement the helper**

```ts
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string) {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
```

- [ ] **Step 4: Implement `ArchiveAudioPlayer`**

Create:

```tsx
import type { ArchiveAudioTrack } from "@/data/archive-entries";
import { withBasePath } from "@/lib/asset-path";

type ArchiveAudioPlayerProps = {
  tracks: ArchiveAudioTrack[];
};

export function ArchiveAudioPlayer({
  tracks,
}: ArchiveAudioPlayerProps) {
  if (!tracks.length) return null;

  const multipleTracks = tracks.length > 1;

  return (
    <section className="archive-audio" aria-labelledby="archive-audio-heading">
      <h3 id="archive-audio-heading">
        {multipleTracks ? "Audio recordings" : "Audio recording"}
      </h3>
      <div className="archive-audio-tracks">
        {tracks.map((track) => (
          <div className="archive-audio-track" key={track.src}>
            {multipleTracks ? (
              <p className="archive-audio-label">{track.label}</p>
            ) : null}
            <audio
              controls
              preload="metadata"
              aria-label={`Audio interview with ${track.label}`}
            >
              <source src={withBasePath(track.src)} type="audio/mp4" />
              Your browser does not support embedded audio.
            </audio>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Insert the player in the modal**

Import the component and render it immediately after the summary paragraph:

```tsx
{openItem.audioTracks?.length ? (
  <ArchiveAudioPlayer tracks={openItem.audioTracks} />
) : null}
```

- [ ] **Step 6: Reuse the asset helper for the header icon**

Replace the local base-path constant in `site-header.tsx` with `withBasePath("/icon.svg")`.

- [ ] **Step 7: Run focused tests and verify GREEN**

Run the Task 3 focused command. Expected: all pass.

- [ ] **Step 8: Commit component behavior**

```powershell
git add -- src/lib/asset-path.ts src/components/archive-audio-player.tsx src/components/archive-explorer.tsx src/components/site-header.tsx tests/archive-audio.test.mjs tests/archive-ui-contract.test.mjs tests/site-brand.test.mjs
git commit -m "feat: embed archive interview players"
```

---

### Task 4: Style the audio section within the existing modal

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tests/archive-audio.test.mjs`

**Interfaces:**
- Consumes: `.archive-audio`, `.archive-audio-tracks`, `.archive-audio-track`, and `.archive-audio-label`.
- Preserves: Existing modal tokens and responsive rules.

- [ ] **Step 1: Add the failing style contract**

Require:

- two-rem section spacing;
- heading typography/color shared with `.archive-modal-story h3`;
- grid track layout with 1.25-rem gap;
- collection track dividers using `var(--line)`;
- smaller Archivo narrator labels;
- audio width and max-width at 100%;
- no audio card background or box shadow.

- [ ] **Step 2: Run the style test and verify RED**

- [ ] **Step 3: Add minimal token-based CSS**

Add:

```css
.archive-audio {
  margin: 2rem 0;
}

.archive-audio h3,
.archive-modal-story h3 {
  margin: 0 0 0.75rem;
  font-family: 'Archivo', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--archive-text-accent);
}

.archive-audio-tracks {
  display: grid;
  gap: 1.25rem;
}

.archive-audio-track + .archive-audio-track {
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
}

.archive-audio-label {
  margin: 0 0 0.5rem;
  color: var(--ink-soft);
  font-family: 'Archivo', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
}

.archive-audio audio {
  display: block;
  width: 100%;
  max-width: 100%;
}
```

Replace the existing standalone `.archive-modal-story h3` declarations with the combined heading rule to avoid duplication.

- [ ] **Step 4: Run focused tests and verify GREEN**

- [ ] **Step 5: Commit styling**

```powershell
git add -- src/app/globals.css tests/archive-audio.test.mjs
git commit -m "style: integrate archive audio players"
```

---

### Task 5: Verify all media, stories, layouts, and production paths

**Files:**
- Verify: all Task 1–4 files
- Verify generated: `out/archive/index.html`

**Interfaces:**
- Consumes: complete audio implementation.
- Produces: evidence for every acceptance criterion.

- [ ] **Step 1: Run formatter or confirm none is configured**

Use the configured formatter if present. If no formatter script or config exists, record that fact and run `git diff --check`.

- [ ] **Step 2: Run full automated gates**

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/*.test.mjs
& 'C:\Program Files\nodejs\npx.cmd' tsc --noEmit
& 'C:\Program Files\nodejs\npm.cmd' run lint
& 'C:\Program Files\nodejs\npm.cmd' run build
git diff --check
```

Separate known pre-existing lint findings from task regressions.

- [ ] **Step 3: Verify the production export**

Require all 19 files under `out/audio/archive/`, exact byte sizes, and repository-scoped audio URLs such as `/YPSI-Sample-History-Website/audio/archive/jonathan-hwang.m4a` in generated output.

- [ ] **Step 4: Verify browser metadata and playback for every unique file**

Use Chromium to load each source and record finite duration, successful muted play with advancing `currentTime`, pause, seek, and volume mutation.

- [ ] **Step 5: Verify every story detail**

Open all 12 stories and confirm exact player counts `2,1,1,1,1,1,1,1,1,3,5,5`, exact source order, correct headings/labels, summary-before-audio-before-classification order, no card players, and reused path equality.

- [ ] **Step 6: Verify responsive and theme behavior**

At desktop and 390-pixel mobile widths in light/dark modes, confirm no overflow, usable modal scrolling, visible native controls, focus behavior, Escape/outside close, and no browser errors.

- [ ] **Step 7: Push and deploy**

Push `main`, wait for the GitHub Pages build and deploy jobs to succeed, then repeat the production source, metadata, playback, and story-count checks on the public Pages URL.

- [ ] **Step 8: Final audit and report**

Report files created, components/data modified, 19/19 download status, 12-story/23-player verification, production build/deployment, playback behaviors, and all four naming discrepancies.
