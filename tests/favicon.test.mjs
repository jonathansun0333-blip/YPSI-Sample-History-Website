import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const iconUrl = new URL("../src/app/icon.png", import.meta.url);
const oldFaviconUrl = new URL("../src/app/favicon.ico", import.meta.url);

test("uses the supplied 960 by 720 PNG as the sole favicon source", async () => {
  const icon = await readFile(iconUrl);
  assert.deepEqual([...icon.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(icon.readUInt32BE(16), 960);
  assert.equal(icon.readUInt32BE(20), 720);
  await assert.rejects(stat(oldFaviconUrl), { code: "ENOENT" });
});
