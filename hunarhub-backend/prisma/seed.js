import prisma from "../src/config/prisma.js";

async function main() {
  console.log("🌱 Seeding categories...");

  await prisma.category.createMany({
    data: [
      // 🔧 LOCAL SERVICES
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
      { name: "Welder", description: "Metal welding services" },
      { name: "Cobbler", description: "Shoe repair services" },
      { name: "Laundry Service", description: "Clothes washing & ironing" },
      { name: "Pest Control", description: "Pest removal services" },

      // 🎨 CREATIVE & FREELANCE
      { name: "Graphic Designer", description: "Design & branding services" },
      { name: "UI/UX Designer", description: "Product & interface design" },
      { name: "Content Writer", description: "Writing & content creation" },
      { name: "Photographer", description: "Photography services" },
      { name: "Videographer", description: "Video production & editing" },
      { name: "Voice Over Artist", description: "Voice recording services" },
      { name: "Social Media Manager", description: "Social media handling" },

      // 💻 TECH PROFESSIONALS
      { name: "Frontend Engineer", description: "Frontend web development" },
      { name: "Backend Engineer", description: "Backend system development" },
      { name: "Full Stack Developer", description: "Frontend + Backend development" },
      { name: "Web Developer", description: "Website development" },
      { name: "App Developer", description: "Mobile app development" },
      { name: "AI Engineer", description: "AI/ML model development" },
      { name: "Data Scientist", description: "Data analysis & ML" },
      { name: "DevOps Engineer", description: "Deployment & infrastructure" },
      { name: "Cloud Engineer", description: "Cloud architecture & services" },

      // 🚀 STARTUP & BUSINESS
      { name: "Startup Consultant", description: "Startup guidance & strategy" },
      { name: "Business Consultant", description: "Business growth & planning" },
      { name: "Marketing Specialist", description: "Marketing strategies" },
      { name: "SEO Specialist", description: "Search engine optimization" },
      { name: "Sales Consultant", description: "Sales strategy & execution" },

      // 🏠 PERSONAL & SERVICES
      { name: "Tutor", description: "Private teaching services" },
      { name: "Fitness Trainer", description: "Personal fitness coaching" },
      { name: "Yoga Instructor", description: "Yoga training services" },
      { name: "Cook", description: "Home or event cooking" },
      { name: "Driver", description: "Personal or commercial driving" },
      { name: "Security Guard", description: "Security services" },
      { name: "Caregiver", description: "Elderly care services" },

      // 🧑‍💼 PROFESSIONAL SERVICES
      { name: "Lawyer", description: "Legal consulting services" },
      { name: "Accountant", description: "Financial & tax services" },
      { name: "Real Estate Agent", description: "Property dealing services" },
      { name: "Travel Agent", description: "Travel planning services" }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });