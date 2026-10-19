"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { hardNavigate, isCapacitorNative } from "@/lib/capacitorNav";

const HISTORY_STORAGE_KEY = "agriveda_nav_history_v1";

/**
 * Retrieve the current in-app navigation stack from sessionStorage.
 */
export function getNavHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save the navigation stack to sessionStorage (capped at 25 entries).
 */
export function saveNavHistory(stack: string[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(stack.slice(-25)));
  } catch {
    /* ignore */
  }
}

/**
 * Record a route visit. Handles pushing new entries and cleaning up if user popped back.
 */
export function recordNavVisit(url: string): void {
  if (typeof window === "undefined" || !url) return;

  // Normalize url
  const cleanUrl = url.replace(/#.*$/, "");
  const stack = getNavHistory();

  // If already at top of stack, ignore
  if (stack.length > 0 && stack[stack.length - 1] === cleanUrl) {
    return;
  }

  // If user navigated backwards to the previous page, pop
  if (stack.length > 1 && stack[stack.length - 2] === cleanUrl) {
    stack.pop();
    saveNavHistory(stack);
    return;
  }

  // Forward navigation
  stack.push(cleanUrl);
  saveNavHistory(stack);
}

/**
 * Get the immediately preceding page in the in-app history.
 */
export function getPreviousNavUrl(): string | null {
  const stack = getNavHistory();
  return stack.length >= 2 ? stack[stack.length - 2] : null;
}

/**
 * Pop the top entry from history stack and return the previous URL.
 */
export function popNavHistory(): string | null {
  const stack = getNavHistory();
  if (stack.length <= 1) return null;
  stack.pop();
  const prev = stack[stack.length - 1] ?? null;
  saveNavHistory(stack);
  return prev;
}

interface GoBackOptions {
  router: AppRouterInstance;
  backHref?: string;
  breadcrumbs?: { label: string; href?: string }[];
  onBack?: () => void;
}

/**
 * Universally smart Back button handler.
 * Guarantees navigating to the immediately preceding page without dumping to Home.
 */
export function navigateBack({ router, backHref, breadcrumbs, onBack }: GoBackOptions): void {
  if (onBack) {
    onBack();
    return;
  }

  const prevUrl = getPreviousNavUrl();

  // 1. If we have a tracked previous in-app URL:
  if (prevUrl) {
    popNavHistory();

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    if (isCapacitorNative()) {
      hardNavigate(prevUrl);
    } else {
      router.push(prevUrl);
    }
    return;
  }

  // 2. If no tracked previous URL (direct land, deep link, or page reload):
  // Resolve parent from breadcrumbs or backHref
  const breadcrumbParent =
    breadcrumbs && breadcrumbs.length > 1
      ? breadcrumbs[breadcrumbs.length - 2]?.href
      : undefined;

  const resolvedTarget =
    (backHref && backHref !== "/" ? backHref : undefined) ??
    (breadcrumbParent && breadcrumbParent !== "/" ? breadcrumbParent : undefined) ??
    backHref ??
    "/";

  if (typeof window !== "undefined" && window.history.length > 1) {
    router.back();
    return;
  }

  if (isCapacitorNative()) {
    hardNavigate(resolvedTarget);
  } else {
    router.push(resolvedTarget);
  }
}
