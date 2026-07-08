export default function PageBackground({ premium = false }: { premium?: boolean }) {
  if (premium) {
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url(/images/premium/home-bg.png)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/70 to-emerald-950/90" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(251,191,36,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[100px] dark:bg-emerald-500/8" />
      <div className="absolute top-1/3 -left-48 h-96 w-96 rounded-full bg-cyan-500/8 blur-[80px] dark:bg-cyan-500/6" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-green-600/8 blur-[90px] dark:bg-green-600/5" />
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
