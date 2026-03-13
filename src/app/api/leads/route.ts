import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantByHostname } from "@/lib/tenant";

export async function POST(req: NextRequest) {
  const hostname = req.headers.get("x-tenant-hostname") ?? req.headers.get("host") ?? "";
  const tenant = await getTenantByHostname(hostname);

  if (!tenant || !tenant.active) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const body = await req.json();
  const { firstName, lastName, email, phone, message, source } = body;

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: {
      tenantId: tenant.id,
      firstName,
      lastName,
      email,
      phone: phone || null,
      message: message || null,
      source: source || "contact_form",
    },
  });

  return NextResponse.json(lead, { status: 201 });
}
