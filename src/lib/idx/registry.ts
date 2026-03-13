import { IDXAdapter, IDXConfigInput } from "./types";
import { ManualAdapter } from "./adapters/manual";
import { RESOAdapter } from "./adapters/reso";
import { SparkAdapter } from "./adapters/spark";

export function getIDXAdapter(tenantId: string, config: IDXConfigInput | null): IDXAdapter {
  if (!config || config.adapterType === "MANUAL" || config.adapterType === "EMBED") {
    return new ManualAdapter(tenantId);
  }

  if (config.adapterType === "RESO") {
    const adapter = new RESOAdapter(config);
    if (adapter.isConfigured(config)) return adapter;
  }

  if (config.adapterType === "SPARK") {
    const adapter = new SparkAdapter(config);
    if (adapter.isConfigured(config)) return adapter;
  }

  // Fallback
  return new ManualAdapter(tenantId);
}
