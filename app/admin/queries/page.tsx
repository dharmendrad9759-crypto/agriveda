"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  ImageIcon,
  Leaf,
  Loader2,
  LogOut,
  MessageSquareText,
  RefreshCw,
  Send,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/cn";

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
    treatments?: string[];
    visualObservations?: string;
  } | null;
  source: string;
  status: string;
  expertReply: string | null;
  expertName: string | null;
  answeredAt: string | null;
  createdAt: string;
};

type Filter = "all" | "pending" | "answered";

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString("hi-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminQueriesPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [queries, setQueries] = useState<AdminQuery[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [expertName, setExpertName] = useState("Agriveda Expert");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const auth = await fetch("/api/admin/auth", { credentials: "include" }).then((r) =>
        r.json()
      );
      if (!auth.authenticated) {
        router.replace("/admin");
        return;
      }
      setReady(true);
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
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === "pending") {
      return queries.filter((q) => q.status === "pending" || q.status === "in_review");
    }
    if (filter === "answered") return queries.filter((q) => q.status === "answered");
    return queries;
  }, [queries, filter]);

  const selected = queries.find((q) => q.id === selectedId) ?? filtered[0] ?? null;

  useEffect(() => {
    if (selected?.expertReply) setReply(selected.expertReply);
    else setReply("");
  }, [selected?.id, selected?.expertReply]);

  const pendingCount = queries.filter(
    (q) => q.status === "pending" || q.status === "in_review"
  ).length;
  const answeredCount = queries.filter((q) => q.status === "answered").length;

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE", credentials: "include" });
    router.replace("/admin");
  };

  const markInReview = async () => {
    if (!selected || selected.status !== "pending") return;
    await fetch(`/api/admin/expert-queries/${selected.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "in_review" }),
    });
    await load();
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
      await load();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (!ready && loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh]">
      <header className="admin-cine__enter sticky top-0 z-30 border-b border-white/10 bg-[#040c09]/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/35 bg-emerald-500/10 shadow-[0_0_32px_-8px_rgba(52,211,153,0.55)]">
              <Leaf className="h-5 w-5 text-emerald-300" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/90">
                Agriveda · Expert Console
              </p>
              <h1 className="admin-cine__brand-glow truncate font-display text-lg font-bold tracking-tight sm:text-xl">
                Query Inbox
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-100">
                {pendingCount} pending
              </span>
              <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-100">
                {answeredCount} done
              </span>
            </div>
            <button
              type="button"
              onClick={load}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-emerald-100/85 transition hover:border-emerald-400/30 hover:bg-emerald-500/10"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-red-200/80 transition hover:border-red-400/30 hover:bg-red-500/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[340px_1fr]">
        <aside className="admin-cine__glass admin-cine__enter-delay rounded-[1.6rem] p-3">
          <div className="mb-3 grid grid-cols-3 gap-1.5 rounded-2xl bg-black/30 p-1 ring-1 ring-white/5">
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
                  "rounded-xl px-2 py-2.5 text-[11px] font-bold transition",
                  filter === tab.id
                    ? "bg-emerald-400 text-[#042f1e] shadow-[0_8px_24px_-10px_rgba(52,211,153,0.8)]"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                )}
              >
                {tab.label} ({tab.n})
              </button>
            ))}
          </div>

          <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <p className="px-2 py-12 text-center text-sm text-white/40">
                {filter === "pending" ? "कोई pending सवाल नहीं" : "अभी कोई सवाल नहीं"}
              </p>
            ) : (
              filtered.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedId(q.id)}
                  style={{ animationDelay: `${Math.min(i, 8) * 0.04}s` }}
                  className={cn(
                    "admin-cine__enter w-full rounded-2xl border px-3 py-3 text-left transition",
                    selected?.id === q.id
                      ? "border-emerald-400/45 bg-emerald-500/12 shadow-[0_0_36px_-16px_rgba(52,211,153,0.65)]"
                      : "border-white/8 bg-black/25 hover:border-emerald-400/25 hover:bg-white/[0.04]"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-bold text-white">
                      {q.farmerName || "किसान"} · {q.cropName}
                    </p>
                    {q.status === "answered" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <Clock3 className="h-4 w-4 shrink-0 text-amber-300" />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-white/50">
                    {q.queryText}
                  </p>
                  <p className="mt-2 text-[10px] font-medium text-white/35">
                    {formatWhen(q.createdAt)}
                    {q.source === "ai-doctor" ? " · AI Doctor" : ""}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="admin-cine__glass admin-cine__enter-delay-2 rounded-[1.6rem] p-4 sm:p-6">
          {error ? (
            <p className="mb-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          ) : null}

          {!selected ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
              <div className="relative mb-2">
                <span className="admin-cine__pulse-ring" aria-hidden />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10">
                  <MessageSquareText className="h-7 w-7 text-emerald-300/80" />
                </div>
              </div>
              <p className="mt-4 text-sm text-white/45">बाईं ओर से सवाल चुनें</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {selected.farmerName || "किसान"} · {selected.cropName}
                  </h2>
                  <p className="mt-1 text-xs text-white/45">
                    {[selected.farmerPhone ? `+91 ${selected.farmerPhone}` : null, selected.location]
                      .filter(Boolean)
                      .join(" · ") || "Location नहीं दी"}
                  </p>
                  <p className="mt-1 text-[11px] text-white/35">
                    {formatWhen(selected.createdAt)} · {selected.status}
                  </p>
                </div>
                {selected.status === "pending" ? (
                  <button
                    type="button"
                    onClick={markInReview}
                    className="rounded-xl border border-amber-400/35 bg-amber-400/10 px-3 py-2 text-[11px] font-bold text-amber-100 transition hover:bg-amber-400/20"
                  >
                    Mark in review
                  </button>
                ) : null}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-inner">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-300/85">
                    Farmer message
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/80">
                    {selected.queryText}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-inner">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-300/85">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Photo
                  </p>
                  {selected.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selected.photoUrl}
                      alt="Farmer crop"
                      className="max-h-64 w-full rounded-xl object-cover ring-1 ring-white/10"
                    />
                  ) : (
                    <p className="py-8 text-center text-sm text-white/35">No photo</p>
                  )}
                </div>
              </div>

              {selected.aiDiagnosis ? (
                <div className="rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/10 to-transparent p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-300">
                    <Stethoscope className="h-3.5 w-3.5" />
                    AI Doctor diagnosis
                  </p>
                  <p className="mt-2 text-base font-bold text-white">
                    {selected.aiDiagnosis.diseaseName || "—"}
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    {[
                      selected.aiDiagnosis.confidence != null
                        ? `${selected.aiDiagnosis.confidence}% confidence`
                        : null,
                      selected.aiDiagnosis.severity,
                      selected.aiDiagnosis.riskLevel,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {selected.aiDiagnosis.visualObservations ? (
                    <p className="mt-2 text-xs leading-relaxed text-white/55">
                      {selected.aiDiagnosis.visualObservations}
                    </p>
                  ) : null}
                  {selected.aiDiagnosis.treatments?.length ? (
                    <ul className="mt-2 space-y-1 text-xs text-white/55">
                      {selected.aiDiagnosis.treatments.slice(0, 4).map((t) => (
                        <li key={t}>• {t}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-300/85">
                  Your expert reply
                </p>
                <input
                  value={expertName}
                  onChange={(e) => setExpertName(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none ring-emerald-500/30 placeholder:text-white/30 focus:border-emerald-400/45 focus:ring-2"
                  placeholder="Expert display name"
                />
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={8}
                  className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm leading-relaxed text-white outline-none ring-emerald-500/30 placeholder:text-white/30 focus:border-emerald-400/45 focus:ring-2"
                  placeholder="किसान को साफ़ हिंदी में जवाब लिखें — दवा, डोज़, सावधानी…"
                />
                <button
                  type="button"
                  disabled={saving || !reply.trim()}
                  onClick={sendReply}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#042f1e] shadow-[0_12px_40px_-12px_rgba(52,211,153,0.75)] transition hover:bg-emerald-300 disabled:opacity-40"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {selected.status === "answered" ? "Update reply" : "Send reply to farmer"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
