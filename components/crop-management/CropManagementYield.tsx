import type { CropManagementProfile } from "@/types/crop-management";
import FuturisticPanel from "@/components/ui/FuturisticPanel";
import { BarChart3 } from "lucide-react";

interface Props {
  profile: CropManagementProfile;
}

export default function CropManagementYield({ profile }: Props) {
  return (
    <FuturisticPanel
      title="Expected Yield"
      subtitle="Benchmark under optimal management"
      icon={BarChart3}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 ring-1 ring-emerald-500/30">
          <span className="text-2xl">📊</span>
        </div>
        <div>
          <p className="text-2xl font-black text-white">{profile.yield}</p>
          <p className="mt-0.5 text-xs text-emerald-400/70">
            Achievable with balanced nutrition, timely irrigation & IPM
          </p>
        </div>
      </div>
    </FuturisticPanel>
  );
}
