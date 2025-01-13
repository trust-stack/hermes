import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ExternalResolverController } from "./external-resolver.controller";
import { ExternalResolverService } from "./external-resolver.service";

@Module({
  imports: [PrismaModule],
  controllers: [ExternalResolverController],
  providers: [ExternalResolverService],
})
export class ExternalResolverModule {}
