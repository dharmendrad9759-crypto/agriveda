import type { CropManagementProfile } from "@/types/crop-management";

interface CropManagementFAQProps {
  profile: CropManagementProfile;
}

export default function CropManagementFAQ({ profile }: CropManagementFAQProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-xl font-bold text-white">FAQs</h2>
      {profile.faqs.map((faq) => (
        <article key={faq.question} className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <h3 className="font-semibold text-white">{faq.question}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">{faq.answer}</p>
        </article>
      ))}
    </section>
  );
}
