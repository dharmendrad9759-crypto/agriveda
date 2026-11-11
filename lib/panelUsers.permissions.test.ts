import { describe, expect, it } from "vitest";
import { permissionsForUser } from "@/lib/panelUsers";

describe("permissionsForUser", () => {
  it("does not grant view-all or assign when manager flags are false", () => {
    const p = permissionsForUser({
      role: "manager",
      canAssign: false,
      canManageExperts: false,
      canViewAll: false,
    });
    expect(p.assignQueries).toBe(false);
    expect(p.viewAllQueries).toBe(false);
    expect(p.replyAll).toBe(false);
    expect(p.manageExperts).toBe(false);
    expect(p.accessSettings).toBe(false);
  });

  it("honors manager flags when true", () => {
    const p = permissionsForUser({
      role: "manager",
      canAssign: true,
      canManageExperts: true,
      canViewAll: true,
    });
    expect(p.assignQueries).toBe(true);
    expect(p.viewAllQueries).toBe(true);
    expect(p.replyAll).toBe(true);
    expect(p.manageExperts).toBe(true);
  });

  it("owner always has full access", () => {
    const p = permissionsForUser({
      role: "owner",
      canAssign: false,
      canManageExperts: false,
      canViewAll: false,
    });
    expect(p.viewAllQueries).toBe(true);
    expect(p.assignQueries).toBe(true);
    expect(p.accessSettings).toBe(true);
  });

  it("expert is least privilege", () => {
    const p = permissionsForUser({
      role: "expert",
      canAssign: false,
      canManageExperts: false,
      canViewAll: false,
    });
    expect(p).toEqual({
      manageExperts: false,
      assignQueries: false,
      replyAll: false,
      viewAllQueries: false,
      accessSettings: false,
    });
  });
});
