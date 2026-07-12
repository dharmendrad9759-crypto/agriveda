"use client";

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  segments,
  centerLabel,
  centerValue,
  size = 120,
}: {
  segments: DonutSegment[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;
  let angle = -90;

  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const sweep = pct * 360;
    const start = angle;
    angle += sweep;
    const startRad = (start * Math.PI) / 180;
    const endRad = ((start + sweep) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const large = sweep > 180 ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
    return { ...seg, d };
  });

  return (
    <div className="flex w-full max-w-full flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden>
        {arcs.map((a) => (
          <path key={a.label} d={a.d} fill="none" stroke={a.color} strokeWidth="14" strokeLinecap="round" />
        ))}
        {centerValue && (
          <>
            <text x={cx} y={cy - 4} textAnchor="middle" className="fill-[var(--av-text-primary)] text-[14px] font-bold">
              {centerValue}
            </text>
            {centerLabel && (
              <text x={cx} y={cy + 12} textAnchor="middle" className="fill-[var(--av-text-muted)] text-[9px]">
                {centerLabel}
              </text>
            )}
          </>
        )}
      </svg>
      <ul className="grid w-full grid-cols-2 gap-x-3 gap-y-1.5 text-xs sm:block sm:w-auto sm:space-y-1.5">
        {segments.map((s) => (
          <li key={s.label} className="flex min-w-0 items-center gap-2 text-[var(--av-text-secondary)]">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.label} ({Math.round((s.value / total) * 100)}%)
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sparkline({ data, color = "#10b981", width = 64, height = 24 }: { data: number[]; color?: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  });
  return (
    <svg width={width} height={height} className="overflow-visible" aria-hidden>
      <path d={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function LineChart({
  labels,
  series,
  height = 160,
}: {
  labels: string[];
  series: { name: string; data: number[]; color: string }[];
  height?: number;
}) {
  const all = series.flatMap((s) => s.data);
  const min = Math.min(...all) * 0.98;
  const max = Math.max(...all) * 1.02;
  const range = max - min || 1;
  const w = Math.max(labels.length * 48, 280);
  const pad = 24;

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <svg viewBox={`0 0 ${w} ${height + 32}`} className="min-w-full" style={{ minWidth: w }}>
        {series.map((s) => {
          const points = s.data.map((v, i) => {
            const x = pad + (i / (s.data.length - 1)) * (w - pad * 2);
            const y = pad + (1 - (v - min) / range) * (height - pad * 2);
            return { x, y, v };
          });
          const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
          return (
            <g key={s.name}>
              <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" />
              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="3" fill={s.color} />
                  <text x={p.x} y={p.y - 8} textAnchor="middle" className="fill-[var(--av-text-secondary)] text-[8px]">
                    {p.v.toLocaleString("en-IN")}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
        {labels.map((l, i) => {
          const x = pad + (i / (labels.length - 1)) * (w - pad * 2);
          return (
            <text key={l} x={x} y={height + 20} textAnchor="middle" className="fill-[var(--av-text-muted)] text-[9px]">
              {l}
            </text>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-[var(--av-text-secondary)]">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function GaugeChart({ value, max = 100, label }: { value: number; max?: number; label: string }) {
  const pct = Math.min(value / max, 1);
  const angle = -90 + pct * 180;
  const r = 50;
  const cx = 60;
  const cy = 55;
  const rad = (angle * Math.PI) / 180;
  const nx = cx + r * Math.cos(rad);
  const ny = cy + r * Math.sin(rad);

  return (
    <div className="text-center">
      <svg width="120" height="70" viewBox="0 0 120 70" aria-hidden>
        <path d="M 10 55 A 50 50 0 0 1 110 55" fill="none" stroke="var(--av-border)" strokeWidth="8" strokeLinecap="round" />
        <path
          d="M 10 55 A 50 50 0 0 1 110 55"
          fill="none"
          stroke="var(--av-accent)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${pct * 157} 157`}
        />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--av-accent)" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="4" fill="var(--av-accent)" />
      </svg>
      <p className="text-sm font-bold text-[var(--av-text-primary)]">{label}</p>
    </div>
  );
}
