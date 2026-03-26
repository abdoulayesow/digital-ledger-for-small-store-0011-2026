import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  mockPrisma,
  mockCookieStore,
  makeRequest,
  makeInvalidRequest,
} from "@/lib/test-helpers/mock-prisma";

vi.mock("@/lib/prisma", () => ({ default: mockPrisma }));
vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue(mockCookieStore),
}));

import { POST } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/auth/check-phone", () => {
  it("returns 400 for invalid JSON", async () => {
    const res = await POST(new NextRequest(makeInvalidRequest()));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid JSON");
  });

  it("returns 400 for invalid phone number", async () => {
    const res = await POST(new NextRequest(makeRequest({ phone: "abc" })));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid phone number");
  });

  it("returns exists: true when phone is registered", async () => {
    mockPrisma.retailer.findUnique.mockResolvedValue({ id: "r1" });
    const res = await POST(new NextRequest(makeRequest({ phone: "622123456" })));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.exists).toBe(true);
  });

  it("returns exists: false when phone is not registered", async () => {
    mockPrisma.retailer.findUnique.mockResolvedValue(null);
    const res = await POST(new NextRequest(makeRequest({ phone: "622123456" })));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.exists).toBe(false);
  });

  it("returns 500 on database error", async () => {
    mockPrisma.retailer.findUnique.mockRejectedValue(new Error("DB down"));
    const res = await POST(new NextRequest(makeRequest({ phone: "622123456" })));
    expect(res.status).toBe(500);
  });
});
