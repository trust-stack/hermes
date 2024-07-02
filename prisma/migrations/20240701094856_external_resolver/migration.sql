-- CreateTable
CREATE TABLE "ExternalResolverSet" (
    "id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,

    CONSTRAINT "ExternalResolverSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalResolver" (
    "id" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "externalResolverSetId" TEXT NOT NULL,

    CONSTRAINT "ExternalResolver_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExternalResolver" ADD CONSTRAINT "ExternalResolver_externalResolverSetId_fkey" FOREIGN KEY ("externalResolverSetId") REFERENCES "ExternalResolverSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
