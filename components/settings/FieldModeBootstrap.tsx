"use client";

import { useEffect } from "react";
import { readStorage } from "@/lib/storage";

const KEY = "agriveda-app-settings";

export default function FieldModeBootstrap() {
  useEffect(() => {
    const settings = readStorage(KEY, { fieldMode: false } as { fieldMode?: boolean });
    document.documentElement.toggleAttribute("data-field-mode", Boolean(settings.fieldMode));
  }, []);

  return null;
}
