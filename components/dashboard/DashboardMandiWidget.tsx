"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { SkeletonList } from "@/components/design-system";
import { useMandiPrices } from "@/hooks/useMandiPrices";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { AV } from "@/lib/design/tokens";

interface Props {
  limit?: number;
  className?: string;
  compact?: boolean;
}

export default function DashboardMandiWidget({ limit = 5, className = "", compact = false }: Props) {
  const { profile } = useFarmerProfile();
  const { data, loading } = useMandiPrices({
    state: profile.state || "Madhya Pradesh",
    district: profile.district,
  });

  const rows = (data?.rows ?? []).slice(0, limit);
  const sourceLabel = data?.source === "live" ? "Live" : "Sample";

  return (
    <DarkCard hover delay={1} className={compact ? className : `xl:col-span-8 ${className}`}>
      <SectionHeader title={compact ? "Market Prices" : "Mandi Prices (Today)"} action={{ label: "View All", href: "/mandi" }} />
      {!compact && (
        <p className={`mt-1 ${AV.micro}`}>
          {profile.district ? `${profile.district}, ` : ""}
          {profile.state || "Madhya Pradesh"} · {sourceLabel}
          {data?.lastUpdated ? ` · ${data.lastUpdated}` : ""}
        </p>
      )}

      {loading ? (
        <div className="mt-3">
          <SkeletonList count={compact ? 3 : 4} />
        </div>
      ) : compact ? (
        <ul className="mt-3 space-y-2">
          {rows.map((m) => (
            <li key={m.id} className="av-card-inset flex items-center justify-between gap-2 p-2.5">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{m.cropHi || m.crop}</p>
                <p className="text-[10px] text-[var(--av-text-muted)]">₹{m.modal.toLocaleString("en-IN")}/qtl</p>
              </div>
              <span
                className={`shrink-0 text-xs font-bold ${m.change >= 0 ? "text-[var(--av-accent)]" : "text-red-500"}`}
              >
                {m.change >= 0 ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />}
                {m.change > 0 ? "+" : ""}
                {m.change}%
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="av-table">
            <thead>
              <tr>
                <th>Commodity</th>
                <th>Market</th>
                <th>Modal</th>
                <th className="text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td className="font-semibold text-[var(--av-text-primary)]">{m.cropHi || m.crop}</td>
                  <td>{m.mandi}</td>
                  <td className="font-mono">₹{m.modal.toLocaleString("en-IN")}</td>
                  <td
                    className={`text-right font-semibold ${m.change >= 0 ? "text-[var(--av-accent)]" : "text-red-500"}`}
                  >
                    {m.change >= 0 ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />}
                    {m.change > 0 ? "+" : ""}
                    {m.change}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && rows.length === 0 && (
        <p className={`mt-3 text-center ${AV.micro}`}>
          No mandi data — <AppLink href="/mandi">open mandi page</AppLink>
        </p>
      )}
    </DarkCard>
  );
}
