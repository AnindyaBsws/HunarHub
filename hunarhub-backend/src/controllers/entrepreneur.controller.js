import prisma from '../config/prisma.js';

async function getEntrepreneurs(req, res) {
    try {
        const { category, location, page, limit, sort } = req.query;

        // Pagination
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 5;
        const skip = (pageNumber - 1) * limitNumber;

        // DYNAMIC FILTER
        const filter = {
            isAvailable: true,

            // (optional + ID based)
            ...(category && {
                categories: {
                    some: {
                        id: Number(category)
                    }
                }
            }),

            // LOCATION FIX
            ...(location && location.trim() !== "" && {
                location: {
                    contains: location,
                    mode: "insensitive"
                }
            })
        };

        // Sorting
        let orderBy = {};
        if (sort === "newest") {
            orderBy = { createdAt: "desc" };
        }

        // Fetch data
        const entrepreneurs = await prisma.entrepreneurProfile.findMany({
            where: filter,
            skip,
            take: limitNumber,
            orderBy,

            include: {
                user: {
                    select: { name: true }
                },
                categories: {
                    select: { name: true }
                },
                experiences: {
                    select: {
                        sector: true,
                        years: true,
                        isCurrent: true
                    }
                }
            }
        });

        // Count
        const total = await prisma.entrepreneurProfile.count({
            where: filter
        });

        // Format
        const formatted = entrepreneurs.map(e => ({
            id: e.id,
            name: e.user.name,
            bio: e.bio,
            location: e.location,
            categories: e.categories.map(c => c.name),
            experience: e.experiences.length
                ? `${Math.max(...e.experiences.map(exp => exp.years))} years`
                : "No experience"
        }));

        // Sort by experience (frontend-level)
        if (sort === "experience") {
            formatted.sort((a, b) => {
                const expA = parseInt(a.experience) || 0;
                const expB = parseInt(b.experience) || 0;
                return expB - expA;
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


async function getEntrepreneurById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId; // may be undefined if not logged in

    const profile = await prisma.entrepreneurProfile.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        categories: { select: { name: true } },
        experiences: true
      }
    });

    if (!profile) {
      return res.status(404).json({ message: "Entrepreneur not found" });
    }

    // 🔐 CHECK: does user have accepted request?
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

    // 🔥 BASE DATA (visible to everyone)
    const baseData = {
      id: profile.id,
      name: profile.user.name,
      location: profile.location,
      bio: profile.bio,
      categories: profile.categories.map(c => c.name),
      experience: profile.experiences.length
        ? `${Math.max(...profile.experiences.map(e => e.years))} years`
        : "No experience",
      hasAccess
    };

    // 🔐 FULL DATA (only if accepted)
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