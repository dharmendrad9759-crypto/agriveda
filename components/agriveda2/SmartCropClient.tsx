"use client";

import { useMemo } from "react";
import Link from "next/link";
import { TrendingUp, AlertTriangle, IndianRupee } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { rankCropsForFarmer } from "@/lib/agriveda2/smartCropEngine";

export default function SmartCropClient() {
  const { profile } = useFarmerProfile();

  const ranks = useMemo(
    () =>
      rankCropsForFarmer({
        district: profile.district,
        state: profile.state,
        waterIndex: profile.state?.toLowerCase().includes("rajasthan") ? "low" : "medium",
        limit: 5,
      }),
    [profile.district, profile.state]
  );

  const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

  return (
    <div className="space-y-4">
      <GlassCard className="p-4 text-xs theme-text-muted">
        <p className="font-bold theme-text-primary">Verified North India data (2024-25)</p>
        <p className="mt-1">
          MSP · net profit range · soil + water fit — {profile.district || "your district"}
        </p>
      </GlassCard>

      {ranks.map((crop, i) => (
        <GlassCard key={crop.slug} neon={i === 0} className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-lg font-black theme-text-primary">
                {medals[i]} Rank {crop.rank}: {crop.emoji} {crop.name}
              </p>
              <p className="mt-1 text-sm font-bold text-emerald-600">
                💰 {crop.netProfitRange}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${
                crop.soilMatch === "Perfect"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              {crop.soilMatch}
            </span>
          </div>

          <ul className="mt-3 space-y-1 text-xs theme-text-muted">
            <li className="flex items-center gap-1">
              <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
              Yield: {crop.avgYield} · {crop.avgPrice}
            </li>
            <li className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              Mandi demand: {crop.marketDemand} ({crop.mandiTrend})
            </li>
            <li className="flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              Risk: {crop.riskLabel}
            </li>
          </ul>

          <Link
            href={`/crop-details/${crop.slug}`}
            className="mt-3 inline-block text-xs font-bold text-emerald-600"
          >
            Crop guide →
          </Link>
        </GlassCard>
      ))}
    </div>
  );
}
