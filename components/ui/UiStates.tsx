"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  CameraOff,
  CloudOff,
  FileWarning,
  Loader2,
  MapPinOff,
  RefreshCw,
  SearchX,
  WifiOff,
} from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "error" | "warn" | "success";

const toneStyles: Record<Tone, string> = {
  neutral: "border-[var(--av-border)] bg-[var(--av-surface)]",
  error: "border-red-500/30 bg-red-500/10",
  warn: "border-amber-500/30 bg-amber-500/10",
  success: "border-emerald-500/30 bg-emerald-500/10",
};

const iconTone: Record<Tone, string> = {
  neutral: "text-[var(--av-accent)]",
  error: "text-red-500",
  warn: "text-amber-600 dark:text-amber-300",
  success: "text-emerald-600 dark:text-emerald-300",
};

interface UiStateCardProps {
  tone?: Tone;
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
  children?: ReactNode;
}

/** Shared empty / error / offline / permission card for farmer flows */
export function UiStateCard({
  tone = "neutral",
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  className,
  children,
}: UiStateCardProps) {
  return (
    <DarkCard className={cn("mt-4 text-center", toneStyles[tone], className)}>
      <div className={cn("mx-auto flex h-12 w-12 items-center justify-center", iconTone[tone])}>
        {icon}
      </div>
      <p className="mt-3 text-base font-bold text-[var(--av-text-primary)]">{title}</p>
      {description && (
        <p className="mt-1 text-sm leading-relaxed text-[var(--av-text-muted)]">{description}</p>
      )}
      {children}
      {(actionLabel || secondaryLabel) && (
        <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"
            >
              <RefreshCw className="h-4 w-4" />
              {actionLabel}
            </button>
          )}
          {secondaryLabel && onSecondary && (
            <button
              type="button"
              onClick={onSecondary}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--av-border)] px-4 py-2.5 text-sm font-semibold text-[var(--av-text-secondary)]"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </DarkCard>
  );
}

export function LoadingState({
  title = "लोड हो रहा है…",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="py-14 text-center">
      <Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--av-accent)]" />
      <p className="mt-3 text-sm font-semibold text-[var(--av-text-primary)]">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-[var(--av-text-muted)]">{description}</p>
      )}
    </div>
  );
}

export function SlowNetworkState({
  title = "नेटवर्क धीमा है…",
  description = "ग्रामीण नेट पर थोड़ा समय लग सकता है — कृपया रुकें।",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <UiStateCard
      tone="warn"
      icon={<WifiOff className="h-8 w-8" />}
      title={title}
      description={description}
    >
      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-200">
        <Loader2 className="h-4 w-4 animate-spin" />
        अभी भी काम हो रहा है
      </div>
    </UiStateCard>
  );
}

export function OfflineState({
  title = "इंटरनेट नहीं है",
  description = "मौसम और AI Doctor के लिए नेट ज़रूरी है। Wi‑Fi या मोबाइल डेटा चालू करें।",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <UiStateCard
      tone="warn"
      icon={<CloudOff className="h-8 w-8" />}
      title={title}
      description={description}
      actionLabel={onRetry ? "फिर से कोशिश" : undefined}
      onAction={onRetry}
    />
  );
}

export function ErrorState({
  title = "कुछ गलत हो गया",
  description,
  onRetry,
  actionLabel = "फिर से कोशिश",
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  actionLabel?: string;
}) {
  return (
    <UiStateCard
      tone="error"
      icon={<AlertTriangle className="h-8 w-8" />}
      title={title}
      description={description}
      actionLabel={onRetry ? actionLabel : undefined}
      onAction={onRetry}
    />
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}) {
  return (
    <UiStateCard
      tone="neutral"
      icon={icon ?? <FileWarning className="h-8 w-8" />}
      title={title}
      description={description}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}

export function NoResultsState({
  title = "कोई परिणाम नहीं मिला",
  description = "दूसरा नाम या शहर लिखकर खोजें।",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <UiStateCard
      tone="neutral"
      icon={<SearchX className="h-8 w-8" />}
      title={title}
      description={description}
      actionLabel={onRetry ? "फिर खोजें" : undefined}
      onAction={onRetry}
    />
  );
}

export function PermissionDeniedState({
  kind = "location",
  onOpenSettings,
  onRetry,
}: {
  kind?: "location" | "camera";
  onOpenSettings?: () => void;
  onRetry?: () => void;
}) {
  const isCamera = kind === "camera";
  return (
    <UiStateCard
      tone="warn"
      icon={isCamera ? <CameraOff className="h-8 w-8" /> : <MapPinOff className="h-8 w-8" />}
      title={isCamera ? "कैमरा अनुमति बंद है" : "लोकेशन अनुमति बंद है"}
      description={
        isCamera
          ? "AI Doctor के लिए फोटो चाहिए। Phone Settings → Apps → Agriveda → Permissions → Camera → Allow करें।"
          : "सटीक मौसम के लिए Location ON करें। Settings → Apps → Agriveda → Permissions → Location → Allow।"
      }
      actionLabel={onOpenSettings ? "Settings खोलें" : undefined}
      onAction={onOpenSettings}
      secondaryLabel={onRetry ? "फिर से कोशिश" : undefined}
      onSecondary={onRetry}
    />
  );
}

export function ValidationHint({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="mt-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-xs font-semibold text-amber-800 dark:text-amber-200"
    >
      {message}
    </p>
  );
}

export function SuccessBanner({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-center text-sm font-semibold text-emerald-800 dark:text-emerald-200"
    >
      {message}
    </div>
  );
}
