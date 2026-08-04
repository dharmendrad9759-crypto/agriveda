import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  createSupabaseServiceClient,
  getSupabaseUrl,
  hasSupabaseServiceRole,
} from "@/lib/supabase";
import { expertQueriesBackendReady } from "@/lib/expertQueries";

/**
 * Admin-only diagnostics — never expose project host / key status publicly.
 * GET /api/expert-queries/status
 */
export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if ("error" in admin) return admin.error;

  const normalized = getSupabaseUrl();
  const hasService = hasSupabaseServiceRole();

  let tableOk: boolean | null = null;
  let tableError: string | undefined;

  if (normalized && hasService) {
    try {
      const client = createSupabaseServiceClient();
      if (client) {
        const { error } = await client.from("expert_queries").select("id").limit(1);
        if (error) {
          tableOk = false;
          tableError = error.message.slice(0, 160);
        } else {
          tableOk = true;
        }
      }
    } catch (err) {
      tableOk = false;
      tableError = err instanceof Error ? err.message.slice(0, 160) : "error";
    }
  }

  return NextResponse.json({
    ok: expertQueriesBackendReady() && hasService && Boolean(normalized) && tableOk !== false,
    supabaseConfigured: Boolean(normalized),
    serviceRole: hasService,
    tableOk,
    tableError: tableOk === false ? tableError : undefined,
  });
}
