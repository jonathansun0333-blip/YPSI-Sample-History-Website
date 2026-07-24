# Archive Interview Audio Design

## Goal

Add the corresponding interview recordings to every existing Archive story detail modal. Store each unique recording once in the repository, preserve the current Archive cards and modal design, and make all production media URLs work under the GitHub Pages project path.

## Source and Scope

The supplied mapping defines 19 unique Google Drive M4A recordings reused across 23 player placements in 12 stories. Drive metadata confirms that all 19 targets are accessible, nonempty `audio/x-m4a` files and that their filenames match the supplied mapping.

The Archive listing cards remain unchanged. Audio appears only in the opened story detail, immediately after the introductory summary and before the Era / Category row.

## Selected Approach

Use locally stored recordings and the browser's native audio controls.

- Store files under `public/audio/archive/` using the exact normalized filenames in the supplied mapping.
- Add `ArchiveAudioTrack` and optional `audioTracks` data to each existing `ArchiveEntry`.
- Keep root-relative values such as `/audio/archive/jonathan-hwang.m4a` in data.
- Add a small `withBasePath` helper that prefixes `NEXT_PUBLIC_BASE_PATH` when a public asset is rendered.
- Reuse that helper for the header icon so public assets share one GitHub Pages path rule.
- Render an `ArchiveAudioPlayer` inside the modal only.
- Use native `<audio controls preload="metadata">` elements with an `audio/mp4` source and an accessible interview label.
- Do not autoplay.

A custom player was rejected because it would add playback state, keyboard, seeking, volume, and accessibility complexity without improving the requested outcome. Direct Drive URLs were rejected because they violate the local-file requirement and are not stable media sources.

## Data Mapping

The story-to-track order is authoritative:

1. `vallco-before-the-demolition`: Jonathan Hwang; Long Jiao
2. `growing-up-on-cupertinos-trails`: Jonathan Hwang
3. `from-taiwan-to-a-second-home`: Amy Su
4. `apple-park-from-proposal-to-landmark`: Dajao
5. `cherry-blossom-festival-and-belonging`: Michelle Kim
6. `closing-the-digital-and-generational-divide`: Phil Sun
7. `building-for-west-valley-community-services`: Garrett Kai
8. `biking-to-the-library-with-my-son`: David Ranslan
9. `a-childhood-summer-at-the-library-fountains`: Hannie Du
10. `the-library-fish-tank`: Tony Fei; Jonathan Hwang; Yona Lee
11. `the-cost-of-staying-in-cupertino`: Peter Choo; Nicole Fan; David Ranslan; Kai Kunurat and family; Ben Dong
12. `a-city-chosen-for-its-schools`: Michael Hung; Zhao Han Xu; Phil Sun; Long-time Cupertino resident; Cupertino parent

Reused recordings point to the same local path. No duplicate bytes are committed.

## Component and Accessibility

`ArchiveAudioPlayer` receives a nonempty track array and renders:

- “Audio recording” for one track;
- “Audio recordings” for a collection;
- narrator labels only when multiple tracks need differentiation;
- one native audio player per track;
- an `aria-label` in the form `Audio interview with {label}`;
- fallback text for browsers without audio support.

The section is labelled by its heading. The modal's existing focus trap remains valid because native audio controls are keyboard-focusable under the existing focusable selector.

## Styling

The audio section follows the existing modal language:

- rust-colored, uppercase Archivo heading matching “Full story”;
- vertical spacing between the summary, audio, classification, and full story;
- smaller narrator labels in the existing neutral text palette;
- existing divider token between tracks in a collection;
- players at `width: 100%` and `max-width: 100%`;
- no cards, shadows, decorative backgrounds, or player chrome replacements;
- no mobile overflow.

## Download and Validation

Each Drive file is downloaded once and validated against authoritative Drive metadata:

- exact expected filename mapping;
- `.m4a` extension;
- nonzero byte length;
- local byte length equal to the Drive-reported size;
- M4A container signature;
- browser metadata load with finite positive duration.

Playback verification will exercise each unique file in Chromium by loading metadata, playing muted media long enough for `currentTime` to advance, pausing, seeking, and changing volume. Reused tracks will also be checked in every story that references them.

## Testing and Production Verification

Automated tests will prove:

- all 12 entries have the exact ordered audio mapping;
- exactly 19 unique paths exist and all referenced files are present and nonempty;
- the player uses native controls, metadata preload, no autoplay, and base-path-prefixed sources;
- audio is rendered between summary and classification;
- no audio player appears on listing cards;
- styling uses existing tokens and prevents overflow;
- the production export contains repository-scoped audio URLs.

Browser verification will cover all 12 modal details and the required player counts: `2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 5, 5`. It will check both desktop and mobile, light and dark themes, modal scrolling, keyboard focus, playback behaviors, reused sources, and browser errors.

## Discrepancies to Preserve and Report

- Drive filename `Interview 9 - yona Lu.m4a` versus current transcript label `Yona Lee`.
- Drive filename `Interviews 4 zhou Han xu.m4a` versus current website label `Zhao Han Xu`.
- Drive filename `Interview 6 Gerit Kai.m4a` misspells the current website name `Garrett Kai`.
- Drive files `William 2.m4a` and `William 6.m4a` use the supplied visible labels `Long-time Cupertino resident` and `Cupertino parent`.

These discrepancies are reported, not silently “corrected” in source filenames or narrator identity assumptions.

## Acceptance Criteria

1. All 19 unique recordings exist once under `public/audio/archive/`.
2. All 12 story details render the exact 23 ordered player placements.
3. Players appear only after the summary and before Era / Category.
4. Every player uses native controls, `preload="metadata"`, no autoplay, and a base-path-correct local source.
5. Single and collection headings/labels match the supplied behavior.
6. Players fit desktop and mobile modal widths without changing listing cards.
7. Metadata, play, pause, seek, volume, and duration are verified for every unique recording.
8. Reused tracks work in every story that references them.
9. Formatter, tests, type check, lint, and production export are run; any pre-existing lint findings are separated from task regressions.
10. GitHub Pages deploys the exact committed media and public Archive verification passes.
