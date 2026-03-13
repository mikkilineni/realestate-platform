import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface Props {
  params: { slug: string };
}

export default async function AboutPage({ params }: Props) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: params.slug },
    include: { agent: true },
  });
  if (!tenant || !tenant.active) notFound();

  const agent = tenant.agent;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {agent?.headshotUrl && (
          <img
            src={agent.headshotUrl}
            alt={`${agent.firstName} ${agent.lastName}`}
            className="w-48 h-48 rounded-full object-cover shadow"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {agent ? `${agent.firstName} ${agent.lastName}` : "Your Agent"}
          </h1>
          {agent?.phone && (
            <p className="text-gray-500 mb-4">
              <a href={`tel:${agent.phone}`} className="hover:underline">{agent.phone}</a>
            </p>
          )}
          {agent?.bio ? (
            <p className="text-gray-700 leading-relaxed">{agent.bio}</p>
          ) : (
            <p className="text-gray-500">Agent bio coming soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}
