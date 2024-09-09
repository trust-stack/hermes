import { Module } from "@nestjs/common";
import { ExternalResolverModule } from "./external-resolver/external-resolver.module";
import { LinkSetModule } from "./link-set/link-set.module";
import { ObjectModule } from "./object/object.module";
import { ResolverModule } from "./resolver/resolver.module";
import { S3Module } from "./s3/s3.module";

@Module({
  imports: [
    ObjectModule,
    LinkSetModule,
    ExternalResolverModule,
    ResolverModule,
    S3Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
