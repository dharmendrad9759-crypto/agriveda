export default function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-[100px]" />
      <div className="absolute top-1/3 -left-48 h-96 w-96 rounded-full bg-cyan-500/6 blur-[80px]" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-green-600/5 blur-[90px]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,136,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
