import type { ArchiveEntry } from "@/data/archive-entries";

export function filterArchiveEntries(
  entries: ArchiveEntry[],
  activeFilter: string,
  query: string,
): ArchiveEntry[] {
  const normalizedFilter = activeFilter.trim().toLowerCase();
  const normalizedQuery = query.trim().toLowerCase().replaceAll("–", "—");

  return entries.filter((entry) => {
    const matchesFilter =
      normalizedFilter === "all" ||
      entry.category.toLowerCase() === normalizedFilter;

    const searchableText = [
      entry.title,
      entry.narrators,
      entry.metadata,
      entry.summary,
      entry.era,
      entry.category,
      entry.story,
    ]
      .join(" ")
      .toLowerCase();

    return (
      matchesFilter &&
      (normalizedQuery.length === 0 || searchableText.includes(normalizedQuery))
    );
  });
}
