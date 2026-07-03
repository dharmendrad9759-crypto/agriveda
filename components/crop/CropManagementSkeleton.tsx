export default function CropManagementSkeleton() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_25%),linear-gradient(135deg,_#020617,_#0f172a_50%,_#020617)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-52 animate-pulse rounded-[32px] border border-white/10 bg-slate-900/80" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-[24px] border border-white/10 bg-slate-900/70" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[24px] border border-white/10 bg-slate-900/70" />
          ))}
        </div>
      </div>
    </main>
  );
}
