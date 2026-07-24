import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

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
