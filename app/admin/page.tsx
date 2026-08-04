"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Lock, Loader2, User } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"owner" | "expert">("owner");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/auth", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { authenticated?: boolean }) => {
        if (d.authenticated) router.replace("/admin/home");
      })
      .finally(() => setChecking(false));
  }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "owner" ? { password } : { username, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.replace("/admin/home");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-lg flex-col justify-center px-5 py-14">
      <div className="admin-cine__enter mb-10 text-center">
        <div className="relative mx-auto inline-flex">
          <span className="admin-cine__pulse-ring" aria-hidden />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-white shadow-lg shadow-emerald-600/15">
            <Leaf className="h-8 w-8 text-emerald-600" strokeWidth={1.75} />
          </div>
        </div>
        <h1 className="admin-cine__brand-glow mt-7 font-display text-[clamp(2.2rem,8vw,3.1rem)] font-bold tracking-tight">
          Agriveda
        </h1>
        <p className="mt-3 text-sm font-medium text-emerald-900/55">
          Expert Console · bright desk for farm advisors
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="admin-cine__glass admin-cine__enter-delay rounded-[1.75rem] p-6 shadow-xl shadow-emerald-900/10 sm:p-7"
      >
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-emerald-50/80 p-1 ring-1 ring-emerald-900/8">
          <button
            type="button"
            onClick={() => setMode("owner")}
            className={`rounded-lg py-2 text-xs font-bold transition ${
              mode === "owner"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                : "text-emerald-900/50 hover:text-emerald-900"
            }`}
          >
            Main Owner
          </button>
          <button
            type="button"
            onClick={() => setMode("expert")}
            className={`rounded-lg py-2 text-xs font-bold transition ${
              mode === "expert"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                : "text-emerald-900/50 hover:text-emerald-900"
            }`}
          >
            Expert / Manager
          </button>
        </div>

        {mode === "expert" ? (
          <>
            <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800/70">
              Username
            </label>
            <div className="relative mt-2">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600/50" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-emerald-900/12 bg-white py-3.5 pl-11 pr-3 text-sm text-emerald-950 outline-none ring-emerald-500/30 placeholder:text-emerald-900/30 focus:border-emerald-500/50 focus:ring-2"
                placeholder="expert1"
                required
                autoComplete="username"
              />
            </div>
          </>
        ) : (
          <p className="text-[11px] leading-relaxed text-emerald-900/50">
            Main Owner: Vercel का <span className="font-semibold">ADMIN_PANEL_SECRET</span> password।
            Experts → Experts page से बनाएँ।
          </p>
        )}

        <label className="mt-4 block text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800/70">
          Password
        </label>
        <div className="relative mt-2">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600/50" />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-emerald-900/12 bg-white py-3.5 pl-11 pr-3 text-sm text-emerald-950 outline-none ring-emerald-500/30 focus:border-emerald-500/50 focus:ring-2"
            placeholder="••••••••••••"
            required
          />
        </div>
        {error ? <p className="mt-3 text-xs font-medium text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading || !password || (mode === "expert" && !username)}
          className="admin-cine__btn-primary mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Enter console
        </button>
      </form>
    </div>
  );
}
