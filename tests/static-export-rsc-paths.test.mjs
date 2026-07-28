import assert from "node:assert/strict";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const fixerUrl = new URL(
  "../scripts/fix-next-static-export-rsc-paths.mjs",
  import.meta.url,
);
const packageUrl = new URL("../package.json", import.meta.url);

async function fileExists(url) {
  try {
    await access(url);
    return true;
  } catch {
    return false;
  }
}

test("flattens Windows-exported RSC payloads to the paths Next requests", async () => {
  assert.equal(
    await fileExists(fixerUrl),
    true,
    "the static-export RSC path normalizer must exist",
  );

  const { copyFlattenedRscPayloads } = await import(fixerUrl.href);
  const fixtureRoot = await mkdtemp(
    path.join(tmpdir(), "cupertino-rsc-export-test-"),
  );

  try {
    const fixtures = [
      {
        nested: path.join(
          fixtureRoot,
          "about",
          "__next.about",
          "__PAGE__.txt",
        ),
        flat: path.join(
          fixtureRoot,
          "about",
          "__next.about.__PAGE__.txt",
        ),
        content: "about payload",
      },
      {
        nested: path.join(
          fixtureRoot,
          "_not-found",
          "__next._not-found",
          "__PAGE__.txt",
        ),
        flat: path.join(
          fixtureRoot,
          "_not-found",
          "__next._not-found.__PAGE__.txt",
        ),
        content: "not-found payload",
      },
    ];

    for (const fixture of fixtures) {
      await mkdir(path.dirname(fixture.nested), { recursive: true });
      await writeFile(fixture.nested, fixture.content, "utf8");
    }

    assert.equal(await copyFlattenedRscPayloads(fixtureRoot), 2);

    for (const fixture of fixtures) {
      assert.equal(await readFile(fixture.flat, "utf8"), fixture.content);
    }

    assert.equal(
      await copyFlattenedRscPayloads(fixtureRoot),
      0,
      "running the normalizer twice must not rewrite unchanged files",
    );
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }

  const packageJson = JSON.parse(await readFile(packageUrl, "utf8"));
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(
    packageJson.scripts.postbuild,
    "node scripts/fix-next-static-export-rsc-paths.mjs",
  );
});
