"use client";

import { useEffect } from "react";
import { readStorage } from "@/lib/storage";

const KEY = "agriveda-app-settings";

export default function FieldModeBootstrap() {
  useEffect(() => {
    const settings = readStorage(KEY, { fieldMode: false } as { fieldMode?: boolean });
    if (settings.fieldMode) {
      document.documentElement.setAttribute("data-field-mode", "true");
    } else {
      document.documentElement.removeAttribute("data-field-mode");
    }
  }, []);

  return null;
}
