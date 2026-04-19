import prisma from "../config/prisma.js";


// ------------------ GET ENTREPRENEUR PROFILE (SELF) ------------------
// GET /api/entrepreneur/profile
async function getEntrepreneurProfile(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const profile = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true, // ✅ from User model now
          },
        },
        categories: {
          select: { id: true, name: true },
        },
        experiences: true,
      },
    });

    if (!profile) {
      return res.status(404).json({
        message: "Entrepreneur profile not found",
      });
    }

    return res.status(200).json({
      id: profile.id,
      name: profile.user.name,
      email: profile.user.email,
      phone: profile.user.phone, // ✅ unified phone
      bio: profile.bio,
      location: profile.location,
      categories: profile.categories,
      experiences: profile.experiences,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
}


// ------------------ UPDATE ENTREPRENEUR PROFILE ------------------
// PATCH /api/entrepreneur/profile
async function updateEntrepreneurProfile(req, res) {
  try {
    const userId = req.userId;
    const { bio, location, phone } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const existingProfile = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return res.status(400).json({
        message: "Entrepreneur profile not found",
      });
    }

    // ✅ Update USER phone (universal)
    if (phone !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: { phone },
      });
    }

    // ✅ Update profile fields
    const updatedProfile = await prisma.entrepreneurProfile.update({
      where: { userId },
      data: {
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
      },
      include: {
        categories: true,
        experiences: true,
      },
    });

    return res.status(200).json({
      message: "Entrepreneur profile updated successfully",
      profile: updatedProfile,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error updating entrepreneur profile",
    });
  }
}


// ------------------ CREATE ENTREPRENEUR PROFILE ------------------
// POST /api/entrepreneur/profile
async function createEntrepreneurProfile(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { bio, location, avatarUrl, categories, experiences } = req.body;

    // Check existing
    const existing = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

    // Required fields
    if (!location || !categories || categories.length === 0) {
      return res.status(400).json({
        message: "Location and categories are required",
      });
    }

    const profile = await prisma.entrepreneurProfile.create({
      data: {
        userId,
        bio,
        location,
        avatarUrl,

        categories: {
          connect: categories.map((id) => ({
            id: Number(id),
          })),
        },

        experiences: {
          create: (experiences || []).map((exp) => ({
            sector: exp.sector,
            years: exp.years,
            isCurrent: exp.isCurrent,
            description: exp.description,
          })),
        },
      },
      include: {
        categories: true,
        experiences: true,
      },
    });

    return res.status(201).json({
      message: "Entrepreneur profile created successfully",
      profile,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}


export {
  getEntrepreneurProfile,
  updateEntrepreneurProfile,
  createEntrepreneurProfile,
};