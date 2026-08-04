"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Shield, UserCheck } from "lucide-react";
import { AdminShell, useAdminSession } from "@/components/admin/AdminShell";
import { cn } from "@/lib/cn";

type ExpertRow = {
  id: string;
  username: string;
  displayName: string;
  role: string;
  canAssign?: boolean;
  canManageExperts?: boolean;
  canViewAll?: boolean;
  active: boolean;
};

export default function AdminExpertsPage() {
  const { me, ready, logout } = useAdminSession();
  const [experts, setExperts] = useState<ExpertRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"expert" | "manager">("expert");
  const [canAssign, setCanAssign] = useState(false);
  const [canViewAll, setCanViewAll] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/experts", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Load failed");
        return;
      }
      setExperts(data.experts ?? []);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/experts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          displayName,
          password,
          role,
          canAssign: role === "manager" ? true : canAssign,
          canViewAll: role === "manager" ? true : canViewAll,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Create failed");
        return;
      }
      setUsername("");
      setDisplayName("");
      setPassword("");
      setCanAssign(false);
      setCanViewAll(false);
      await load();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/experts/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    await load();
  };

  const patchPerm = async (
    id: string,
    patch: { canAssign?: boolean; canViewAll?: boolean }
  ) => {
    await fetch(`/api/admin/experts/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await load();
  };

  if (!ready || !me) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!me.permissions.manageExperts) {
    return (
      <AdminShell me={me} onLogout={() => void logout()} title="Experts">
        <p className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Experts manage करने की permission नहीं — Main Owner से माँगें।
        </p>
      </AdminShell>
    );
  }

  return (
    <AdminShell me={me} onLogout={() => void logout()} title="Experts">
      <div className="mx-auto max-w-4xl space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Experts & permissions</h1>
          <p className="mt-1 text-sm text-white/50">
            High authority (आप) → Expert बनाएँ → permission दें → वे किसान को जवाब भेजें।
          </p>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </p>
        ) : null}

        <form
          onSubmit={onCreate}
          className="admin-cine__glass space-y-3 rounded-2xl border border-white/10 p-4 sm:p-5"
        >
          <p className="flex items-center gap-2 text-sm font-bold text-emerald-300">
            <Plus className="h-4 w-4" /> नया Expert / Manager
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username (login)"
              className="rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400/40"
            />
            <input
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              className="rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400/40"
            />
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8)"
              className="rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400/40"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "expert" | "manager")}
              className="rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-sm text-white outline-none"
            >
              <option value="expert">Expert — जवाब भेजें</option>
              <option value="manager">Manager — assign + सब देखें</option>
            </select>
          </div>
          {role === "expert" ? (
            <div className="flex flex-wrap gap-4 text-xs text-white/70">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={canAssign}
                  onChange={(e) => setCanAssign(e.target.checked)}
                />
                Assign tickets कर सके
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={canViewAll}
                  onChange={(e) => setCanViewAll(e.target.checked)}
                />
                सारे queries देख सके
              </label>
            </div>
          ) : null}
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-[#042f1e] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create & grant access"}
          </button>
        </form>

        <div className="space-y-2">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          ) : experts.length === 0 ? (
            <p className="text-sm text-white/40">अभी कोई expert नहीं।</p>
          ) : (
            experts.map((ex) => (
              <div
                key={ex.id}
                className={cn(
                  "admin-cine__glass rounded-2xl border p-4",
                  ex.active ? "border-white/10" : "border-white/5 opacity-60"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-bold text-white">
                      <UserCheck className="h-4 w-4 text-emerald-400" />
                      {ex.displayName}
                      <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white/50">
                        {ex.role}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-white/40">@{ex.username}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold text-emerald-200/70">
                      {ex.canAssign ? (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5">Assign</span>
                      ) : null}
                      {ex.canViewAll ? (
                        <span className="rounded-full bg-sky-500/15 px-2 py-0.5">View all</span>
                      ) : null}
                      {ex.canManageExperts ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5">
                          <Shield className="h-3 w-3" /> Manage
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ex.role === "expert" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void patchPerm(ex.id, { canAssign: !ex.canAssign })}
                          className="rounded-lg border border-white/10 px-2 py-1 text-[10px] font-bold text-white/70"
                        >
                          {ex.canAssign ? "Revoke assign" : "Grant assign"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void patchPerm(ex.id, { canViewAll: !ex.canViewAll })}
                          className="rounded-lg border border-white/10 px-2 py-1 text-[10px] font-bold text-white/70"
                        >
                          {ex.canViewAll ? "Revoke view-all" : "Grant view-all"}
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void toggleActive(ex.id, !ex.active)}
                      className={cn(
                        "rounded-lg px-2 py-1 text-[10px] font-bold",
                        ex.active
                          ? "border border-red-400/30 text-red-300"
                          : "border border-emerald-400/30 text-emerald-300"
                      )}
                    >
                      {ex.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}
