import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

interface SyncPayload {
  action: "create" | "update";
  record: {
    id: string;
    retailerId: string;
    customerId: string;
    type: "debt" | "payment";
    amount: number;
    note?: string | null;
    createdAt: string;
    updatedAt: string;
    syncStatus?: string;
    lastSyncedAt?: string | null;
    clientId?: string | null;
  };
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  let body: SyncPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, record } = body;

  if (!action || !record?.id || !record?.retailerId) {
    return NextResponse.json(
      { error: "Missing action or record" },
      { status: 400 }
    );
  }

  // Transactions are append-only — no delete support
  if (action !== "create" && action !== "update") {
    return NextResponse.json(
      { error: "Transactions only support create/update" },
      { status: 400 }
    );
  }

  // Security: verify the record belongs to the authenticated retailer
  if (record.retailerId !== session!.retailerId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { default: prisma } = await import("@/lib/prisma");

  await prisma.transaction.upsert({
    where: { id: record.id },
    create: {
      id: record.id,
      retailerId: record.retailerId,
      customerId: record.customerId,
      type: record.type,
      amount: Math.round(record.amount),
      note: record.note ?? null,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      syncStatus: "synced",
      lastSyncedAt: new Date(),
      clientId: record.clientId ?? null,
    },
    update: {
      note: record.note ?? null,
      updatedAt: new Date(record.updatedAt),
      syncStatus: "synced",
      lastSyncedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
