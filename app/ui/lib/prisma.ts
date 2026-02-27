/**
 * Prisma client singleton for server-side use.
 * Import: `import prisma from "@/lib/prisma"`
 *
 * In API routes, use dynamic import to keep Prisma out of client bundles:
 *   const { default: prisma } = await import("@/lib/prisma")
 */
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
