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

const SEED_STATS: FeedbackStore = {
  "paddy-ysb-cta": {
    helpful: 847,
    notHelpful: 83,
    comments: [
      { text: "तीन spray में फर्क दिखा", author: "सुरेश, बुलंदशहर", at: "2025" },
      { text: "साथ में Zinc भी डाला तो और जल्दी ठीक हुआ", author: "महेश, मेरठ", at: "2025" },
    ],
  },
  "tomato-early-blight": {
    helpful: 612,
    notHelpful: 45,
    comments: [
      { text: "Mancozeb + neem oil rotation worked", author: "Ravi, Karnal", at: "2025" },
    ],
  },
};

export function useSolutionFeedback(solutionId: string) {
  const [stats, setStats] = useState<SolutionFeedbackStats>(
    SEED_STATS[solutionId] ?? { helpful: 120, notHelpful: 12, comments: [] }
  );
  const [userVote, setUserVote] = useState<"helpful" | "not_helpful" | null>(null);

  useEffect(() => {
    const store = readStorage<FeedbackStore>(KEY, {});
    const votes = readStorage<Record<string, "helpful" | "not_helpful">>(
      `${KEY}-votes`,
      {}
    );
    setUserVote(votes[solutionId] ?? null);
    if (store[solutionId]) {
      setStats({ ...SEED_STATS[solutionId], ...store[solutionId] });
    } else if (SEED_STATS[solutionId]) {
      setStats(SEED_STATS[solutionId]);
    }
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
