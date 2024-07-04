import { Module } from "@nestjs/common";
import { ExternalResolverModule } from "./external-resolver/external-resolver.module";
import { LinkSetModule } from "./link-set/link-set.module";
import { ResolverModule } from "./resolver/resolver.module";

@Module({
  imports: [LinkSetModule, ResolverModule, ExternalResolverModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
