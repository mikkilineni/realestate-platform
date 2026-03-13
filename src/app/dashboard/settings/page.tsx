import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AgentSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) redirect("/login");

  const agent = await prisma.agent.findFirst({
    where: { tenantId: session.user.tenantId },
    include: { tenant: { include: { siteConfig: true } } },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Name:</span> {agent?.firstName} {agent?.lastName}</p>
          <p><span className="font-medium">Phone:</span> {agent?.phone ?? "Not set"}</p>
          <p><span className="font-medium">Site URL:</span> {agent?.tenant.platformDomain}</p>
        </div>
        <p className="mt-4 text-sm text-gray-500">Settings editing coming in Phase 4.</p>
      </div>
    </div>
  );
}
