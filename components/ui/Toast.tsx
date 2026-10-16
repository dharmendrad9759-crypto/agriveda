"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { randomId } from "@/lib/randomId";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = randomId();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((cur) => (cur?.id === id ? null : cur));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="pointer-events-none fixed bottom-20 left-0 right-0 z-[100] flex justify-center px-4 md:bottom-6">
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto max-w-sm rounded-full px-4 py-2 text-xs font-black shadow-xl ring-1 transition-all ${
              toast.type === "success"
                ? "border-emerald-500/40 bg-emerald-700 text-white ring-emerald-400/30"
                : toast.type === "error"
                  ? "border-rose-500/40 bg-rose-700 text-white ring-rose-400/30"
                  : "border-gray-200 bg-white text-gray-900 ring-black/10"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
