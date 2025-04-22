import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { LinkAnchorController } from "./link-anchor.controller";
import { LinkAnchorService } from "./link-anchor.service";

@Module({
  imports: [PrismaModule],
  controllers: [LinkAnchorController],
  providers: [LinkAnchorService],
})
export class LinkAnchorModule {}
