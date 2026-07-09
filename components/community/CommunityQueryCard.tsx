"use client";

import { useState } from "react";
import { Sprout, ChevronDown, ChevronUp } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import type { CommunityQuery } from "@/data/queries";
import AudioPlayerBar from "@/components/query/AudioPlayerBar";
import { AV } from "@/lib/design/tokens";

interface CommunityQueryCardProps {
  query: CommunityQuery;
}

export default function CommunityQueryCard({ query }: CommunityQueryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const fullAnswer = query.expertResponse?.fullAnswer ?? query.expertResponse?.preview ?? "";
  const pending = query.expertResponse?.date === "Pending review";

  return (
    <DarkCard className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--av-accent)]/15">
          <span className="text-sm font-bold text-[var(--av-accent)]">
            {query.farmerName.charAt(0)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="text-sm font-bold text-[var(--av-text-primary)]">{query.farmerName}</span>
            <span className="text-xs text-[var(--av-text-muted)]">• {query.crop}</span>
            {query.isMine && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                You
              </span>
            )}
            {pending && (
              <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-500">
                Unanswered
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--av-text-muted)]">{query.date}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[var(--av-text-secondary)]">{query.query}</p>

      {query.hasAudio && (
        <div className="mt-3">
          <AudioPlayerBar duration={query.audioDuration} />
        </div>
      )}

      {query.image && (
        <div className="mt-3 overflow-hidden rounded-xl border border-[var(--av-border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={query.image} alt={`Crop - ${query.crop}`} className="h-40 w-full object-cover" />
        </div>
      )}

      {query.expertResponse && (
        <div className="mt-3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--av-accent)]">
              <Sprout className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--av-text-primary)]">{query.expertResponse.expertName}</p>
              <p className="text-[10px] text-[var(--av-text-muted)]">{query.expertResponse.date}</p>
            </div>
          </div>
          <p className={`mt-2 text-xs leading-relaxed text-[var(--av-text-secondary)] ${expanded ? "" : "line-clamp-3"}`}>
            {fullAnswer}
          </p>
          {fullAnswer.length > 120 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className={`mt-2 inline-flex items-center gap-1 ${AV.micro} font-bold text-[var(--av-accent)]`}
            >
              {expanded ? (
                <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
              ) : (
                <>View full answer <ChevronDown className="h-3.5 w-3.5" /></>
              )}
            </button>
          )}
        </div>
      )}
    </DarkCard>
  );
}
