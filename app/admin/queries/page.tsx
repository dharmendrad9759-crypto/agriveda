"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ImageIcon,
  Loader2,
  MessageSquareText,
  RefreshCw,
  Search,
  Send,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { AdminShell, useAdminSession, type AdminMe } from "@/components/admin/AdminShell";

type AdminQuery = {
  id: string;
  farmerName: string | null;
  farmerPhone: string | null;
  location: string;
  cropName: string;
  cropSlug: string | null;
  queryText: string;
  photoUrl: string | null;
  aiDiagnosis: {
    diseaseName?: string;
    confidence?: number;
    severity?: string;
    riskLevel?: string;
  } | null;
  source: string;
  status: string;
  expertReply: string | null;
  expertName: string | null;
  answeredAt: string | null;
  assignedTo: string | null;
  assignedName: string | null;
  createdAt: string;
};

type ExpertOpt = { id: string; displayName: string; username: string };
type Filter = "all" | "pending" | "answered";

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function initials(name: string | null): string {
  return (name || "K").trim().slice(0, 1).toUpperCase();
}

export default function AdminQueriesPage() {
  const { me, ready, logout } = useAdminSession();
  const [loading, setLoading] = useState(true);
  const [queries, setQueries] = useState<AdminQuery[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [expertName, setExpertName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [inboxSearch, setInboxSearch] = useState("");
  const [experts, setExperts] = useState<ExpertOpt[]>([]);
  const [assignTo, setAssignTo] = useState("");

  const load = useCallback(async (session: AdminMe) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/expert-queries?status=all", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Load failed");
        return;
      }
      const list = (data.queries ?? []) as AdminQuery[];
      setQueries(list);
      setSelectedId((prev) => {
        if (prev && list.some((q) => q.id === prev)) return prev;
        return list[0]?.id ?? null;
      });
      if (!expertName) setExpertName(session.displayName || "Agriveda Expert");

      if (session.permissions.assignQueries || session.permissions.manageExperts) {
        const er = await fetch("/api/admin/experts", { credentials: "include" });
        const ed = await er.json();
        if (er.ok) {
          setExperts(
            ((ed.experts ?? []) as ExpertOpt[]).filter(
              (e) => e.id && (e as { active?: boolean }).active !== false
            )
          );
        }
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [expertName]);

  useEffect(() => {
    if (ready && me) void load(me);
  }, [ready, me, load]);

  const filtered = useMemo(() => {
    let list = queries;
    if (filter === "pending") {
      list = list.filter((q) => q.status === "pending" || q.status === "in_review");
    } else if (filter === "answered") {
      list = list.filter((q) => q.status === "answered");
    }
    const q = inboxSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) =>
      [item.farmerName, item.cropName, item.queryText, item.location, item.farmerPhone]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [queries, filter, inboxSearch]);

  const selected = queries.find((q) => q.id === selectedId) ?? filtered[0] ?? null;

  useEffect(() => {
    if (selected?.expertReply) setReply(selected.expertReply);
    else setReply("");
    setAssignTo(selected?.assignedTo ?? "");
  }, [selected?.id, selected?.expertReply, selected?.assignedTo]);

  const pendingCount = queries.filter(
    (q) => q.status === "pending" || q.status === "in_review"
  ).length;
  const answeredCount = queries.filter((q) => q.status === "answered").length;

  const markInReview = async () => {
    if (!selected || selected.status !== "pending") return;
    await fetch(`/api/admin/expert-queries/${selected.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "in_review" }),
    });
    if (me) await load(me);
  };

  const claim = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/expert-queries/${selected.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim: true }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Claim failed");
      else if (me) await load(me);
    } finally {
      setSaving(false);
    }
  };

  const assign = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/expert-queries/${selected.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: assignTo || null }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Assign failed");
      else if (me) await load(me);
    } finally {
      setSaving(false);
    }
  };

  const sendReply = async () => {
    if (!selected || !reply.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/expert-queries/${selected.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply, expertName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reply failed");
        return;
      }
      if (me) await load(me);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (!ready || !me) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <AdminShell me={me} onLogout={() => void logout()} pendingCount={pendingCount} title="Queries">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="admin-cine__glass space-y-3 rounded-2xl border border-emerald-900/10 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-900/35" />
            <input
              value={inboxSearch}
              onChange={(e) => setInboxSearch(e.target.value)}
              placeholder="Search inbox…"
              className="w-full rounded-xl border border-emerald-900/12 bg-white py-2 pl-8 pr-2 text-[11px] text-emerald-950 outline-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-emerald-50/80 p-1">
            {(
              [
                { id: "pending" as const, label: "Pending", n: pendingCount },
                { id: "answered" as const, label: "Done", n: answeredCount },
                { id: "all" as const, label: "All", n: queries.length },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "rounded-lg px-1 py-2 text-[10px] font-bold",
                  filter === tab.id ? "bg-emerald-500 text-[#052e16]" : "text-emerald-900/50"
                )}
              >
                {tab.label}
                <span className="mt-0.5 block opacity-80">{tab.n}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => me && void load(me)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-900/10 py-2 text-[11px] font-bold text-emerald-900/60"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </button>
          <div className="max-h-[60vh] space-y-1.5 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-xs text-emerald-900/35">कोई सवाल नहीं</p>
            ) : (
              filtered.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedId(q.id)}
                  className={cn(
                    "w-full rounded-xl border px-2.5 py-2.5 text-left",
                    selected?.id === q.id
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-emerald-900/10 bg-white"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-[11px] font-bold text-emerald-700">
                      {initials(q.farmerName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="truncate text-[12px] font-bold text-emerald-950">
                          {q.farmerName || "किसान"}
                        </p>
                        {q.status === "answered" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Clock3 className="h-3.5 w-3.5 text-amber-600" />
                        )}
                      </div>
                      <p className="truncate text-[10px] text-emerald-700/70">{q.cropName}</p>
                      {q.assignedName ? (
                        <p className="truncate text-[10px] text-sky-700/70">→ {q.assignedName}</p>
                      ) : (
                        <p className="text-[10px] text-emerald-900/30">Unassigned</p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <div>
          {error ? (
            <p className="mb-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          ) : null}

          {!selected ? (
            <div className="admin-cine__glass flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-emerald-900/10">
              <MessageSquareText className="h-8 w-8 text-emerald-600/70" />
              <p className="mt-3 text-sm text-emerald-900/45">Inbox से सवाल चुनें</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="font-display text-xl font-bold text-emerald-950">Farmer message</h1>
                <div className="flex flex-wrap gap-2">
                  {selected.status === "pending" ? (
                    <button
                      type="button"
                      onClick={() => void markInReview()}
                      className="rounded-xl border border-amber-400/35 bg-amber-400/10 px-3 py-2 text-[11px] font-bold text-amber-900"
                    >
                      Mark in review
                    </button>
                  ) : null}
                  {!selected.assignedTo || selected.assignedTo !== me.id ? (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void claim()}
                      className="rounded-xl border border-sky-400/35 bg-sky-400/10 px-3 py-2 text-[11px] font-bold text-sky-800"
                    >
                      Claim for me
                    </button>
                  ) : null}
                  <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] font-bold text-emerald-700">
                    {selected.status}
                  </span>
                </div>
              </div>

              {(me.permissions.assignQueries || me.permissions.manageExperts) && (
                <div className="admin-cine__glass flex flex-wrap items-end gap-2 rounded-2xl border border-emerald-900/10 p-3">
                  <div className="min-w-[180px] flex-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-emerald-900/40">
                      Assign expert
                    </label>
                    <select
                      value={assignTo}
                      onChange={(e) => setAssignTo(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-emerald-900/12 bg-white px-3 py-2 text-sm text-emerald-950"
                    >
                      <option value="">— Unassigned —</option>
                      {experts.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.displayName} (@{e.username})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void assign()}
                    className="rounded-xl bg-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-700"
                  >
                    Save assign
                  </button>
                </div>
              )}

              <div className="grid gap-4 lg:grid-cols-2">
                <article className="admin-cine__glass rounded-2xl border border-emerald-900/10 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-600/90">
                    Farmer · {formatWhen(selected.createdAt)}
                  </p>
                  <p className="mt-2 text-sm font-bold text-emerald-950">
                    {selected.farmerName || "किसान"} · {selected.cropName}
                  </p>
                  <p className="text-[11px] text-emerald-900/40">
                    {[
                      selected.farmerPhone ? `+91 ${selected.farmerPhone}` : null,
                      selected.location,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-emerald-900/75">{selected.queryText}</p>
                </article>

                <article className="admin-cine__glass rounded-2xl border border-emerald-900/10 p-4">
                  {selected.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selected.photoUrl}
                      alt="Crop"
                      className="max-h-64 w-full rounded-xl object-cover ring-1 ring-emerald-900/10"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                        const sib = e.currentTarget.nextElementSibling as HTMLElement | null;
                        if (sib) sib.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className={`flex min-h-[160px] flex-col items-center justify-center text-emerald-900/35 ${
                      selected.photoUrl ? "hidden" : ""
                    }`}
                  >
                    <ImageIcon className="h-7 w-7" />
                    <p className="mt-2 text-sm">
                      {selected.photoUrl ? "फोटो लोड नहीं हुई" : "No photo"}
                    </p>
                  </div>
                </article>
              </div>

              {selected.aiDiagnosis ? (
                <div className="admin-cine__glass rounded-2xl border border-emerald-500/25 p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                    <Stethoscope className="h-3.5 w-3.5" /> AI Doctor
                  </p>
                  <p className="mt-1 text-base font-bold text-emerald-950">
                    {selected.aiDiagnosis.diseaseName || "—"}
                  </p>
                </div>
              ) : null}

              <section className="admin-cine__glass rounded-2xl border border-emerald-900/10 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-600/90">
                  Expert reply → किसान (app + WhatsApp/SMS)
                </p>
                <input
                  value={expertName}
                  onChange={(e) => setExpertName(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-emerald-900/12 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none"
                  placeholder="Expert display name"
                />
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={8}
                  className="mt-2 w-full resize-y rounded-xl border border-emerald-900/12 bg-white px-3 py-3 text-sm text-emerald-950 outline-none"
                  placeholder="किसान को साफ़ हिंदी में जवाब…"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    disabled={saving || !reply.trim()}
                    onClick={() => void sendReply()}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-bold text-[#042f1e] disabled:opacity-40"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {selected.status === "answered" ? "Update reply" : "Send to farmer"}
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
