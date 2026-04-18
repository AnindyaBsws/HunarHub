import prisma from '../config/prisma.js';


// 🔥 CREATE SERVICE
async function createService(req, res) {
    try {
        const userId = req.userId;
        const { title, description, price } = req.body;

        if (!title || !price) {
            return res.status(400).json({
                message: "Title and price are required"
            });
        }

        const profile = await prisma.entrepreneurProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            return res.status(403).json({
                message: "Create profile first"
            });
        }

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


// 🔥 GET MY SERVICES (WITH RATINGS)
async function getMyServices(req, res) {
    try {
        const userId = req.userId;

        const profile = await prisma.entrepreneurProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            return res.status(403).json({
                message: "No profile found"
            });
        }

        const services = await prisma.service.findMany({
            where: { profileId: profile.id },

            include: {
                reviews: {
                    select: { rating: true }
                }
            }
        });

        const formatted = services.map(s => {
            const ratings = s.reviews.map(r => r.rating);

            const avgRating =
                ratings.length > 0
                    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                    : null;

            return {
                id: s.id,
                title: s.title,
                description: s.description,
                price: s.price,
                rating: avgRating,
                totalReviews: ratings.length
            };
        });

        return res.status(200).json({ services: formatted });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}


// 🔥 GET SERVICES BY PROFILE (IMPORTANT FOR ENTREPRENEUR PAGE)
async function getServicesByProfile(req, res) {
    try {
        const { id } = req.params;

        const services = await prisma.service.findMany({
            where: { profileId: Number(id) },

            include: {
                reviews: {
                    select: { rating: true }
                }
            }
        });

        const formatted = services.map(s => {
            const ratings = s.reviews.map(r => r.rating);

            const avgRating =
                ratings.length > 0
                    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                    : null;

            return {
                id: s.id,
                title: s.title,
                description: s.description,
                price: s.price,
                rating: avgRating,
                totalReviews: ratings.length
            };
        });

        return res.json({ services: formatted });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


// 🔥 UPDATE SERVICE
async function updateService(req, res) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { title, description, price } = req.body;

        const profile = await prisma.entrepreneurProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const service = await prisma.service.findUnique({
            where: { id: Number(id) }
        });

        if (!service || service.profileId !== profile.id) {
            return res.status(403).json({ message: "Not your service" });
        }

        const updated = await prisma.service.update({
            where: { id: Number(id) },
            data: { title, description, price }
        });

        return res.json({ service: updated });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


// 🔥 DELETE SERVICE
async function deleteService(req, res) {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const profile = await prisma.entrepreneurProfile.findUnique({
            where: { userId }
        });

        const service = await prisma.service.findUnique({
            where: { id: Number(id) }
        });

        if (!service || service.profileId !== profile.id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        await prisma.service.delete({
            where: { id: Number(id) }
        });

        return res.json({ message: "Deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


// 🔥 EXPLORE SERVICES (WITH RATINGS)
async function getAllServices(req, res) {
    try {
        const { category, location, maxPrice } = req.query;

        const filter = {
            ...(maxPrice && {
                price: { lte: parseFloat(maxPrice) }
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
                },

                reviews: {
                    select: { rating: true }
                }
            }
        });

        const formatted = services.map(s => {
            const ratings = s.reviews.map(r => r.rating);

            const avgRating =
                ratings.length > 0
                    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                    : null;

            return {
                id: s.id,
                title: s.title,
                price: s.price,
                entrepreneur: s.profile.user.name,
                location: s.profile.location,
                categories: s.profile.categories.map(c => c.name),
                rating: avgRating,
                totalReviews: ratings.length
            };
        });

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


export {
    createService,
    getAllServices,
    getMyServices,
    updateService,
    deleteService,
    getServicesByProfile
};