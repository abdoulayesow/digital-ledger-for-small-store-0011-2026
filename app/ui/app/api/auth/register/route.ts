import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { parsePhone } from "@/lib/utils/phone";
import { setSessionCookie } from "@/lib/auth";
import { PIN_LENGTH, PIN_DEV_CODE, SESSION_DURATION_DAYS } from "@/lib/constants";

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

    // Check if phone already registered
    const existing = await prisma.retailer.findUnique({
      where: { phone },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ error: "phone_taken" }, { status: 409 });
    }

    // Hash PIN and create retailer
    const pinHash = await bcrypt.hash(pin, 10);
    const retailer = await prisma.retailer.create({
      data: { phone, pinHash },
    });

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
    console.error("[api/auth/register] Database error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
