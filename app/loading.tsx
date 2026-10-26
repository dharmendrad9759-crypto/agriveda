export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-4 py-12 text-center animate-fade-in">
      {/* Brand animated spinner */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping opacity-30" />
        <div className="h-14 w-14 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin dark:border-emerald-400 dark:border-t-transparent" />
        <span className="absolute text-xl" role="img" aria-label="sprout">
          🌱
        </span>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-sm font-black text-emerald-800 dark:text-emerald-300">
          लोड हो रहा है...
        </p>
        <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
          AgriVeda • स्मार्ट किसान सलाहकार
        </p>
      </div>

      {/* Lightweight pulse skeleton blocks */}
      <div className="mt-8 w-full max-w-sm space-y-3 px-2 opacity-60">
        <div className="h-14 w-full animate-pulse rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30" />
        <div className="h-16 w-full animate-pulse rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30" />
      </div>
    </div>
  );
}
