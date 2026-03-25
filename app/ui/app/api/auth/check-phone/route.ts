import { NextRequest, NextResponse } from "next/server";
import { parsePhone } from "@/lib/utils/phone";

export async function POST(req: NextRequest) {
  let body: { phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const phone = parsePhone(body.phone ?? "");
  if (!phone) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  try {
    const { default: prisma } = await import("@/lib/prisma");
    const retailer = await prisma.retailer.findUnique({
      where: { phone },
      select: { id: true },
    });

    return NextResponse.json({ exists: !!retailer });
  } catch (err) {
    console.error("[api/auth/check-phone] Database error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
