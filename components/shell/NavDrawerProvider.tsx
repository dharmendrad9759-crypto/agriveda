"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import ShellNavDrawer from "./ShellNavDrawer";

interface NavDrawerContextValue {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const NavDrawerContext = createContext<NavDrawerContextValue | null>(null);

export function NavDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);

  return (
    <NavDrawerContext.Provider value={{ open, openDrawer, closeDrawer }}>
      {children}
      <ShellNavDrawer open={open} onClose={closeDrawer} />
    </NavDrawerContext.Provider>
  );
}

export function useNavDrawer() {
  const ctx = useContext(NavDrawerContext);
  if (!ctx) throw new Error("useNavDrawer must be used within NavDrawerProvider");
  return ctx;
}
