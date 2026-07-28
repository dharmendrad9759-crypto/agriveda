/** Agriveda unified design tokens — keep weights consistent app-wide */

export const AV = {
  radius: "rounded-xl",
  radiusLg: "rounded-2xl",
  radiusFull: "rounded-full",

  /** Compact spacing (farmer phone first) */
  sectionGap: "space-y-4",
  gridGap: "gap-2.5",
  cardPadding: "p-3.5 sm:p-4",

  space1: "0.25rem",
  space2: "0.5rem",
  space3: "0.75rem",
  space4: "1rem",
  space5: "1.25rem",
  space6: "1.5rem",
  space8: "2rem",

  /**
   * Typography system (same weight every time):
   * - Title / section: 700
   * - Label / chip: 600
   * - Body: 400–500
   * - Micro: 500
   */
  pageTitle: "text-xl font-bold tracking-tight text-[var(--av-text-primary)] lg:text-2xl",
  pageSubtitle: "mt-1 text-sm font-normal text-[var(--av-text-secondary)]",
  sectionTitle: "text-[15px] font-bold text-[var(--av-text-primary)]",
  sectionSubtitle: "text-xs font-medium text-[var(--av-text-muted)]",
  label: "text-[11px] font-semibold text-[var(--av-text-muted)]",
  body: "text-sm font-normal leading-snug text-[var(--av-text-secondary)]",
  micro: "text-[10px] font-medium text-[var(--av-text-muted)]",
  chipText: "text-[11px] font-semibold text-[var(--av-text-secondary)]",
  statValue: "text-lg font-bold leading-tight text-[var(--av-text-primary)]",
  link: "text-xs font-semibold text-[var(--av-accent)] hover:underline",

  /** Surfaces */
  card: "av-card",
  cardHover: "av-card av-card-hover",
  cardInset: "av-card-inset",
  input: "av-input",
  chip: "av-chip",
  chipActive: "av-chip av-chip-active",
  btnPrimary: "av-btn av-btn-primary",
  btnPrimarySm: "av-btn av-btn-sm av-btn-primary",
  btnSecondary: "av-btn av-btn-secondary",
  btnSecondarySm: "av-btn av-btn-sm av-btn-secondary",
  btnGhost: "av-btn av-btn-ghost",
  badgeHigh: "av-badge av-badge-high",
  badgeMedium: "av-badge av-badge-medium",
  badgeLow: "av-badge av-badge-low",
  badgeNeutral: "av-badge av-badge-neutral",
} as const;

export const Z_INDEX = {
  dropdown: 40,
  sticky: 30,
  modal: 50,
  toast: 60,
} as const;

export type BadgeVariant = "high" | "medium" | "low" | "neutral" | "info" | "success" | "warning";
export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type CardVariant = "default" | "glass" | "inset";
