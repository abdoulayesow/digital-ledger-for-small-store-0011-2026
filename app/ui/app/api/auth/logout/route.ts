import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookie, SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const { default: prisma } = await import("@/lib/prisma");
    await prisma.session.deleteMany({ where: { token } });
  }

  await clearSessionCookie();

  return NextResponse.json({ success: true });
}
