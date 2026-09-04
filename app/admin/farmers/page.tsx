"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Sprout,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { AdminShell, useAdminSession } from "@/components/admin/AdminShell";

type FarmerRow = {
  id: string;
  deviceId: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  location: string;
  district: string | null;
  state: string | null;
  pincode: string | null;
  language: string | null;
  createdAt: string;
  profileUpdatedAt: string | null;
  farmUpdatedAt: string | null;
  hasPush: boolean;
  hasProfile: boolean;
  hasFarm: boolean;
  fieldCount: number;
  crops: string[];
  farmAreaAcres: number | null;
  lastLat: number | null;
  lastLon: number | null;
};

function formatWhen(iso: string | null): string {
  if (!iso) return "—";
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

function displayName(row: FarmerRow): string {
  return row.name?.trim() || "अनाम किसान";
}

export default function AdminFarmersPage() {
  const { me, ready, logout } = useAdminSession();
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState<FarmerRow[]>([]);
  const [total, setTotal] = useState(0);
  const [configured, setConfigured] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const canView = me?.permissions.viewAllQueries ?? false;

  const load = useCallback(async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      const res = await fetch(`/api/admin/farmers?${params}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "लोड नहीं हो सका");
        return;
      }
      setFarmers(data.farmers ?? []);
      setTotal(data.total ?? 0);
      setConfigured(Boolean(data.configured));
    } catch {
      setError("नेटवर्क त्रुटि");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready || !canView) return;
    const t = setTimeout(() => void load(search), search ? 300 : 0);
    return () => clearTimeout(t);
  }, [ready, canView, search, load]);

  const stats = useMemo(() => {
    const withProfile = farmers.filter((f) => f.hasProfile).length;
    const withFarm = farmers.filter((f) => f.hasFarm).length;
    const withPush = farmers.filter((f) => f.hasPush).length;
    return { withProfile, withFarm, withPush };
  }, [farmers]);

  if (!ready || !me) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!canView) {
    return (
      <AdminShell me={me} onLogout={() => void logout()} title="Farmers">
        <div className="admin-cine__glass mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-sm font-semibold text-amber-900">
            यह पेज सिर्फ Owner / Manager के लिए है — permission नहीं है।
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell me={me} onLogout={() => void logout()} title="Farmers">
      <div className="admin-cine__enter mx-auto max-w-5xl space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-emerald-950">किसान डेटा</h1>
            <p className="mt-1 text-sm text-emerald-900/55">
              Google लॉगिन + Supabase में सेव हुए किसान — प्रोफाइल और खेत
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load(search)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-bold text-emerald-800"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            रिफ्रेश
          </button>
        </div>

        {!configured ? (
          <div className="admin-cine__glass rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-950">
              Supabase कॉन्फ़िग नहीं है — `.env` में `SUPABASE_SERVICE_ROLE_KEY` सेट करें और
              `schema.sql` + `farmer-cloud-sync.sql` चलाएँ।
            </p>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "कुल किसान", value: total, icon: Users },
            { label: "प्रोफाइल", value: stats.withProfile, icon: Users },
            { label: "खेत सेट", value: stats.withFarm, icon: Sprout },
            { label: "Push ON", value: stats.withPush, icon: MapPin },
          ].map((s) => (
            <div
              key={s.label}
              className="admin-cine__glass rounded-2xl border border-emerald-900/10 p-4"
            >
              <s.icon className="h-4 w-4 text-emerald-600" />
              <p className="mt-2 font-display text-2xl font-bold text-emerald-950">{s.value}</p>
              <p className="text-[11px] font-semibold text-emerald-900/45">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="नाम, फोन, जिला, गाँव, फसल…"
            className="w-full rounded-2xl border border-emerald-900/10 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500/40"
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        ) : farmers.length === 0 ? (
          <div className="admin-cine__glass rounded-2xl border border-emerald-900/10 p-10 text-center">
            <Users className="mx-auto h-8 w-8 text-emerald-600/40" />
            <p className="mt-3 text-sm font-semibold text-emerald-900/60">
              {search ? "कोई किसान नहीं मिला" : "अभी कोई किसान रिकॉर्ड नहीं — लॉगिन के बाद दिखेगा"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {farmers.map((row) => {
              const open = expandedId === row.id;
              return (
                <div
                  key={row.id}
                  className="admin-cine__glass overflow-hidden rounded-2xl border border-emerald-900/10"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(open ? null : row.id)}
                    className="flex w-full items-start gap-3 p-4 text-left"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
                      {displayName(row).slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-emerald-950">{displayName(row)}</p>
                        {row.hasProfile ? (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            प्रोफाइल
                          </span>
                        ) : null}
                        {row.hasFarm ? (
                          <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                            खेत
                          </span>
                        ) : null}
                        {row.hasPush ? (
                          <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold text-violet-800">
                            Push
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-xs text-emerald-900/55">
                        {row.phone || "—"}
                        {row.location ? ` · ${row.location}` : ""}
                      </p>
                      <p className="mt-1 text-[11px] text-emerald-900/40">
                        लॉगिन: {formatWhen(row.createdAt)}
                        {row.crops.length ? ` · ${row.crops.join(", ")}` : ""}
                      </p>
                    </div>
                    {open ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-emerald-900/40" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-emerald-900/40" />
                    )}
                  </button>

                  {open ? (
                    <div className="border-t border-emerald-900/10 bg-emerald-50/40 px-4 py-3 text-xs text-emerald-950">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <p>
                          <span className="font-bold">Email:</span> {row.email || "—"}
                        </p>
                        <p>
                          <span className="font-bold">Device:</span>{" "}
                          <span className="font-mono text-[10px]">{row.deviceId}</span>
                        </p>
                        <p>
                          <span className="font-bold">जिला / राज्य:</span>{" "}
                          {[row.district, row.state].filter(Boolean).join(", ") || "—"}
                        </p>
                        <p>
                          <span className="font-bold">पिनकोड:</span> {row.pincode || "—"}
                        </p>
                        <p>
                          <span className="font-bold">खेत क्षेत्र:</span>{" "}
                          {row.farmAreaAcres ? `${row.farmAreaAcres} एकड़` : "—"}
                        </p>
                        <p>
                          <span className="font-bold">खेत / फसल:</span>{" "}
                          {row.fieldCount
                            ? `${row.fieldCount} खेत — ${row.crops.join(", ") || "—"}`
                            : "—"}
                        </p>
                        <p>
                          <span className="font-bold">प्रोफाइल अपडेट:</span>{" "}
                          {formatWhen(row.profileUpdatedAt)}
                        </p>
                        <p>
                          <span className="font-bold">खेत अपडेट:</span>{" "}
                          {formatWhen(row.farmUpdatedAt)}
                        </p>
                        {row.lastLat != null && row.lastLon != null ? (
                          <p className="sm:col-span-2">
                            <span className="font-bold">आखिरी लोकेशन:</span>{" "}
                            {row.lastLat.toFixed(4)}, {row.lastLon.toFixed(4)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
