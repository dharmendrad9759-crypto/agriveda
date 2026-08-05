"use client";

import { useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import Badge from "@/components/design-system/Badge";
import { useToast } from "@/components/ui/Toast";
import { useFarmData } from "@/hooks/useFarmData";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cropCatalog } from "@/data/crop-catalog";
import { Tractor, Map, Sprout, Heart, Plus, Bell } from "lucide-react";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { getCropHindiName } from "@/lib/crops/crop-display";

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
  return acres > 0 ? `${acres.toFixed(1)} एकड़` : "—";
}

function ownershipLabel(ownership: string) {
  return ownership === "Owned" ? "अपनी ज़मीन" : "बटाई / किराया";
}

function fieldStatusLabel(status: string) {
  if (status === "Active") return "सक्रिय";
  return status;
}

export default function MyFarmPage() {
  const { showToast } = useToast();
  const { t } = useLocale();
  const { data, stats, addField, addActivity, addNote } = useFarmData();
  const farmAlerts = useDashboardAlerts(4);

  const [showAddField, setShowAddField] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);

  const [fieldName, setFieldName] = useState("");
  const [fieldArea, setFieldArea] = useState("");
  const [fieldCrop, setFieldCrop] = useState("");
  const [fieldCropSlug, setFieldCropSlug] = useState("");
  const [fieldOwnership, setFieldOwnership] = useState<"Owned" | "Leased">("Owned");
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
    if (!fieldName.trim() || !fieldArea.trim()) {
      showToast("खेत का नाम और रकबा भरें", "error");
      return;
    }
    const areaNum = parseFloat(fieldArea);
    if (!Number.isFinite(areaNum) || areaNum <= 0) {
      showToast("सही रकबा (एकड़) भरें", "error");
      return;
    }
    const catalog = cropCatalog.find((c) => c.slug === fieldCropSlug);
    const cropLabel = fieldCrop.trim() || catalog?.name || "";
    if (!cropLabel) {
      showToast("फसल चुनें या लिखें", "error");
      return;
    }
    addField({
      name: fieldName.trim(),
      area: `${areaNum.toFixed(2)} Acre`,
      ownership: fieldOwnership,
      crop: cropLabel,
      cropSlug: fieldCropSlug || undefined,
      status: "Active",
      sowingDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      emoji: catalog?.emoji ?? "🌾",
      health: 78,
      stage: "Active growth",
    });
    setFieldName("");
    setFieldArea("");
    setFieldCrop("");
    setFieldCropSlug("");
    setFieldOwnership("Owned");
    setShowAddField(false);
    showToast("खेत सेव हो गया ✓");
  };

  const farmInsights = [
    { label: "कुल रकबा", value: totalAreaLabel(data.fields), icon: "📐" },
    { label: "सक्रिय खेत", value: `${stats.activeFields}`, icon: "🌾" },
    { label: "फसलें", value: `${stats.cropsGrowing}`, icon: "🌱" },
    { label: "स्वास्थ्य", value: data.fields.length ? `${stats.healthScore}%` : "—", icon: "💚" },
  ];

  const handleAddNote = () => {
    if (!noteTitle.trim() || !noteBody.trim()) {
      showToast("नोट का शीर्षक और विवरण भरें", "error");
      return;
    }
    addNote({ title: noteTitle.trim(), body: noteBody.trim(), pinned: false });
    setNoteTitle("");
    setNoteBody("");
    setShowAddNote(false);
    showToast("नोट सेव हो गया ✓");
  };

  const handleAddActivity = () => {
    if (!activityTask.trim() || !activityField.trim()) {
      showToast("कार्य और खेत का नाम भरें", "error");
      return;
    }
    addActivity({
      task: activityTask.trim(),
      field: activityField.trim(),
      date: activityDate.trim() || "इस हफ्ते",
    });
    setActivityTask("");
    setActivityField("");
    setActivityDate("");
    setShowAddActivity(false);
    showToast("कार्य सेव हो गया ✓");
  };

  return (
    <AppShell
      className="!bg-transparent"
      title={t("myFarm")}
      subtitle={
        data.fields.length
          ? `${stats.totalFields} खेत · ${totalAreaLabel(data.fields)} · स्वास्थ्य ${stats.healthScore}%`
          : "अपना खेत, रकबा और फसल खुद जोड़ें"
      }
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("myFarm") }]}
      actions={
        <AppLink href="/field-advisor" className="av-btn av-btn-sm av-btn-secondary">
          {t("shellFieldAdvisor")}
        </AppLink>
      }
    >
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: t("shellStatFields"), value: `${stats.totalFields}`, icon: Tractor },
          { label: t("shellStatArea"), value: data.fields.length ? totalAreaLabel(data.fields).replace(" एकड़", "ac") : "—", icon: Map },
          { label: t("shellStatCrops"), value: `${stats.cropsGrowing}`, icon: Sprout },
          { label: t("shellStatHealth"), value: data.fields.length ? `${stats.healthScore}` : "—", icon: Heart },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-2 py-2 text-center"
          >
            <Icon className="mx-auto h-3.5 w-3.5 text-[var(--av-accent)]" />
            <p className="mt-1 text-sm font-black text-[var(--av-text-primary)]">{value}</p>
            <p className="text-[8px] font-semibold uppercase tracking-wide text-[var(--av-text-muted)]">{label}</p>
          </div>
        ))}
      </div>

      {data.fields.length === 0 && (
        <div className="relative mt-3 overflow-hidden rounded-[22px] border border-emerald-500/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/jobs/job-my-farm.jpg"
            alt=""
            className="h-40 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/55 to-emerald-800/20" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-[16px] font-bold text-white">अभी कोई खेत नहीं</p>
            <p className="mt-0.5 text-[12px] text-white/85">पहला खेत जोड़ो — खेती शुरू</p>
            <button
              type="button"
              onClick={() => setShowAddField(true)}
              className="av-btn av-btn-sm mt-2 inline-flex gap-1 bg-white text-emerald-900"
            >
              <Plus className="h-3.5 w-3.5" /> पहला खेत जोड़ें
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[var(--av-text-primary)]">{t("shellMyFields")}</h2>
        <button
          type="button"
          onClick={() => setShowAddField((v) => !v)}
          className="av-btn av-btn-sm av-btn-primary inline-flex gap-1"
        >
          <Plus className="h-3.5 w-3.5" /> खेत जोड़ें
        </button>
      </div>

      {showAddField && (
        <DarkCard className="mt-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="खेत का नाम"
              className="av-input text-xs"
            />
            <input
              type="number"
              inputMode="decimal"
              value={fieldArea}
              onChange={(e) => setFieldArea(e.target.value)}
              placeholder="रकबा (एकड़)"
              className="av-input text-xs"
            />
            <select
              value={fieldOwnership}
              onChange={(e) => setFieldOwnership(e.target.value as "Owned" | "Leased")}
              className="av-input text-xs"
            >
              <option value="Owned">अपनी ज़मीन</option>
              <option value="Leased">बटाई / किराया</option>
            </select>
            <input
              value={fieldCrop}
              onChange={(e) => setFieldCrop(e.target.value)}
              placeholder="वैरायटी (वैकल्पिक)"
              className="av-input text-xs"
            />
          </div>
          <p className="mt-2 text-[10px] font-bold text-[var(--av-text-muted)]">फसल चुनें</p>
          <div className="mt-1 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {cropCatalog.slice(0, 12).map((crop) => {
              const hi = getCropHindiName(crop.slug);
              return (
                <button
                  key={crop.slug}
                  type="button"
                  onClick={() => {
                    setFieldCropSlug(crop.slug);
                    if (!fieldCrop.trim()) setFieldCrop(crop.name);
                  }}
                  className={`overflow-hidden rounded-xl border text-center text-[9px] font-bold ${
                    fieldCropSlug === crop.slug
                      ? "border-emerald-500 ring-2 ring-emerald-500/30"
                      : "border-[var(--av-border)]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveCropImage({ slug: crop.slug, name: crop.name })}
                    alt=""
                    className="h-12 w-full object-cover"
                  />
                  <span className="block truncate px-0.5 py-1">{hi || crop.name}</span>
                </button>
              );
            })}
          </div>
          <button type="button" onClick={handleAddField} className="av-btn av-btn-sm av-btn-primary mt-3">
            खेत सेव करें
          </button>
        </DarkCard>
      )}

      <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {data.fields.map((f, i) => {
          const img = resolveCropImage({
            slug: f.cropSlug || "",
            name: f.crop,
          });
          const hi = getCropHindiName(f.cropSlug || "") || f.crop;
          return (
            <DarkCard key={f.id} hover delay={i} className="w-56 shrink-0 !overflow-hidden !p-0">
              <div className="relative h-28 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span
                  className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    f.status === "Active"
                      ? "bg-emerald-500/90 text-white"
                      : "bg-amber-500/90 text-white"
                  }`}
                >
                  {fieldStatusLabel(f.status)}
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{f.name}</p>
                <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-200">
                  {hi}
                </p>
                <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
                  {f.area.replace(/\s*Acre$/i, " एकड़")} · {ownershipLabel(f.ownership)}
                </p>
              </div>
            </DarkCard>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">चल रही फसलों का सारांश</h3>
            <AppLink href="/crop-calendar" className="text-xs text-[var(--av-accent)]">{t("shellViewCropCalendar")} →</AppLink>
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
              <li className="text-xs text-[var(--av-text-muted)]">फसल देखने के लिए पहले खेत जोड़ें।</li>
            )}
          </ul>
        </DarkCard>

        <DarkCard hover delay={2}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">आने वाले कार्य (अगले 7 दिन)</h3>
            <button
              type="button"
              onClick={() => setShowAddActivity((v) => !v)}
              className="text-xs font-semibold text-[var(--av-accent)]"
            >
              + जोड़ें
            </button>
          </div>
          {showAddActivity && (
            <div className="mt-2 space-y-2 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
              <input value={activityTask} onChange={(e) => setActivityTask(e.target.value)} placeholder="कार्य (जैसे — खाद डालना)" className="av-input text-xs" />
              <input value={activityField} onChange={(e) => setActivityField(e.target.value)} placeholder="खेत का नाम" className="av-input text-xs" />
              <input value={activityDate} onChange={(e) => setActivityDate(e.target.value)} placeholder="तारीख (वैकल्पिक)" className="av-input text-xs" />
              <button type="button" onClick={handleAddActivity} className="av-btn av-btn-sm av-btn-primary">
                कार्य सेव करें
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
        <DarkCard hover delay={1} className="border-amber-500/15">
          <div className="flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--av-text-primary)]">
              <Bell className="h-4 w-4 text-amber-400" />
              सक्रिय खेत अलर्ट
            </h3>
            <Badge variant={farmAlerts.length ? "warning" : "success"}>{farmAlerts.length}</Badge>
          </div>
          <ul className="mt-3 space-y-2">
            {farmAlerts.length === 0 ? (
              <li className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-3 text-center text-xs text-emerald-400">
                कोई सक्रिय अलर्ट नहीं
              </li>
            ) : (
              farmAlerts.map((a) => (
                <li key={a.id} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                  <AppLink href={a.actionHref ?? "/alerts"} className="block">
                    <p className="text-xs font-semibold text-[var(--av-text-primary)]">{a.title}</p>
                    <p className="text-[10px] text-[var(--av-text-muted)]">{a.body}</p>
                  </AppLink>
                </li>
              ))
            )}
          </ul>
          <AppLink href="/alerts" className="mt-2 inline-block text-xs font-semibold text-[var(--av-accent)]">
            सभी अलर्ट देखें →
          </AppLink>
        </DarkCard>

        <DarkCard hover delay={2} className="border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">मौसम पूर्वानुमान (Weather)</h3>
          <p className="mt-2 text-xs text-[var(--av-text-muted)]">
            लाइव मौसम, स्प्रे सलाह (Spray) और 7 दिन का पूर्वानुमान —{" "}
            <AppLink href="/weather" className="font-semibold text-[var(--av-accent)]">
              {t("weatherTitle")}
            </AppLink>{" "}
            पर देखें।
          </p>
        </DarkCard>
      </div>

      <DarkCard hover delay={1} className="mt-4 border-emerald-500/10">
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">खेत की झलक</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {farmInsights.map((ins) => (
              <div key={ins.label} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 text-center">
                <span className="text-xl">{ins.icon}</span>
                <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{ins.label}</p>
                <p className="text-sm font-bold text-[var(--av-text-primary)]">{ins.value}</p>
              </div>
            ))}
          </div>
      </DarkCard>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">हाल के खेत रिकॉर्ड</h3>
          <ul className="mt-3 space-y-2">
            {data.activities.length === 0 ? (
              <li className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-3 text-center text-xs text-[var(--av-text-muted)]">
                अभी कोई रिकॉर्ड नहीं — ऊपर कार्य जोड़ें
              </li>
            ) : (
              data.activities.slice(0, 6).map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                  <div>
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${RECORD_COLORS.Activity}`}>कार्य</span>
                    <p className="mt-1 text-xs text-[var(--av-text-primary)]">{r.task}</p>
                    <p className="text-[10px] text-[var(--av-text-muted)]">{r.field}</p>
                  </div>
                  <span className="text-[10px] text-[var(--av-text-muted)]">{r.date}</span>
                </li>
              ))
            )}
          </ul>
        </DarkCard>

        <DarkCard hover delay={2}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">खेत नोट</h3>
            <button
              type="button"
              onClick={() => setShowAddNote((v) => !v)}
              className="text-xs font-semibold text-[var(--av-accent)]"
            >
              + नोट जोड़ें
            </button>
          </div>
          {showAddNote && (
            <div className="mt-2 space-y-2 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
              <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="शीर्षक" className="av-input text-xs" />
              <textarea value={noteBody} onChange={(e) => setNoteBody(e.target.value)} placeholder="नोट का विवरण" rows={2} className="av-input w-full resize-none text-xs" />
              <button type="button" onClick={handleAddNote} className="av-btn av-btn-sm av-btn-primary">
                नोट सेव करें
              </button>
            </div>
          )}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {data.notes.length === 0 ? (
              <p className="text-xs text-[var(--av-text-muted)]">कोई नोट नहीं — नोट जोड़ें से जोड़ें</p>
            ) : (
              data.notes.map((n) => (
                <div key={n.id} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
                  <p className="text-xs font-bold text-[var(--av-text-primary)]">{n.title} {n.pinned && "📌"}</p>
                  <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{n.body}</p>
                  <p className="mt-2 text-[9px] text-[var(--av-text-muted)]">{n.date}</p>
                </div>
              ))
            )}
          </div>
        </DarkCard>
      </div>

      <ShellCtaBanner
        title="खेत के लिए विशेषज्ञ मदद चाहिए?"
        description="एआई खेत सहायक (AI) से बात करें या कृषि विशेषज्ञ से जुड़ें।"
        buttonLabel={t("toolKisanSaathi")}
        href="/kisan-saathi"
      />
    </AppShell>
  );
}
