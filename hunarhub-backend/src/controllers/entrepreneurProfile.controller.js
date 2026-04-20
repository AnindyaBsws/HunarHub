import prisma from "../config/prisma.js";


// ------------------ GET ENTREPRENEUR PROFILE (SELF) ------------------
async function getEntrepreneurProfile(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        categories: {
          select: { id: true, name: true },
        },
        experiences: {
          include: {
            category: {
              select: { id: true, name: true },
            },
          },
        },
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
      phone: profile.user.phone,
      bio: profile.bio,
      location: profile.location,
      categories: profile.categories,
      experiences: profile.experiences,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
}


// ------------------ UPDATE ENTREPRENEUR PROFILE ------------------
async function updateEntrepreneurProfile(req, res) {
  try {
    const userId = req.userId;
    const { bio, location, phone } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingProfile = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return res.status(400).json({
        message: "Entrepreneur profile not found",
      });
    }

    // ✅ PHONE VALIDATION
    if (phone !== undefined) {
      if (phone.length > 12) {
        return res.status(400).json({
          message: "Phone number cannot exceed 12 digits",
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { phone },
      });
    }

    // ✅ BIO VALIDATION (max 30 words)
    if (bio !== undefined) {
      const wordCount = bio.trim().split(/\s+/).length;
      if (wordCount > 30) {
        return res.status(400).json({
          message: "Bio cannot exceed 30 words",
        });
      }
    }

    const updatedProfile = await prisma.entrepreneurProfile.update({
      where: { userId },
      data: {
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
      },
      include: {
        categories: true,
        experiences: {
          include: { category: true },
        },
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
async function createEntrepreneurProfile(req, res) {
  try {
    const userId = req.userId;
    const { bio, location, avatarUrl, categories, experiences } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

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
                categoryId: Number(exp.categoryId),   // ✅ FIX
                sector: exp.sector,
                years: exp.years,
                isCurrent: exp.isCurrent,
                description: exp.description,
            })),

        },
      },
      include: {
        categories: true,
        experiences: {
          include: { category: true },
        },
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


// ------------------ ADD EXPERIENCE ------------------
async function addExperience(req, res) {
  try {
    const userId = req.userId;
    const { categoryId, sector, years } = req.body;

    const profile = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
      include: { experiences: true },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // ✅ LIMIT: max 4 experiences
    if (profile.experiences.length >= 4) {
      return res.status(400).json({
        message: "You can only add up to 4 skills",
      });
    }

    // ✅ DUPLICATE CATEGORY CHECK
    const exists = profile.experiences.find(
      (exp) => exp.categoryId === Number(categoryId)
    );

    if (exists) {
      return res.status(400).json({
        message: "You already added this skill",
      });
    }

    // ✅ YEARS VALIDATION
    if (Number(years) > 90) {
      return res.status(400).json({
        message: "Experience cannot exceed 90 years",
      });
    }

    const exp = await prisma.experience.create({
      data: {
        profileId: profile.id,
        categoryId: Number(categoryId),
        sector: sector || null,
        years: Number(years),
        isCurrent: true,
      },
      include: {
        category: true,
      },
    });

    return res.status(201).json(exp);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding experience" });
  }
}


// ------------------ UPDATE EXPERIENCE ------------------
async function updateExperience(req, res) {
  try {
    const { id } = req.params;
    const { sector, years } = req.body;

    // ✅ YEARS VALIDATION
    if (years !== undefined && Number(years) > 90) {
      return res.status(400).json({
        message: "Experience cannot exceed 90 years",
      });
    }

    const updated = await prisma.experience.update({
      where: { id: Number(id) },
      data: {
        ...(sector !== undefined && { sector }),
        ...(years !== undefined && { years: Number(years) }),
      },
      include: { category: true },
    });

    return res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating experience" });
  }
}


// ------------------ DELETE EXPERIENCE ------------------
async function deleteExperience(req, res) {
  try {
    const { id } = req.params;

    await prisma.experience.delete({
      where: { id: Number(id) },
    });

    return res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting experience" });
  }
}


// DELETE /api/entrepreneur/profile
async function deleteEntrepreneurProfile(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const existing = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    await prisma.entrepreneurProfile.delete({
      where: { userId },
    });

    return res.status(200).json({
      message: "Entrepreneur profile deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error deleting profile",
    });
  }
}


export {
  getEntrepreneurProfile,
  updateEntrepreneurProfile,
  createEntrepreneurProfile,
  deleteEntrepreneurProfile,
  addExperience,
  updateExperience,
  deleteExperience,
};