import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ExternalResolveController } from "./external-resolver.controller";
import { ExternalResolverService } from "./external-resolver.service";

@Module({
  imports: [PrismaModule],
  controllers: [ExternalResolveController],
  providers: [ExternalResolverService],
})
export class ExternalResolverModule {}
