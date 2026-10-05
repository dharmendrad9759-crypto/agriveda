/** Honest field stage from sowing ISO — no fake “health %”. */

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse ISO yyyy-mm-dd or loose en-IN display dates when possible. */
export function parseSowingISO(raw: string | undefined | null): string | null {
  if (!raw?.trim()) return null;
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const t = Date.parse(s);
  if (!Number.isFinite(t)) return null;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysAfterSowingISO(iso: string | null | undefined): number | null {
  const parsed = parseSowingISO(iso);
  if (!parsed) return null;
  const sown = new Date(`${parsed}T00:00:00`);
  if (Number.isNaN(sown.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  sown.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - sown.getTime()) / 86_400_000);
}

export function fieldStageLabel(
  sowingISO: string | undefined | null,
  hi: boolean
): string {
  const days = daysAfterSowingISO(sowingISO);
  if (days == null) {
    return hi ? "बुवाई तारीख डालें" : "Add sowing date";
  }
  if (days < 0) {
    return hi ? "बुवाई आगे की तारीख" : "Future sowing date";
  }
  if (days < 20) return hi ? `बुवाई के ${days} दिन · शुरुआती` : `Day ${days} · early`;
  if (days < 55) return hi ? `बुवाई के ${days} दिन · बढ़वार` : `Day ${days} · growth`;
  if (days < 95) return hi ? `बुवाई के ${days} दिन · सुरक्षा` : `Day ${days} · protect`;
  return hi ? `बुवाई के ${days} दिन · कटाई के पास` : `Day ${days} · near harvest`;
}

export function formatSowingDisplay(iso: string, hi: boolean): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(hi ? "hi-IN" : "en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
