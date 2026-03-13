import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function generateSlug(address: string): string {
  return address
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = session.user.tenantId;
  const body = await req.json();
  const { address, city, state, zip, price, bedrooms, bathrooms, sqft, description } = body;

  if (!address || !city || !state || !zip || !price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const baseSlug = generateSlug(`${address} ${city}`);
  let slug = baseSlug;
  let counter = 0;

  while (true) {
    const existing = await prisma.listing.findUnique({ where: { tenantId_slug: { tenantId, slug } } });
    if (!existing) break;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  const listing = await prisma.listing.create({
    data: {
      tenantId,
      address,
      city,
      state,
      zip,
      price: Number(price),
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      sqft: sqft ? Number(sqft) : null,
      description: description || null,
      slug,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listings = await prisma.listing.findMany({
    where: { tenantId: session.user.tenantId },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(listings);
}
