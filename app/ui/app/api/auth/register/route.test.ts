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

const VALID_PHONE = "622123456";
const VALID_PIN = "5678";

beforeEach(() => {
  vi.clearAllMocks();
  mockPrisma.session.create.mockResolvedValue({ id: "s1" });
});

describe("POST /api/auth/register", () => {
  it("returns 400 for invalid JSON", async () => {
    const res = await POST(new NextRequest(makeInvalidRequest()));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid phone", async () => {
    const res = await POST(new NextRequest(makeRequest({ phone: "bad", pin: VALID_PIN })));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid PIN format", async () => {
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: "ab" })));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("invalid_pin_format");
  });

  it("returns 409 when phone is already taken", async () => {
    mockPrisma.retailer.findUnique.mockResolvedValue({ id: "existing" });
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: VALID_PIN })));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe("phone_taken");
  });

  it("creates retailer and session on success", async () => {
    mockPrisma.retailer.findUnique.mockResolvedValue(null);
    mockPrisma.retailer.create.mockResolvedValue({
      id: "new-r1",
      phone: "+224622123456",
      language: "fr",
      shopName: null,
    });

    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: VALID_PIN })));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.retailer.id).toBe("new-r1");

    // Verify retailer was created with hashed PIN
    expect(mockPrisma.retailer.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          phone: "+224622123456",
          pinHash: expect.any(String),
        }),
      })
    );

    // Verify session was created
    expect(mockPrisma.session.create).toHaveBeenCalled();
  });

  it("returns 500 on database error", async () => {
    mockPrisma.retailer.findUnique.mockRejectedValue(new Error("DB down"));
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: VALID_PIN })));
    expect(res.status).toBe(500);
  });
});
