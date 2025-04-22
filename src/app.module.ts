import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { ExternalResolverModule } from "./external-resolver";
import { LinkAnchorModule } from "./link-anchor";
import { LinkSetModule } from "./link-set";
import { ResolverModule } from "./resolver";

@Module({
  imports: [
    ConfigModule,
    ExternalResolverModule,
    LinkAnchorModule,
    LinkSetModule,
    ResolverModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
