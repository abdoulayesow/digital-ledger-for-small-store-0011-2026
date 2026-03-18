import { NextRequest, NextResponse } from "next/server";
import { parsePhone } from "@/lib/utils/phone";
import { generateOtp, OTP_EXPIRY_MINUTES } from "@/lib/otp/generate";
import { sendWhatsAppOtp } from "@/lib/otp/send-whatsapp";
import { sendSmsOtp } from "@/lib/otp/send-sms";

const DEV_CODE = "123456";
const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX = 3;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const phone = parsePhone(body.phone ?? "");
  const channel: "whatsapp" | "sms" = body.channel === "sms" ? "sms" : "whatsapp";

  if (!phone) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 }
    );
  }

  const { default: prisma } = await import("@/lib/prisma");

  // Rate limit: max 3 OTPs per phone in 10 minutes
  const recentCount = await prisma.otpVerification.count({
    where: {
      phone,
      createdAt: {
        gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000),
      },
    },
  });

  if (recentCount >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "too_many_requests" },
      { status: 429 }
    );
  }

  // Generate OTP
  const isDev = process.env.DEV_BYPASS_AUTH === "true";
  const code = isDev ? DEV_CODE : generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Store in DB
  await prisma.otpVerification.create({
    data: { phone, code, channel, expiresAt },
  });

  // Lazy cleanup: delete expired/verified records for this phone
  prisma.otpVerification.deleteMany({
    where: {
      phone,
      OR: [{ expiresAt: { lt: new Date() } }, { verified: true }],
    },
  }).catch(() => {});

  // Send OTP (skip in dev)
  if (!isDev) {
    let sent = false;
    if (channel === "whatsapp") {
      sent = await sendWhatsAppOtp(phone, code);
      if (!sent) {
        return NextResponse.json(
          { error: "whatsapp_failed", suggestion: "sms" },
          { status: 502 }
        );
      }
    } else {
      sent = await sendSmsOtp(phone, code);
      if (!sent) {
        return NextResponse.json(
          { error: "sms_failed" },
          { status: 502 }
        );
      }
    }
  } else {
    console.log(`[DEV] OTP for ${phone}: ${code}`);
  }

  return NextResponse.json({ success: true, channel });
}
