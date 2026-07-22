import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const iconUrl = new URL("../src/app/icon.png", import.meta.url);
const oldFaviconUrl = new URL("../src/app/favicon.ico", import.meta.url);

test("uses the supplied 658 by 652 PNG as the sole favicon source", async () => {
  const icon = await readFile(iconUrl);

  assert.deepEqual(
    [...icon.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
  );
  assert.equal(icon.length, 122_972);
  assert.equal(icon.readUInt32BE(16), 658);
  assert.equal(icon.readUInt32BE(20), 652);
  assert.equal(
    createHash("sha256").update(icon).digest("hex"),
    "d61ad30068b74ebe4fa87a3f02630dcf3109872554b2ef89467fd328a75a65d5",
  );
  await assert.rejects(stat(oldFaviconUrl), { code: "ENOENT" });
});
