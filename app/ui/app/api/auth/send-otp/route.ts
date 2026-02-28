import { NextRequest, NextResponse } from "next/server";
import { parsePhone } from "@/lib/utils/phone";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const phone = parsePhone(body.phone ?? "");

  if (!phone) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 }
    );
  }

  if (process.env.DEV_BYPASS_AUTH === "true") {
    console.log(`[DEV BYPASS] OTP for ${phone}: use code 123456`);
    return NextResponse.json({ success: true });
  }

  const { default: prisma } = await import("@/lib/prisma");

  // Generate 6-digit OTP
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.otpVerification.create({
    data: { phone, code, expiresAt },
  });

  // TODO: Send SMS via provider (Twilio, Africa's Talking, etc.)
  // For development, log the code
  if (process.env.NODE_ENV !== "production") {
    console.log(`[DEV] OTP for ${phone}: ${code}`);
  }

  return NextResponse.json({ success: true });
}
