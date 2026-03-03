-- CreateTable
CREATE TABLE "Instelling" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sleutel" TEXT NOT NULL,
    "waarde" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Instelling_sleutel_key" ON "Instelling"("sleutel");
