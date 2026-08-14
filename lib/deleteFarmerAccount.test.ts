import { describe, expect, it } from "vitest";
import { deleteFarmerAccountServer } from "@/lib/deleteFarmerAccount";

describe("deleteFarmerAccountServer", () => {
  it("rejects empty deviceId", async () => {
    const res = await deleteFarmerAccountServer({ deviceId: "", phone: "9999999999" });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toMatch(/deviceId/i);
  });

  it("accepts Google-only wipe (no phone) when Supabase unset in non-prod", async () => {
    const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const prevKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const res = await deleteFarmerAccountServer({
      deviceId: "test-device-google-only",
      firebaseUid: "uid-test-12345678",
    });
    expect(res.ok).toBe(true);

    if (prevUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl;
    if (prevKey) process.env.SUPABASE_SERVICE_ROLE_KEY = prevKey;
  });
});
