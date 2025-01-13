import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { LinkSetController } from "./link-set.controller";
import { LinkSetService } from "./link-set.service";

@Module({
  imports: [PrismaModule],
  controllers: [LinkSetController],
  providers: [LinkSetService],
})
export class LinkSetModule {}
