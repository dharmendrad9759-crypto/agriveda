import type { CropManagementProfile } from "@/types/crop-management";
import FuturisticPanel, { DataRow, SciBadge } from "@/components/ui/FuturisticPanel";
import { TrendingUp } from "lucide-react";

interface Props {
  profile: CropManagementProfile;
}

export default function CropManagementMarketInformation({ profile }: Props) {
  const market = profile.marketInformation;

  return (
    <FuturisticPanel
      title="Market Information"
      subtitle="Price outlook · Demand analysis · MSP"
      icon={TrendingUp}
      glow
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <DataRow label="Demand Outlook" value={market.demand} highlight />
          <DataRow label="MSP / Support Price" value={market.msp} />
          <DataRow label="Price Trend" value={market.priceTrend} highlight />
        </div>

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
            Major Mandi / Market Hubs
          </p>
          <div className="flex flex-wrap gap-2">
            {market.majorMarkets.map((m) => (
              <span
                key={m}
                className="rounded-xl border border-cyan-500/20 bg-cyan-500/8 px-3 py-1.5 text-xs font-semibold text-cyan-200"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/8 to-transparent p-4">
          <div className="flex items-center gap-2">
            <SciBadge variant="green">Live</SciBadge>
            <p className="text-xs font-bold text-emerald-300">Market Intelligence</p>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Track real-time mandi rates on the Agriveda Mandi Prices module. Off-season storage
            can yield 20–40% premium for potato and tomato.
          </p>
        </div>
      </div>
    </FuturisticPanel>
  );
}
