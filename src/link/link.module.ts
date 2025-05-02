import {Module} from "@nestjs/common";
import {ConfigModule} from "../config";
import {PrismaModule} from "../prisma";
import {LinkController} from "./link.controller";
import {LinkService} from "./link.service";

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [LinkService],
  controllers: [LinkController],
})
export class LinkModule {}
