import {Module} from "@nestjs/common";
import {ConfigModule} from "./config/config.module";
import {ExternalResolverModule} from "./external-resolver";
import {LinkAnchorModule} from "./link-anchor";
import {LinkResolverModule} from "./link-resolver";
import {LinkSetModule} from "./link-set";

@Module({
  imports: [
    ConfigModule,
    ExternalResolverModule,
    LinkAnchorModule,
    LinkSetModule,
    LinkResolverModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
