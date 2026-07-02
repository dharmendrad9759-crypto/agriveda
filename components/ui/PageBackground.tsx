export default function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute top-1/4 -left-40 h-80 w-80 rounded-full bg-lime-200/25 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-teal-100/30 blur-3xl" />
    </div>
  );
}
