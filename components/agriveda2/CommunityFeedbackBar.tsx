"use client";

import Link from "next/link";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useSolutionFeedback } from "@/hooks/useSolutionFeedback";

export default function CommunityFeedbackBar({ solutionId }: { solutionId: string }) {
  const { stats, userVote, vote, helpfulPercent } = useSolutionFeedback(solutionId);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black/20">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => vote("helpful")}
          disabled={!!userVote}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold ${
            userVote === "helpful"
              ? "bg-emerald-600 text-white"
              : "border border-emerald-300 bg-emerald-50 text-emerald-800"
          }`}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          काम आया
        </button>
        <button
          type="button"
          onClick={() => vote("not_helpful")}
          disabled={!!userVote}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold ${
            userVote === "not_helpful"
              ? "bg-red-600 text-white"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          काम नहीं आया
        </button>
        <Link
          href="/ask-query"
          className="inline-flex items-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold theme-text-muted"
        >
          💬 बताओ क्या हुआ
        </Link>
      </div>
      <p className="mt-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
        👥 {stats.helpful.toLocaleString("en-IN")} किसानों ने यह solution try किया · ⭐ {helpfulPercent}%
        को फ़ायदा
      </p>
      {stats.comments.length > 0 && (
        <ul className="mt-2 space-y-1.5 border-t border-gray-100 pt-2 dark:border-white/10">
          {stats.comments.map((c, i) => (
            <li key={i} className="text-[11px] italic text-gray-600 dark:text-gray-400">
              &quot;{c.text}&quot; — {c.author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
