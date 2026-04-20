import prisma from '../config/prisma.js';

async function getEntrepreneurs(req, res) {
    try {
        const { category, location, page, limit, sort } = req.query;

        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 6;
        const skip = (pageNumber - 1) * limitNumber;

        // ✅ FILTER
        const filter = {
            isAvailable: true,

            ...(category && {
                experiences: {
                    some: {
                        categoryId: Number(category)
                    }
                }
            }),

            ...(location && location.trim() !== "" && {
                location: {
                    contains: location,
                    mode: "insensitive"
                }
            })
        };

        let orderBy = {};
        if (sort === "newest") {
            orderBy = { createdAt: "desc" };
        }

        // ✅ FETCH
        const entrepreneurs = await prisma.entrepreneurProfile.findMany({
            where: filter,
            skip,
            take: limitNumber,
            orderBy,

            include: {
                user: {
                    select: { name: true }
                },
                experiences: {
                    include: {
                        category: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        const total = await prisma.entrepreneurProfile.count({
            where: filter
        });

        // ✅ FORMAT (IMPORTANT FIX)
        let formatted = entrepreneurs.map(e => ({
            id: e.id,
            name: e.user.name,
            bio: e.bio,
            location: e.location,

            skills: e.experiences.map(exp => ({
                name: exp.category?.name || "Unknown",
                years: exp.years
            })),

            rating: "No ratings" // placeholder
        }));

        // ✅ SORT BY EXPERIENCE (MAX)
        if (sort === "experience") {
            formatted.sort((a, b) => {
                const maxA = Math.max(...a.skills.map(s => s.years), 0);
                const maxB = Math.max(...b.skills.map(s => s.years), 0);
                return maxB - maxA;
            });
        }

        return res.status(200).json({
            count: total,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            entrepreneurs: formatted
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}


// ---------------- GET SINGLE ----------------
async function getEntrepreneurById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const profile = await prisma.entrepreneurProfile.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        experiences: {
          include: {
            category: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ message: "Entrepreneur not found" });
    }

    let hasAccess = false;

    if (userId) {
      const accepted = await prisma.serviceRequest.findFirst({
        where: {
          userId,
          status: "ACCEPTED",
          service: {
            profileId: profile.id
          }
        }
      });

      if (accepted) hasAccess = true;
    }

    const baseData = {
      id: profile.id,
      name: profile.user.name,
      location: profile.location,
      bio: profile.bio,

      skills: profile.experiences.map(exp => ({
        name: exp.category?.name,
        years: exp.years
      })),

      hasAccess
    };

    if (hasAccess) {
      return res.json({
        ...baseData,
        phone: profile.user.phone,
        email: profile.user.email
      });
    }

    return res.json(baseData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export { getEntrepreneurs, getEntrepreneurById };