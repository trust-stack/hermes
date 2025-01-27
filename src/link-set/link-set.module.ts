import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { HrefBuilderService } from "./href-builder.service";
import { LinkSetController } from "./link-set.controller";
import { LinkSetService } from "./link-set.service";

@Module({
  imports: [PrismaModule],
  controllers: [LinkSetController],
  providers: [LinkSetService, HrefBuilderService],
})
export class LinkSetModule {}
