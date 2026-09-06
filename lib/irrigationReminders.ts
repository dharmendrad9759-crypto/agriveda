import { readStorage, writeStorage } from "@/lib/storage";
import { scheduleLocalAlert } from "@/lib/push/farmerPush";
import { isCapacitorNative } from "@/lib/capacitorNav";
import type { FarmAlert } from "@/lib/agriveda2/farmAlertsEngine";

const KEY = "agriveda-irrigation-reminders";

export type IrrigationReminder = {
  cropSlug: string;
  cropNameHi: string;
  intervalDays: number;
  /** ISO date of next due irrigation */
  nextAt: string;
  createdAt: string;
  fieldLabel?: string;
  notifId: number;
};

function loadAll(): IrrigationReminder[] {
  return readStorage<IrrigationReminder[]>(KEY, []);
}

function saveAll(list: IrrigationReminder[]) {
  writeStorage(KEY, list);
}

export function getIrrigationReminder(cropSlug: string): IrrigationReminder | null {
  return loadAll().find((r) => r.cropSlug === cropSlug) ?? null;
}

export function listIrrigationReminders(): IrrigationReminder[] {
  return loadAll();
}

/** Stable local-notification id per crop (avoids colliding with 9001–9003). */
export function irrigationNotifId(cropSlug: string): number {
  let h = 0;
  for (let i = 0; i < cropSlug.length; i++) {
    h = (h * 31 + cropSlug.charCodeAt(i)) >>> 0;
  }
  return 9200 + (h % 700);
}

export function nextIrrigationDate(intervalDays: number, from = new Date()): Date {
  const d = new Date(from);
  d.setHours(7, 0, 0, 0);
  d.setDate(d.getDate() + Math.max(1, intervalDays));
  if (d.getTime() <= Date.now()) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export function formatReminderDate(iso: string, hi: boolean): string {
  try {
    return new Date(iso).toLocaleDateString(hi ? "hi-IN" : "en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return iso;
  }
}

export async function cancelIrrigationLocalNotif(notifId: number): Promise<void> {
  if (typeof window === "undefined" || !isCapacitorNative()) return;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    await LocalNotifications.cancel({ notifications: [{ id: notifId }] });
  } catch {
    /* ignore */
  }
}

export async function upsertIrrigationReminder(input: {
  cropSlug: string;
  cropNameHi: string;
  intervalDays: number;
  fieldLabel?: string;
  title: string;
  body: string;
}): Promise<IrrigationReminder> {
  const notifId = irrigationNotifId(input.cropSlug);
  await cancelIrrigationLocalNotif(notifId);

  const next = nextIrrigationDate(input.intervalDays);
  const reminder: IrrigationReminder = {
    cropSlug: input.cropSlug,
    cropNameHi: input.cropNameHi,
    intervalDays: input.intervalDays,
    nextAt: next.toISOString(),
    createdAt: new Date().toISOString(),
    fieldLabel: input.fieldLabel,
    notifId,
  };

  const rest = loadAll().filter((r) => r.cropSlug !== input.cropSlug);
  saveAll([reminder, ...rest]);
  notifyIrrigationAlertsChanged();

  // Native Android: system notification. Web/dev: in-app alerts only (AlertsHub).
  await scheduleLocalAlert({
    id: notifId,
    title: input.title,
    body: input.body,
    at: next,
    force: true,
  });

  return reminder;
}

export async function removeIrrigationReminder(cropSlug: string): Promise<void> {
  const existing = getIrrigationReminder(cropSlug);
  if (existing) await cancelIrrigationLocalNotif(existing.notifId);
  saveAll(loadAll().filter((r) => r.cropSlug !== cropSlug));
  notifyIrrigationAlertsChanged();
}

/** Due today or overdue (past nextAt). */
export function dueIrrigationReminders(now = new Date()): IrrigationReminder[] {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return loadAll().filter((r) => new Date(r.nextAt).getTime() <= end.getTime());
}

/** Upcoming within N days (not yet due). */
export function upcomingIrrigationReminders(withinDays = 3, now = new Date()): IrrigationReminder[] {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + 1);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  end.setDate(end.getDate() + withinDays);
  return loadAll().filter((r) => {
    const t = new Date(r.nextAt).getTime();
    return t >= start.getTime() && t <= end.getTime();
  });
}

export function countInAppIrrigationAlerts(): number {
  return buildIrrigationInAppAlerts(true).length;
}

const IRR_ALERTS_EVENT = "agriveda-irrigation-alerts-changed";

export function notifyIrrigationAlertsChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(IRR_ALERTS_EVENT));
}

export function onIrrigationAlertsChanged(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(IRR_ALERTS_EVENT, cb);
  window.addEventListener("focus", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(IRR_ALERTS_EVENT, cb);
    window.removeEventListener("focus", cb);
    window.removeEventListener("storage", cb);
  };
}

/** Build farm alerts for /alerts hub (works on web + native). */
export function buildIrrigationInAppAlerts(hi = true): FarmAlert[] {
  const due = dueIrrigationReminders();
  const dueSlugs = new Set(due.map((d) => d.cropSlug));
  const upcoming = upcomingIrrigationReminders(3).filter((u) => !dueSlugs.has(u.cropSlug));
  const upcomingSlugs = new Set(upcoming.map((u) => u.cropSlug));
  const scheduled = loadAll().filter(
    (r) => !dueSlugs.has(r.cropSlug) && !upcomingSlugs.has(r.cropSlug)
  );

  const alerts: FarmAlert[] = [];

  for (const r of due) {
    alerts.push({
      id: `irr-due-${r.cropSlug}`,
      severity: "critical",
      title: hi ? `आज पानी दें — ${r.cropNameHi}` : `Water today — ${r.cropNameHi}`,
      body: hi
        ? `${r.fieldLabel ? `${r.fieldLabel} · ` : ""}आपने हर ${r.intervalDays} दिन याद लगाई थी। खेत देखकर पानी दें।`
        : `${r.fieldLabel ? `${r.fieldLabel} · ` : ""}You set every ${r.intervalDays} days. Check field and irrigate.`,
      cropSlug: r.cropSlug,
      fieldName: r.fieldLabel ?? (hi ? "मेरा खेत" : "My field"),
      actionLabel: hi ? "पानी गाइड खोलें" : "Open water guide",
      actionHref: `/crops/${r.cropSlug}/care/irrigation`,
    });
  }

  for (const r of upcoming) {
    const daysAhead = Math.max(
      1,
      Math.ceil((new Date(r.nextAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    );
    alerts.push({
      id: `irr-soon-${r.cropSlug}`,
      severity: "warning",
      title: hi ? `जल्द पानी — ${r.cropNameHi}` : `Water soon — ${r.cropNameHi}`,
      body: hi
        ? `${formatReminderDate(r.nextAt, true)} को याद है (हर ${r.intervalDays} दिन)।`
        : `Reminder on ${formatReminderDate(r.nextAt, false)} (every ${r.intervalDays} days).`,
      cropSlug: r.cropSlug,
      fieldName: r.fieldLabel ?? (hi ? "मेरा खेत" : "My field"),
      actionLabel: hi ? "याद देखें" : "See reminder",
      actionHref: `/crops/${r.cropSlug}/care/irrigation`,
      daysAhead,
    });
  }

  // Show newly set reminders in-app even if nextAt is further away.
  for (const r of scheduled) {
    const daysAhead = Math.max(
      1,
      Math.ceil((new Date(r.nextAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    );
    alerts.push({
      id: `irr-set-${r.cropSlug}`,
      severity: "info",
      title: hi ? `पानी याद चालू — ${r.cropNameHi}` : `Water reminder on — ${r.cropNameHi}`,
      body: hi
        ? `अगली याद ${formatReminderDate(r.nextAt, true)} (हर ${r.intervalDays} दिन)।`
        : `Next reminder ${formatReminderDate(r.nextAt, false)} (every ${r.intervalDays} days).`,
      cropSlug: r.cropSlug,
      fieldName: r.fieldLabel ?? (hi ? "मेरा खेत" : "My field"),
      actionLabel: hi ? "याद देखें" : "See reminder",
      actionHref: `/crops/${r.cropSlug}/care/irrigation`,
      daysAhead,
    });
  }

  return alerts;
}

/** After farmer waters — push nextAt forward by intervalDays. */
export async function markIrrigationDone(cropSlug: string): Promise<IrrigationReminder | null> {
  const existing = getIrrigationReminder(cropSlug);
  if (!existing) return null;

  await cancelIrrigationLocalNotif(existing.notifId);
  const next = nextIrrigationDate(existing.intervalDays);
  const updated: IrrigationReminder = {
    ...existing,
    nextAt: next.toISOString(),
  };
  saveAll([updated, ...loadAll().filter((r) => r.cropSlug !== cropSlug)]);
  notifyIrrigationAlertsChanged();

  await scheduleLocalAlert({
    id: existing.notifId,
    title: `पानी याद — ${existing.cropNameHi}`,
    body: `आज ${existing.cropNameHi} में पानी देने का दिन है। खेत देखकर पानी दें।`,
    at: next,
    force: true,
  });

  return updated;
}

/** Suggest interval days from guide badge text like "हर 5–6 दिन". */
export function suggestIntervalDays(badgeTexts: string[]): number {
  for (const b of badgeTexts) {
    const m = b.match(/(\d+)\s*[–\-]\s*(\d+)/);
    if (m) {
      const a = Number(m[1]);
      const c = Number(m[2]);
      if (Number.isFinite(a) && Number.isFinite(c)) return Math.round((a + c) / 2);
    }
    const single = b.match(/(?:हर|every)\s*(\d+)/i);
    if (single) return Number(single[1]) || 7;
  }
  return 7;
}

export const IRRIGATION_INTERVAL_OPTIONS = [3, 4, 5, 6, 7, 8, 10, 12] as const;
