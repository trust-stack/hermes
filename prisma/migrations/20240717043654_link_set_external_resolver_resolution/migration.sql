/*
  Warnings:

  - You are about to drop the column `externalResolverSetId` on the `ExternalResolver` table. All the data in the column will be lost.
  - You are about to drop the `ExternalResolverSet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[qualifier,pattern]` on the table `ExternalResolver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[qualifier,identifier]` on the table `Linkset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qualifier` to the `ExternalResolver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualifier` to the `Linkset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExternalResolver" DROP CONSTRAINT "ExternalResolver_externalResolverSetId_fkey";

-- DropIndex
DROP INDEX "Linkset_identifier_key";

-- AlterTable
ALTER TABLE "ExternalResolver" DROP COLUMN "externalResolverSetId",
ADD COLUMN     "parentExternalResolverId" TEXT,
ADD COLUMN     "qualifier" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Linkset" ADD COLUMN     "parentLinkSetId" TEXT,
ADD COLUMN     "qualifier" TEXT NOT NULL;

-- DropTable
DROP TABLE "ExternalResolverSet";

-- CreateIndex
CREATE UNIQUE INDEX "ExternalResolver_qualifier_pattern_key" ON "ExternalResolver"("qualifier", "pattern");

-- CreateIndex
CREATE UNIQUE INDEX "Linkset_qualifier_identifier_key" ON "Linkset"("qualifier", "identifier");

-- AddForeignKey
ALTER TABLE "Linkset" ADD CONSTRAINT "Linkset_parentLinkSetId_fkey" FOREIGN KEY ("parentLinkSetId") REFERENCES "Linkset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalResolver" ADD CONSTRAINT "ExternalResolver_parentExternalResolverId_fkey" FOREIGN KEY ("parentExternalResolverId") REFERENCES "ExternalResolver"("id") ON DELETE CASCADE ON UPDATE CASCADE;
