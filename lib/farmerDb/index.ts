/**
 * Structured farmer data — Capacitor SQLite on native, IndexedDB on web.
 */
import { isCapacitorNative } from "@/lib/capacitorNav";

const IDB_NAME = "agriveda-farmer-db";
const IDB_STORE = "kv";
const IDB_VERSION = 1;

type SqlitePlugin = {
  initWebStore?: () => Promise<void>;
  createConnection: (db: string, encrypted: boolean, mode: string, version: number) => Promise<{
    open: () => Promise<void>;
    execute: (sql: string) => Promise<void>;
    run: (sql: string, values?: unknown[]) => Promise<void>;
    query: (sql: string, values?: unknown[]) => Promise<{ values?: unknown[][] }>;
    close: () => Promise<void>;
  }>;
};

let dbReady: Promise<void> | null = null;
let useSqlite = false;

function openIndexedDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(key: string): Promise<string | null> {
  const db = await openIndexedDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(key);
    req.onsuccess = () => resolve((req.result as string | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key: string, value: string): Promise<void> {
  const db = await openIndexedDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function initSqlite(): Promise<void> {
  if (typeof window === "undefined" || !isCapacitorNative()) return;
  try {
    const { CapacitorSQLite } = await import("@capacitor-community/sqlite");
    const sqlite = CapacitorSQLite as unknown as SqlitePlugin;
    if (sqlite.initWebStore) await sqlite.initWebStore();
    const conn = await sqlite.createConnection("agriveda", false, "no-encryption", 1);
    await conn.open();
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS farmer_kv (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS spray_logs (
        id TEXT PRIMARY KEY NOT NULL,
        payload TEXT NOT NULL,
        synced INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      );
    `);
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS weather_cache (
        key TEXT PRIMARY KEY NOT NULL,
        payload TEXT NOT NULL,
        expires_at INTEGER NOT NULL
      );
    `);
    await conn.close();
    useSqlite = true;
  } catch {
    useSqlite = false;
  }
}

export async function initFarmerDb(): Promise<void> {
  if (dbReady) return dbReady;
  dbReady = initSqlite();
  return dbReady;
}

export async function farmerDbGet(key: string): Promise<string | null> {
  await initFarmerDb();
  if (useSqlite && isCapacitorNative()) {
    try {
      const { CapacitorSQLite } = await import("@capacitor-community/sqlite");
      const sqlite = CapacitorSQLite as unknown as SqlitePlugin;
      const conn = await sqlite.createConnection("agriveda", false, "no-encryption", 1);
      await conn.open();
      const result = await conn.query("SELECT value FROM farmer_kv WHERE key = ?", [key]);
      await conn.close();
      const row = result.values?.[0]?.[0];
      return typeof row === "string" ? row : null;
    } catch {
      /* fallback */
    }
  }
  if (typeof indexedDB !== "undefined") return idbGet(key);
  return null;
}

export async function farmerDbSet(key: string, value: string): Promise<void> {
  await initFarmerDb();
  if (useSqlite && isCapacitorNative()) {
    try {
      const { CapacitorSQLite } = await import("@capacitor-community/sqlite");
      const sqlite = CapacitorSQLite as unknown as SqlitePlugin;
      const conn = await sqlite.createConnection("agriveda", false, "no-encryption", 1);
      await conn.open();
      await conn.run(
        "INSERT OR REPLACE INTO farmer_kv (key, value, updated_at) VALUES (?, ?, ?)",
        [key, value, Date.now()]
      );
      await conn.close();
      return;
    } catch {
      /* fallback */
    }
  }
  if (typeof indexedDB !== "undefined") await idbSet(key, value);
}

/** One-time migration from localStorage keys into structured DB. */
export async function migrateLocalStorageToFarmerDb(): Promise<void> {
  if (typeof window === "undefined") return;
  const FLAG = "agriveda-sqlite-migrated-v1";
  if (localStorage.getItem(FLAG)) return;

  const keys = [
    "agriveda-spray-logs",
    "agriveda-mandi-history",
    "agriveda-outbreak-cache",
    "agriveda-weather-location",
  ];

  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (raw) await farmerDbSet(key, raw);
  }
  localStorage.setItem(FLAG, "1");
}

export async function cacheWeatherSnapshot(key: string, payload: unknown, ttlMs = 3 * 60_000): Promise<void> {
  const envelope = JSON.stringify({ payload, expiresAt: Date.now() + ttlMs });
  await farmerDbSet(`weather:${key}`, envelope);
}

export async function readWeatherSnapshot<T>(key: string): Promise<T | null> {
  const raw = await farmerDbGet(`weather:${key}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { payload: T; expiresAt: number };
    if (parsed.expiresAt < Date.now()) return null;
    return parsed.payload;
  } catch {
    return null;
  }
}
