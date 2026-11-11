"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { notoSansDevanagari, notoSerifDevanagari } from "@/lib/fonts";
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
  footer?: ReactNode;
  size?: "md" | "lg";
  level?: number;
}

/**
 * Shared bottom-sheet / dialog shell for farm actions.
 * Mobile-first: slides up as a bottom sheet on phones, centered on desktop.
 */
export default function FarmSheet({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
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

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ zIndex: level }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.button
            type="button"
            aria-label="बंद करें"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-[3px]"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION.fast }}
          />

          <motion.div
            className={cn(
              notoSansDevanagari.className,
              "relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[32px] border border-[var(--av-border)] bg-[var(--av-surface)] text-left shadow-[0_24px_64px_-16px_rgba(6,45,28,0.45)] sm:max-h-[85dvh] sm:rounded-[28px]",
              footer
                ? "pb-0"
                : "pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-0",
              size === "lg" ? "max-w-lg" : "max-w-md"
            )}
            initial={reduced ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: MOTION.normal, ease: EASE_OUT }}
          >
            <div className="mx-auto mt-2.5 mb-0.5 h-1 w-10 rounded-full bg-[var(--av-border)] sm:hidden" />

            <header className="flex items-start gap-3 px-5 pb-3 pt-2 sm:pt-4">
              {icon ? (
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/12 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200">
                  {icon}
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <h2
                  className={cn(
                    notoSerifDevanagari.className,
                    "text-balance text-[1.2rem] font-bold leading-snug tracking-tight text-[var(--av-text-primary)]"
                  )}
                >
                  {title}
                </h2>
                {subtitle ? (
                  <p className="text-pretty mt-0.5 text-[13px] font-medium leading-snug text-[var(--av-text-muted)]">
                    {subtitle}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--av-text-muted)] transition-colors hover:bg-[var(--av-surface-inset)] hover:text-[var(--av-text-primary)] active:scale-95"
                aria-label="बंद करें"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-3.5">
              {children}
            </div>

            {footer ? (
              <div className="shrink-0 border-t border-[var(--av-border-subtle)] bg-[var(--av-surface)] px-5 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-3">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
