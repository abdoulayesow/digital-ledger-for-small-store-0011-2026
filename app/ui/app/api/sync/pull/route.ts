import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

const MAX_RECORDS_PER_TABLE = 500;

export async function GET(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  const sinceParam = req.nextUrl.searchParams.get("since");
  const since = sinceParam ? new Date(sinceParam) : new Date(0);

  if (isNaN(since.getTime())) {
    return NextResponse.json(
      { error: "Invalid since parameter" },
      { status: 400 }
    );
  }

  const { default: prisma } = await import("@/lib/prisma");
  const retailerId = session!.retailerId;
  const serverTime = new Date().toISOString();

  const [customers, transactions] = await Promise.all([
    prisma.customer.findMany({
      where: {
        retailerId,
        updatedAt: { gt: since },
      },
      orderBy: { updatedAt: "asc" },
      take: MAX_RECORDS_PER_TABLE,
    }),
    prisma.transaction.findMany({
      where: {
        retailerId,
        updatedAt: { gt: since },
      },
      orderBy: { updatedAt: "asc" },
      take: MAX_RECORDS_PER_TABLE,
    }),
  ]);

  return NextResponse.json({
    customers,
    transactions,
    serverTime,
  });
}
