import prisma from '../config/prisma.js';

async function createRequest(req, res) {
    try {
        const userId = req.userId;
        const { serviceId, message } = req.body;

        //Validate input
        if (!serviceId) {
            return res.status(400).json({
                message: "Service ID is required"
            });
        }

        //Check if service exists
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            include: {
                profile: true
            }
        });

        if (!service) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        //Prevent requesting own service
        if (service.profile.userId === userId) {
            return res.status(400).json({
                message: "You cannot request your own service"
            });
        }

        const existingRequest = await prisma.serviceRequest.findFirst({
            where: {
                userId,
                serviceId,
                status: "PENDING"
            }
        });

        if (existingRequest && existingRequest.status === "PENDING") {
            return res.status(400).json({
                message: "You already have a pending request"
            });
        }

        //Create request
        const request = await prisma.serviceRequest.create({
            data: {
                userId,
                serviceId,
                message
            }
        });

        return res.status(201).json({
            message: "Request sent successfully",
            request
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
}




async function getIncomingRequests(req, res) {
    try {
        const userId = req.userId;

        // get optional status from query
        const { status } = req.query;

        //Find entrepreneur profile
        const profile = await prisma.entrepreneurProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            return res.status(403).json({
                message: "Not an entrepreneur"
            });
        }

        // Build filter (THIS IS THE IMPORTANT PART)
        const filter = {
            service: {
                profileId: profile.id
            },

            // dynamic status filter
            ...(status && { status })
        };

        //Fetch requests
        const requests = await prisma.serviceRequest.findMany({
            where: filter,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                service: {
                    select: {
                        title: true,
                        price: true
                    }
                }
            }
        });

        return res.status(200).json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}




async function updateRequestStatus(req, res) {
    try {
        const userId = req.userId;
        const requestId = parseInt(req.params.id);
        const { status } = req.body;

        // Validate status
        if (!["ACCEPTED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                message: "Status must be ACCEPTED or REJECTED"
            });
        }

        // Get request with ownership info
        const request = await prisma.serviceRequest.findUnique({
            where: { id: requestId },
            include: {
                service: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        // Check if current user owns this service
        if (request.service.profile.userId !== userId) {
            return res.status(403).json({
                message: "Not authorized to update this request"
            });
        }

        // Prevent re-updating (important logic)
        if (request.status !== "PENDING") {
            return res.status(400).json({
                message: "Request already processed"
            });
        }

        // Update status
        const updated = await prisma.serviceRequest.update({
            where: { id: requestId },
            data: { status }
        });

        return res.status(200).json({
            message: `Request ${status.toLowerCase()}`,
            updated
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

export { createRequest, getIncomingRequests, updateRequestStatus };

