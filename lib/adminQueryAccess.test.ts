import { describe, expect, it } from "vitest";
import { canAccessQuery } from "@/lib/adminQueryAccess";
import type { AdminSession } from "@/lib/adminAuth";

function session(partial: Partial<AdminSession>): AdminSession {
  return {
    role: "expert",
    userId: "exp-1",
    displayName: "E",
    username: "e",
    permissions: {
      manageExperts: false,
      assignQueries: false,
      replyAll: false,
      viewAllQueries: false,
      accessSettings: false,
    },
    cropScopes: [],
    exp: Math.floor(Date.now() / 1000) + 3600,
    ...partial,
  };
}

describe("canAccessQuery", () => {
  it("blocks experts from the unassigned queue", () => {
    const ok = canAccessQuery(session({}), {
      assigned_to: null,
      status: "pending",
    });
    expect(ok).toBe(false);
  });

  it("allows an expert to see their assignment", () => {
    const ok = canAccessQuery(session({}), {
      assigned_to: "exp-1",
      status: "pending",
    });
    expect(ok).toBe(true);
  });

  it("allows assigners to see unassigned tickets", () => {
    const ok = canAccessQuery(
      session({
        permissions: {
          manageExperts: false,
          assignQueries: true,
          replyAll: false,
          viewAllQueries: false,
          accessSettings: false,
        },
      }),
      { assigned_to: null, status: "pending" }
    );
    expect(ok).toBe(true);
  });
});
