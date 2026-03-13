export interface IDXSearchParams {
  query?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  page?: number;
  pageSize?: number;
}

export interface IDXProperty {
  id: string;
  mlsId?: string;
  source: "manual" | "reso" | "spark";
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  description?: string;
  slug: string;
  images: string[];
  status: "active" | "pending" | "sold" | "inactive";
}

export interface IDXSearchResult {
  properties: IDXProperty[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IDXAdapter {
  readonly type: "reso" | "spark" | "manual";
  search(params: IDXSearchParams): Promise<IDXSearchResult>;
  getById(mlsId: string): Promise<IDXProperty | null>;
  isConfigured(config: IDXConfigInput): boolean;
}

export interface IDXConfigInput {
  adapterType: string;
  apiEndpoint?: string | null;
  apiKey?: string | null;
  apiSecret?: string | null;
  mlsCode?: string | null;
}
