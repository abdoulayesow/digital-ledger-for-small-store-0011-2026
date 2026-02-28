import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

const DEV_RETAILER_ID = "dev-retailer-00000000";

export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;

  if (process.env.DEV_BYPASS_AUTH === "true") {
    return NextResponse.json({
      retailer: {
        id: DEV_RETAILER_ID,
        phone: "+224622000000",
        language: "fr",
        shopName: "Boutique Test",
        neighborhood: null,
      },
    });
  }

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
