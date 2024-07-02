import { Module } from "@nestjs/common";
import { ExternalResolverModule } from "./external-resolver/external-resolver.module";
import { ResolverModule } from "./resolver/resolver.module";

@Module({
  imports: [ResolverModule, ExternalResolverModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
