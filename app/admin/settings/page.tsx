"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import { AdminShell, useAdminSession } from "@/components/admin/AdminShell";
import { APP_VERSION } from "@/lib/appMeta";

export default function AdminSettingsPage() {
  const { me, ready, logout } = useAdminSession();

  if (!ready || !me) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <AdminShell me={me} onLogout={() => void logout()} title="Settings">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="font-display text-2xl font-bold text-white">Console settings</h1>

        <div className="admin-cine__glass rounded-2xl border border-white/10 p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-emerald-300">
            <ShieldCheck className="h-4 w-4" /> आपका account
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-white/45">Name</dt>
              <dd className="font-semibold text-white">{me.displayName}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-white/45">Username</dt>
              <dd className="font-semibold text-white">@{me.username}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-white/45">Role</dt>
              <dd className="font-semibold uppercase text-emerald-300">{me.role}</dd>
            </div>
          </dl>
        </div>

        <div className="admin-cine__glass rounded-2xl border border-white/10 p-5">
          <p className="text-sm font-bold text-white">Permissions</p>
          <ul className="mt-2 space-y-1 text-xs text-white/60">
            <li>{me.permissions.manageExperts ? "✓" : "✗"} Experts बनाएँ / deactivate</li>
            <li>{me.permissions.assignQueries ? "✓" : "✗"} Tickets assign</li>
            <li>{me.permissions.replyAll ? "✓" : "✗"} किसी भी ticket पर जवाब</li>
            <li>{me.permissions.viewAllQueries ? "✓" : "✗"} सारे queries देखना</li>
            <li>{me.permissions.accessSettings ? "✓" : "✗"} Settings</li>
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-white/40">
            Expert सिर्फ assigned / unclaimed tickets जवाब देता है। Owner Manager/Expert बनाता है और
            permission flags बदलता है।
          </p>
        </div>

        <p className="text-center text-[10px] text-white/30">Agriveda console v{APP_VERSION}</p>
      </div>
    </AdminShell>
  );
}
