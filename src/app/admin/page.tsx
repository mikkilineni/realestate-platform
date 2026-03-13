import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [tenantCount, leadCount, listingCount] = await Promise.all([
    prisma.tenant.count(),
    prisma.lead.count(),
    prisma.listing.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h1>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Agents", value: tenantCount },
          { label: "Total Leads", value: leadCount },
          { label: "Total Listings", value: listingCount },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <Link
          href="/admin/agents/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Agent
        </Link>
        <Link
          href="/admin/agents"
          className="bg-white border text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
        >
          View All Agents
        </Link>
      </div>
    </div>
  );
}
