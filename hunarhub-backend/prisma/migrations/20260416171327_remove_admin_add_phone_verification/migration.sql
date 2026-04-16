/*
  Warnings:

  - You are about to drop the column `status` on the `EntrepreneurProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EntrepreneurProfile" DROP COLUMN "status",
ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false;
