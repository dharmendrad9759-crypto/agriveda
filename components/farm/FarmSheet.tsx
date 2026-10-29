"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

// Tracks open sheets so only the topmost one reacts to Escape.
const sheetStack: number[] = [];
let nextSheetId = 0;

interface FarmSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  size?: "md" | "lg";
  level?: number;
}

/**
 * Shared bottom-sheet / dialog shell for farm actions.
 * Keeps every farm form visually consistent and animated on low-end phones.
 */
export default function FarmSheet({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  size = "md",
  level = 1000,
}: FarmSheetProps) {
  const reduced = useReducedMotion();
  const sheetId = useRef<number | null>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    if (sheetId.current === null) sheetId.current = nextSheetId++;
    const id = sheetId.current;
    sheetStack.push(id);
    return () => {
      const index = sheetStack.lastIndexOf(id);
      if (index >= 0) sheetStack.splice(index, 1);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (sheetStack[sheetStack.length - 1] !== sheetId.current) return;
      event.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-4"
          style={{ zIndex: level }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.button
            type="button"
            aria-label="बंद करें"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[3px]"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION.fast }}
          />

          <motion.div
            className={cn(
              "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-2xl sm:rounded-3xl",
              size === "lg" ? "sm:max-w-lg" : "sm:max-w-md"
            )}
            initial={reduced ? false : { opacity: 0, y: 48, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.99 }}
            transition={{ duration: MOTION.normal, ease: EASE_OUT }}
          >
            <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-[var(--av-border)] sm:hidden" />

            <header className="flex items-start gap-3 border-b border-[var(--av-border-subtle)] px-4 pb-3 pt-3 sm:px-5">
              {icon ? (
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-700 dark:text-emerald-300">
                  {icon}
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-semibold leading-tight text-[var(--av-text-primary)]">
                  {title}
                </h2>
                {subtitle ? (
                  <p className="mt-0.5 text-[11px] leading-snug text-[var(--av-text-muted)]">
                    {subtitle}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--av-text-muted)] transition hover:bg-[var(--av-surface-inset)] hover:text-[var(--av-text-primary)] active:scale-95"
                aria-label="बंद करें"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
