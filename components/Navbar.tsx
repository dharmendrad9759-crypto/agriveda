"use client";

import AppLink from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { User } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import MotionPressable from "@/components/motion/MotionPressable";
import { BRAND } from "@/lib/brand";

export default function Navbar() {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "CROPS", path: "/crops" },
    { name: "WEATHER", path: "/weather" },
    { name: "AI DOCTOR", path: "/ai-doctor" },
    { name: "MANDI", path: "/mandi" },
  ];

  return (
    <nav className="hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between gap-3 sm:h-14">
          <MotionPressable as="span">
            <AppLink href="/" className="flex items-center">
              <span className="text-base font-black tracking-wide agriveda-gradient-text sm:text-lg">
                {BRAND}
              </span>
            </AppLink>
          </MotionPressable>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-0.5 sm:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <AppLink
                    key={item.path}
                    href={item.path}
                    className="relative rounded-lg px-2.5 py-2 text-[10px] font-bold tracking-wider transition-colors duration-150"
                  >
                    {isActive && !reduced && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    {isActive && reduced && (
                      <span className="absolute inset-0 rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30" />
                    )}
                    <span
                      className={`relative z-10 ${
                        isActive ? "text-emerald-500" : "theme-text-muted hover:text-emerald-500"
                      }`}
                    >
                      {item.name}
                    </span>
                  </AppLink>
                );
              })}
            </div>
            <MotionPressable as="span">
              <AppLink
                href="/profile"
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-150 ${
                  pathname === "/profile"
                    ? "bg-emerald-500/15 text-emerald-500"
                    : "theme-text-muted hover:bg-emerald-500/10 hover:text-emerald-500"
                }`}
                aria-label="Profile"
              >
                <User className="h-5 w-5" />
              </AppLink>
            </MotionPressable>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
