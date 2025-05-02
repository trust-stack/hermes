import {Module} from "@nestjs/common";
import {createPrismaClient} from "./prisma.factory";

@Module({
  providers: [
    {
      provide: "PRISMA_CLIENT",
      useFactory: createPrismaClient,
    },
  ],
  exports: ["PRISMA_CLIENT"],
})
export class PrismaModule {}
