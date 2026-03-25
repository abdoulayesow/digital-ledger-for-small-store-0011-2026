import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { parsePhone } from "@/lib/utils/phone";
import { setSessionCookie } from "@/lib/auth";
import { PIN_LENGTH, PIN_DEV_CODE, PIN_MAX_ATTEMPTS, PIN_LOCKOUT_MINUTES, SESSION_DURATION_DAYS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  let body: { phone?: string; pin?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const phone = parsePhone(body.phone ?? "");
  const pin = String(body.pin ?? "").trim();

  if (!phone) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  if (!pin || pin.length !== PIN_LENGTH || !/^\d+$/.test(pin)) {
    return NextResponse.json({ error: "invalid_pin_format" }, { status: 400 });
  }

  // Dev bypass
  if (process.env.DEV_BYPASS_AUTH === "true" && process.env.NODE_ENV !== "production" && pin === PIN_DEV_CODE) {
    await setSessionCookie("dev-session-token");
    return NextResponse.json({
      success: true,
      retailer: {
        id: "dev-retailer-00000000",
        phone,
        language: "fr",
        shopName: null,
      },
    });
  }

  try {
    const { default: prisma } = await import("@/lib/prisma");

    const retailer = await prisma.retailer.findUnique({ where: { phone } });

    if (!retailer) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (!retailer.pinHash) {
      return NextResponse.json({ error: "no_pin_set" }, { status: 400 });
    }

    // Check lockout
    if (retailer.pinLockedUntil && retailer.pinLockedUntil > new Date()) {
      return NextResponse.json({ error: "account_locked" }, { status: 429 });
    }

    // Compare PIN
    const match = await bcrypt.compare(pin, retailer.pinHash);

    if (!match) {
      const attempts = retailer.pinAttempts + 1;
      const lockout = attempts >= PIN_MAX_ATTEMPTS
        ? new Date(Date.now() + PIN_LOCKOUT_MINUTES * 60 * 1000)
        : null;

      await prisma.retailer.update({
        where: { id: retailer.id },
        data: {
          pinAttempts: attempts,
          pinLockedUntil: lockout,
        },
      });

      if (lockout) {
        return NextResponse.json({ error: "account_locked" }, { status: 429 });
      }

      return NextResponse.json({ error: "invalid_pin" }, { status: 400 });
    }

    // Reset attempts on success
    if (retailer.pinAttempts > 0) {
      await prisma.retailer.update({
        where: { id: retailer.id },
        data: { pinAttempts: 0, pinLockedUntil: null },
      });
    }

    // Create session
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: { retailerId: retailer.id, token, expiresAt },
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      retailer: {
        id: retailer.id,
        phone: retailer.phone,
        language: retailer.language,
        shopName: retailer.shopName,
      },
    });
  } catch (err) {
    console.error("[api/auth/login] Database error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
