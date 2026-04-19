/*
  Warnings:

  - Added the required column `categoryId` to the `Experience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "categoryId" INTEGER NOT NULL,
ALTER COLUMN "sector" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
