import {
  copyFile,
  readFile,
  readdir,
  stat,
} from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

async function filesMatch(leftPath, rightPath) {
  try {
    const [left, right] = await Promise.all([
      readFile(leftPath),
      readFile(rightPath),
    ]);
    return left.equals(right);
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function copyPayloadDirectory(
  sourceDirectory,
  targetDirectory,
  targetPrefix,
) {
  let copiedCount = 0;
  const entries = await readdir(sourceDirectory, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDirectory, entry.name);

    if (entry.isDirectory()) {
      copiedCount += await copyPayloadDirectory(
        sourcePath,
        targetDirectory,
        `${targetPrefix}.${entry.name}`,
      );
      continue;
    }

    if (!entry.isFile()) continue;

    const targetPath = path.join(
      targetDirectory,
      `${targetPrefix}.${entry.name}`,
    );

    if (await filesMatch(sourcePath, targetPath)) continue;

    await copyFile(sourcePath, targetPath);
    copiedCount += 1;
  }

  return copiedCount;
}

async function visitExportDirectory(directory) {
  let copiedCount = 0;
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const childDirectory = path.join(directory, entry.name);

    if (entry.name.startsWith("__next.")) {
      copiedCount += await copyPayloadDirectory(
        childDirectory,
        directory,
        entry.name,
      );
      continue;
    }

    copiedCount += await visitExportDirectory(childDirectory);
  }

  return copiedCount;
}

export async function copyFlattenedRscPayloads(outputDirectory = "out") {
  const resolvedOutput = path.resolve(outputDirectory);
  const outputStats = await stat(resolvedOutput);

  if (!outputStats.isDirectory()) {
    throw new Error(`Static export path is not a directory: ${resolvedOutput}`);
  }

  return visitExportDirectory(resolvedOutput);
}

const entryPath = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : undefined;

if (entryPath === import.meta.url) {
  const copiedCount = await copyFlattenedRscPayloads();
  console.log(
    copiedCount === 0
      ? "Static RSC payload paths already match client requests."
      : `Created ${copiedCount} flattened static RSC payload file${copiedCount === 1 ? "" : "s"}.`,
  );
}
