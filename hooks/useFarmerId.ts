"use client";

import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

const FARMER_ID_KEY = "agriveda-farmer-id";

export function useFarmerId(): string {
  const [farmerId, setFarmerId] = useState("");

  useEffect(() => {
    let id = readStorage<string | null>(FARMER_ID_KEY, null);
    if (!id) {
      id = crypto.randomUUID();
      writeStorage(FARMER_ID_KEY, id);
    }
    setFarmerId(id);
  }, []);

  return farmerId;
}
