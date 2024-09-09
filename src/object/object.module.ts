import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { S3Module } from "src/s3/s3.module";
import { ObjectController } from "./object.controller";
import { ObjectService } from "./object.service";

@Module({
  imports: [PrismaModule, S3Module],
  controllers: [ObjectController],
  providers: [ObjectService],
  exports: [ObjectService],
})
export class ObjectModule {}
