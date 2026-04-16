import prisma from '../config/prisma.js';

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
            where: { id: requestId },
            include: {
                service: true
            }
        });

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        //Check ownership
        if (request.userId !== userId) {
            return res.status(403).json({
                message: "You cannot review this request"
            });
        }

        //Check status
        if (request.status !== "ACCEPTED") {
            return res.status(400).json({
                message: "You can only review accepted requests"
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
            message: "Review submitted successfully",
            review
        });

    } catch (error) {
        console.error(error);

        // Handle duplicate review
        if (error.code === 'P2002') {
            return res.status(400).json({
                message: "Review already exists for this request"
            });
        }

        return res.status(500).json({
            message: "Server error"
        });
    }
}

export { createReview };