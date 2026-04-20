import prisma from "../src/config/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Seeding started...");

  // 🔐 HASH PASSWORD
  const hashedPassword = await bcrypt.hash("123456", 10);

  // 🧵 1. CATEGORIES (MULTIPLE)
  await prisma.category.createMany({
    data: [
      { name: "Tailor", description: "Clothing & stitching" },
      { name: "Electrician", description: "Electrical services" },
      { name: "Plumber", description: "Water & pipe fixing" },
      { name: "Carpenter", description: "Woodwork & furniture" },
      { name: "Painter", description: "Painting services" },
      { name: "Mechanic", description: "Vehicle repair" },
      { name: "Cleaner", description: "Cleaning services" },
      { name: "Gardener", description: "Garden maintenance" },
      { name: "AC Technician", description: "AC repair & service" },
      { name: "Mason", description: "Construction work" },
    ],
    skipDuplicates: true,
  });

  // 🔍 FETCH CATEGORY (Tailor for demo)
  const tailor = await prisma.category.findUnique({
    where: { name: "Tailor" },
  });

  // 👤 2. USER (SAFE UPSERT)
  const user = await prisma.user.upsert({
    where: { email: "rahul@example.com" },
    update: {},
    create: {
      name: "Rahul",
      email: "rahul@example.com",
      password: hashedPassword,
    },
  });

  // 🧑‍💼 3. ENTREPRENEUR PROFILE
  const profile = await prisma.entrepreneurProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      bio: "Experienced tailor with 5+ years",
      location: "Kolkata",
      phone: "9999999999",

      categories: {
        connect: [{ id: tailor.id }],
      },
    },
  });

  // 🧠 4. EXPERIENCE (linked with category)
  const existingExp = await prisma.experience.findFirst({
    where: {
      profileId: profile.id,
      categoryId: tailor.id,
    },
  });

  if (!existingExp) {
    await prisma.experience.create({
      data: {
        profileId: profile.id,
        categoryId: tailor.id,
        sector: "Tailoring",
        years: 5,
        isCurrent: true,
      },
    });
  }

  // 🛠 5. SERVICES
  const existingServices = await prisma.service.findMany({
    where: { profileId: profile.id },
  });

  if (existingServices.length === 0) {
    await prisma.service.createMany({
      data: [
        {
          title: "Shirt Stitching",
          description: "Custom shirt stitching",
          price: 200,
          profileId: profile.id,
        },
        {
          title: "Pant Alteration",
          description: "Adjust pant fitting",
          price: 100,
          profileId: profile.id,
        },
      ],
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });