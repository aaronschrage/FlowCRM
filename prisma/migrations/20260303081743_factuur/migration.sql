-- CreateTable
CREATE TABLE "Factuur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nummer" TEXT NOT NULL,
    "klantId" INTEGER NOT NULL,
    "datum" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vervaldatum" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'openstaand',
    "notities" TEXT,
    "subtotaal" REAL NOT NULL DEFAULT 0,
    "btwBedrag" REAL NOT NULL DEFAULT 0,
    "totaal" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Factuur_klantId_fkey" FOREIGN KEY ("klantId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FactuurRegel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "factuurId" INTEGER NOT NULL,
    "omschrijving" TEXT NOT NULL,
    "aantal" REAL NOT NULL,
    "eenheidsprijs" REAL NOT NULL,
    "btw" INTEGER NOT NULL DEFAULT 21,
    "totaal" REAL NOT NULL,
    CONSTRAINT "FactuurRegel_factuurId_fkey" FOREIGN KEY ("factuurId") REFERENCES "Factuur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Factuur_nummer_key" ON "Factuur"("nummer");
