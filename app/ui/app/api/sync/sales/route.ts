import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

interface SyncPayload {
  action: "create" | "update" | "delete";
  record: {
    id: string;
    retailerId: string;
    customerId: string | null;
    type: "cash" | "credit" | "payment";
    amount: number;
    note?: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
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

  const validActions = ["create", "update", "delete"] as const;
  if (!validActions.includes(action as typeof validActions[number])) {
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  }

  // Security: verify the record belongs to the authenticated retailer
  if (record.retailerId !== session!.retailerId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Input validation
  const validTypes = ["cash", "credit", "payment"] as const;
  if (!validTypes.includes(record.type as typeof validTypes[number])) {
    return NextResponse.json(
      { error: "Invalid sale type" },
      { status: 400 }
    );
  }

  if (!record.amount || record.amount <= 0) {
    return NextResponse.json(
      { error: "Amount must be positive" },
      { status: 400 }
    );
  }

  if (record.type === "credit" && !record.customerId) {
    return NextResponse.json(
      { error: "Credit sales require a customerId" },
      { status: 400 }
    );
  }

  try {
    const { default: prisma } = await import("@/lib/prisma");

    // IDOR protection: verify existing record belongs to this retailer
    const existing = await prisma.sale.findUnique({
      where: { id: record.id },
      select: { retailerId: true },
    });
    if (existing && existing.retailerId !== session!.retailerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (action === "delete") {
      await prisma.sale.upsert({
        where: { id: record.id },
        create: {
          id: record.id,
          retailerId: record.retailerId,
          customerId: record.customerId ?? null,
          type: record.type,
          amount: Math.round(record.amount),
          note: record.note ?? null,
          createdAt: new Date(record.createdAt),
          updatedAt: new Date(record.updatedAt),
          deletedAt: record.deletedAt ? new Date(record.deletedAt) : new Date(),
          syncStatus: "synced",
          lastSyncedAt: new Date(),
          clientId: record.clientId ?? null,
        },
        update: {
          deletedAt: record.deletedAt ? new Date(record.deletedAt) : new Date(),
          updatedAt: new Date(record.updatedAt),
          syncStatus: "synced",
          lastSyncedAt: new Date(),
        },
      });
    } else {
      await prisma.sale.upsert({
        where: { id: record.id },
        create: {
          id: record.id,
          retailerId: record.retailerId,
          customerId: record.customerId ?? null,
          type: record.type,
          amount: Math.round(record.amount),
          note: record.note ?? null,
          createdAt: new Date(record.createdAt),
          updatedAt: new Date(record.updatedAt),
          deletedAt: null,
          syncStatus: "synced",
          lastSyncedAt: new Date(),
          clientId: record.clientId ?? null,
        },
        update: {
          note: record.note ?? null,
          updatedAt: new Date(record.updatedAt),
          deletedAt: record.deletedAt ? new Date(record.deletedAt) : null,
          syncStatus: "synced",
          lastSyncedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/sync/sales] Database error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
