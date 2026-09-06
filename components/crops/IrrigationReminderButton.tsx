"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, X } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { useToast } from "@/components/ui/Toast";
import { useFarmData } from "@/hooks/useFarmData";
import { isCapacitorNative } from "@/lib/capacitorNav";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";
import {
  IRRIGATION_INTERVAL_OPTIONS,
  formatReminderDate,
  getIrrigationReminder,
  removeIrrigationReminder,
  suggestIntervalDays,
  upsertIrrigationReminder,
  type IrrigationReminder,
} from "@/lib/irrigationReminders";

type Props = {
  cropSlug: string;
  cropLabel: string;
  hi: boolean;
  /** Badge texts from irrigation stages — used to suggest interval */
  badgeHints: string[];
};

export default function IrrigationReminderButton({
  cropSlug,
  cropLabel,
  hi,
  badgeHints,
}: Props) {
  const { showToast } = useToast();
  const { data: farm, addActivity } = useFarmData();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const suggested = useMemo(() => suggestIntervalDays(badgeHints), [badgeHints]);
  const [intervalDays, setIntervalDays] = useState(suggested);
  const [fieldId, setFieldId] = useState("");
  const [reminder, setReminder] = useState<IrrigationReminder | null>(null);

  const matchingFields = useMemo(
    () =>
      farm.fields.filter(
        (f) =>
          f.cropSlug === cropSlug ||
          f.crop.toLowerCase().includes(cropLabel.toLowerCase().slice(0, 4))
      ),
    [farm.fields, cropSlug, cropLabel]
  );

  useEffect(() => {
    setReminder(getIrrigationReminder(cropSlug));
  }, [cropSlug, open]);

  useEffect(() => {
    setIntervalDays(suggested);
  }, [suggested]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const fieldLabel =
    matchingFields.find((f) => f.id === fieldId)?.name ||
    matchingFields[0]?.name ||
    (hi ? "मेरा खेत" : "My field");

  const handleSave = async () => {
    setSaving(true);
    try {
      const next = await upsertIrrigationReminder({
        cropSlug,
        cropNameHi: cropLabel,
        intervalDays,
        fieldLabel,
        title: hi ? `पानी याद — ${cropLabel}` : `Water reminder — ${cropLabel}`,
        body: hi
          ? `आज ${cropLabel} में पानी देने का दिन है। खेत देखकर पानी दें।`
          : `Time to water ${cropLabel}. Check the field, then irrigate.`,
      });

      const dateLabel = formatReminderDate(next.nextAt, hi);
      addActivity({
        task: hi
          ? `${cropLabel} में पानी — हर ${intervalDays} दिन`
          : `${cropLabel} water — every ${intervalDays} days`,
        field: fieldLabel,
        date: dateLabel,
      });

      setReminder(next);
      setOpen(false);

      const native = isCapacitorNative();
      showToast(
        hi
          ? native
            ? `याद लग गई ✓ ${dateLabel} · ऐप अलर्ट + फोन सूचना`
            : `याद लग गई ✓ ${dateLabel} · घंटी (अलर्ट) में दिखेगा`
          : native
            ? `Reminder set ✓ ${dateLabel} · in-app + phone`
            : `Reminder set ✓ ${dateLabel} · see Alerts (bell)`
      );
    } catch {
      showToast(hi ? "याद सेव नहीं हुई" : "Could not save reminder", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    await removeIrrigationReminder(cropSlug);
    setReminder(null);
    showToast(hi ? "याद हटा दी" : "Reminder removed");
  };

  return (
    <>
      {reminder ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-3">
          <p className="text-[12px] font-extrabold text-emerald-900 dark:text-emerald-100">
            {hi ? "पानी की याद चालू है" : "Water reminder is on"}
          </p>
          <p className="mt-1 text-[12px] font-semibold text-[var(--av-text-secondary)]">
            {hi
              ? `हर ${reminder.intervalDays} दिन · अगली तारीख: ${formatReminderDate(reminder.nextAt, true)}`
              : `Every ${reminder.intervalDays} days · next: ${formatReminderDate(reminder.nextAt, false)}`}
            {reminder.fieldLabel ? ` · ${reminder.fieldLabel}` : ""}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cn(AV.btnPrimarySm)}
            >
              {hi ? "बदलें" : "Change"}
            </button>
            <button
              type="button"
              onClick={() => void handleClear()}
              className={cn(AV.btnSecondarySm)}
            >
              {hi ? "हटाएँ" : "Remove"}
            </button>
            <AppLink href="/my-farm" className={cn(AV.btnSecondarySm)}>
              {hi ? "मेरा खेत →" : "My farm →"}
            </AppLink>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(AV.btnPrimary, "w-full justify-center")}
        >
          <CalendarClock className="mr-1.5 inline h-4 w-4" />
          {hi ? "पानी की याद लगाएँ" : "Set water reminder"}
        </button>
      )}

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg animate-sheet-up rounded-t-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 pb-8 shadow-[var(--av-shadow-md)] sm:rounded-2xl sm:pb-4">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <h3 className="text-[16px] font-black text-[var(--av-text-primary)]">
                  {hi ? "पानी की याद" : "Water reminder"}
                </h3>
                <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
                  {hi
                    ? `${cropLabel} — कितने दिन बाद याद दिलाएँ?`
                    : `${cropLabel} — remind after how many days?`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--av-border)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[11px] font-bold text-[var(--av-text-muted)]">
              {hi ? "कितने दिन बाद?" : "After how many days?"}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {IRRIGATION_INTERVAL_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setIntervalDays(d)}
                  className={cn(
                    "min-w-[3rem] rounded-xl border px-3 py-2 text-sm font-extrabold transition active:scale-[0.97]",
                    intervalDays === d
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-primary)]"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>

            {matchingFields.length > 0 ? (
              <div className="mt-4">
                <p className="text-[11px] font-bold text-[var(--av-text-muted)]">
                  {hi ? "कौन सा खेत?" : "Which field?"}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {matchingFields.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFieldId(f.id)}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-[12px] font-bold",
                        fieldId === f.id || (!fieldId && matchingFields[0]?.id === f.id)
                          ? "border-sky-500/45 bg-sky-500/10 text-sky-900 dark:text-sky-100"
                          : "border-[var(--av-border)] text-[var(--av-text-secondary)]"
                      )}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <p className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/8 px-3 py-2 text-[11px] font-semibold leading-snug text-amber-950 dark:text-amber-100">
              {hi
                ? `आज से ${intervalDays} दिन बाद सुबह याद दिलाएँगे। मेरा खेत में भी काम लिख देंगे।`
                : `We'll remind you in ${intervalDays} days (morning). Also saved in My Farm.`}
            </p>

            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSave()}
              className={cn(AV.btnPrimary, "mt-4 w-full justify-center")}
            >
              {saving
                ? hi
                  ? "लग रहा है…"
                  : "Saving…"
                : hi
                  ? "याद लगा दें"
                  : "Save reminder"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
