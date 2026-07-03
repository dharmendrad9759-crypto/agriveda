import type { CropManagementProfile } from "@/types/crop-management";

interface CropManagementClimateProps {
  profile: CropManagementProfile;
}

export default function CropManagementClimate({ profile }: CropManagementClimateProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-xl font-bold text-white">Climate</h2>
      <p className="text-sm leading-7 text-slate-300">{profile.climate}</p>
    </section>
  );
}
