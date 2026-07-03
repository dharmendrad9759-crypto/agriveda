import type { CropManagementProfile } from "@/types/crop-management";

interface CropManagementInterculturalOperationsProps {
  profile: CropManagementProfile;
}

export default function CropManagementInterculturalOperations({
  profile,
}: CropManagementInterculturalOperationsProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-xl font-bold text-white">Intercultural Operations</h2>
      <ul className="space-y-2 text-sm text-slate-300">
        {profile.interculturalOperations.map((item) => (
          <li key={item} className="rounded-xl border border-white/5 bg-slate-950/40 px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
