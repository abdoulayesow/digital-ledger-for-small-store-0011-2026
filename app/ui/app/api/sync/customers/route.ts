import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

interface SyncPayload {
  action: "create" | "update" | "delete";
  record: {
    id: string;
    retailerId: string;
    name: string;
    phone?: string | null;
    colorCode: string;
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

  // Security: verify the record belongs to the authenticated retailer
  if (record.retailerId !== session!.retailerId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { default: prisma } = await import("@/lib/prisma");

  if (action === "delete") {
    // Soft delete: set deletedAt
    await prisma.customer.upsert({
      where: { id: record.id },
      create: {
        id: record.id,
        retailerId: record.retailerId,
        name: record.name,
        phone: record.phone ?? null,
        colorCode: record.colorCode,
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
    // Create or update via upsert for idempotency
    await prisma.customer.upsert({
      where: { id: record.id },
      create: {
        id: record.id,
        retailerId: record.retailerId,
        name: record.name,
        phone: record.phone ?? null,
        colorCode: record.colorCode,
        createdAt: new Date(record.createdAt),
        updatedAt: new Date(record.updatedAt),
        deletedAt: null,
        syncStatus: "synced",
        lastSyncedAt: new Date(),
        clientId: record.clientId ?? null,
      },
      update: {
        name: record.name,
        phone: record.phone ?? null,
        colorCode: record.colorCode,
        updatedAt: new Date(record.updatedAt),
        deletedAt: record.deletedAt ? new Date(record.deletedAt) : null,
        syncStatus: "synced",
        lastSyncedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ success: true });
}
