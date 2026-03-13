import { BaseAdapter } from "./base";
import { IDXConfigInput, IDXProperty, IDXSearchParams, IDXSearchResult } from "../types";

export class RESOAdapter extends BaseAdapter {
  readonly type = "reso" as const;
  private config: IDXConfigInput;

  constructor(config: IDXConfigInput) {
    super();
    this.config = config;
  }

  isConfigured(config: IDXConfigInput): boolean {
    return !!(config.apiEndpoint && config.apiKey);
  }

  async search(params: IDXSearchParams): Promise<IDXSearchResult> {
    const filters: string[] = ["StandardStatus eq 'Active'"];
    if (params.city) filters.push(`City eq '${params.city}'`);
    if (params.minPrice) filters.push(`ListPrice ge ${params.minPrice}`);
    if (params.maxPrice) filters.push(`ListPrice le ${params.maxPrice}`);
    if (params.minBeds) filters.push(`BedroomsTotal ge ${params.minBeds}`);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 12;
    const skip = (page - 1) * pageSize;

    const url = new URL(`${this.config.apiEndpoint}/Property`);
    url.searchParams.set("$filter", filters.join(" and "));
    url.searchParams.set("$top", String(pageSize));
    url.searchParams.set("$skip", String(skip));
    url.searchParams.set("$count", "true");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${this.config.apiKey}` },
    });

    if (!res.ok) throw new Error(`RESO API error: ${res.status}`);
    const data = await res.json();

    return {
      properties: (data.value ?? []).map(this.mapProperty),
      total: data["@odata.count"] ?? 0,
      page,
      pageSize,
    };
  }

  async getById(mlsId: string): Promise<IDXProperty | null> {
    const url = `${this.config.apiEndpoint}/Property('${mlsId}')`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.config.apiKey}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return this.mapProperty(data);
  }

  private mapProperty(p: Record<string, unknown>): IDXProperty {
    return {
      id: String(p.ListingKey ?? p.ListingId),
      mlsId: String(p.ListingId ?? ""),
      source: "reso",
      address: String(p.UnparsedAddress ?? ""),
      city: String(p.City ?? ""),
      state: String(p.StateOrProvince ?? ""),
      zip: String(p.PostalCode ?? ""),
      price: Number(p.ListPrice ?? 0),
      bedrooms: p.BedroomsTotal ? Number(p.BedroomsTotal) : undefined,
      bathrooms: p.BathroomsTotalInteger ? Number(p.BathroomsTotalInteger) : undefined,
      sqft: p.LivingArea ? Number(p.LivingArea) : undefined,
      description: p.PublicRemarks ? String(p.PublicRemarks) : undefined,
      slug: String(p.ListingKey ?? p.ListingId),
      images: [],
      status: "active",
    };
  }
}
