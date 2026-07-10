"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ButtonSize, ButtonVariant } from "@/lib/design/tokens";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "av-btn av-btn-primary",
  secondary: "av-btn av-btn-secondary",
  ghost: "av-btn av-btn-ghost",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "av-btn-sm",
  md: "",
  lg: "min-h-[44px] px-5 text-sm",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  href,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const classes = cn("av-btn", variantClass[variant], sizeClass[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
