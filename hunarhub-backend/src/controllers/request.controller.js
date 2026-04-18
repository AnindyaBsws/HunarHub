import prisma from '../config/prisma.js';


// 🔥 CREATE REQUEST
async function createRequest(req, res) {
    try {
        const userId = req.userId || req.user?.id;
        const { serviceId, message } = req.body;

        if (!serviceId) {
            return res.status(400).json({
                message: "Service ID is required"
            });
        }

        const service = await prisma.service.findUnique({
            where: { id: Number(serviceId) },
            include: { profile: true }
        });

        if (!service) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        // ❌ Prevent self-request
        if (service.profile.userId === userId) {
            return res.status(400).json({
                message: "You cannot request your own service"
            });
        }

        // ❌ Prevent duplicate pending
        const existing = await prisma.serviceRequest.findFirst({
            where: {
                userId,
                serviceId,
                status: "PENDING"
            }
        });

        if (existing) {
            return res.status(400).json({
                message: "Already requested"
            });
        }

        const request = await prisma.serviceRequest.create({
            data: {
                userId,
                serviceId,
                message
            }
        });

        return res.status(201).json({
            message: "Request sent",
            request
        });

    } catch (err) {
        console.error("CREATE REQUEST ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}


// 🔥 INCOMING (SELLER)
async function getIncomingRequests(req, res) {
    try {
        const userId = req.userId || req.user?.id;
        const { status } = req.query;

        const profile = await prisma.entrepreneurProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            return res.status(403).json({
                message: "Not a seller"
            });
        }

        const requests = await prisma.serviceRequest.findMany({
            where: {
                service: {
                    profileId: profile.id
                },

                // 🔥 REMOVE REJECTED COMPLETELY
                NOT: {
                    status: "REJECTED"
                },

                ...(status && { status })
            },
            include: {
                user: {
                    select: { name: true, email: true }
                },
                service: {
                    select: { title: true, price: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        res.json({ requests });

    } catch (err) {
        console.error("INCOMING ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}


// 🔥 MY REQUESTS (USER)
async function getMyRequests(req, res) {
    try {
        const userId = req.userId || req.user?.id;

        const requests = await prisma.serviceRequest.findMany({
            where: { userId },
            include: {
                service: {
                    select: {
                        title: true,
                        price: true,
                        profile: {
                            include: {
                                user: {
                                    select: { name: true }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        res.json({ requests });

    } catch (err) {
        console.error("MY REQUEST ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}


// 🔥 UPDATE STATUS (SELLER ONLY)
async function updateRequestStatus(req, res) {
    try {
        const { id } = req.params;

        // ✅ SAFE BODY
        const { status, sellerMessage } = req.body || {};

        if (!status) {
            return res.status(400).json({
                message: "Status required"
            });
        }

        const request = await prisma.serviceRequest.findUnique({
            where: { id: Number(id) },
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

        const userId = req.userId || req.user?.id;

        // ❌ Only service owner can update
        if (request.service.profile.userId !== userId) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        if (request.status !== "PENDING") {
            return res.status(400).json({
                message: "Already updated"
            });
        }

        const updated = await prisma.serviceRequest.update({
            where: { id: Number(id) },
            data: {
                status,
                sellerMessage: status === "ACCEPTED" ? sellerMessage : null
            }
        });

        res.json({
            message: "Updated",
            request: updated
        });

    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}


// 🔥 MARK SEEN (USER SIDE)
async function markRequestsSeen(req, res) {
  try {
    const userId = req.userId;

    await prisma.serviceRequest.updateMany({
      where: {
        userId,
        status: "REJECTED",
        seenByUser: false
      },
      data: {
        seenByUser: true
      }
    });

    res.json({ message: "Seen updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


// 🔥 DELETE (WITHDRAW)
async function deleteRequest(req, res) {
    try {
        const userId = req.userId || req.user?.id;
        const { id } = req.params;

        const request = await prisma.serviceRequest.findUnique({
            where: { id: Number(id) }
        });

        if (!request || request.userId !== userId) {
            return res.status(403).json({
                message: "Not allowed"
            });
        }

        if (request.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending can be withdrawn"
            });
        }

        await prisma.serviceRequest.delete({
            where: { id: Number(id) }
        });

        res.json({
            message: "Request withdrawn"
        });

    } catch (err) {
        console.error("DELETE ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}


export {
    createRequest,
    getIncomingRequests,
    updateRequestStatus,
    getMyRequests,
    deleteRequest,
    markRequestsSeen
};