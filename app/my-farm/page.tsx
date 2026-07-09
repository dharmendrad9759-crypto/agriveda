"use client";

import { useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import { useToast } from "@/components/ui/Toast";
import { useFarmData } from "@/hooks/useFarmData";
import {
  FARM_INSIGHTS,
  FARM_RECORDS,
} from "@/data/mock/farm";
import { Tractor, Map, Sprout, ListTodo, Heart, Plus } from "lucide-react";

const RECORD_COLORS: Record<string, string> = {
  Fertilizer: "bg-emerald-500/20 text-emerald-400",
  Pesticide: "bg-sky-500/20 text-sky-400",
  Irrigation: "bg-blue-500/20 text-blue-400",
  Activity: "bg-amber-500/20 text-amber-400",
};

function totalAreaLabel(fields: { area: string }[]) {
  const acres = fields.reduce((sum, f) => {
    const match = f.area.match(/([\d.]+)/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0);
  return acres > 0 ? `${acres.toFixed(1)} Acre` : "—";
}

export default function MyFarmPage() {
  const { showToast } = useToast();
  const { data, stats, addField, addActivity, addNote } = useFarmData();

  const [showAddField, setShowAddField] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);

  const [fieldName, setFieldName] = useState("");
  const [fieldArea, setFieldArea] = useState("");
  const [fieldCrop, setFieldCrop] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [activityTask, setActivityTask] = useState("");
  const [activityField, setActivityField] = useState("");
  const [activityDate, setActivityDate] = useState("");

  const activeCrops = data.fields
    .filter((f) => f.status === "Active")
    .map((f) => {
      const match = f.crop.match(/^([^(]+)(?:\(([^)]+)\))?/);
      return {
        name: match?.[1]?.trim() ?? f.crop,
        variety: match?.[2]?.trim() ?? "—",
        field: f.name.split(" - ")[1] ?? f.name,
        stage: f.stage,
        progress: f.health ?? 75,
      };
    });

  const handleAddField = () => {
    if (!fieldName.trim() || !fieldArea.trim() || !fieldCrop.trim()) {
      showToast("Field name, area aur crop bharein", "error");
      return;
    }
    addField({
      name: fieldName.trim(),
      area: fieldArea.trim(),
      ownership: "Owned",
      crop: fieldCrop.trim(),
      status: "Active",
      sowingDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      emoji: "🌾",
      health: 78,
      stage: "Active growth",
    });
    setFieldName("");
    setFieldArea("");
    setFieldCrop("");
    setShowAddField(false);
    showToast("Field saved ✓");
  };

  const handleAddNote = () => {
    if (!noteTitle.trim() || !noteBody.trim()) {
      showToast("Note title aur detail bharein", "error");
      return;
    }
    addNote({ title: noteTitle.trim(), body: noteBody.trim(), pinned: false });
    setNoteTitle("");
    setNoteBody("");
    setShowAddNote(false);
    showToast("Note saved ✓");
  };

  const handleAddActivity = () => {
    if (!activityTask.trim() || !activityField.trim()) {
      showToast("Task aur field bharein", "error");
      return;
    }
    addActivity({
      task: activityTask.trim(),
      field: activityField.trim(),
      date: activityDate.trim() || "This week",
    });
    setActivityTask("");
    setActivityField("");
    setActivityDate("");
    setShowAddActivity(false);
    showToast("Activity saved ✓");
  };

  const healthLabel = stats.healthScore >= 80 ? "Very Good" : stats.healthScore >= 65 ? "Good" : "Watch";

  return (
    <AppShell
      title="My Farm"
      subtitle="Manage your fields, crops, activities and track farm progress"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Farm" }]}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard icon={Tractor} label="Total Fields" value={`${stats.totalFields} Active`} action={{ label: "View All", href: "/my-farm" }} />
        <StatCard icon={Map} label="Total Area" value={totalAreaLabel(data.fields)} action={{ label: "View Details", href: "/my-farm" }} />
        <StatCard icon={Sprout} label="Crops Growing" value={`${stats.cropsGrowing} Current`} action={{ label: "View Crops", href: "/crops" }} />
        <StatCard icon={ListTodo} label="Upcoming Tasks" value={`${stats.upcomingTasks} This Week`} action={{ label: "View Tasks", href: "/crop-calendar" }} />
        <StatCard icon={Heart} label="Farm Health" value={`${stats.healthScore}/100`} sub={healthLabel} action={{ label: "Improve Now", href: "/field-advisor" }} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[var(--av-text-primary)]">My Fields</h2>
        <button
          type="button"
          onClick={() => setShowAddField((v) => !v)}
          className="av-btn av-btn-sm av-btn-primary inline-flex gap-1"
        >
          <Plus className="h-3.5 w-3.5" /> Add Field
        </button>
      </div>

      {showAddField && (
        <DarkCard className="mt-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <input
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Field name"
              className="av-input text-xs"
            />
            <input
              value={fieldArea}
              onChange={(e) => setFieldArea(e.target.value)}
              placeholder="Area (e.g. 2.5 Acre)"
              className="av-input text-xs"
            />
            <input
              value={fieldCrop}
              onChange={(e) => setFieldCrop(e.target.value)}
              placeholder="Crop (e.g. Paddy PB 1121)"
              className="av-input text-xs"
            />
          </div>
          <button type="button" onClick={handleAddField} className="av-btn av-btn-sm av-btn-primary mt-2">
            Save Field
          </button>
        </DarkCard>
      )}

      <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {data.fields.map((f, i) => (
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
            {activeCrops.length > 0 ? (
              activeCrops.map((c) => (
                <li key={`${c.name}-${c.field}`} className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
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
              ))
            ) : (
              <li className="text-xs text-[var(--av-text-muted)]">Add a field to see crops here.</li>
            )}
          </ul>
        </DarkCard>

        <DarkCard hover delay={2}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Upcoming Activities (Next 7 Days)</h3>
            <button
              type="button"
              onClick={() => setShowAddActivity((v) => !v)}
              className="text-xs font-semibold text-[var(--av-accent)]"
            >
              + Add
            </button>
          </div>
          {showAddActivity && (
            <div className="mt-2 space-y-2 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
              <input value={activityTask} onChange={(e) => setActivityTask(e.target.value)} placeholder="Task" className="av-input text-xs" />
              <input value={activityField} onChange={(e) => setActivityField(e.target.value)} placeholder="Field" className="av-input text-xs" />
              <input value={activityDate} onChange={(e) => setActivityDate(e.target.value)} placeholder="Date (optional)" className="av-input text-xs" />
              <button type="button" onClick={handleAddActivity} className="av-btn av-btn-sm av-btn-primary">
                Save Activity
              </button>
            </div>
          )}
          <ul className="mt-3 space-y-2">
            {data.activities.slice(0, 6).map((a) => (
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
          <p className="mt-2 text-xs text-[var(--av-text-muted)]">
            Live weather ke liye{" "}
            <AppLink href="/weather" className="font-semibold text-[var(--av-accent)]">
              Weather page
            </AppLink>{" "}
            dekhein.
          </p>
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
              onClick={() => setShowAddNote((v) => !v)}
              className="text-xs font-semibold text-[var(--av-accent)]"
            >
              + Add Note
            </button>
          </div>
          {showAddNote && (
            <div className="mt-2 space-y-2 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
              <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Title" className="av-input text-xs" />
              <textarea value={noteBody} onChange={(e) => setNoteBody(e.target.value)} placeholder="Note detail" rows={2} className="av-input w-full resize-none text-xs" />
              <button type="button" onClick={handleAddNote} className="av-btn av-btn-sm av-btn-primary">
                Save Note
              </button>
            </div>
          )}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {data.notes.map((n) => (
              <div key={n.id} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
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
