import prisma from '../config/prisma.js';


// 🔥 CREATE REVIEW
async function createReview(req, res) {
    try {
        const userId = req.userId;
        const { requestId, rating, comment } = req.body;

        // Validate input
        if (!requestId || !rating) {
            return res.status(400).json({
                message: "Request ID and rating are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        // Get request
        const request = await prisma.serviceRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        // Ownership check
        if (request.userId !== userId) {
            return res.status(403).json({
                message: "You cannot review this request"
            });
        }

        // Only accepted
        if (request.status !== "ACCEPTED") {
            return res.status(400).json({
                message: "Only accepted requests can be reviewed"
            });
        }

        // 🔥 PREVENT DUPLICATE (cleaner than prisma error)
        const existingReview = await prisma.review.findUnique({
            where: { requestId }
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You already reviewed this request"
            });
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                userId,
                serviceId: request.serviceId,
                requestId,
                rating,
                comment
            }
        });

        return res.status(201).json({
            message: "Review submitted",
            review
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}


// 🔥 GET REVIEWS OF A SERVICE
async function getServiceReviews(req, res) {
    try {
        const { serviceId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { serviceId: Number(serviceId) },
            include: {
                user: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return res.json({ reviews });

    } catch (err) {
        console.error("GET REVIEWS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export { createReview, getServiceReviews };