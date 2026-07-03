import type { CropManagementProfile } from "@/types/crop-management";

interface CropManagementOverviewProps {
  profile: CropManagementProfile;
}

export default function CropManagementOverview({ profile }: CropManagementOverviewProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-xl font-bold text-white">Overview</h2>
      <p className="text-sm leading-7 text-slate-300">{profile.summary}</p>
      <p className="text-sm leading-7 text-slate-400">{profile.overview}</p>
    </section>
  );
}
