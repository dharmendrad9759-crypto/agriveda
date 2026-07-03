interface MetricCardProps {
  label: string;
  value: string;
}

export default function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}
