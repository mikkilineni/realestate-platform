import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@platform.com" },
    update: {},
    create: {
      email: "admin@platform.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Seeded admin user:", admin.email);

  // Create a test agent
  const agentPassword = await bcrypt.hash("agent123456", 12);
  const agentUser = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      password: agentPassword,
      role: "AGENT",
    },
  });

  const tenant = await prisma.tenant.upsert({
    where: { slug: "johnsmith" },
    update: {},
    create: {
      slug: "johnsmith",
      platformDomain: "johnsmith.localhost",
      siteConfig: {
        create: {
          heroHeadline: "Find Your Dream Home in Austin",
          primaryColor: "#1a56db",
        },
      },
    },
  });

  await prisma.agent.upsert({
    where: { userId: agentUser.id },
    update: {},
    create: {
      userId: agentUser.id,
      tenantId: tenant.id,
      firstName: "John",
      lastName: "Smith",
      bio: "Licensed real estate agent with 10+ years of experience in the Austin market.",
    },
  });

  // Create sample listings
  await prisma.listing.createMany({
    skipDuplicates: true,
    data: [
      {
        tenantId: tenant.id,
        address: "123 Oak Street",
        city: "Austin",
        state: "TX",
        zip: "78701",
        price: 450000,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1800,
        description: "Beautiful 3 bedroom home in the heart of Austin.",
        slug: "123-oak-street-austin",
      },
      {
        tenantId: tenant.id,
        address: "456 Maple Ave",
        city: "Austin",
        state: "TX",
        zip: "78702",
        price: 625000,
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2400,
        description: "Stunning 4 bedroom modern home with open floor plan.",
        slug: "456-maple-ave-austin",
      },
    ],
  });

  console.log("Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
