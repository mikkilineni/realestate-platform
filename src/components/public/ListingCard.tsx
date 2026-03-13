import Link from "next/link";

interface ListingCardProps {
  listing: {
    id: string;
    address: string;
    city: string;
    state: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
    slug: string;
    image?: string;
  };
  slug: string;
}

export function ListingCard({ listing, slug }: ListingCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(listing.price);

  return (
    <Link href={`/_sites/${slug}/listings/${listing.slug}`} className="group block">
      <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-video bg-gray-200 overflow-hidden">
          {listing.image ? (
            <img
              src={listing.image}
              alt={listing.address}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xl font-bold text-gray-900">{formattedPrice}</p>
          <p className="text-gray-700 mt-1">{listing.address}</p>
          <p className="text-gray-500 text-sm">{listing.city}, {listing.state}</p>
          <div className="flex gap-4 mt-3 text-sm text-gray-500">
            {listing.bedrooms && <span>{listing.bedrooms} bd</span>}
            {listing.bathrooms && <span>{listing.bathrooms} ba</span>}
            {listing.sqft && <span>{listing.sqft.toLocaleString()} sqft</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
