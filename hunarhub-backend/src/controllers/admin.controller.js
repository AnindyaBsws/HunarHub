import prisma from '../config/prisma.js';

async function updateVerificationStatus(req, res) {
    try {
        const { profileId } = req.params;
        const { status } = req.body;

        // Validate
        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                message: "Status must be APPROVED or REJECTED"
            });
        }

        // Update profile
        const updated = await prisma.entrepreneurProfile.update({
            where: { id: parseInt(profileId) },
            data: { status }
        });

        return res.status(200).json({
            message: `Profile ${status.toLowerCase()}`,
            updated
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

export { updateVerificationStatus };