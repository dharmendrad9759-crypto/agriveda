"use client";

import Card from "@/components/design-system/Card";
import type { ReactNode } from "react";

interface DarkCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
  static?: boolean;
}

/** Theme-aware panel card — delegates to unified Card primitive */
export default function DarkCard(props: DarkCardProps) {
  return <Card variant="default" {...props} />;
}
