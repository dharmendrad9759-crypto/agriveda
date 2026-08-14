"use client";

import { useEffect } from "react";
import { initFarmerDb, migrateLocalStorageToFarmerDb } from "@/lib/farmerDb";

export default function SqliteBootstrap() {
  useEffect(() => {
    void initFarmerDb().then(() => migrateLocalStorageToFarmerDb());
  }, []);
  return null;
}
