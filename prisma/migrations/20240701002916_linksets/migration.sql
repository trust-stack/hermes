-- CreateTable
CREATE TABLE "Linkset" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,

    CONSTRAINT "Linkset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lang" TEXT[],
    "linksetId" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Linkset_identifier_key" ON "Linkset"("identifier");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_linksetId_fkey" FOREIGN KEY ("linksetId") REFERENCES "Linkset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
