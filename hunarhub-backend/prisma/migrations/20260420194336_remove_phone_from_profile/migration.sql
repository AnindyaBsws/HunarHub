/*
  Warnings:

  - You are about to drop the column `phone` on the `EntrepreneurProfile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "EntrepreneurProfile_phone_key";

-- AlterTable
ALTER TABLE "EntrepreneurProfile" DROP COLUMN "phone";
