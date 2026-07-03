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
    }) => {
      const entry: CommunityQuery = {
        id: `user-${Date.now()}`,
        farmerName: input.farmerName || "You",
        crop: input.cropName,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        query: input.query,
        hasAudio: false,
        audioDuration: "0:00",
        image: input.image,
        isMine: true,
        expertResponse: {
          expertName: "Agriveda Expert",
          date: "Pending review",
          preview:
            "आपकी query प्राप्त हो गई है। हमारा कृषि विशेषज्ञ 24–48 घंटे में जवाब देगा। तब तक AI Doctor से तुरंत जांच कर सकते हैं।",
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

  return { queries, hydrated, addQuery };
}
