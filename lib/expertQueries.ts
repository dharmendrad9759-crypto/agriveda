import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServiceClient, hasSupabaseServiceRole } from "@/lib/supabase";
import { randomBytes } from "crypto";

export type ExpertQueryStatus = "pending" | "in_review" | "answered" | "closed";
export type ExpertQuerySource = "ask-query" | "ai-doctor";

export type AiDiagnosisPayload = {
  diseaseName?: string;
  pathogen?: string;
  confidence?: number;
  severity?: string;
  riskLevel?: string;
  stage?: string;
  treatments?: string[];
  visualObservations?: string;
  cropContext?: string;
};

export type ExpertQueryRow = {
  id: string;
  farmer_id: string | null;
  device_id: string | null;
  farmer_name: string | null;
  farmer_phone: string | null;
  farmer_village: string | null;
  farmer_district: string | null;
  farmer_state: string | null;
  crop_slug: string | null;
  crop_name: string;
  query_text: string;
  photo_url: string | null;
  ai_diagnosis: AiDiagnosisPayload | null;
  source: ExpertQuerySource;
  status: ExpertQueryStatus;
  expert_reply: string | null;
  expert_name: string | null;
  answered_at: string | null;
  assigned_to: string | null;
  assigned_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateExpertQueryInput = {
  farmerId?: string | null;
  deviceId: string;
  farmerName?: string;
  farmerPhone?: string;
  farmerVillage?: string;
  farmerDistrict?: string;
  farmerState?: string;
  cropSlug?: string;
  cropName: string;
  queryText: string;
  photoDataUrl?: string | null;
  aiDiagnosis?: AiDiagnosisPayload | null;
  source?: ExpertQuerySource;
};

type MemoryStore = {
  rows: ExpertQueryRow[];
};

declare global {
  // eslint-disable-next-line no-var
  var __agrivedaExpertQueryStore: MemoryStore | undefined;
}

function memoryStore(): MemoryStore {
  if (!globalThis.__agrivedaExpertQueryStore) {
    globalThis.__agrivedaExpertQueryStore = { rows: [] };
  }
  return globalThis.__agrivedaExpertQueryStore;
}

/** In-memory expert inbox is DEV ONLY — never share across tenants in production. */
function allowMemoryFallback(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.VERCEL_ENV !== "production" &&
    process.env.AGRIVEDA_FORCE_PROD_AUTH !== "true"
  );
}

export function expertQueriesBackendReady(): boolean {
  return hasSupabaseServiceRole() || allowMemoryFallback();
}

function nowIso(): string {
  return new Date().toISOString();
}

/** Compress / strip oversized data URLs before storage upload. */
export function sanitizePhotoDataUrl(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== "string") return null;
  if (!raw.startsWith("data:image/")) return null;
  // ~350KB text ≈ safe for API + storage
  if (raw.length > 350_000) return null;
  return raw;
}

const PHOTO_BUCKET = "expert-query-photos";

/** Extract storage object path from stored photo ref (signed/public/storage://). */
export function expertPhotoStoragePath(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("data:image/")) return null;
  if (url.startsWith(`storage://${PHOTO_BUCKET}/`)) {
    return url.slice(`storage://${PHOTO_BUCKET}/`.length);
  }
  try {
    const u = new URL(url);
    const markers = [
      `/object/sign/${PHOTO_BUCKET}/`,
      `/object/public/${PHOTO_BUCKET}/`,
      `/object/authenticated/${PHOTO_BUCKET}/`,
      `/${PHOTO_BUCKET}/`,
    ];
    for (const marker of markers) {
      const idx = u.pathname.indexOf(marker);
      if (idx >= 0) {
        return decodeURIComponent(u.pathname.slice(idx + marker.length));
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** Fresh signed URL for private bucket (admin + farmer UI). */
export async function resolveExpertPhotoUrl(
  stored: string | null | undefined,
  client = createSupabaseServiceClient()
): Promise<string | null> {
  if (!stored) return null;
  if (stored.startsWith("data:image/")) return stored;

  const path = expertPhotoStoragePath(stored);
  if (!path || !client) {
    // Legacy public URL still might work if bucket was public
    if (stored.startsWith("http://") || stored.startsWith("https://")) return stored;
    return null;
  }

  try {
    const { data, error } = await client.storage
      .from(PHOTO_BUCKET)
      .createSignedUrl(path, 60 * 60 * 12); // 12h
    if (!error && data?.signedUrl) return data.signedUrl;
  } catch (err) {
    console.error("[expertQueries] sign photo", err);
  }

  if (stored.startsWith("http://") || stored.startsWith("https://")) return stored;
  return null;
}

async function withResolvedPhotos(rows: ExpertQueryRow[]): Promise<ExpertQueryRow[]> {
  if (!rows.length) return rows;
  return Promise.all(
    rows.map(async (r) => ({
      ...r,
      photo_url: await resolveExpertPhotoUrl(r.photo_url),
    }))
  );
}

async function uploadPhoto(
  client: SupabaseClient,
  deviceId: string,
  dataUrl: string
): Promise<string | null> {
  try {
    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
    if (!match) return null;
    const mime = match[1];
    const b64 = match[2];
    const ext = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
    const bytes = Buffer.from(b64, "base64");
    if (bytes.length > 2.5 * 1024 * 1024) return null;

    const path = `${deviceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "device"}/${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
    const { error } = await client.storage.from(PHOTO_BUCKET).upload(path, bytes, {
      contentType: mime,
      upsert: false,
    });
    if (error) {
      console.error("[expertQueries] photo upload", error.message);
      return null;
    }
    // Store durable path — signed URL is created on read (bucket is private)
    return `storage://${PHOTO_BUCKET}/${path}`;
  } catch (err) {
    console.error("[expertQueries] photo upload failed", err);
    return null;
  }
}

function mapRow(raw: Record<string, unknown>): ExpertQueryRow {
  return {
    id: String(raw.id),
    farmer_id: (raw.farmer_id as string) ?? null,
    device_id: (raw.device_id as string) ?? null,
    farmer_name: (raw.farmer_name as string) ?? null,
    farmer_phone: (raw.farmer_phone as string) ?? null,
    farmer_village: (raw.farmer_village as string) ?? null,
    farmer_district: (raw.farmer_district as string) ?? null,
    farmer_state: (raw.farmer_state as string) ?? null,
    crop_slug: (raw.crop_slug as string) ?? null,
    crop_name: String(raw.crop_name ?? ""),
    query_text: String(raw.query_text ?? ""),
    photo_url: (raw.photo_url as string) ?? null,
    ai_diagnosis: (raw.ai_diagnosis as AiDiagnosisPayload) ?? null,
    source: (raw.source as ExpertQuerySource) ?? "ask-query",
    status: (raw.status as ExpertQueryStatus) ?? "pending",
    expert_reply: (raw.expert_reply as string) ?? null,
    expert_name: (raw.expert_name as string) ?? null,
    answered_at: (raw.answered_at as string) ?? null,
    assigned_to: (raw.assigned_to as string) ?? null,
    assigned_at: (raw.assigned_at as string) ?? null,
    created_at: String(raw.created_at ?? nowIso()),
    updated_at: String(raw.updated_at ?? nowIso()),
  };
}

const QUERY_SELECT =
  "id, farmer_id, device_id, farmer_name, farmer_phone, farmer_village, farmer_district, farmer_state, crop_slug, crop_name, query_text, photo_url, ai_diagnosis, source, status, expert_reply, expert_name, answered_at, assigned_to, assigned_at, created_at, updated_at";

/** Fallback if panel-users.sql (assigned_to) not yet applied */
const QUERY_SELECT_BASIC =
  "id, farmer_id, device_id, farmer_name, farmer_phone, farmer_village, farmer_district, farmer_state, crop_slug, crop_name, query_text, photo_url, ai_diagnosis, source, status, expert_reply, expert_name, answered_at, created_at, updated_at";

async function selectExpertRows(
  client: SupabaseClient,
  build: (select: string) => PromiseLike<{ data: unknown; error: { message: string } | null }>
): Promise<Record<string, unknown>[] | null> {
  const full = await build(QUERY_SELECT);
  if (!full.error && full.data) {
    return (Array.isArray(full.data) ? full.data : [full.data]) as Record<string, unknown>[];
  }
  const msg = full.error?.message?.toLowerCase() ?? "";
  if (msg.includes("assigned_to") || msg.includes("assigned_at") || msg.includes("column")) {
    const basic = await build(QUERY_SELECT_BASIC);
    if (!basic.error && basic.data) {
      return (Array.isArray(basic.data) ? basic.data : [basic.data]) as Record<string, unknown>[];
    }
  }
  if (full.error) console.error("[expertQueries] select", full.error.message);
  return null;
}

export async function createExpertQuery(
  input: CreateExpertQueryInput,
  client = createSupabaseServiceClient()
): Promise<{ row: ExpertQueryRow | null; error?: string }> {
  const queryText = input.queryText.trim();
  const cropName = input.cropName.trim();
  if (!queryText || !cropName || !input.deviceId.trim()) {
    return { row: null, error: "queryText, cropName, deviceId required" };
  }

  const photoData = sanitizePhotoDataUrl(input.photoDataUrl);
  let photoUrl: string | null = null;
  if (client && photoData) {
    photoUrl = await uploadPhoto(client, input.deviceId, photoData);
  }

  const payload = {
    farmer_id: input.farmerId ?? null,
    device_id: input.deviceId.slice(0, 80),
    farmer_name: input.farmerName?.trim().slice(0, 80) || null,
    farmer_phone: input.farmerPhone?.replace(/\D/g, "").slice(0, 15) || null,
    farmer_village: input.farmerVillage?.trim().slice(0, 80) || null,
    farmer_district: input.farmerDistrict?.trim().slice(0, 80) || null,
    farmer_state: input.farmerState?.trim().slice(0, 80) || null,
    crop_slug: input.cropSlug?.trim().slice(0, 64) || null,
    crop_name: cropName.slice(0, 80),
    query_text: queryText.slice(0, 4000),
    photo_url: photoUrl,
    ai_diagnosis: input.aiDiagnosis ?? null,
    source: input.source ?? "ask-query",
    status: "pending" as const,
    updated_at: nowIso(),
  };

  if (!client) {
    if (process.env.NODE_ENV === "production") {
      return {
        row: null,
        error:
          "SUPABASE_SERVICE_ROLE_KEY missing on server — Vercel env check + Redeploy",
      };
    }
  }

  if (client) {
    const attemptInsert = async (data: typeof payload) => {
      try {
        const full = await client.from("expert_queries").insert(data).select(QUERY_SELECT).single();
        if (
          full.error &&
          /assigned_/i.test(full.error.message || "")
        ) {
          return client.from("expert_queries").insert(data).select(QUERY_SELECT_BASIC).single();
        }
        return full;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
          data: null,
          error: { message: msg, code: "FETCH", details: "" } as {
            message: string;
            code: string;
            details: string;
          },
        };
      }
    };

    let { data, error } = await attemptInsert(payload);

    // FK / farmer row missing — retry without farmer_id
    if (
      error &&
      (error.code === "23503" ||
        error.message.toLowerCase().includes("foreign key") ||
        error.message.toLowerCase().includes("farmer_id"))
    ) {
      const retry = await attemptInsert({ ...payload, farmer_id: null });
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error("[expertQueries] insert", error.message, error.code, error.details);
      if (process.env.NODE_ENV === "production") {
        const rawMsg = error.message || "";
        const looksHtml = rawMsg.includes("<!DOCTYPE") || rawMsg.includes("<html");
        const friendly = looksHtml
          ? "Supabase URL गलत है — Project URL Settings → API से कॉपी करें"
          : rawMsg.toLowerCase().includes("fetch failed") || error.code === "FETCH"
            ? "Supabase तक पहुँच नहीं (fetch failed) — Project Pause/Delete तो नहीं? Dashboard में Project URL दोबारा कॉपी करके Vercel में डालो + Redeploy"
            : rawMsg.toLowerCase().includes("invalid path") || error.code === "PGRST125"
            ? `${rawMsg.slice(0, 120)} — URL सिर्फ https://PROJECT.supabase.co हो (बिना /rest/v1)`
            : rawMsg.includes("relation") || error.code === "42P01"
              ? `${rawMsg.slice(0, 120)} — expert_queries SQL चलाएँ`
              : rawMsg.toLowerCase().includes("jwt") ||
                  rawMsg.toLowerCase().includes("api key") ||
                  rawMsg.toLowerCase().includes("invalid api")
                ? `${rawMsg.slice(0, 120)} — SERVICE_ROLE key गलत (anon मत डालो)`
                : rawMsg.slice(0, 200);
        return { row: null, error: `DB insert failed: ${friendly}` };
      }
    } else if (data) {
      const row = mapRow(data as Record<string, unknown>);
      return {
        row: { ...row, photo_url: await resolveExpertPhotoUrl(row.photo_url) },
      };
    }
  }

  if (!allowMemoryFallback()) {
    return { row: null, error: "Database unavailable — later try again" };
  }

  const row: ExpertQueryRow = {
    id: `mem-${Date.now()}-${randomBytes(3).toString("hex")}`,
    ...payload,
    photo_url: photoUrl ?? (photoData ? photoData.slice(0, 120_000) : null),
    expert_reply: null,
    expert_name: null,
    answered_at: null,
    assigned_to: null,
    assigned_at: null,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  memoryStore().rows.unshift(row);
  return { row };
}

export async function listExpertQueriesForDevice(
  deviceId: string,
  client = createSupabaseServiceClient()
): Promise<ExpertQueryRow[]> {
  if (!deviceId) return [];

  if (client) {
    const data = await selectExpertRows(client, (select) =>
      client
        .from("expert_queries")
        .select(select)
        .eq("device_id", deviceId)
        .order("created_at", { ascending: false })
        .limit(50)
    );
    if (data) return withResolvedPhotos(data.map(mapRow));
  }

  if (!allowMemoryFallback()) return [];
  return withResolvedPhotos(
    memoryStore().rows.filter((r) => r.device_id === deviceId).slice(0, 50)
  );
}

export async function listExpertQueriesAdmin(opts: {
  status?: ExpertQueryStatus | "all";
  limit?: number;
  client?: SupabaseClient | null;
  /** When set, filter to queries this expert may see */
  viewer?: {
    userId: string;
    viewAll: boolean;
    cropScopes?: string[];
  };
}): Promise<ExpertQueryRow[]> {
  const client = opts.client ?? createSupabaseServiceClient();
  const limit = Math.min(200, Math.max(1, opts.limit ?? 80));
  const status = opts.status ?? "all";

  let rows: ExpertQueryRow[] = [];

  if (client) {
    const data = await selectExpertRows(client, (select) => {
      let q = client
        .from("expert_queries")
        .select(select)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (status !== "all") q = q.eq("status", status);
      return q;
    });
    if (data) rows = data.map(mapRow);
  }

  if (!rows.length && allowMemoryFallback()) {
    let mem = [...memoryStore().rows];
    if (status !== "all") mem = mem.filter((r) => r.status === status);
    rows = mem.slice(0, limit);
  }

  const viewer = opts.viewer;
  if (viewer && !viewer.viewAll) {
    rows = rows.filter((r) => {
      if (r.assigned_to === viewer.userId) return true;
      if (!r.assigned_to && (r.status === "pending" || r.status === "in_review")) return true;
      return false;
    });
    if (viewer.cropScopes && viewer.cropScopes.length > 0) {
      const set = new Set(viewer.cropScopes);
      rows = rows.filter((r) => !r.crop_slug || set.has(r.crop_slug));
    }
  }

  return withResolvedPhotos(rows);
}

export async function assignExpertQuery(
  id: string,
  assignedTo: string | null,
  client = createSupabaseServiceClient()
): Promise<ExpertQueryRow | null> {
  const patch = {
    assigned_to: assignedTo,
    assigned_at: assignedTo ? nowIso() : null,
    updated_at: nowIso(),
    ...(assignedTo && { status: "in_review" as const }),
  };

  if (client && !id.startsWith("mem-")) {
    let data: Record<string, unknown> | null = null;
    let error: { message: string } | null = null;
    const full = await client
      .from("expert_queries")
      .update(patch)
      .eq("id", id)
      .select(QUERY_SELECT)
      .single();
    data = (full.data as Record<string, unknown> | null) ?? null;
    error = full.error;
    if (error && /assigned_/i.test(error.message)) {
      const retry = await client
        .from("expert_queries")
        .update({
          updated_at: nowIso(),
          ...(assignedTo && { status: "in_review" as const }),
        })
        .eq("id", id)
        .select(QUERY_SELECT_BASIC)
        .single();
      data = (retry.data as Record<string, unknown> | null) ?? null;
      error = retry.error;
    }
    if (!error && data) {
      const row = mapRow(data);
      return { ...row, photo_url: await resolveExpertPhotoUrl(row.photo_url) };
    }
  }

  if (!allowMemoryFallback()) return null;
  const store = memoryStore();
  const idx = store.rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  store.rows[idx] = {
    ...store.rows[idx],
    assigned_to: assignedTo,
    assigned_at: assignedTo ? nowIso() : null,
    updated_at: nowIso(),
    status: assignedTo ? "in_review" : store.rows[idx].status,
  };
  return store.rows[idx];
}

export async function getExpertQueryById(
  id: string,
  client = createSupabaseServiceClient()
): Promise<ExpertQueryRow | null> {
  if (client) {
    const data = await selectExpertRows(client, async (select) => {
      const res = await client.from("expert_queries").select(select).eq("id", id).maybeSingle();
      return { data: res.data ? [res.data] : null, error: res.error };
    });
    if (data?.[0]) {
      const row = mapRow(data[0]);
      return { ...row, photo_url: await resolveExpertPhotoUrl(row.photo_url) };
    }
  }
  if (!allowMemoryFallback()) return null;
  const mem = memoryStore().rows.find((r) => r.id === id) ?? null;
  if (!mem) return null;
  return { ...mem, photo_url: await resolveExpertPhotoUrl(mem.photo_url) };
}

export async function replyToExpertQuery(
  id: string,
  reply: string,
  expertName: string,
  client = createSupabaseServiceClient()
): Promise<ExpertQueryRow | null> {
  const text = reply.trim().slice(0, 8000);
  const name = expertName.trim().slice(0, 80) || "Agriveda Expert";
  if (!id || !text) return null;

  const patch = {
    expert_reply: text,
    expert_name: name,
    status: "answered" as const,
    answered_at: nowIso(),
    updated_at: nowIso(),
  };

  if (client && !id.startsWith("mem-")) {
    let data: Record<string, unknown> | null = null;
    let error: { message: string } | null = null;
    const full = await client
      .from("expert_queries")
      .update(patch)
      .eq("id", id)
      .select(QUERY_SELECT)
      .single();
    data = (full.data as Record<string, unknown> | null) ?? null;
    error = full.error;
    if (error && /assigned_/i.test(error.message || "")) {
      const retry = await client
        .from("expert_queries")
        .update(patch)
        .eq("id", id)
        .select(QUERY_SELECT_BASIC)
        .single();
      data = (retry.data as Record<string, unknown> | null) ?? null;
      error = retry.error;
    }
    if (!error && data) {
      const row = mapRow(data);
      return { ...row, photo_url: await resolveExpertPhotoUrl(row.photo_url) };
    }
  }

  if (!allowMemoryFallback()) return null;
  const store = memoryStore();
  const idx = store.rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  store.rows[idx] = { ...store.rows[idx], ...patch };
  return store.rows[idx];
}

export async function setExpertQueryStatus(
  id: string,
  status: ExpertQueryStatus,
  client = createSupabaseServiceClient()
): Promise<ExpertQueryRow | null> {
  const patch = { status, updated_at: nowIso() };
  if (client && !id.startsWith("mem-")) {
    let data: Record<string, unknown> | null = null;
    let error: { message: string } | null = null;
    const full = await client
      .from("expert_queries")
      .update(patch)
      .eq("id", id)
      .select(QUERY_SELECT)
      .single();
    data = (full.data as Record<string, unknown> | null) ?? null;
    error = full.error;
    if (error && /assigned_/i.test(error.message || "")) {
      const retry = await client
        .from("expert_queries")
        .update(patch)
        .eq("id", id)
        .select(QUERY_SELECT_BASIC)
        .single();
      data = (retry.data as Record<string, unknown> | null) ?? null;
      error = retry.error;
    }
    if (!error && data) {
      const row = mapRow(data);
      return { ...row, photo_url: await resolveExpertPhotoUrl(row.photo_url) };
    }
  }
  if (!allowMemoryFallback()) return null;
  const store = memoryStore();
  const idx = store.rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  store.rows[idx] = { ...store.rows[idx], ...patch };
  return store.rows[idx];
}
