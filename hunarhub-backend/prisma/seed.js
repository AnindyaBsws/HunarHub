import prisma from "../src/config/prisma.js";

async function main() {

  // 🧵 1. Categories
  const tailor = await prisma.category.create({
    data: {
      name: "Tailor",
      description: "Clothing and stitching services",
    },
  });

  const electrician = await prisma.category.create({
    data: {
      name: "Electrician",
      description: "Electrical services",
    },
  });

  // 👤 2. User (Rahul)
  const user = await prisma.user.create({
    data: {
      name: "Rahul",
      email: "rahul@example.com",
      password: "123456", // (hashed not needed for now)
    },
  });

  // 🧑‍💼 3. Entrepreneur Profile
  const profile = await prisma.entrepreneurProfile.create({
    data: {
      userId: user.id,
      bio: "Experienced tailor with 5+ years",
      location: "Kolkata",
      phone: "9999999999",

      categories: {
        connect: [{ id: tailor.id }],
      },
    },
  });

  // 🧠 4. Experience
  await prisma.experience.create({
    data: {
      profileId: profile.id,
      sector: "Tailoring",
      years: 5,
      isCurrent: true,
    },
  });

  // 🛠 5. Services
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

  console.log("🌱 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });