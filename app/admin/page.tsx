"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/auth", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { authenticated?: boolean }) => {
        if (d.authenticated) router.replace("/admin/queries");
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
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.replace("/admin/queries");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07140f]">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07140f] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.22),transparent_50%),radial-gradient(ellipse_at_90%_80%,rgba(5,150,105,0.12),transparent_45%)]"
      />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10">
            <ShieldCheck className="h-7 w-7 text-emerald-400" />
          </div>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400/90">
            Agriveda Control
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Expert Admin
          </h1>
          <p className="mt-2 text-sm text-emerald-100/55">
            किसान सवालों का जवाब देने वाला सुरक्षित पैनल
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        >
          <label className="block text-xs font-semibold text-emerald-100/70">
            Admin password
          </label>
          <div className="relative mt-2">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/60" />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-white outline-none ring-emerald-500/40 placeholder:text-white/30 focus:border-emerald-500/40 focus:ring-2"
              placeholder="••••••••••••"
              required
            />
          </div>
          {error ? <p className="mt-3 text-xs font-medium text-red-300">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || !password}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-[#042f1e] transition hover:bg-emerald-400 disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Enter console
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-white/35">
          यह पेज किसानों के ऐप में नहीं दिखता — सिर्फ आपकी टीम के लिए
        </p>
      </div>
    </div>
  );
}
