"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

const KEY = "agriveda-solution-feedback";

export interface SolutionFeedbackStats {
  helpful: number;
  notHelpful: number;
  comments: { text: string; author: string; at: string }[];
}

type FeedbackStore = Record<string, SolutionFeedbackStats>;

const EMPTY_STATS: SolutionFeedbackStats = { helpful: 0, notHelpful: 0, comments: [] };

export function useSolutionFeedback(solutionId: string) {
  const [stats, setStats] = useState<SolutionFeedbackStats>(EMPTY_STATS);
  const [userVote, setUserVote] = useState<"helpful" | "not_helpful" | null>(null);

  useEffect(() => {
    const store = readStorage<FeedbackStore>(KEY, {});
    const votes = readStorage<Record<string, "helpful" | "not_helpful">>(
      `${KEY}-votes`,
      {}
    );
    setUserVote(votes[solutionId] ?? null);
    setStats(store[solutionId] ?? EMPTY_STATS);
  }, [solutionId]);

  const vote = useCallback(
    (type: "helpful" | "not_helpful") => {
      const votes = readStorage<Record<string, "helpful" | "not_helpful">>(
        `${KEY}-votes`,
        {}
      );
      if (votes[solutionId]) return;

      votes[solutionId] = type;
      writeStorage(`${KEY}-votes`, votes);
      setUserVote(type);

      const store = readStorage<FeedbackStore>(KEY, {});
      const base = store[solutionId] ?? stats;
      const next = {
        ...base,
        helpful: base.helpful + (type === "helpful" ? 1 : 0),
        notHelpful: base.notHelpful + (type === "not_helpful" ? 1 : 0),
      };
      store[solutionId] = next;
      writeStorage(KEY, store);
      setStats(next);
    },
    [solutionId, stats]
  );

  const helpfulPercent =
    stats.helpful + stats.notHelpful > 0
      ? Math.round((stats.helpful / (stats.helpful + stats.notHelpful)) * 100)
      : 0;

  return { stats, userVote, vote, helpfulPercent };
}
