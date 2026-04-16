import prisma from '../config/prisma.js';

async function createService(req, res) {
    try {
        const userId = req.userId;

        const { title, description, price } = req.body;

        //Validate input
        if (!title || !price) {
            return res.status(400).json({
                message: "Title and price are required"
            });
        }

        //Get entrepreneur profile
        const profile = await prisma.entrepreneurProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            return res.status(403).json({
                message: "Create profile first"
            });
        }

        //Create service
        const service = await prisma.service.create({
            data: {
                title,
                description,
                price,
                profileId: profile.id
            }
        });

        return res.status(201).json({
            message: "Service created successfully",
            service
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}


//Listing Services(Service Category + location + price) (Sorting is done in Entreprenuer Controller)
async function getAllServices(req, res) {
    try {
        const { category, location, maxPrice } = req.query;

        // Build filter
        const filter = {
            ...(maxPrice && {
                price: {
                    lte: parseFloat(maxPrice)
                }
            }),

            profile: {
                isAvailable: true,

                ...(location && {
                    location: {
                        contains: location,
                        mode: "insensitive"
                    }
                }),

                ...(category && {
                    categories: {
                        some: {
                            name: {
                                equals: category,
                                mode: "insensitive"
                            }
                        }
                    }
                })
            }
        };

        const services = await prisma.service.findMany({
            where: filter,

            include: {
                profile: {
                    include: {
                        user: {
                            select: { name: true }
                        },
                        categories: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        // Format response
        const formatted = services.map(s => ({
            title: s.title,
            price: s.price,
            entrepreneur: s.profile.user.name,
            location: s.profile.location,
            categories: s.profile.categories.map(c => c.name)
        }));

        return res.status(200).json({
            count: formatted.length,
            services: formatted
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

export { createService, getAllServices };