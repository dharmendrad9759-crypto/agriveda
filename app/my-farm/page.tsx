"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import { useToast } from "@/components/ui/Toast";
import {
  FARM_STATS,
  FARM_FIELDS,
  FARM_CROPS,
  FARM_INSIGHTS,
  FARM_RECORDS,
  FARM_NOTES,
} from "@/data/mock/farm";
import { Tractor, Map, Sprout, ListTodo, Heart, Plus } from "lucide-react";
import { DASHBOARD_ACTIVITIES } from "@/data/mock/dashboard";

const RECORD_COLORS: Record<string, string> = {
  Fertilizer: "bg-emerald-500/20 text-emerald-400",
  Pesticide: "bg-sky-500/20 text-sky-400",
  Irrigation: "bg-blue-500/20 text-blue-400",
  Activity: "bg-amber-500/20 text-amber-400",
};

export default function MyFarmPage() {
  const { showToast } = useToast();
  return (
    <AppShell
      title="My Farm"
      subtitle="Manage your fields, crops, activities and track farm progress"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Farm" }]}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard icon={Tractor} label="Total Fields" value={`${FARM_STATS.totalFields} Active`} action={{ label: "View All", href: "/my-farm" }} />
        <StatCard icon={Map} label="Total Area" value={FARM_STATS.totalArea} action={{ label: "View Details", href: "/my-farm" }} />
        <StatCard icon={Sprout} label="Crops Growing" value={`${FARM_STATS.cropsGrowing} Current`} action={{ label: "View Crops", href: "/crops" }} />
        <StatCard icon={ListTodo} label="Upcoming Tasks" value={`${FARM_STATS.upcomingTasks} This Week`} action={{ label: "View Tasks", href: "/crop-calendar" }} />
        <StatCard icon={Heart} label="Farm Health" value={`${FARM_STATS.healthScore}/100`} sub="Very Good" action={{ label: "Improve Now", href: "/field-advisor" }} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[var(--av-text-primary)]">My Fields</h2>
        <AppLink
          href="/profile"
          onClick={() => showToast("Profile se naya field add karein")}
          className="av-btn av-btn-sm av-btn-primary inline-flex gap-1"
        >
          <Plus className="h-3.5 w-3.5" /> Add Field
        </AppLink>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {FARM_FIELDS.map((f, i) => (
          <DarkCard key={f.id} hover delay={i} className="w-56 shrink-0">
            <div className="flex h-24 items-center justify-center rounded-lg bg-[var(--av-surface-inset)] text-4xl">{f.emoji}</div>
            <p className="mt-2 text-xs font-bold text-[var(--av-text-primary)]">{f.name}</p>
            <p className="text-[10px] text-[var(--av-text-muted)]">{f.area} · {f.ownership}</p>
            <p className="text-[10px] text-[var(--av-text-secondary)]">{f.crop}</p>
            <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${f.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
              {f.status}
            </span>
          </DarkCard>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Current Crops Overview</h3>
            <AppLink href="/crop-calendar" className="text-xs text-[var(--av-accent)]">Crop Calendar →</AppLink>
          </div>
          <ul className="mt-3 space-y-2">
            {FARM_CROPS.map((c) => (
              <li key={c.name} className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                <div>
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{c.name} ({c.variety})</p>
                  <p className="text-[10px] text-[var(--av-text-muted)]">{c.field} · {c.stage}</p>
                </div>
                <div className="text-right">
                  <div className="relative mx-auto h-10 w-10">
                    <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#1f2937" strokeWidth="3" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${c.progress} 100`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[var(--av-text-primary)]">{c.progress}%</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </DarkCard>

        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Upcoming Activities (Next 7 Days)</h3>
          <ul className="mt-3 space-y-2">
            {DASHBOARD_ACTIVITIES.map((a) => (
              <li key={a.id} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                <p className="text-xs font-semibold text-[var(--av-text-primary)]">{a.task}</p>
                <p className="text-[10px] text-[var(--av-text-muted)]">{a.field}</p>
                <p className="text-[10px] font-medium text-[var(--av-accent)]">{a.date}</p>
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Farm Insights</h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {FARM_INSIGHTS.map((ins) => (
              <div key={ins.label} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 text-center">
                <span className="text-xl">{ins.icon}</span>
                <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{ins.label}</p>
                <p className="text-sm font-bold text-[var(--av-text-primary)]">{ins.value}</p>
              </div>
            ))}
          </div>
        </DarkCard>

        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Weather Forecast</h3>
          <p className="mt-2 text-2xl font-bold text-[var(--av-text-primary)]">32°C <span className="text-sm font-normal text-[var(--av-text-secondary)]">Partly Cloudy</span></p>
          <p className="text-xs text-[var(--av-text-muted)]">Humidity 62% · Wind 14 km/h · Rain 20%</p>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {["Thu", "Fri", "Sat", "Sun", "Mon"].map((d, i) => (
              <div key={d} className="shrink-0 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-center text-[10px]">
                <p className="text-[var(--av-text-muted)]">{d}</p>
                <p className="text-lg">🌤</p>
                <p className="font-semibold text-[var(--av-text-primary)]">{33 - i}°/{24 + i}°</p>
              </div>
            ))}
          </div>
        </DarkCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Recent Farm Records</h3>
          <ul className="mt-3 space-y-2">
            {FARM_RECORDS.map((r) => (
              <li key={r.desc} className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                <div>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${RECORD_COLORS[r.type]}`}>{r.type}</span>
                  <p className="mt-1 text-xs text-[var(--av-text-primary)]">{r.desc}</p>
                  <p className="text-[10px] text-[var(--av-text-muted)]">{r.detail}</p>
                </div>
                <span className="text-[10px] text-[var(--av-text-muted)]">{r.date}</span>
              </li>
            ))}
          </ul>
        </DarkCard>

        <DarkCard hover delay={2}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Farm Notes</h3>
            <button
              type="button"
              onClick={() => showToast("Note save — profile se manage karein")}
              className="text-xs font-semibold text-[var(--av-accent)]"
            >
              + Add Note
            </button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {FARM_NOTES.map((n) => (
              <div key={n.title} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{n.title} {n.pinned && "📌"}</p>
                <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{n.body}</p>
                <p className="mt-2 text-[9px] text-[var(--av-text-muted)]">{n.date}</p>
              </div>
            ))}
          </div>
        </DarkCard>
      </div>

      <ShellCtaBanner
        title="Need Expert Help for Your Farm?"
        description="Chat with our AI Farm Assistant or connect with agriculture experts."
        buttonLabel="Ask AI Farm Assistant"
        href="/kisan-saathi"
      />
    </AppShell>
  );
}
