import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="font-bold text-gray-900">Agent Portal</span>
              <div className="flex gap-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm">Dashboard</Link>
                <Link href="/dashboard/leads" className="text-gray-600 hover:text-gray-900 text-sm">Leads</Link>
                <Link href="/dashboard/listings" className="text-gray-600 hover:text-gray-900 text-sm">Listings</Link>
                <Link href="/dashboard/settings" className="text-gray-600 hover:text-gray-900 text-sm">Settings</Link>
              </div>
            </div>
            <span className="text-sm text-gray-500">{session.user.email}</span>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
