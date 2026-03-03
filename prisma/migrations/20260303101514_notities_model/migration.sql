/*
  Warnings:

  - You are about to drop the column `notities` on the `Customer` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Notitie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tekst" TEXT NOT NULL,
    "klantId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notitie_klantId_fkey" FOREIGN KEY ("klantId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Customer" ("createdAt", "email", "id", "name") SELECT "createdAt", "email", "id", "name" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
