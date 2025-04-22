import {Module} from "@nestjs/common";
import {ConfigModule} from "src/config";
import {PrismaModule} from "../prisma/prisma.module";
import {ResolverController} from "./link-resolver.controller";
import {LinkResolverService} from "./link-resolver.service";

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [LinkResolverService],
  controllers: [ResolverController],
})
export class LinkResolverModule {}
