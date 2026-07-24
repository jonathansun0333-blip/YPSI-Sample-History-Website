import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";
import { ARCHIVE_ENTRIES } from "../src/data/archive-entries.ts";

const audioDirectoryUrl = new URL(
  "../public/audio/archive/",
  import.meta.url,
);

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

test("stores each unique Drive recording once as validated M4A bytes", async () => {
  const expectedNames = Object.keys(EXPECTED_AUDIO_FILES).sort();
  const actualNames = (await readdir(audioDirectoryUrl)).sort();

  assert.deepEqual(actualNames, expectedNames);

  await Promise.all(
    expectedNames.map(async (name) => {
      const fileUrl = new URL(name, audioDirectoryUrl);
      const [fileStats, bytes] = await Promise.all([
        stat(fileUrl),
        readFile(fileUrl),
      ]);

      assert.equal(name.endsWith(".m4a"), true);
      assert.equal(fileStats.size, EXPECTED_AUDIO_FILES[name]);
      assert.equal(fileStats.size > 0, true);
      assert.equal(bytes.subarray(4, 8).toString("ascii"), "ftyp");
    }),
  );
});

test("maps the exact ordered recordings to all 12 archive stories", () => {
  const expectedTracksBySlug = {
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
      [
        "Kai Kunurat and family",
        "/audio/archive/kai-kunurat-family.m4a",
      ],
      ["Ben Dong", "/audio/archive/ben-dong.m4a"],
    ],
    "a-city-chosen-for-its-schools": [
      ["Michael Hung", "/audio/archive/michael-hung.m4a"],
      ["Zhao Han Xu", "/audio/archive/zhao-han-xu.m4a"],
      ["Phil Sun", "/audio/archive/phil-sun.m4a"],
      [
        "Long-time Cupertino resident",
        "/audio/archive/cupertino-25-year-resident.m4a",
      ],
      [
        "Cupertino parent",
        "/audio/archive/cupertino-parent-schools.m4a",
      ],
    ],
  };
  const actualTracksBySlug = Object.fromEntries(
    ARCHIVE_ENTRIES.map((entry) => [
      entry.slug,
      entry.audioTracks?.map((track) => [track.label, track.src]),
    ]),
  );
  const allTracks = ARCHIVE_ENTRIES.flatMap(
    (entry) => entry.audioTracks ?? [],
  );

  assert.deepEqual(actualTracksBySlug, expectedTracksBySlug);
  assert.equal(allTracks.length, 23);
  assert.equal(new Set(allTracks.map((track) => track.src)).size, 19);
});

test("renders base-path-aware native audio controls in the archive modal", async () => {
  const [player, explorer, helper] = await Promise.all([
    readFile(
      new URL("../src/components/archive-audio-player.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/components/archive-explorer.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../src/lib/asset-path.ts", import.meta.url), "utf8"),
  ]);

  assert.match(player, /<section className="archive-audio"/);
  assert.match(player, /<audio[\s\S]*?\bcontrols\b[\s\S]*?preload="metadata"/);
  assert.doesNotMatch(player, /\bautoPlay\b/);
  assert.match(player, /<source[\s\S]*?type="audio\/mp4"/);
  assert.match(player, /src=\{withBasePath\(track\.src\)\}/);
  assert.match(helper, /process\.env\.NEXT_PUBLIC_BASE_PATH\s*\?\?\s*""/);
  assert.match(explorer, /import \{ ArchiveAudioPlayer \}/);

  const summaryIndex = explorer.indexOf('id="archive-modal-summary"');
  const playerIndex = explorer.indexOf("<ArchiveAudioPlayer");
  const metadataIndex = explorer.indexOf('className="archive-modal-meta"');

  assert.ok(summaryIndex >= 0);
  assert.ok(playerIndex > summaryIndex);
  assert.ok(metadataIndex > playerIndex);
});

test("styles audio controls as a responsive part of the existing modal", async () => {
  const styles = await readFile(
    new URL("../src/app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(styles, /\.archive-audio\s*\{[^}]*margin:\s*2rem 0;/s);
  assert.match(
    styles,
    /\.archive-audio h3,\s*\.archive-modal-story h3\s*\{[^}]*font-family:\s*'Archivo', sans-serif;[^}]*text-transform:\s*uppercase;[^}]*color:\s*var\(--archive-text-accent\);/s,
  );
  assert.match(
    styles,
    /\.archive-audio-tracks\s*\{[^}]*display:\s*grid;[^}]*gap:\s*1\.25rem;/s,
  );
  assert.match(
    styles,
    /\.archive-audio-track \+ \.archive-audio-track\s*\{[^}]*border-top:\s*1px solid var\(--line\);/s,
  );
  assert.match(
    styles,
    /\.archive-audio-label\s*\{[^}]*font-family:\s*'Archivo', sans-serif;[^}]*font-size:\s*0\.75rem;/s,
  );
  assert.match(
    styles,
    /\.archive-audio audio\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*100%;/s,
  );

  const audioStyles = styles.slice(
    styles.indexOf(".archive-audio {"),
    styles.indexOf(".archive-modal-story p"),
  );
  assert.doesNotMatch(audioStyles, /box-shadow|background(?:-color)?:/);
});
