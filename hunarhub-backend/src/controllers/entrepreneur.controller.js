import prisma from '../config/prisma.js';

async function getEntrepreneurs(req, res) {
    try {
        const { category, location } = req.query;

        if (!category) {
            return res.status(400).json({
                message: "Category is required"
            });
        }

        const entrepreneurs = await prisma.entrepreneurProfile.findMany({
            where: {
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
            },

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

        const formatted = entrepreneurs.map(e => ({
            name: e.user.name,
            bio: e.bio,
            location: e.location,
            categories: e.categories.map(c => c.name),
            experience: e.experiences.length
                ? `${Math.max(...e.experiences.map(exp => exp.years))} years`
                : "No experience"
        }));

        return res.status(200).json({
            count: formatted.length,
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