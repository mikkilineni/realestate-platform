import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { firstName, lastName, email, password, slug, phone } = body;

  if (!firstName || !lastName || !email || !password || !slug) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const platformDomain = process.env.PLATFORM_DOMAIN ?? "localhost";
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, password: hashedPassword, role: "AGENT" },
      });

      const tenant = await tx.tenant.create({
        data: {
          slug,
          platformDomain: `${slug}.${platformDomain}`,
          siteConfig: { create: {} },
        },
      });

      const agent = await tx.agent.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          firstName,
          lastName,
          phone: phone || null,
        },
      });

      return { user, tenant, agent };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Email or slug already taken" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agents = await prisma.agent.findMany({
    include: { tenant: true, user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(agents);
}
