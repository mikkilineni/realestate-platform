import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/public/ListingCard";

interface Props {
  params: { slug: string };
}

export default async function ListingsPage({ params }: Props) {
  const tenant = await prisma.tenant.findUnique({ where: { slug: params.slug } });
  if (!tenant || !tenant.active) notFound();

  const listings = await prisma.listing.findMany({
    where: { tenantId: tenant.id, status: "ACTIVE" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Listings</h1>
      {listings.length === 0 ? (
        <p className="text-gray-500">No listings available at this time.</p>
      ) : (
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
      )}
    </div>
  );
}
