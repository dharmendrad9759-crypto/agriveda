"use client";

import { useState } from "react";
import { Sprout, ChevronDown, ChevronUp } from "lucide-react";
import type { CommunityQuery } from "@/data/queries";
import AudioPlayerBar from "./AudioPlayerBar";

interface QueryCardProps {
  query: CommunityQuery;
}

export default function QueryCard({ query }: QueryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const fullAnswer = query.expertResponse?.fullAnswer ?? query.expertResponse?.preview ?? "";

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-gray-900">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {query.farmerName.charAt(0)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{query.farmerName}</span>
            <span className="text-xs text-gray-500">• {query.crop}</span>
            {query.isMine && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                You
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400">{query.date}</p>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-700 leading-relaxed dark:text-gray-300">{query.query}</p>

      {query.hasAudio && (
        <div className="mt-3">
          <AudioPlayerBar duration={query.audioDuration} />
        </div>
      )}

      {query.image && (
        <div className="mt-3 overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={query.image}
            alt={`Crop damage - ${query.crop}`}
            className="h-48 w-full object-cover"
          />
        </div>
      )}

      {query.expertResponse && (
        <div className="mt-3 rounded-xl bg-gray-50 p-3 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#006432]">
              <Sprout className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                {query.expertResponse.expertName}
              </p>
              <p className="text-[10px] text-gray-400">{query.expertResponse.date}</p>
            </div>
          </div>
          <p className={`mt-2 text-xs text-gray-600 leading-relaxed dark:text-gray-400 ${expanded ? "" : "line-clamp-3"}`}>
            {fullAnswer}
          </p>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-xs font-bold text-[#2D8A5B]"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                View full answer <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </article>
  );
}
