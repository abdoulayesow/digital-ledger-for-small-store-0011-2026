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

  // Input validation
  if (!record.name || typeof record.name !== "string" || record.name.length > 200) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (record.phone && (typeof record.phone !== "string" || record.phone.length > 30)) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }

  // Security: verify the record belongs to the authenticated retailer
  if (record.retailerId !== session!.retailerId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { default: prisma } = await import("@/lib/prisma");

    // IDOR protection: verify existing record belongs to this retailer
    const existing = await prisma.customer.findUnique({
      where: { id: record.id },
      select: { retailerId: true },
    });
    if (existing && existing.retailerId !== session!.retailerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (action === "delete") {
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
  } catch (err) {
    console.error("[api/sync/customers] Database error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
