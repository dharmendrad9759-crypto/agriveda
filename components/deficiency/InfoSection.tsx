import type { ReactNode } from "react";

interface InfoSectionProps {
  title: string;
  description?: string;
  items: string[];
  icon?: ReactNode;
  accent?: string;
}

export default function InfoSection({ title, description, items, icon, accent = "text-emerald-400" }: InfoSectionProps) {
  const bulletClass = accent.replace("text-", "bg-");

  return (
    <section className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_10px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className={`rounded-2xl border border-white/10 bg-white/10 p-2 ${accent}`}>
          {icon}
        </div>
        <div>
          <h2 className={`text-xl font-semibold ${accent}`}>{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm leading-6 text-slate-300">
            <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${bulletClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
