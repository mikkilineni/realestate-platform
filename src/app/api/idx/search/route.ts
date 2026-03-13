import { NextRequest, NextResponse } from "next/server";
import { getTenantByHostname } from "@/lib/tenant";
import { getIDXAdapter } from "@/lib/idx/registry";

export async function GET(req: NextRequest) {
  const hostname = req.headers.get("x-tenant-hostname") ?? req.headers.get("host") ?? "";
  const tenant = await getTenantByHostname(hostname);

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const { searchParams } = req.nextUrl;
  const adapter = getIDXAdapter(tenant.id, tenant.idxConfig);

  const results = await adapter.search({
    city: searchParams.get("city") ?? undefined,
    state: searchParams.get("state") ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    minBeds: searchParams.get("minBeds") ? Number(searchParams.get("minBeds")) : undefined,
    minBaths: searchParams.get("minBaths") ? Number(searchParams.get("minBaths")) : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 12,
  });

  return NextResponse.json(results);
}
