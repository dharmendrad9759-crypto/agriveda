/** Agriveda enterprise design tokens — single source for spacing, radius, typography */

export const AV = {
  radius: "rounded-xl", // 12px
  radiusLg: "rounded-2xl",
  radiusFull: "rounded-full",

  /** Section vertical rhythm */
  sectionGap: "space-y-5",
  gridGap: "gap-4",
  cardPadding: "p-4 lg:p-5",

  /** Typography scale */
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
