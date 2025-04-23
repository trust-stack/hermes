import {Module} from "@nestjs/common";
import {ConfigModule} from "../config";
import {PrismaModule} from "../prisma/prisma.module";
import {LinkResolverController} from "./link-resolver.controller";
import {LinkResolverService} from "./link-resolver.service";

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [LinkResolverService],
  controllers: [LinkResolverController],
})
export class LinkResolverModule {}
