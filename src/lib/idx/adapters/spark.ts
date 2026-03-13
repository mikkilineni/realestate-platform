import { BaseAdapter } from "./base";
import { IDXConfigInput, IDXProperty, IDXSearchParams, IDXSearchResult } from "../types";

export class SparkAdapter extends BaseAdapter {
  readonly type = "spark" as const;
  private config: IDXConfigInput;

  constructor(config: IDXConfigInput) {
    super();
    this.config = config;
  }

  isConfigured(config: IDXConfigInput): boolean {
    return !!(config.apiKey);
  }

  async search(params: IDXSearchParams): Promise<IDXSearchResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 12;

    const url = new URL("https://sparkapi.com/v1/listings");
    if (params.city) url.searchParams.set("_filter", `City Eq '${params.city}'`);
    url.searchParams.set("_limit", String(pageSize));
    url.searchParams.set("_offset", String((page - 1) * pageSize));

    const res = await fetch(url.toString(), {
      headers: { Authorization: `OAuth ${this.config.apiKey}` },
    });

    if (!res.ok) throw new Error(`Spark API error: ${res.status}`);
    const data = await res.json();

    return {
      properties: (data.D?.Results ?? []).map(this.mapProperty),
      total: data.D?.Pagination?.TotalRows ?? 0,
      page,
      pageSize,
    };
  }

  async getById(mlsId: string): Promise<IDXProperty | null> {
    const res = await fetch(`https://sparkapi.com/v1/listings/${mlsId}`, {
      headers: { Authorization: `OAuth ${this.config.apiKey}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const p = data.D?.Results?.[0];
    return p ? this.mapProperty(p) : null;
  }

  private mapProperty(p: Record<string, unknown>): IDXProperty {
    const std = p.StandardFields as Record<string, unknown> ?? {};
    return {
      id: String(p.Id ?? ""),
      mlsId: String(p.Id ?? ""),
      source: "spark",
      address: String(std.UnparsedAddress ?? ""),
      city: String(std.City ?? ""),
      state: String(std.StateOrProvince ?? ""),
      zip: String(std.PostalCode ?? ""),
      price: Number(std.ListPrice ?? 0),
      bedrooms: std.BedsTotal ? Number(std.BedsTotal) : undefined,
      bathrooms: std.BathsTotal ? Number(std.BathsTotal) : undefined,
      sqft: std.BuildingAreaTotal ? Number(std.BuildingAreaTotal) : undefined,
      slug: String(p.Id ?? ""),
      images: [],
      status: "active",
    };
  }
}
