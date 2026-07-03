import type { CropStage } from "@/types/crop-management";

interface StageTimelineProps {
  stages: CropStage[];
}

export default function StageTimeline({ stages }: StageTimelineProps) {
  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <div key={stage.title} className="flex gap-4 rounded-[24px] border border-white/10 bg-slate-900/70 p-4">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-semibold text-emerald-300">
              {index + 1}
            </div>
            {index < stages.length - 1 ? <div className="mt-2 h-full w-px bg-white/10" /> : null}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-white">{stage.title}</h3>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                {stage.period}
              </span>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              {stage.keyPoints.map((point) => (
                <li key={point} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
