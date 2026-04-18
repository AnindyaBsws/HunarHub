import cron from "node-cron";
import prisma from "../config/prisma.js";

export function startCleanupJob() {
  // runs every minute
  cron.schedule("* * * * *", async () => {
    try {
        const now = new Date();

        // ✅ ACCEPTED → 2 DAYS
        await prisma.serviceRequest.deleteMany({
        where: {
            status: "ACCEPTED",
            createdAt: {
            lt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
            }
        }
        });

        // ✅ REJECTED → 1 DAY
        await prisma.serviceRequest.deleteMany({
        where: {
            status: "REJECTED",
            createdAt: {
            lt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
            }
        }
        });

    } catch (err) {
        console.error("Cleanup Error:", err);
    }
    });
}