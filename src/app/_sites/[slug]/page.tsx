import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/public/HeroSection";
import { LeadCaptureForm } from "@/components/public/LeadCaptureForm";
import { ListingCard } from "@/components/public/ListingCard";

interface Props {
  params: { slug: string };
}

async function getTenant(slug: string) {
  if (slug === "__custom") return null; // handled by layout
  return prisma.tenant.findUnique({
    where: { slug },
    include: { agent: true, siteConfig: true },
  });
}

export default async function PublicSitePage({ params }: Props) {
  const tenant = await getTenant(params.slug);
  if (!tenant || !tenant.active) notFound();

  const listings = await prisma.listing.findMany({
    where: { tenantId: tenant.id, status: "ACTIVE" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const agent = tenant.agent;
  const config = tenant.siteConfig;

  return (
    <div className="min-h-screen bg-white">
      <HeroSection
        agentName={agent ? `${agent.firstName} ${agent.lastName}` : "Your Agent"}
        headline={config?.heroHeadline ?? "Find Your Dream Home"}
        primaryColor={config?.primaryColor ?? "#1a56db"}
      />

      {listings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={{
                  id: listing.id,
                  address: listing.address,
                  city: listing.city,
                  state: listing.state,
                  price: listing.price,
                  bedrooms: listing.bedrooms ?? undefined,
                  bathrooms: listing.bathrooms ?? undefined,
                  sqft: listing.sqft ?? undefined,
                  slug: listing.slug,
                  image: listing.images[0]?.url,
                }}
                slug={params.slug}
              />
            ))}
          </div>
        </section>
      )}

      <section id="contact" className="bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Get in Touch</h2>
          <p className="text-gray-500 text-center mb-8">
            Ready to find your dream home? Contact {agent ? `${agent.firstName}` : "us"} today.
          </p>
          <LeadCaptureForm tenantSlug={params.slug} />
        </div>
      </section>
    </div>
  );
}
