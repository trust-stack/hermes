import { Module } from "@nestjs/common";
import { ExternalResolverModule } from "./external-resolver/external-resolver.module";
import { LinkSetModule } from "./link-set/link-set.module";
import { ResolverModule } from "./resolver/resolver.module";

@Module({
  imports: [LinkSetModule, ExternalResolverModule, ResolverModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
