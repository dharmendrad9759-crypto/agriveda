export default function RootLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="पेज खुल रहा है"
      className="mx-auto w-full max-w-lg px-3 py-4"
    >
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-100">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-emerald-600" />
      </div>
      <div className="mt-4 h-24 animate-pulse rounded-2xl bg-emerald-950/5" />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="h-20 animate-pulse rounded-2xl bg-emerald-950/5" />
        <div className="h-20 animate-pulse rounded-2xl bg-emerald-950/5" />
      </div>
    </div>
  );
}
