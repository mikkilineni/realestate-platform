import { IDXAdapter, IDXConfigInput, IDXProperty, IDXSearchParams, IDXSearchResult } from "../types";

export abstract class BaseAdapter implements IDXAdapter {
  abstract readonly type: "reso" | "spark" | "manual";
  abstract search(params: IDXSearchParams): Promise<IDXSearchResult>;
  abstract getById(mlsId: string): Promise<IDXProperty | null>;
  abstract isConfigured(config: IDXConfigInput): boolean;
}
