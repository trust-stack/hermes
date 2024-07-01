import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ResolverController } from "./resolver.controller";
import { ResolverService } from "./resolver.service";

@Module({
  imports: [PrismaModule],
  providers: [ResolverService],
  controllers: [ResolverController],
})
export class ResolverModule {}
