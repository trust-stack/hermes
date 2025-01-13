import { PrismaClient } from "@prisma/client";

export function createPrismaClient() {
  const client = new PrismaClient();
  return client;
}
