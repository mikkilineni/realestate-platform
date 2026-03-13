import { prisma } from "@/lib/prisma";
import { BaseAdapter } from "./base";
import { IDXConfigInput, IDXProperty, IDXSearchParams, IDXSearchResult } from "../types";

export class ManualAdapter extends BaseAdapter {
  readonly type = "manual" as const;
  private tenantId: string;

  constructor(tenantId: string) {
    super();
    this.tenantId = tenantId;
  }

  isConfigured(_config: IDXConfigInput): boolean {
    return true; // always available
  }

  async search(params: IDXSearchParams): Promise<IDXSearchResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 12;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {
      tenantId: this.tenantId,
      status: "ACTIVE",
    };

    if (params.city) where.city = { contains: params.city, mode: "insensitive" };
    if (params.state) where.state = params.state;
    if (params.minPrice || params.maxPrice) {
      where.price = {};
      if (params.minPrice) (where.price as Record<string, number>).gte = params.minPrice;
      if (params.maxPrice) (where.price as Record<string, number>).lte = params.maxPrice;
    }
    if (params.minBeds) where.bedrooms = { gte: params.minBeds };
    if (params.minBaths) where.bathrooms = { gte: params.minBaths };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: pageSize,
        include: { images: { orderBy: { order: "asc" } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      properties: listings.map((l) => ({
        id: l.id,
        mlsId: l.mlsId ?? undefined,
        source: "manual" as const,
        address: l.address,
        city: l.city,
        state: l.state,
        zip: l.zip,
        price: l.price,
        bedrooms: l.bedrooms ?? undefined,
        bathrooms: l.bathrooms ?? undefined,
        sqft: l.sqft ?? undefined,
        description: l.description ?? undefined,
        slug: l.slug,
        images: l.images.map((i) => i.url),
        status: l.status.toLowerCase() as IDXProperty["status"],
      })),
      total,
      page,
      pageSize,
    };
  }

  async getById(id: string): Promise<IDXProperty | null> {
    const listing = await prisma.listing.findFirst({
      where: { OR: [{ id }, { slug: id }], tenantId: this.tenantId },
      include: { images: { orderBy: { order: "asc" } } },
    });

    if (!listing) return null;

    return {
      id: listing.id,
      mlsId: listing.mlsId ?? undefined,
      source: "manual",
      address: listing.address,
      city: listing.city,
      state: listing.state,
      zip: listing.zip,
      price: listing.price,
      bedrooms: listing.bedrooms ?? undefined,
      bathrooms: listing.bathrooms ?? undefined,
      sqft: listing.sqft ?? undefined,
      description: listing.description ?? undefined,
      slug: listing.slug,
      images: listing.images.map((i) => i.url),
      status: listing.status.toLowerCase() as IDXProperty["status"],
    };
  }
}
