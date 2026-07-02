import Link from "next/link";
import { Sprout } from "lucide-react";
import type { CommunityQuery } from "@/data/queries";
import AudioPlayerBar from "./AudioPlayerBar";

interface QueryCardProps {
  query: CommunityQuery;
}

export default function QueryCard({ query }: QueryCardProps) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-sm font-bold text-emerald-700">
            {query.farmerName.charAt(0)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="text-sm font-bold text-gray-900">{query.farmerName}</span>
            <span className="text-xs text-gray-500">• {query.crop}</span>
          </div>
          <p className="text-[11px] text-gray-400">{query.date}</p>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-700 leading-relaxed">{query.query}</p>

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
        <div className="mt-3 rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#006432]">
              <Sprout className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">{query.expertResponse.expertName}</p>
              <p className="text-[10px] text-gray-400">{query.expertResponse.date}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed line-clamp-3">
            {query.expertResponse.preview}
          </p>
          <button type="button" className="mt-2 text-xs font-bold text-[#2D8A5B]">
            View full answer
          </button>
        </div>
      )}
    </article>
  );
}
