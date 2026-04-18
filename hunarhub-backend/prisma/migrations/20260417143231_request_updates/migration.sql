/*
  Warnings:

  - You are about to drop the column `phoneVerified` on the `EntrepreneurProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EntrepreneurProfile" DROP COLUMN "phoneVerified";

-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN     "seenByUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sellerMessage" TEXT;
