"use client";

import { Moon, Sun } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const reduced = useReducedMotion();

  if (!mounted) {
    return <div className="h-10 w-10 rounded-xl border border-emerald-500/15" />;
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      whileHover={reduced ? undefined : { scale: 1.03 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-500 transition-colors hover:border-emerald-400/40 hover:shadow-[0_0_12px_rgba(0,255,136,0.2)]"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </motion.button>
  );
}
