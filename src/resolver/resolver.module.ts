import { Module } from "@nestjs/common";
import { ConfigModule } from "src/config";
import { PrismaModule } from "../prisma/prisma.module";
import { ResolverController } from "./resolver.controller";
import { ResolverService } from "./resolver.service";

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [ResolverService],
  controllers: [ResolverController],
})
export class ResolverModule {}
