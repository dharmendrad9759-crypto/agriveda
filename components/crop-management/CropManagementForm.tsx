import type { CropManagementProfile } from "@/types/crop-management";

interface CropManagementFormProps {
  profile: CropManagementProfile;
}

export default function CropManagementForm({ profile }: CropManagementFormProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-xl font-bold text-white">Crop Profile</h2>
      <p className="text-sm text-slate-300">
        {profile.name} data is loaded from the catalog. Editing is not enabled in this build.
      </p>
    </section>
  );
}
