"use client";

import { useCallback, useEffect, useState } from "react";
import type { CommunityQuery } from "@/data/queries";
import { readStorage, writeStorage } from "@/lib/storage";

const KEY = "agriveda-user-queries";

export function useQueryHistory() {
  const [queries, setQueries] = useState<CommunityQuery[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setQueries(readStorage<CommunityQuery[]>(KEY, []));
    setHydrated(true);
  }, []);

  const addQuery = useCallback(
    (input: {
      crop: string;
      cropName: string;
      query: string;
      image?: string;
      farmerName?: string;
      expertResponse?: CommunityQuery["expertResponse"];
    }) => {
      const today = new Date().toLocaleDateString("hi-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const entry: CommunityQuery = {
        id: `user-${Date.now()}`,
        farmerName: input.farmerName || "आप",
        crop: input.cropName,
        date: today,
        query: input.query,
        hasAudio: false,
        audioDuration: "0:00",
        image: input.image,
        isMine: true,
        expertResponse: input.expertResponse ?? {
          expertName: "Agriveda Expert",
          date: "समीक्षा में",
          preview:
            "आपकी query प्राप्त हो गई है। कृषि विशेषज्ञ जल्द जवाब देंगे। तब तक AI Doctor से तुरंत जांच कर सकते हैं।",
        },
      };
      setQueries((prev) => {
        const next = [entry, ...prev];
        writeStorage(KEY, next);
        return next;
      });
      return entry;
    },
    []
  );

  const clearQueries = useCallback(() => {
    writeStorage(KEY, []);
    setQueries([]);
  }, []);

  return { queries, hydrated, addQuery, clearQueries };
}
