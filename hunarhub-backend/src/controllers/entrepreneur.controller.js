import prisma from '../config/prisma.js';

async function getEntrepreneurs(req, res) {
    try {
        const { category, location, page, limit, sort } = req.query;

        // Validate category
        if (!category) {
            return res.status(400).json({
                message: "Category is required"
            });
        }

        // Pagination setup
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 5;
        const skip = (pageNumber - 1) * limitNumber;

        // Common filter (reuse for both queries)
        const filter = {
                categories: {
                    some: {
                        name: {
                            equals: category,
                            mode: "insensitive"
                        }
                    }
                },

                isAvailable: true,
                
                ...(location && {
                    location: {
                        contains: location,
                        mode: "insensitive"
                }
            })
        };

        //Sorting
        let orderBy = {};
        if (sort === "newest") {
            orderBy = { createdAt: "desc" };
        }


        // Fetch paginated data
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

        // Total count (for pagination)
        const total = await prisma.entrepreneurProfile.count({
            where: filter
        });

        // Format response
        const formatted = entrepreneurs.map(e => ({
            id: e.id, // ✅ IMPORTANT

            name: e.user.name,
            bio: e.bio,
            location: e.location,

            categories: e.categories.map(c => c.name),

            experience: e.experiences.length
                ? `${Math.max(...e.experiences.map(exp => exp.years))} years`
                : "No experience"
        }));

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

export { getEntrepreneurs };