import {Module} from "@nestjs/common";
import {PrismaModule} from "../prisma";
import {LinkController} from "./link.controller";
import {LinkService} from "./link.service";

@Module({
  imports: [PrismaModule],
  providers: [LinkService],
  controllers: [LinkController],
})
export class LinkModule {}
