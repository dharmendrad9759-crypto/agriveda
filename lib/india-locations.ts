import stateDistricts from "@/data/india-state-districts.json";

export type StateDistrictMap = Record<string, string[]>;

export const STATE_DISTRICTS = stateDistricts as StateDistrictMap;

export const INDIAN_STATES = Object.keys(STATE_DISTRICTS).sort((a, b) =>
  a.localeCompare(b, "en", { sensitivity: "base" })
);

export function getDistrictsForState(state: string): string[] {
  const districts = STATE_DISTRICTS[state];
  if (!districts) return [];
  return [...districts].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
}

export function filterByQuery(items: string[], query: string, limit = 100): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return items.slice(0, limit);
  return items.filter((item) => item.toLowerCase().includes(q)).slice(0, limit);
}

export function isValidState(state: string): boolean {
  return Boolean(state && STATE_DISTRICTS[state]);
}

export function isValidDistrict(state: string, district: string): boolean {
  if (!district) return false;
  return getDistrictsForState(state).includes(district);
}

export function matchOption(items: string[], typed: string): string | null {
  const q = typed.trim().toLowerCase();
  if (!q) return null;
  const exact = items.find((item) => item.toLowerCase() === q);
  return exact ?? null;
}
