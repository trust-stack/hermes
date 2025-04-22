/*
  Warnings:

  - You are about to drop the column `linksetId` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the `Linkset` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `linkSetId` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_linksetId_fkey";

-- DropForeignKey
ALTER TABLE "Linkset" DROP CONSTRAINT "Linkset_parentLinkSetId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "linksetId",
ADD COLUMN     "linkSetId" TEXT NOT NULL,
ALTER COLUMN "href" DROP NOT NULL;

-- DropTable
DROP TABLE "Linkset";

-- CreateTable
CREATE TABLE "LinkSet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qualifier" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "parentLinkSetId" TEXT,

    CONSTRAINT "LinkSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkAnchor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "linkSetId" TEXT,

    CONSTRAINT "LinkAnchor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkSet_qualifier_identifier_key" ON "LinkSet"("qualifier", "identifier");

-- AddForeignKey
ALTER TABLE "LinkSet" ADD CONSTRAINT "LinkSet_parentLinkSetId_fkey" FOREIGN KEY ("parentLinkSetId") REFERENCES "LinkSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_linkSetId_fkey" FOREIGN KEY ("linkSetId") REFERENCES "LinkSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkAnchor" ADD CONSTRAINT "LinkAnchor_linkSetId_fkey" FOREIGN KEY ("linkSetId") REFERENCES "LinkSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
