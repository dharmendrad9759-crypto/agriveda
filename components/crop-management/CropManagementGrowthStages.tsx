import type { CropManagementProfile } from "@/types/crop-management";
import StageTimeline from "@/components/crop/StageTimeline";

interface CropManagementGrowthStagesProps {
  profile: CropManagementProfile;
}

export default function CropManagementGrowthStages({ profile }: CropManagementGrowthStagesProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-xl font-bold text-white">Growth Stages</h2>
      <StageTimeline stages={profile.growthStages} />
    </section>
  );
}
