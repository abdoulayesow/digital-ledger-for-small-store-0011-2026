import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { parsePhone } from "@/lib/utils/phone";
import { setSessionCookie } from "@/lib/auth";

const MAX_ATTEMPTS = 5;
const SESSION_DURATION_DAYS = 30;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const phone = parsePhone(body.phone ?? "");
  const code = String(body.code ?? "").trim();

  if (!phone || !code) {
    return NextResponse.json(
      { error: "Phone and code are required" },
      { status: 400 }
    );
  }

  const { default: prisma } = await import("@/lib/prisma");

  // Find the most recent unexpired, unverified OTP for this phone
  const otp = await prisma.otpVerification.findFirst({
    where: {
      phone,
      verified: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    return NextResponse.json(
      { error: "No valid OTP found. Please request a new code." },
      { status: 400 }
    );
  }

  if (otp.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many attempts. Please request a new code." },
      { status: 429 }
    );
  }

  if (otp.code !== code) {
    await prisma.otpVerification.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  // Mark OTP as verified
  await prisma.otpVerification.update({
    where: { id: otp.id },
    data: { verified: true },
  });

  // Find or create retailer
  let retailer = await prisma.retailer.findUnique({ where: { phone } });
  if (!retailer) {
    retailer = await prisma.retailer.create({ data: { phone } });
  }

  // Create session
  const token = randomUUID();
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
  );

  await prisma.session.create({
    data: {
      retailerId: retailer.id,
      token,
      expiresAt,
    },
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
}
