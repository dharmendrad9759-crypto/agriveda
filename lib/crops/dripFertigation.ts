import type { Crop } from "@/types/crop";

/** Drip fertigation toggle — mostly open-field vegetables with drip kits. */
export function cropSupportsDripFertigation(crop: Pick<Crop, "category">): boolean {
  return crop.category === "Vegetables";
}

export function mentionsDripFertigation(text: string): boolean {
  return /ड्रिप|drip|fertigation|फर्टिगेशन/i.test(text);
}

export function withoutDripFertigationLines<T extends { apply?: string; detail?: string }>(
  rows: T[],
  supportsDrip: boolean
): T[] {
  if (supportsDrip) return rows;
  return rows.filter((r) => {
    const text = r.apply ?? r.detail ?? "";
    return !mentionsDripFertigation(text);
  });
}

export function filterDripMentions(lines: string[], supportsDrip: boolean): string[] {
  if (supportsDrip) return lines;
  return lines.filter((line) => !mentionsDripFertigation(line));
}
