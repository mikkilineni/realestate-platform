import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  params: { slug: string };
}

async function getTenant(slug: string) {
  if (slug === "__custom") return null;
  return prisma.tenant.findUnique({
    where: { slug },
    include: { agent: true, siteConfig: true },
  });
}

export default async function PublicSiteLayout({ children, params }: Props) {
  const tenant = await getTenant(params.slug);
  if (!tenant || !tenant.active) notFound();

  const agent = tenant.agent;
  const primaryColor = tenant.siteConfig?.primaryColor ?? "#1a56db";

  return (
    <div>
      <header style={{ borderBottomColor: primaryColor }} className="border-b-2 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href={`/_sites/${params.slug}`} className="font-bold text-xl text-gray-900">
              {agent ? `${agent.firstName} ${agent.lastName}` : tenant.slug}
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href={`/_sites/${params.slug}/listings`} className="text-gray-600 hover:text-gray-900">Listings</Link>
              <Link href={`/_sites/${params.slug}/about`} className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href={`/_sites/${params.slug}#contact`} className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
          </div>
        </div>
      </header>
      {children}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} {agent ? `${agent.firstName} ${agent.lastName}` : tenant.slug}. All rights reserved.</p>
      </footer>
    </div>
  );
}
