import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN ?? "localhost";

export type TenantWithConfig = Awaited<ReturnType<typeof fetchTenantByHostname>>;

async function fetchTenantByHostname(hostname: string) {
  // Strip port for local dev
  const host = hostname.split(":")[0];

  // Check if it's a platform subdomain: slug.yourdomain.com
  const platformSuffix = `.${PLATFORM_DOMAIN}`;
  if (host.endsWith(platformSuffix)) {
    const slug = host.slice(0, -platformSuffix.length);
    return prisma.tenant.findUnique({
      where: { slug },
      include: { agent: true, siteConfig: true, idxConfig: true },
    });
  }

  // Otherwise treat as custom domain
  return prisma.tenant.findUnique({
    where: { customDomain: host },
    include: { agent: true, siteConfig: true, idxConfig: true },
  });
}

const getCachedTenant = unstable_cache(
  fetchTenantByHostname,
  ["tenant-by-hostname"],
  { revalidate: 60 }
);

export const getTenantByHostname = cache(async (hostname: string) => {
  return getCachedTenant(hostname);
});
