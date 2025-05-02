import {Module} from "@nestjs/common";
import {ConfigModule} from "./config/config.module";
import {LinkModule} from "./link";
import {PrismaModule} from "./prisma/prisma.module";
import {ResolverModule} from "./resolver";

@Module({
  imports: [ConfigModule, PrismaModule, LinkModule, ResolverModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
