"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  Home,
  Leaf,
  LogOut,
  Menu,
  MessageSquareText,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { PanelPermissions } from "@/lib/panelUsers";

export type AdminMe = {
  id: string;
  username: string;
  displayName: string;
  role: string;
  permissions: PanelPermissions;
};

export function useAdminSession() {
  const router = useRouter();
  const [me, setMe] = useState<AdminMe | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const auth = await fetch("/api/admin/auth", { credentials: "include" }).then((r) =>
      r.json()
    );
    if (!auth.authenticated || !auth.user) {
      router.replace("/admin");
      return null;
    }
    const user = auth.user as AdminMe;
    setMe(user);
    setReady(true);
    return user;
  }, [router]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE", credentials: "include" });
    router.replace("/admin");
  };

  return { me, ready, refresh, logout };
}

export function AdminShell({
  children,
  me,
  onLogout,
  pendingCount = 0,
  title,
}: {
  children: ReactNode;
  me: AdminMe;
  onLogout: () => void;
  pendingCount?: number;
  title?: string;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const nav = [
    { href: "/admin/home", icon: Home, label: "Home", show: true },
    { href: "/admin/queries", icon: MessageSquareText, label: "Queries", show: true },
    {
      href: "/admin/experts",
      icon: Users,
      label: "Experts",
      show: me.permissions.manageExperts || me.permissions.assignQueries,
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
      show: true,
    },
  ].filter((n) => n.show);

  const roleLabel =
    me.role === "owner" ? "Main Owner" : me.role === "manager" ? "Manager" : "Expert";

  return (
    <div className="relative min-h-[100dvh]">
      <header className="admin-cine__enter sticky top-0 z-40 border-b border-emerald-900/10 bg-white/80 shadow-sm backdrop-blur-xl">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-emerald-900/60 transition hover:bg-emerald-500/10 hover:text-emerald-900"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-4 w-4 lg:hidden" /> : <Menu className="h-4 w-4" />}
            <Menu className="hidden h-4 w-4 lg:block" />
          </button>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/25">
              <Leaf className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <span className="font-display text-base font-bold tracking-tight text-emerald-900 sm:text-lg">
              Agriveda
            </span>
            <span className="hidden rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 sm:inline">
              {roleLabel}
            </span>
          </div>
          {title ? (
            <p className="ml-2 hidden text-xs font-semibold text-emerald-900/40 md:block">{title}</p>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50/80 py-1 pl-1 pr-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[11px] font-bold text-white">
                {(me.displayName || "A").slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden max-w-[120px] truncate text-xs font-semibold text-emerald-950 sm:inline">
                {me.displayName}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100dvh-3.5rem)]">
        <aside
          className={cn(
            "admin-cine__panel z-30 flex w-[260px] shrink-0 flex-col border-r border-emerald-900/10 transition-transform",
            "fixed inset-y-14 left-0 lg:static",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-[72px]"
          )}
        >
          <nav className={cn("space-y-1 p-3", !sidebarOpen && "lg:px-2")}>
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[13px] font-semibold transition",
                    active
                      ? "admin-cine__neon bg-emerald-500/12 text-emerald-900"
                      : "border border-transparent text-emerald-900/55 hover:bg-emerald-500/8 hover:text-emerald-950"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className={cn(!sidebarOpen && "lg:hidden")}>{item.label}</span>
                  {item.label === "Queries" && pendingCount > 0 && sidebarOpen ? (
                    <span className="ml-auto rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {pendingCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-emerald-900/10 p-3">
            <button
              type="button"
              onClick={onLogout}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[13px] font-semibold text-red-600/90 transition hover:bg-red-50",
                !sidebarOpen && "lg:justify-center"
              )}
            >
              <LogOut className="h-4 w-4" />
              <span className={cn(!sidebarOpen && "lg:hidden")}>Logout</span>
            </button>
          </div>
        </aside>

        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-emerald-950/20 backdrop-blur-[2px] lg:hidden"
            aria-label="Close"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <main className="min-w-0 flex-1 px-3 py-4 sm:px-5 lg:px-7">{children}</main>
      </div>
    </div>
  );
}
