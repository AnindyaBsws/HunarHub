import prisma from "../src/config/prisma.js";

async function main() {

  // 🧵 1. Categories
  const tailor = await prisma.category.upsert({
    where: { name: "Tailor" },
    update: {},
    create: {
      name: "Tailor",
      description: "Clothing and stitching services",
    },
  });

  const electrician = await prisma.category.upsert({
    where: { name: "Electrician" },
    update: {},
    create: {
      name: "Electrician",
      description: "Electrical services",
    },
  });

  // 👤 2. User (SAFE UPSERT ✅)
  const user = await prisma.user.upsert({
    where: { email: "rahul@example.com" },
    update: {},
    create: {
      name: "Rahul",
      email: "rahul@example.com",
      password: "123456",
    },
  });

  // 🧑‍💼 3. Entrepreneur Profile (SAFE UPSERT ✅)
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

  // 🧠 4. Experience (avoid duplicates)
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

  // 🛠 5. Services (simple safe insert)
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

  console.log("🌱 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });