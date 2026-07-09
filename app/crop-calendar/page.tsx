"use client";

import { useState } from "react";
import { Download, Calendar } from "lucide-react";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { useToast } from "@/components/ui/Toast";
import {
  CALENDAR_FILTERS,
  GROWTH_STAGES,
  CALENDAR_ACTIVITIES,
  UPCOMING_CALENDAR,
  CALENDAR_SUMMARY,
  RECOMMENDED_INPUTS,
  STAGE_TIPS,
  CALENDAR_ALERTS,
} from "@/data/mock/crop-calendar";
import AppLink from "@/components/ui/AppLink";
import { AV } from "@/lib/design/tokens";

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

export default function CropCalendarPage() {
  const { showToast } = useToast();
  const [crop, setCrop] = useState(CALENDAR_FILTERS.crops[0]);
  const [season, setSeason] = useState(CALENDAR_FILTERS.seasons[0]);
  const [field, setField] = useState(CALENDAR_FILTERS.fields[0]);

  return (
    <AppShell
      title="Crop Calendar"
      subtitle="Plan and track all farming activities across the season"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Crop Calendar" }]}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
          <select value={crop} onChange={(e) => setCrop(e.target.value)} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2 text-sm text-[var(--av-text-primary)]">
            {CALENDAR_FILTERS.crops.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={season} onChange={(e) => setSeason(e.target.value)} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2 text-sm text-[var(--av-text-primary)]">
            {CALENDAR_FILTERS.seasons.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={field} onChange={(e) => setField(e.target.value)} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2 text-sm text-[var(--av-text-primary)]">
            {CALENDAR_FILTERS.fields.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <button
          type="button"
          onClick={() => showToast("Calendar PDF — jald available hoga")}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--av-text-primary)]"
        >
          <Download className="h-4 w-4" /> Download Calendar
        </button>
      </div>

      <DarkCard className="mt-4 overflow-x-auto" delay={1}>
        <h3 className="mb-3 text-sm font-bold text-[var(--av-text-primary)]">Growth Stages & Activities Timeline</h3>
        <div className="min-w-[700px]">
          <div className="mb-2 flex gap-1">
            {MONTHS.map((m) => (
              <div key={m} className="flex-1 text-center text-[10px] font-semibold text-[var(--av-text-muted)]">{m}</div>
            ))}
          </div>
          <div className="mb-4 flex h-8 gap-0.5">
            {GROWTH_STAGES.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-center rounded text-[9px] font-bold text-[#0a0f1a]"
                style={{ flex: s.weeks[1] - s.weeks[0], background: s.color }}
              >
                {s.name}
              </div>
            ))}
          </div>
          {CALENDAR_ACTIVITIES.map((act) => (
            <div key={act.name} className="mb-2 flex items-center gap-2">
              <span className="w-28 shrink-0 text-[10px] text-[var(--av-text-secondary)]">{act.name}</span>
              <div className="relative h-5 flex-1 rounded bg-[var(--av-surface-inset)]">
                <div
                  className="absolute top-0.5 h-4 rounded"
                  style={{
                    left: `${(act.start / 16) * 100}%`,
                    width: `${((act.end - act.start) / 16) * 100}%`,
                    background: act.color,
                    opacity: 0.8,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </DarkCard>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DarkCard hover delay={2}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Upcoming Activities</h3>
            <AppLink href="/crop-calendar" className="text-xs text-[var(--av-accent)]">View All →</AppLink>
          </div>
          <ul className="mt-3 space-y-2">
            {UPCOMING_CALENDAR.map((u) => (
              <li key={u.task} className="flex items-start justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                <div>
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{u.task}</p>
                  <p className="text-[10px] text-[var(--av-text-muted)]">{u.desc}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--av-accent)]/15 px-2 py-0.5 text-[9px] font-bold text-[var(--av-accent)]">{u.status}</span>
              </li>
            ))}
          </ul>
        </DarkCard>

        <DarkCard hover delay={3}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Calendar Summary</h3>
          <div className="mt-3 flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#1f2937" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${CALENDAR_SUMMARY.progress} 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-bold text-[var(--av-text-primary)]">{CALENDAR_SUMMARY.progress}%</span>
            </div>
            <ul className="space-y-1 text-xs text-[var(--av-text-secondary)]">
              <li>Duration: {CALENDAR_SUMMARY.totalDays}</li>
              <li>Passed: {CALENDAR_SUMMARY.daysPassed}</li>
              <li>Remaining: {CALENDAR_SUMMARY.daysRemaining}</li>
              <li>Harvest: {CALENDAR_SUMMARY.harvest}</li>
            </ul>
          </div>
        </DarkCard>

        <DarkCard hover delay={4}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Recommended Inputs</h3>
          <ul className="mt-3 space-y-2">
            {RECOMMENDED_INPUTS.map((r) => (
              <li key={r.item} className="text-xs">
                <span className="font-semibold text-[var(--av-accent)]">{r.type}:</span>{" "}
                <span className="text-[var(--av-text-secondary)]">{r.item}</span>
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Current Stage: Tillering — Important Tips</h3>
          <ul className="mt-3 space-y-2">
            {STAGE_TIPS.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm text-[var(--av-text-secondary)]">
                <span className="text-[var(--av-accent)]">✓</span> {tip}
              </li>
            ))}
          </ul>
        </DarkCard>
        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Calendar Alerts</h3>
          <ul className="mt-3 space-y-2">
            {CALENDAR_ALERTS.map((a) => (
              <li key={a.text} className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-[var(--av-text-secondary)]">
                {a.text} <span className="text-[var(--av-text-muted)]">· {a.date}</span>
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Add Custom Activity", action: () => showToast("Activity add — profile se manage karein") },
          { label: "Set Reminder", action: () => showToast("Reminder set ho gaya ✓") },
          { label: "Share Calendar", action: () => showToast("Calendar share — jald available") },
          { label: "Print Calendar", action: () => showToast("Print — jald available") },
        ].map(({ label, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            className={`inline-flex justify-center gap-1.5 ${AV.btnSecondarySm}`}
          >
            <Calendar className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      <ShellCtaBanner
        title="Need personalized advice?"
        description="Ask our AI Advisor for crop-specific calendar recommendations."
        buttonLabel="Ask AI Advisor"
        href="/field-advisor"
      />
    </AppShell>
  );
}
