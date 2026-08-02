"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Bold,
  CheckCircle2,
  Clock3,
  Home,
  ImageIcon,
  Italic,
  Leaf,
  Link2,
  List,
  Loader2,
  LogOut,
  Menu,
  MessageSquareText,
  RefreshCw,
  Search,
  Send,
  Settings,
  Sparkles,
  Stethoscope,
  Underline,
  Users,
  X,
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
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function initials(name: string | null): string {
  const n = (name || "K").trim();
  return n.slice(0, 1).toUpperCase();
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inboxSearch, setInboxSearch] = useState("");

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
      {/* Top bar — video mock */}
      <header className="admin-cine__enter sticky top-0 z-40 border-b border-white/8 bg-[#0b0f0e]/75 backdrop-blur-2xl">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/5 hover:text-white"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-4 w-4 lg:hidden" /> : <Menu className="h-4 w-4" />}
            <Menu className="hidden h-4 w-4 lg:block" />
          </button>

          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-400" strokeWidth={2.25} />
            <span className="font-display text-base font-bold tracking-tight text-emerald-400 sm:text-lg">
              Agriveda
            </span>
            <span className="hidden rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 sm:inline">
              Expert
            </span>
          </div>

          <div className="mx-auto hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
              <input
                value={inboxSearch}
                onChange={(e) => setInboxSearch(e.target.value)}
                placeholder="Expert Console"
                className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/35 focus:border-emerald-500/40"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={load}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/5 hover:text-white"
              aria-label="Refresh"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </button>
            <button
              type="button"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/5 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {pendingCount > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {pendingCount > 9 ? "9+" : pendingCount}
                </span>
              ) : null}
            </button>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-bold text-emerald-300">
                A
              </span>
              <span className="hidden text-xs font-semibold text-white/80 sm:inline">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100dvh-3.5rem)]">
        {/* Sidebar — video mock */}
        <aside
          className={cn(
            "admin-cine__panel admin-cine__enter-delay z-30 flex w-[280px] shrink-0 flex-col border-r border-white/8 transition-transform duration-300",
            "fixed inset-y-14 left-0 lg:static lg:inset-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-[72px]"
          )}
        >
          <div className={cn("border-b border-white/8 p-4", !sidebarOpen && "lg:px-2")}>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/35 bg-emerald-500/10">
                <Leaf className="h-4 w-4 text-emerald-400" />
              </span>
              <div className={cn(sidebarOpen ? "block" : "lg:hidden")}>
                <p className="text-sm font-bold text-emerald-400">Agriveda</p>
                <p className="text-[10px] text-white/40">Inbox · Expert desk</p>
              </div>
            </div>
            <div className={cn("relative mt-3", !sidebarOpen && "lg:hidden")}>
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
              <input
                value={inboxSearch}
                onChange={(e) => setInboxSearch(e.target.value)}
                placeholder="Search inbox…"
                className="w-full rounded-xl border border-white/10 bg-black/30 py-2 pl-8 pr-2 text-[11px] text-white outline-none placeholder:text-white/35 focus:border-emerald-500/40"
              />
            </div>
          </div>

          <nav className={cn("space-y-1 p-3", !sidebarOpen && "lg:px-2")}>
            <p
              className={cn(
                "mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30",
                !sidebarOpen && "lg:hidden"
              )}
            >
              Menu
            </p>
            {[
              { icon: Home, label: "Home", active: false },
              { icon: MessageSquareText, label: "Queries", active: true },
              { icon: Users, label: "Experts", active: false },
              { icon: Settings, label: "Settings", active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[13px] font-medium",
                  item.active
                    ? "admin-cine__neon border bg-emerald-500/10 text-emerald-300"
                    : "border border-transparent text-white/50"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className={cn(!sidebarOpen && "lg:hidden")}>{item.label}</span>
                {item.active && sidebarOpen ? (
                  <span className="ml-auto rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    {pendingCount}
                  </span>
                ) : null}
              </div>
            ))}
          </nav>

          <div className={cn("px-3 pb-2", !sidebarOpen && "lg:hidden")}>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-black/35 p-1 ring-1 ring-white/5">
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
                    "rounded-lg px-1 py-2 text-[10px] font-bold transition",
                    filter === tab.id
                      ? "bg-emerald-500 text-[#052e16]"
                      : "text-white/50 hover:text-white"
                  )}
                >
                  {tab.label}
                  <span className="mt-0.5 block opacity-80">{tab.n}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className={cn(
              "min-h-0 flex-1 space-y-1.5 overflow-y-auto px-3 pb-3",
              !sidebarOpen && "lg:hidden"
            )}
          >
            {filtered.length === 0 ? (
              <p className="px-2 py-10 text-center text-xs text-white/35">कोई सवाल नहीं</p>
            ) : (
              filtered.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(q.id);
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={cn(
                    "w-full rounded-xl border px-2.5 py-2.5 text-left transition",
                    selected?.id === q.id
                      ? "admin-cine__neon border bg-emerald-500/10"
                      : "border-white/6 bg-black/20 hover:border-emerald-500/25"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[11px] font-bold text-emerald-300">
                      {initials(q.farmerName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="truncate text-[12px] font-bold text-white">
                          {q.farmerName || "किसान"}
                        </p>
                        {q.status === "answered" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        ) : (
                          <Clock3 className="h-3.5 w-3.5 shrink-0 text-amber-300" />
                        )}
                      </div>
                      <p className="truncate text-[10px] text-emerald-300/70">{q.cropName}</p>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/45">
                        {q.queryText}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="mt-auto border-t border-white/8 p-3">
            <button
              type="button"
              onClick={logout}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[13px] font-medium text-red-300/80 transition hover:bg-red-500/10",
                !sidebarOpen && "lg:justify-center"
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className={cn(!sidebarOpen && "lg:hidden")}>Logout</span>
            </button>
          </div>
        </aside>

        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        {/* Main workspace */}
        <main className="admin-cine__enter-delay-2 min-w-0 flex-1 px-3 py-4 sm:px-5 lg:px-7">
          {error ? (
            <p className="mb-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          ) : null}

          {!selected ? (
            <div className="admin-cine__panel flex min-h-[60vh] flex-col items-center justify-center rounded-2xl">
              <MessageSquareText className="h-8 w-8 text-emerald-400/70" />
              <p className="mt-3 text-sm text-white/45">बाईं ओर से farmer message चुनें</p>
            </div>
          ) : (
            <div className="mx-auto max-w-6xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-display text-xl font-bold tracking-[0.04em] text-white sm:text-2xl">
                  FARMER MESSAGE
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  {selected.status === "pending" ? (
                    <button
                      type="button"
                      onClick={markInReview}
                      className="rounded-xl border border-amber-400/35 bg-amber-400/10 px-3 py-2 text-[11px] font-bold text-amber-100"
                    >
                      Mark in review
                    </button>
                  ) : null}
                  <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] font-bold text-emerald-300">
                    {selected.status}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <article className="admin-cine__panel rounded-2xl p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-400/90">
                      Farmer&apos;s Message
                    </p>
                    <p className="text-[10px] text-white/35">{formatWhen(selected.createdAt)}</p>
                  </div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-300">
                      {initials(selected.farmerName)}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {selected.farmerName || "किसान"} · {selected.cropName}
                      </p>
                      <p className="text-[11px] text-white/40">
                        {[
                          selected.farmerPhone ? `+91 ${selected.farmerPhone}` : null,
                          selected.location,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "Location नहीं दी"}
                      </p>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                    {selected.queryText}
                  </p>
                  {selected.source === "ai-doctor" ? (
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-emerald-300/70">
                      Via AI Doctor
                    </p>
                  ) : null}
                </article>

                <article className="admin-cine__panel rounded-2xl p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-400/90">
                      {selected.photoUrl ? "Photo Evidence" : "Your Expert Reply"}
                    </p>
                    {selected.answeredAt ? (
                      <p className="text-[10px] text-white/35">{formatWhen(selected.answeredAt)}</p>
                    ) : null}
                  </div>

                  {selected.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selected.photoUrl}
                      alt="Farmer crop"
                      className="max-h-64 w-full rounded-xl object-cover ring-1 ring-white/10"
                    />
                  ) : selected.expertReply ? (
                    <div className="flex gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-[#052e16]">
                        {initials(selected.expertName || expertName)}
                      </span>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/70">
                        {selected.expertReply}
                      </p>
                    </div>
                  ) : (
                    <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                      <ImageIcon className="h-7 w-7 text-white/25" />
                      <p className="mt-2 text-sm text-white/35">No photo · reply नीचे लिखें</p>
                    </div>
                  )}

                  {selected.photoUrl && selected.expertReply ? (
                    <div className="mt-4 border-t border-white/8 pt-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-white/35">
                        Previous reply
                      </p>
                      <p className="line-clamp-4 text-xs leading-relaxed text-white/55">
                        {selected.expertReply}
                      </p>
                    </div>
                  ) : null}
                </article>
              </div>

              {selected.aiDiagnosis ? (
                <div className="admin-cine__panel admin-cine__neon rounded-2xl p-4">
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
                </div>
              ) : null}

              {/* Reply composer — video mock */}
              <section className="admin-cine__panel rounded-2xl p-4 sm:p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-400/90">
                  Your Expert Reply
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-1 rounded-xl border border-white/8 bg-black/25 p-1.5">
                  <span className="mr-1 rounded-lg bg-white/5 px-2 py-1 text-[10px] font-semibold text-white/50">
                    Hindi / EN
                  </span>
                  {[Bold, Italic, Underline, Link2, List, ImageIcon].map((Icon, i) => (
                    <span
                      key={i}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/40"
                      aria-hidden
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  ))}
                </div>

                <input
                  value={expertName}
                  onChange={(e) => setExpertName(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-500/45"
                  placeholder="Expert display name"
                />

                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={8}
                  className="admin-cine__neon mt-2 w-full resize-y rounded-xl border bg-black/40 px-3 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-white/30 focus:border-emerald-400/60"
                  placeholder="Type your comments… किसान को साफ़ हिंदी में जवाब लिखें"
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] text-white/35">
                    Reply farmer app में दिखेगा · clear Hindi लिखें
                  </p>
                  <button
                    type="button"
                    disabled={saving || !reply.trim()}
                    onClick={sendReply}
                    className="admin-cine__btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <Sparkles className="h-3.5 w-3.5 opacity-80" />
                      </>
                    )}
                    {selected.status === "answered" ? "Update reply" : "Send"}
                  </button>
                </div>
              </section>

              <footer className="flex flex-wrap items-center justify-between gap-2 pb-4 text-[10px] text-white/30">
                <p>Agriveda Expert Console · Admin Message</p>
                <p>Copyright © {new Date().getFullYear()} Agriveda</p>
              </footer>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
