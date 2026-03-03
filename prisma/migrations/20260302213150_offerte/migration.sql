-- CreateTable
CREATE TABLE "Offerte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nummer" TEXT NOT NULL,
    "klantId" INTEGER NOT NULL,
    "datum" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geldigTot" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'concept',
    "notities" TEXT,
    "subtotaal" REAL NOT NULL DEFAULT 0,
    "btwBedrag" REAL NOT NULL DEFAULT 0,
    "totaal" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Offerte_klantId_fkey" FOREIGN KEY ("klantId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OfferteRegel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "offerteId" INTEGER NOT NULL,
    "omschrijving" TEXT NOT NULL,
    "aantal" REAL NOT NULL,
    "eenheidsprijs" REAL NOT NULL,
    "btw" INTEGER NOT NULL DEFAULT 21,
    "totaal" REAL NOT NULL,
    CONSTRAINT "OfferteRegel_offerteId_fkey" FOREIGN KEY ("offerteId") REFERENCES "Offerte" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Offerte_nummer_key" ON "Offerte"("nummer");
