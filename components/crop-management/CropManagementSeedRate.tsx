import type { CropManagementProfile } from "@/types/crop-management";
import { calculateSeedRequirement } from "@/lib/seedRateCalculator";

interface CropManagementSeedRateProps {
  profile: CropManagementProfile;
}

export default function CropManagementSeedRate({ profile }: CropManagementSeedRateProps) {
  const estimate = calculateSeedRequirement(profile.seedRate, 1);

  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-xl font-bold text-white">Seed Rate</h2>
      <p className="text-sm text-slate-300">{profile.seedRate}</p>
      {estimate && (
        <p className="text-sm text-emerald-300">
          Estimated requirement per acre: {estimate.perAcre} {estimate.unit}
        </p>
      )}
    </section>
  );
}
