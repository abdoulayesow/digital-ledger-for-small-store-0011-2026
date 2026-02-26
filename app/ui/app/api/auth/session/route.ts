import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;

  const { default: prisma } = await import("@/lib/prisma");

  const retailer = await prisma.retailer.findUnique({
    where: { id: session!.retailerId },
    select: {
      id: true,
      phone: true,
      language: true,
      shopName: true,
      neighborhood: true,
    },
  });

  if (!retailer) {
    return NextResponse.json({ error: "Retailer not found" }, { status: 404 });
  }

  return NextResponse.json({ retailer });
}
