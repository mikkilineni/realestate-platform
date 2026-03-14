import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, unknown> = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "not set",
  };

  try {
    const userCount = await prisma.user.count();
    checks.db_connected = true;
    checks.user_count = userCount;
  } catch (err) {
    checks.db_connected = false;
    checks.db_error = String(err);
  }

  return NextResponse.json(checks);
}
