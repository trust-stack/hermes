import { Module } from "@nestjs/common";
import { ObjectModule } from "src/object/object.module";
import { PrismaModule } from "../prisma/prisma.module";
import { LinkSetController } from "./link-set.controller";
import { LinkSetService } from "./link-set.service";

@Module({
  imports: [PrismaModule, ObjectModule],
  controllers: [LinkSetController],
  providers: [LinkSetService],
})
export class LinkSetModule {}
