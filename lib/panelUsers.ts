import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { createSupabaseServiceClient } from "@/lib/supabase";

export type PanelRole = "owner" | "manager" | "expert";

export type PanelUser = {
  id: string;
  username: string;
  displayName: string;
  role: PanelRole;
  canAssign: boolean;
  canManageExperts: boolean;
  canViewAll: boolean;
  active: boolean;
  cropScopes: string[];
  createdAt: string;
  lastLoginAt: string | null;
};

export type PanelPermissions = {
  manageExperts: boolean;
  assignQueries: boolean;
  replyAll: boolean;
  viewAllQueries: boolean;
  accessSettings: boolean;
};

type MemoryRow = PanelUser & { passwordHash: string };

declare global {
  // eslint-disable-next-line no-var
  var __agrivedaPanelUsers: MemoryRow[] | undefined;
}

function memoryUsers(): MemoryRow[] {
  if (!globalThis.__agrivedaPanelUsers) globalThis.__agrivedaPanelUsers = [];
  return globalThis.__agrivedaPanelUsers;
}

function allowMemory(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.VERCEL_ENV !== "production"
  );
}

export function permissionsForUser(u: Pick<
  PanelUser,
  "role" | "canAssign" | "canManageExperts" | "canViewAll"
>): PanelPermissions {
  if (u.role === "owner") {
    return {
      manageExperts: true,
      assignQueries: true,
      replyAll: true,
      viewAllQueries: true,
      accessSettings: true,
    };
  }
  if (u.role === "manager") {
    return {
      manageExperts: u.canManageExperts,
      assignQueries: u.canAssign || true,
      replyAll: true,
      viewAllQueries: u.canViewAll || true,
      accessSettings: false,
    };
  }
  return {
    manageExperts: false,
    assignQueries: u.canAssign,
    replyAll: false,
    viewAllQueries: u.canViewAll,
    accessSettings: false,
  };
}

/** Default flags when creating a role */
export function defaultFlagsForRole(role: PanelRole): {
  canAssign: boolean;
  canManageExperts: boolean;
  canViewAll: boolean;
} {
  if (role === "owner") {
    return { canAssign: true, canManageExperts: true, canViewAll: true };
  }
  if (role === "manager") {
    return { canAssign: true, canManageExperts: false, canViewAll: true };
  }
  return { canAssign: false, canManageExperts: false, canViewAll: false };
}

export function hashPanelPassword(password: string, salt?: string): string {
  const s = salt || randomBytes(16).toString("hex");
  const hash = scryptSync(password, s, 64).toString("hex");
  return `${s}:${hash}`;
}

export function verifyPanelPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const incoming = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (incoming.length !== expected.length) return false;
  return timingSafeEqual(incoming, expected);
}

function mapDb(row: Record<string, unknown>): PanelUser {
  return {
    id: String(row.id),
    username: String(row.username),
    displayName: String(row.display_name ?? row.username),
    role: (row.role as PanelRole) || "expert",
    canAssign: Boolean(row.can_assign),
    canManageExperts: Boolean(row.can_manage_experts),
    canViewAll: Boolean(row.can_view_all),
    active: row.active !== false,
    cropScopes: Array.isArray(row.crop_scopes) ? (row.crop_scopes as string[]) : [],
    createdAt: String(row.created_at ?? new Date().toISOString()),
    lastLoginAt: row.last_login_at ? String(row.last_login_at) : null,
  };
}

function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 40);
}

export async function findPanelUserByUsername(
  username: string
): Promise<(PanelUser & { passwordHash: string }) | null> {
  const uname = normalizeUsername(username);
  if (!uname) return null;

  const client = createSupabaseServiceClient();
  if (client) {
    const { data, error } = await client
      .from("panel_users")
      .select(
        "id, username, display_name, password_hash, role, can_assign, can_manage_experts, can_view_all, active, crop_scopes, created_at, last_login_at"
      )
      .eq("username", uname)
      .maybeSingle();
    if (!error && data) {
      return { ...mapDb(data as Record<string, unknown>), passwordHash: String(data.password_hash) };
    }
  }

  if (!allowMemory()) return null;
  const row = memoryUsers().find((u) => u.username === uname);
  return row ? { ...row, passwordHash: row.passwordHash } : null;
}

export async function getPanelUserById(id: string): Promise<PanelUser | null> {
  if (!id) return null;
  if (id === "owner-master") {
    return {
      id: "owner-master",
      username: "owner",
      displayName: "Main Owner",
      role: "owner",
      canAssign: true,
      canManageExperts: true,
      canViewAll: true,
      active: true,
      cropScopes: [],
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    };
  }

  const client = createSupabaseServiceClient();
  if (client && !id.startsWith("mem-")) {
    const { data, error } = await client
      .from("panel_users")
      .select(
        "id, username, display_name, role, can_assign, can_manage_experts, can_view_all, active, crop_scopes, created_at, last_login_at"
      )
      .eq("id", id)
      .maybeSingle();
    if (!error && data) return mapDb(data as Record<string, unknown>);
  }

  if (!allowMemory()) return null;
  const row = memoryUsers().find((u) => u.id === id);
  return row ?? null;
}

export async function listPanelUsers(): Promise<PanelUser[]> {
  const client = createSupabaseServiceClient();
  if (client) {
    const { data, error } = await client
      .from("panel_users")
      .select(
        "id, username, display_name, role, can_assign, can_manage_experts, can_view_all, active, crop_scopes, created_at, last_login_at"
      )
      .order("created_at", { ascending: true })
      .limit(200);
    if (!error && data) return (data as Record<string, unknown>[]).map(mapDb);
  }

  if (!allowMemory()) return [];
  return memoryUsers().map(({ passwordHash: _, ...u }) => u);
}

export async function createPanelUser(input: {
  username: string;
  displayName: string;
  password: string;
  role: PanelRole;
  createdBy?: string | null;
  canAssign?: boolean;
  canManageExperts?: boolean;
  canViewAll?: boolean;
  cropScopes?: string[];
}): Promise<{ user: PanelUser | null; error?: string }> {
  const username = normalizeUsername(input.username);
  if (!username || username.length < 3) {
    return { user: null, error: "Username कम से कम 3 अक्षर" };
  }
  if (!input.password || input.password.length < 8) {
    return { user: null, error: "Password कम से कम 8 अक्षर" };
  }
  if (input.role === "owner") {
    return { user: null, error: "Owner role सिर्फ master secret से" };
  }

  const flags = defaultFlagsForRole(input.role);
  const canAssign = input.canAssign ?? flags.canAssign;
  const canManageExperts = input.canManageExperts ?? flags.canManageExperts;
  const canViewAll = input.canViewAll ?? flags.canViewAll;
  const passwordHash = hashPanelPassword(input.password);
  const displayName = input.displayName.trim().slice(0, 80) || username;

  const existing = await findPanelUserByUsername(username);
  if (existing) return { user: null, error: "Username पहले से है" };

  const client = createSupabaseServiceClient();
  if (client) {
    const { data, error } = await client
      .from("panel_users")
      .insert({
        username,
        display_name: displayName,
        password_hash: passwordHash,
        role: input.role,
        can_assign: canAssign,
        can_manage_experts: canManageExperts,
        can_view_all: canViewAll,
        crop_scopes: input.cropScopes ?? [],
        created_by:
          input.createdBy && !input.createdBy.startsWith("mem-") && input.createdBy !== "owner-master"
            ? input.createdBy
            : null,
        active: true,
      })
      .select(
        "id, username, display_name, role, can_assign, can_manage_experts, can_view_all, active, crop_scopes, created_at, last_login_at"
      )
      .single();
    if (error) {
      return { user: null, error: error.message.slice(0, 160) };
    }
    return { user: mapDb(data as Record<string, unknown>) };
  }

  if (!allowMemory()) {
    return { user: null, error: "Supabase panel_users table चाहिए — SQL चलाएँ" };
  }

  const row: MemoryRow = {
    id: `mem-${randomBytes(6).toString("hex")}`,
    username,
    displayName,
    role: input.role,
    canAssign,
    canManageExperts,
    canViewAll,
    active: true,
    cropScopes: input.cropScopes ?? [],
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    passwordHash,
  };
  memoryUsers().push(row);
  const { passwordHash: _, ...user } = row;
  return { user };
}

export async function updatePanelUser(
  id: string,
  patch: {
    displayName?: string;
    role?: PanelRole;
    canAssign?: boolean;
    canManageExperts?: boolean;
    canViewAll?: boolean;
    active?: boolean;
    cropScopes?: string[];
    password?: string;
  }
): Promise<{ user: PanelUser | null; error?: string }> {
  if (id === "owner-master") {
    return { user: null, error: "Master owner edit नहीं होता" };
  }
  if (patch.role === "owner") {
    return { user: null, error: "Cannot promote to owner" };
  }

  const client = createSupabaseServiceClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.displayName != null) updates.display_name = patch.displayName.trim().slice(0, 80);
  if (patch.role != null) updates.role = patch.role;
  if (patch.canAssign != null) updates.can_assign = patch.canAssign;
  if (patch.canManageExperts != null) updates.can_manage_experts = patch.canManageExperts;
  if (patch.canViewAll != null) updates.can_view_all = patch.canViewAll;
  if (patch.active != null) updates.active = patch.active;
  if (patch.cropScopes != null) updates.crop_scopes = patch.cropScopes;
  if (patch.password != null && patch.password.length >= 8) {
    updates.password_hash = hashPanelPassword(patch.password);
  }

  if (client && !id.startsWith("mem-")) {
    const { data, error } = await client
      .from("panel_users")
      .update(updates)
      .eq("id", id)
      .select(
        "id, username, display_name, role, can_assign, can_manage_experts, can_view_all, active, crop_scopes, created_at, last_login_at"
      )
      .single();
    if (error) return { user: null, error: error.message.slice(0, 160) };
    return { user: mapDb(data as Record<string, unknown>) };
  }

  if (!allowMemory()) return { user: null, error: "Not found" };
  const store = memoryUsers();
  const idx = store.findIndex((u) => u.id === id);
  if (idx < 0) return { user: null, error: "Not found" };
  const cur = store[idx];
  store[idx] = {
    ...cur,
    displayName: patch.displayName?.trim() || cur.displayName,
    role: patch.role ?? cur.role,
    canAssign: patch.canAssign ?? cur.canAssign,
    canManageExperts: patch.canManageExperts ?? cur.canManageExperts,
    canViewAll: patch.canViewAll ?? cur.canViewAll,
    active: patch.active ?? cur.active,
    cropScopes: patch.cropScopes ?? cur.cropScopes,
    passwordHash:
      patch.password && patch.password.length >= 8
        ? hashPanelPassword(patch.password)
        : cur.passwordHash,
  };
  const { passwordHash: _, ...user } = store[idx];
  return { user };
}

export async function touchPanelLogin(id: string): Promise<void> {
  if (id === "owner-master" || id.startsWith("mem-")) return;
  const client = createSupabaseServiceClient();
  if (!client) return;
  await client
    .from("panel_users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", id);
}

/** Stable id for master owner cookie */
export const OWNER_MASTER_ID = "owner-master";

export function inviteCodeHint(username: string, role: PanelRole): string {
  return createHmac("sha256", "agriveda-invite-hint").update(`${username}:${role}`).digest("hex").slice(0, 8);
}
