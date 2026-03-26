import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
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

function makeRetailer(overrides: Record<string, unknown> = {}) {
  return {
    id: "r1",
    phone: "+224622123456",
    pinHash: bcrypt.hashSync(VALID_PIN, 4), // low rounds for speed
    pinAttempts: 0,
    pinLockedUntil: null,
    language: "fr",
    shopName: null,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockPrisma.session.create.mockResolvedValue({ id: "s1" });
  mockPrisma.session.deleteMany.mockResolvedValue({ count: 0 });
});

describe("POST /api/auth/login", () => {
  it("returns 400 for invalid JSON", async () => {
    const res = await POST(new NextRequest(makeInvalidRequest()));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid phone", async () => {
    const res = await POST(new NextRequest(makeRequest({ phone: "bad", pin: VALID_PIN })));
    expect(res.status).toBe(400);
  });

  it("returns 400 for non-numeric PIN", async () => {
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: "abcd" })));
    expect(res.status).toBe(400);
  });

  it("returns 400 for wrong-length PIN", async () => {
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: "12" })));
    expect(res.status).toBe(400);
  });

  it("returns 404 when phone not found", async () => {
    mockPrisma.retailer.findUnique.mockResolvedValue(null);
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: VALID_PIN })));
    expect(res.status).toBe(404);
  });

  it("returns 400 when no PIN is set", async () => {
    mockPrisma.retailer.findUnique.mockResolvedValue(makeRetailer({ pinHash: null }));
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: VALID_PIN })));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("no_pin_set");
  });

  it("returns 429 when account is locked", async () => {
    mockPrisma.retailer.findUnique.mockResolvedValue(
      makeRetailer({ pinLockedUntil: new Date(Date.now() + 60_000) })
    );
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: VALID_PIN })));
    expect(res.status).toBe(429);
  });

  it("returns 400 and increments attempts on wrong PIN", async () => {
    mockPrisma.retailer.findUnique.mockResolvedValue(makeRetailer());
    mockPrisma.retailer.update.mockResolvedValue({});
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: "0000" })));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("invalid_pin");
    expect(mockPrisma.retailer.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ pinAttempts: 1 }),
      })
    );
  });

  it("returns 429 and locks account on 5th failed attempt", async () => {
    mockPrisma.retailer.findUnique.mockResolvedValue(makeRetailer({ pinAttempts: 4 }));
    mockPrisma.retailer.update.mockResolvedValue({});
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: "0000" })));
    expect(res.status).toBe(429);
    expect(mockPrisma.retailer.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          pinAttempts: 5,
          pinLockedUntil: expect.any(Date),
        }),
      })
    );
  });

  it("returns success and creates session on correct PIN", async () => {
    mockPrisma.retailer.findUnique.mockResolvedValue(makeRetailer());
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: VALID_PIN })));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.retailer.id).toBe("r1");
    expect(mockPrisma.session.create).toHaveBeenCalled();
  });

  it("resets attempts on successful login after failures", async () => {
    mockPrisma.retailer.findUnique.mockResolvedValue(makeRetailer({ pinAttempts: 3 }));
    mockPrisma.retailer.update.mockResolvedValue({});
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: VALID_PIN })));
    expect(res.status).toBe(200);
    expect(mockPrisma.retailer.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { pinAttempts: 0, pinLockedUntil: null },
      })
    );
  });

  it("cleans up expired sessions on login", async () => {
    mockPrisma.retailer.findUnique.mockResolvedValue(makeRetailer());
    await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: VALID_PIN })));
    expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          retailerId: "r1",
          expiresAt: expect.objectContaining({ lt: expect.any(Date) }),
        }),
      })
    );
  });

  it("returns 500 on database error", async () => {
    mockPrisma.retailer.findUnique.mockRejectedValue(new Error("DB down"));
    const res = await POST(new NextRequest(makeRequest({ phone: VALID_PHONE, pin: VALID_PIN })));
    expect(res.status).toBe(500);
  });
});
