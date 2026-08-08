import { readStorage, writeStorage } from "@/lib/storage";

const KEY = "agriveda-scheme-progress";

export type SchemeProgressMap = Record<
  string,
  { checked: string[]; updatedAt: string }
>;

export function loadSchemeProgress(): SchemeProgressMap {
  return readStorage<SchemeProgressMap>(KEY, {});
}

export function getCheckedDocs(schemeId: string): string[] {
  return loadSchemeProgress()[schemeId]?.checked ?? [];
}

export function setDocChecked(schemeId: string, docId: string, checked: boolean): string[] {
  const all = loadSchemeProgress();
  const prev = new Set(all[schemeId]?.checked ?? []);
  if (checked) prev.add(docId);
  else prev.delete(docId);
  const next = [...prev];
  all[schemeId] = { checked: next, updatedAt: new Date().toISOString() };
  writeStorage(KEY, all);
  return next;
}
