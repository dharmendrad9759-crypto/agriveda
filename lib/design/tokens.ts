/** Agriveda unified design tokens */

export const AV = {
  radius: "rounded-xl",
  radiusLg: "rounded-2xl",
  radiusFull: "rounded-full",

  sectionGap: "space-y-5",
  gridGap: "gap-4",
  cardPadding: "p-4 lg:p-5",

  /** Spacing scale */
  space1: "0.25rem",
  space2: "0.5rem",
  space3: "0.75rem",
  space4: "1rem",
  space5: "1.25rem",
  space6: "1.5rem",
  space8: "2rem",

  /** Typography */
  pageTitle: "text-xl font-bold tracking-tight text-[var(--av-text-primary)] lg:text-2xl",
  pageSubtitle: "mt-1 text-sm text-[var(--av-text-secondary)]",
  sectionTitle: "text-sm font-semibold text-[var(--av-text-primary)]",
  sectionSubtitle: "text-xs text-[var(--av-text-muted)]",
  label: "text-[11px] font-semibold uppercase tracking-wide text-[var(--av-text-muted)]",
  body: "text-sm text-[var(--av-text-secondary)]",
  micro: "text-[10px] text-[var(--av-text-muted)]",
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
