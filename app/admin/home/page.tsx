"use client";

import Link from "next/link";
import { Loader2, MessageSquareText, Users, CheckCircle2, Clock3 } from "lucide-react";
import { AdminShell, useAdminSession } from "@/components/admin/AdminShell";
import { useEffect, useState } from "react";

export default function AdminHomePage() {
  const { me, ready, logout } = useAdminSession();
  const [stats, setStats] = useState({ pending: 0, answered: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    fetch("/api/admin/expert-queries?status=all", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setStats({
          pending: d.counts?.pending ?? 0,
          answered: d.counts?.answered ?? 0,
          total: d.counts?.total ?? 0,
        });
      })
      .finally(() => setLoading(false));
  }, [ready]);

  if (!ready || !me) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <AdminShell me={me} onLogout={() => void logout()} pendingCount={stats.pending} title="Home">
      <div className="admin-cine__enter mx-auto max-w-4xl space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Namaste, {me.displayName}
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {me.role === "owner" || me.role === "admin"
              ? "आप Main Owner हैं — Experts को permission दें, tickets assign करें।"
              : me.role === "manager"
                ? "Manager — tickets assign कर सकते हैं और जवाब भेज सकते हैं।"
                : "Expert — अपने assigned / unclaimed सवालों का जवाब किसान तक भेजें।"}
          </p>
        </div>

        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Pending", value: stats.pending, icon: Clock3, color: "text-amber-300" },
              { label: "Answered", value: stats.answered, icon: CheckCircle2, color: "text-emerald-300" },
              { label: "Visible", value: stats.total, icon: MessageSquareText, color: "text-sky-300" },
            ].map((s) => (
              <div
                key={s.label}
                className="admin-cine__glass rounded-2xl border border-white/10 p-4"
              >
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <p className="mt-3 font-display text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs font-semibold text-white/45">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/queries"
            className="admin-cine__glass rounded-2xl border border-emerald-500/25 p-5 transition hover:border-emerald-400/50"
          >
            <MessageSquareText className="h-5 w-5 text-emerald-400" />
            <p className="mt-3 text-sm font-bold text-white">Queries inbox</p>
            <p className="mt-1 text-xs text-white/45">किसान के सवाल देखें → जवाब भेजें (WhatsApp/SMS/ऐप)</p>
          </Link>
          {me.permissions.manageExperts || me.permissions.assignQueries ? (
            <Link
              href="/admin/experts"
              className="admin-cine__glass rounded-2xl border border-emerald-500/25 p-5 transition hover:border-emerald-400/50"
            >
              <Users className="h-5 w-5 text-emerald-400" />
              <p className="mt-3 text-sm font-bold text-white">Experts & permissions</p>
              <p className="mt-1 text-xs text-white/45">
                नए expert बनाएँ, assign/view permissions ऑन करें
              </p>
            </Link>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}
