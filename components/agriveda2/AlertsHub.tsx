"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useEffect } from "react";
import {
  Bell,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Droplets,
  Plus,
  Shield,
  Sprout,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { useSprayFields } from "@/hooks/useSprayFields";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useToast } from "@/components/ui/Toast";
import { buildFieldAlerts } from "@/lib/agriveda2/farmAlertsEngine";
import {
  buildIrrigationInAppAlerts,
  markIrrigationDone,
  onIrrigationAlertsChanged,
} from "@/lib/irrigationReminders";
import {
  answerAiFollowUp,
  buildAiFollowUpAlerts,
} from "@/lib/aiDoctorFollowUp";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";

const SEV = {
  critical: "border-l-red-500 bg-red-50 dark:bg-red-500/10",
  warning: "border-l-amber-500 bg-amber-50 dark:bg-amber-500/10",
  info: "border-l-sky-500 bg-sky-50 dark:bg-sky-500/10",
};

export interface CustomAlert {
  id: string;
  type: "irrigation" | "fertilizer" | "spray" | "mandi" | "other";
  title: string;
  date: string;
  time?: string;
  fieldName?: string;
  notes?: string;
  createdAt: string;
}

const CUSTOM_ALERTS_KEY = "agriveda_custom_alerts";

const ALERT_TYPE_META: Record<
  CustomAlert["type"],
  { labelHi: string; icon: string; bg: string }
> = {
  irrigation: { labelHi: "सिंचाई", icon: "💧", bg: "bg-sky-500/15 text-sky-800 dark:text-sky-200" },
  fertilizer: { labelHi: "खाद", icon: "🌱", bg: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200" },
  spray: { labelHi: "स्प्रे / कीटनाशक", icon: "🛡️", bg: "bg-purple-500/15 text-purple-800 dark:text-purple-200" },
  mandi: { labelHi: "मंडी भाव", icon: "📈", bg: "bg-amber-500/15 text-amber-800 dark:text-amber-200" },
  other: { labelHi: "रिमाइंडर", icon: "🔔", bg: "bg-stone-500/15 text-stone-800 dark:text-stone-200" },
};

export default function AlertsHub() {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const { showToast } = useToast();
  const { fields } = useSprayFields();
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const [irrTick, setIrrTick] = useState(0);
  const [fuTick, setFuTick] = useState(0);

  // Custom alert states
  const [customAlerts, setCustomAlerts] = useState<CustomAlert[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<CustomAlert["type"]>("irrigation");
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [newTime, setNewTime] = useState("08:00");
  const [newField, setNewField] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Load custom alerts from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_ALERTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setCustomAlerts(
            parsed.filter(
              (a): a is CustomAlert =>
                !!a &&
                typeof a === "object" &&
                typeof a.id === "string" &&
                typeof a.title === "string" &&
                typeof a.date === "string"
            )
          );
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save custom alerts
  const saveCustomAlerts = (list: CustomAlert[]) => {
    setCustomAlerts(list);
    try {
      localStorage.setItem(CUSTOM_ALERTS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  const handleAddCustomAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast(hi ? "कृपया अलर्ट का नाम भरें" : "Please enter alert title", "error");
      return;
    }

    const created: CustomAlert = {
      id: `alert-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      date: newDate,
      time: newTime || undefined,
      fieldName: newField.trim() || undefined,
      notes: newNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const next = [created, ...customAlerts];
    saveCustomAlerts(next);
    setShowAddModal(false);
    setNewTitle("");
    setNewNotes("");
    showToast(hi ? "नया रिमाइंडर सफलतापूर्वक जुड़ गया ✓" : "Reminder added successfully ✓");
  };

  const handleDeleteCustomAlert = (id: string) => {
    const next = customAlerts.filter((a) => a.id !== id);
    saveCustomAlerts(next);
    showToast(hi ? "अलर्ट पूरा हुआ / हटा दिया गया ✓" : "Alert dismissed ✓");
  };

  useEffect(() => onIrrigationAlertsChanged(() => setIrrTick((n) => n + 1)), []);

  const irrigationAlerts = useMemo(
    () => buildIrrigationInAppAlerts(hi),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hi, irrTick]
  );

  const aiFollowUps = useMemo(
    () => buildAiFollowUpAlerts(hi),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hi, fuTick]
  );

  const fieldAlerts = useMemo(() => {
    const list =
      fields.length > 0
        ? fields
        : crops.map((c, i) => ({
            id: `c-${c.slug}`,
            name: `Field ${i + 1}`,
            cropSlug: c.slug,
          }));

    return list
      .flatMap((f) =>
        buildFieldAlerts(f, profile.sowingDates[f.cropSlug]).map((a) => ({
          ...a,
          fieldName: a.fieldName ?? f.name,
        }))
      )
      .sort((a, b) => {
        const order = { critical: 0, warning: 1, info: 2 };
        return order[a.severity] - order[b.severity];
      });
  }, [fields, crops, profile.sowingDates]);

  const allAlerts = useMemo(() => {
    const order = { critical: 0, warning: 1, info: 2 };
    const mappedFu = aiFollowUps.map((f) => ({
      id: f.id,
      severity: f.severity as "info",
      title: f.title,
      body: f.body,
      fieldName: hi ? "AI Doctor जाँच" : "AI Doctor check-in",
      actionLabel: hi ? "AI Doctor खोलें" : "Open AI Doctor",
      actionHref: f.href,
      followUpId: f.followUpId as string | undefined,
      cropSlug: undefined as string | undefined,
      daysAhead: undefined as number | undefined,
    }));
    return [...irrigationAlerts, ...fieldAlerts, ...mappedFu].sort(
      (a, b) => order[a.severity] - order[b.severity]
    );
  }, [irrigationAlerts, fieldAlerts, aiFollowUps, hi]);

  const onWatered = useCallback(
    async (cropSlug: string) => {
      await markIrrigationDone(cropSlug);
      setIrrTick((n) => n + 1);
      showToast(hi ? "अगली पानी याद लगा दी ✓" : "Next water reminder set ✓");
    },
    [hi, showToast]
  );

  const onFollowUp = useCallback(
    (id: string, status: "improved" | "same" | "worse") => {
      answerAiFollowUp(id, status);
      setFuTick((n) => n + 1);
      showToast(
        hi
          ? status === "improved"
            ? "अच्छा — सुधार नोट किया ✓"
            : status === "worse"
              ? "नोट किया — विशेषज्ञ से पूछें"
              : "नोट किया ✓"
          : "Thanks — noted ✓"
      );
    },
    [hi, showToast]
  );

  return (
    <div className="space-y-4">
      {/* Top Banner with "+ नया रिमाइंडर" button */}
      <div className="relative overflow-hidden rounded-[22px] border border-amber-500/20 shadow-[var(--av-shadow-sm)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/jobs/job-alerts.jpg"
          alt=""
          className="h-36 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[17px] font-bold text-white">
                {hi ? "अलर्ट व याददाश्त" : "Alerts & Reminders"}
              </p>
              <p className="text-[12px] font-medium text-white/85">
                {hi
                  ? "सिंचाई · खाद · स्प्रे · मंडी भाव"
                  : "Water · fertilizer · spray · mandi"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-emerald-950/30 transition hover:bg-emerald-500 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>{hi ? "+ नया अलर्ट" : "+ Add alert"}</span>
          </button>
        </div>
      </div>

      {/* Custom Farmer Reminders Section */}
      {customAlerts.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-sm font-extrabold text-[var(--av-text-primary)]">
              📌 {hi ? "मेरे लगाए गए अलर्ट / रिमाइंडर" : "My custom reminders"}
            </h3>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {customAlerts.length} {hi ? "सक्रिय" : "active"}
            </span>
          </div>

          <div className="space-y-2">
            {customAlerts.map((ca) => {
              const meta = ALERT_TYPE_META[ca.type] || ALERT_TYPE_META.other;
              return (
                <div
                  key={ca.id}
                  className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-base">
                        {meta.icon}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={cn(
                              "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                              meta.bg
                            )}
                          >
                            {meta.labelHi}
                          </span>
                          {ca.fieldName && (
                            <span className="rounded-md bg-[var(--av-surface-inset)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--av-text-secondary)]">
                              {ca.fieldName}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm font-bold text-[var(--av-text-primary)]">
                          {ca.title}
                        </p>
                        {ca.notes && (
                          <p className="mt-0.5 text-xs text-[var(--av-text-muted)]">
                            {ca.notes}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {ca.date}
                          </span>
                          {ca.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {ca.time}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCustomAlert(ca.id)}
                      className="flex shrink-0 items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-500/20 active:scale-95"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{hi ? "पूरा हुआ" : "Done"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* System In-App Alerts */}
      <div className="space-y-2.5">
        <h3 className="text-sm font-extrabold text-[var(--av-text-primary)]">
          🔔 {hi ? "खेत व मौसम संबंधी अलर्ट" : "Field & weather alerts"}
        </h3>

        {allAlerts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 px-4 py-8 text-center text-sm font-semibold text-[var(--av-text-muted)]">
            {hi ? "कोई अलर्ट नहीं — सब ठीक ✓" : "No alerts — all good ✓"}
          </p>
        ) : (
          allAlerts.map((a) => {
            const isIrrDue = a.id.startsWith("irr-due-");
            const isAiFu = a.id.startsWith("ai-fu-");
            const cropSlug = a.cropSlug;
            const followUpId =
              "followUpId" in a && typeof (a as { followUpId?: unknown }).followUpId === "string"
                ? (a as { followUpId: string }).followUpId
                : undefined;
            return (
              <div key={a.id + (a.fieldName ?? "")} className="mb-3">
                <Link href={a.actionHref ?? "/dashboard"}>
                  <div
                    className={`rounded-xl border border-[var(--av-border)] border-l-4 p-4 ${SEV[a.severity]}`}
                  >
                    <p className="text-[10px] font-bold uppercase text-[var(--av-text-muted)]">
                      {a.fieldName}
                      {a.daysAhead ? ` · ${a.daysAhead} ${hi ? "दिन पहले" : "days ahead"}` : ""}
                    </p>
                    <p className="mt-1 font-bold text-[var(--av-text-primary)]">{a.title}</p>
                    <p className="mt-1 text-sm text-[var(--av-text-secondary)]">{a.body}</p>
                    {a.actionLabel && !isAiFu && (
                      <p className="mt-2 flex items-center gap-1 text-xs font-bold text-[var(--av-accent)]">
                        {a.actionLabel}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </p>
                    )}
                  </div>
                </Link>
                {isIrrDue && cropSlug ? (
                  <button
                    type="button"
                    onClick={() => void onWatered(cropSlug)}
                    className={cn(AV.btnSecondarySm, "mt-2 w-full justify-center")}
                  >
                    {hi ? "पानी दे दिया — अगली याद लगाओ" : "Watered — set next reminder"}
                  </button>
                ) : null}
                {isAiFu && followUpId ? (
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: "improved" as const, label: hi ? "सुधार" : "Better" },
                        { id: "same" as const, label: hi ? "वैसा ही" : "Same" },
                        { id: "worse" as const, label: hi ? "बढ़ी" : "Worse" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onFollowUp(followUpId, opt.id)}
                        className={cn(AV.btnSecondarySm, "justify-center px-1 text-[11px]")}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add New Custom Alert */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[var(--av-border)] bg-[var(--background)] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--av-border)]">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  <Bell className="h-4 w-4" />
                </span>
                <h3 className="text-base font-bold text-[var(--av-text-primary)]">
                  {hi ? "नया अलर्ट / रिमाइंडर लगाएं" : "Add New Reminder"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl p-1.5 text-[var(--av-text-muted)] hover:bg-[var(--av-surface-inset)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomAlert} className="mt-4 space-y-3.5">
              {/* Alert Type Selection */}
              <div>
                <label className="block text-xs font-bold text-[var(--av-text-primary)]">
                  {hi ? "अलर्ट का प्रकार" : "Reminder Type"}
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: "irrigation" as const, label: "💧 सिंचाई" },
                      { id: "fertilizer" as const, label: "🌱 खाद" },
                      { id: "spray" as const, label: "🛡️ स्प्रे" },
                      { id: "mandi" as const, label: "📈 मंडी" },
                      { id: "other" as const, label: "🔔 अन्य" },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewType(t.id)}
                      className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold transition ${
                        newType === t.id
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[var(--av-text-primary)]">
                  {hi ? "कार्य या विषय *" : "Title *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={hi ? "उदा. गेहूं में पहली सिंचाई या यूरिया छिड़काव" : "e.g. First irrigation in wheat"}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2 text-sm text-[var(--av-text-primary)] outline-none focus:border-emerald-500"
                />
              </div>

              {/* Field Name */}
              <div>
                <label className="block text-xs font-bold text-[var(--av-text-primary)]">
                  {hi ? "खेत का नाम (वैकल्पिक)" : "Field Name (optional)"}
                </label>
                <input
                  type="text"
                  placeholder={hi ? "उदा. खेत 1 (धान / गेहूं)" : "e.g. Field 1"}
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2 text-sm text-[var(--av-text-primary)] outline-none focus:border-emerald-500"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[var(--av-text-primary)]">
                    {hi ? "तारीख *" : "Date *"}
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2 text-sm text-[var(--av-text-primary)] outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--av-text-primary)]">
                    {hi ? "समय" : "Time"}
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2 text-sm text-[var(--av-text-primary)] outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[var(--av-text-primary)]">
                  {hi ? "विशेष नोट / खुराक (वैकल्पिक)" : "Notes / Dose (optional)"}
                </label>
                <input
                  type="text"
                  placeholder={hi ? "उदा. 30 किलो यूरिया + 5 किलो जिंक" : "e.g. 30kg urea + 5kg zinc"}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2 text-sm text-[var(--av-text-primary)] outline-none focus:border-emerald-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] py-2.5 text-xs font-bold text-[var(--av-text-secondary)]"
                >
                  {hi ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="w-2/3 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/20 active:scale-95"
                >
                  {hi ? "रिमाइंडर सहेजें ✓" : "Save Reminder ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
