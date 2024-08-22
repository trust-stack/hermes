import { Module } from "@nestjs/common";
import { ObjectModule } from "src/object/object.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ResolverController } from "./resolver.controller";
import { ResolverService } from "./resolver.service";

@Module({
  imports: [PrismaModule, ObjectModule],
  providers: [ResolverService],
  controllers: [ResolverController],
})
export class ResolverModule {}
