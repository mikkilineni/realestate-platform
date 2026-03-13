import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AgentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) redirect("/login");

  const tenantId = session.user.tenantId;

  const [leadCount, listingCount, newLeadCount] = await Promise.all([
    prisma.lead.count({ where: { tenantId } }),
    prisma.listing.count({ where: { tenantId } }),
    prisma.lead.count({ where: { tenantId, status: "NEW" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Leads", value: leadCount },
          { label: "New Leads", value: newLeadCount },
          { label: "Listings", value: listingCount },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <Link href="/dashboard/leads" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          View Leads
        </Link>
        <Link href="/dashboard/listings" className="bg-white border text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
          Manage Listings
        </Link>
      </div>
    </div>
  );
}
