import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="font-bold text-gray-900">RE Platform Admin</span>
              <div className="flex gap-4">
                <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm">Dashboard</Link>
                <Link href="/admin/agents" className="text-gray-600 hover:text-gray-900 text-sm">Agents</Link>
                <Link href="/admin/domains" className="text-gray-600 hover:text-gray-900 text-sm">Domains</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
