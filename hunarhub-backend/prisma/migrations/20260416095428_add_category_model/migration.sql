-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToEntrepreneurProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToEntrepreneurProfile_AB_unique" ON "_CategoryToEntrepreneurProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToEntrepreneurProfile_B_index" ON "_CategoryToEntrepreneurProfile"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToEntrepreneurProfile" ADD CONSTRAINT "_CategoryToEntrepreneurProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToEntrepreneurProfile" ADD CONSTRAINT "_CategoryToEntrepreneurProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "EntrepreneurProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
